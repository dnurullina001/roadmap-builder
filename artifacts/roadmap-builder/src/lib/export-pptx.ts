import pptxgen from 'pptxgenjs';
import { PhaseRoadmapData, ImplementationRoadmapData, Phase, AssigneeRole } from '@/types/roadmap';
import { getStatusStyle, getAssigneeLabel, getAssigneeColor } from '@/lib/status';

// ── Corporate slide layout ────────────────────────────────────────────────────
const SLIDE_W = 12.598;
const SLIDE_H = 7.086;

const ML = 0.5;   // left margin
const MR = 0.5;   // right margin
const MB = 0.35;  // bottom margin

const CW = SLIDE_W - ML - MR; // content width ≈ 11.598"

const TITLE_Y  = 0.28;
const TITLE_H  = 0.62;
const ACCENT_Y = TITLE_Y + TITLE_H;
const CONTENT_Y = ACCENT_Y + 0.15;

const LEGEND_H = 0.22; // height reserved for assignee legend at bottom
const CONTENT_H = SLIDE_H - CONTENT_Y - MB - LEGEND_H - 0.08; // leave room for legend

const TITLE_FONT = 'Times New Roman';
const TITLE_SIZE = 28;
const BODY_FONT  = 'Arial';
const BODY_SIZE  = 10;

// Cell text (task/item descriptions) — 8pt to fit more content
const CELL_TEXT_SIZE = 8;

const CORP_NAVY = '44546A';
const CORP_BLUE = '0048F4';
const PHASE_COLORS = ['0048F4', '4472C4', 'ED7D31', '70AD47', 'FFC000', '5B9BD5'];

// Minimum readable row height — never place shapes below this height
const MIN_ROW_H = 0.18; // inches

// ── Auto-growing cells ────────────────────────────────────────────────────────
function estimateWrappedLines(text: string, fontSizePt: number, boxWidthIn: number): number {
  if (!text) return 1;
  // Average Arial glyph width factor (slightly conservative so cells grow rather than clip)
  const avgCharWidthIn = (fontSizePt / 72) * 0.58;
  const charsPerLine = Math.max(3, Math.floor(boxWidthIn / avgCharWidthIn));
  return Math.max(1, Math.ceil(text.length / charsPerLine));
}

function textBlockHeightIn(text: string, fontSizePt: number, boxWidthIn: number): number {
  const lines = estimateWrappedLines(text, fontSizePt, Math.max(boxWidthIn, 0.2));
  const lineHeightIn = (fontSizePt / 72) * 1.45; // generous line spacing
  return lines * lineHeightIn;
}

// ── Assignee inline text (compact, no badge shapes) ──────────────────────────
// Renders assignees as a single short colored-text line at the bottom of a cell.
// Uses 2-letter abbreviations separated by spaces so it fits on one line easily.
function assigneeInlineText(assignees: string[], roles?: AssigneeRole[]): string {
  if (!assignees || assignees.length === 0) return '';
  return assignees
    .map(a => getAssigneeLabel(a, roles).substring(0, 2).toUpperCase())
    .join(' · ');
}

function setupLayout(prs: pptxgen) {
  (prs as any).defineLayout({ name: 'CORP', width: SLIDE_W, height: SLIDE_H });
  prs.layout = 'CORP' as any;
}

// Title bar WITHOUT border lines (fix #6)
function addTitleBar(slide: pptxgen.Slide, title: string) {
  // No surrounding rect / no border — just the text and the blue accent line
  slide.addText(title, {
    x: ML + 0.15, y: TITLE_Y, w: CW - 0.3, h: TITLE_H,
    fontFace: TITLE_FONT, fontSize: TITLE_SIZE,
    bold: false, color: '000000', valign: 'middle',
  });
  slide.addShape('line' as any, {
    x: ML, y: ACCENT_Y, w: CW, h: 0,
    line: { color: CORP_BLUE, pt: 2 },
  });
}

// Assignee legend row below the grid
function addAssigneeLegend(
  slide: pptxgen.Slide,
  assigneeRoles: AssigneeRole[] | undefined,
  legendY: number,
) {
  const roles = assigneeRoles && assigneeRoles.length > 0
    ? assigneeRoles
    : [
        { id: 'pm',        label: 'ПМ',          color: '#0048F4' },
        { id: 'analyst',   label: 'Аналитик',    color: '#4472C4' },
        { id: 'developer', label: 'Разработчик', color: '#ED7D31' },
        { id: 'tester',    label: 'Тестировщик', color: '#70AD47' },
      ];

  // Background strip
  slide.addShape('rect' as any, {
    x: ML, y: legendY, w: CW, h: LEGEND_H,
    fill: { color: 'F8F8F8' }, line: { color: 'DDDDDD', pt: 0.5 },
  });

  const badgeW = 0.14;
  const badgeH = 0.13;
  const gapBetween = 0.12;
  const textW = 0.85;
  const itemW = badgeW + gapBetween + textW + 0.18;

  let curX = ML + 0.2;
  const midY = legendY + (LEGEND_H - badgeH) / 2;

  roles.forEach((role) => {
    if (curX + itemW > ML + CW - 0.1) return; // don't overflow slide

    const colorHex = role.color.replace('#', '');
    // Colored badge chip
    slide.addShape('roundRect' as any, {
      x: curX, y: midY, w: badgeW, h: badgeH,
      fill: { color: colorHex }, line: { color: colorHex, pt: 0 },
      rectRadius: 0.02,
    });
    // 2-letter abbreviation inside chip
    slide.addText(role.label.substring(0, 2).toUpperCase(), {
      x: curX, y: midY, w: badgeW, h: badgeH,
      fontFace: BODY_FONT, fontSize: 5, bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle',
    });
    // Full label next to chip
    slide.addText(role.label, {
      x: curX + badgeW + 0.05, y: legendY, w: textW, h: LEGEND_H,
      fontFace: BODY_FONT, fontSize: BODY_SIZE - 2,
      color: '333333', valign: 'middle',
    });

    curX += itemW;
  });
}

/** Strip # and ensure valid 6-char hex; fall back to white */
function hex(colorStr: string): string {
  const cleaned = colorStr.replace('#', '').trim();
  return /^[0-9A-Fa-f]{6}$/.test(cleaned) ? cleaned : 'FFFFFF';
}

// ────────────────────────────────────────────────────────────────────────────
// PHASE SLIDE PACKING
// ────────────────────────────────────────────────────────────────────────────

const PHASE_HEADER_H = 0.28;
const PHASE_ROW_AREA = CONTENT_H - PHASE_HEADER_H;
const MAX_ROWS_PER_SLIDE = Math.floor(PHASE_ROW_AREA / MIN_ROW_H);

function packPhasesIntoSlides(phases: Phase[], requestedSlides: number): Phase[][] {
  if (requestedSlides <= 1 || phases.length === 0) return [phases];

  const phaseRowCounts = phases.map(p => Math.max(p.subItems.length, 1));
  const totalRows = phaseRowCounts.reduce((a, b) => a + b, 0);
  const targetRows = Math.min(
    Math.ceil(totalRows / requestedSlides),
    MAX_ROWS_PER_SLIDE,
  );

  const groups: Phase[][] = [];
  let current: Phase[] = [];
  let currentRows = 0;
  const slidesLeft = () => requestedSlides - groups.length;

  phases.forEach((phase, i) => {
    const rows = phaseRowCounts[i];
    const wouldOverflow = currentRows + rows > targetRows;
    const canStartNew = current.length > 0 && slidesLeft() > 1;

    if (wouldOverflow && canStartNew) {
      groups.push(current);
      current = [phase];
      currentRows = rows;
    } else {
      current.push(phase);
      currentRows += rows;
    }
  });
  if (current.length > 0) groups.push(current);
  return groups;
}

// ════════════════════════════════════════════════════════════════════════════
// PHASE ROADMAP (По этапам)
// ════════════════════════════════════════════════════════════════════════════
export function exportPhaseRoadmapToPptx(
  data: PhaseRoadmapData,
  slideCount = 1,
  assigneeRoles?: AssigneeRole[],
): void {
  const prs = new pptxgen();
  setupLayout(prs);

  const slideGroups = packPhasesIntoSlides(data.phases, slideCount);
  const totalSlides = slideGroups.length;

  const COL_LABEL_W = 2.0;
  const GRID_W = CW - COL_LABEL_W;
  const periodW = GRID_W / Math.max(data.periods.length, 1);

  const LEGEND_Y = SLIDE_H - MB - LEGEND_H;
  const BOTTOM_LIMIT = LEGEND_Y - 0.05;

  slideGroups.forEach((slidePhases, slideIdx) => {
    if (slidePhases.length === 0) return;

    const slide = prs.addSlide();
    slide.background = { color: 'FFFFFF' };

    addTitleBar(
      slide,
      totalSlides > 1
        ? `${data.title}  (${slideIdx + 1}/${totalSlides})`
        : data.title,
    );

    // ── Assignee legend ──────────────────────────────────────────────────────
    addAssigneeLegend(slide, assigneeRoles, LEGEND_Y);

    // ── Row height: auto-fit to available area ────────────────────────────────
    const totalItemRows = slidePhases.reduce(
      (sum, p) => sum + Math.max(p.subItems.length, 1),
      0,
    );
    const ROW_H = Math.min(
      0.45,
      Math.max(MIN_ROW_H, PHASE_ROW_AREA / totalItemRows),
    );

    const GRID_START_Y = CONTENT_Y;

    // ── ЭТАП header ──────────────────────────────────────────────────────────
    slide.addShape('rect' as any, {
      x: ML, y: GRID_START_Y, w: COL_LABEL_W, h: PHASE_HEADER_H,
      fill: { color: CORP_NAVY }, line: { color: CORP_NAVY, pt: 0.5 },
    });
    slide.addText('ЭТАП', {
      x: ML + 0.1, y: GRID_START_Y, w: COL_LABEL_W - 0.1, h: PHASE_HEADER_H,
      fontFace: BODY_FONT, fontSize: BODY_SIZE, bold: true, color: 'FFFFFF',
    });

    // ── Period headers (черный жирный текст — fix #5) ────────────────────────
    data.periods.forEach((period, idx) => {
      const x = ML + COL_LABEL_W + idx * periodW;
      const isCurrent = idx === data.currentPosition;
      slide.addShape('rect' as any, {
        x, y: GRID_START_Y, w: periodW, h: PHASE_HEADER_H,
        fill: { color: isCurrent ? 'FFF4E6' : 'F5F5F5' },
        line: { color: 'CCCCCC', pt: 0.5 },
      });
      slide.addText(period.toUpperCase(), {
        x, y: GRID_START_Y, w: periodW, h: PHASE_HEADER_H,
        fontFace: BODY_FONT, fontSize: BODY_SIZE - 1,
        bold: true,
        color: isCurrent ? 'CC6600' : '111111', // black text, fix #5
        align: 'center',
      });
      if (isCurrent) {
        slide.addText('▲ МЫ ЗДЕСЬ', {
          x: x - periodW * 0.3, y: GRID_START_Y - 0.2,
          w: periodW * 1.6, h: 0.18,
          fontFace: BODY_FONT, fontSize: BODY_SIZE - 3,
          bold: true, color: 'CC6600', align: 'center',
        });
      }
    });

    // ── Phases & sub-items ───────────────────────────────────────────────────
    let currentY = GRID_START_Y + PHASE_HEADER_H;

    slidePhases.forEach((phase, phaseIdx) => {
      if (currentY >= BOTTOM_LIMIT - MIN_ROW_H) return;

      const phaseColor = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];

      // Per-row heights: grow a row if text won't fit at CELL_TEXT_SIZE
      const rowHeights: number[] = phase.subItems.length
        ? phase.subItems.map((item) => {
            const spanW = periodW * Math.max(item.endPeriod - item.startPeriod, 1);
            const innerW = Math.max(spanW - 0.10, 0.2);
            const descH = textBlockHeightIn(item.description, CELL_TEXT_SIZE, innerW);
            // Assignee inline text: one extra line at 6pt
            const assigneeLineH = (item.assignees && item.assignees.length > 0)
              ? (6 / 72) * 1.4 + 0.03
              : 0;
            const neededH = 0.07 + descH + assigneeLineH;
            return Math.max(ROW_H, neededH, MIN_ROW_H);
          })
        : [ROW_H];

      const naturalPhaseH = rowHeights.reduce((a, b) => a + b, 0);
      const phaseH = Math.min(naturalPhaseH, BOTTOM_LIMIT - currentY);

      // Phase label cell
      slide.addShape('rect' as any, {
        x: ML, y: currentY, w: COL_LABEL_W, h: phaseH,
        fill: { color: 'FFFFFF' }, line: { color: 'CCCCCC', pt: 0.5 },
      });
      slide.addShape('rect' as any, {
        x: ML, y: currentY, w: 0.05, h: phaseH,
        fill: { color: phaseColor }, line: { color: phaseColor, pt: 0 },
      });
      slide.addText(`${phase.number}. ${phase.name}`, {
        x: ML + 0.1, y: currentY, w: COL_LABEL_W - 0.15, h: phaseH,
        fontFace: BODY_FONT, fontSize: BODY_SIZE - 1,
        bold: true, color: '222222', valign: 'middle', wrap: true,
      });

      if (phase.subItems.length === 0) {
        data.periods.forEach((_, periodIdx) => {
          const x = ML + COL_LABEL_W + periodIdx * periodW;
          const rowH = Math.min(ROW_H, BOTTOM_LIMIT - currentY);
          slide.addShape('rect' as any, {
            x, y: currentY, w: periodW, h: rowH,
            fill: { color: 'FAFAFA' }, line: { color: 'DDDDDD', pt: 0.5 },
          });
        });
      } else {
        let itemY = currentY;
        phase.subItems.forEach((item, itemIdx) => {
          const naturalRowH = rowHeights[itemIdx];
          if (itemY >= BOTTOM_LIMIT) return;
          const rowH = Math.min(naturalRowH, BOTTOM_LIMIT - itemY);
          const statusStyle = getStatusStyle(item.status);
          const assignees = item.assignees || [];
          const assigneeText = assigneeInlineText(assignees, assigneeRoles);

          data.periods.forEach((_, periodIdx) => {
            const x = ML + COL_LABEL_W + periodIdx * periodW;
            const inRange = periodIdx >= item.startPeriod && periodIdx < item.endPeriod;
            const isStart = periodIdx === item.startPeriod;
            const bgColor = inRange ? hex(statusStyle.bg) : 'FFFFFF';

            slide.addShape('rect' as any, {
              x, y: itemY, w: periodW, h: rowH,
              fill: { color: bgColor }, line: { color: 'DDDDDD', pt: 0.5 },
            });

            if (isStart) {
              const spanW = periodW * Math.max(item.endPeriod - item.startPeriod, 1);
              const innerW = spanW - 0.08;

              if (assigneeText) {
                // Description text (slightly reduced height to leave room for assignee line)
                const assigneeLineH = (6 / 72) * 1.5 + 0.02;
                const descAvailH = Math.max(rowH - assigneeLineH - 0.06, 0.10);

                slide.addText(item.description, {
                  x: x + 0.04, y: itemY + 0.02,
                  w: innerW, h: descAvailH,
                  fontFace: BODY_FONT, fontSize: CELL_TEXT_SIZE,
                  color: hex(statusStyle.fg),
                  wrap: true, valign: 'top',
                });

                // Assignee line — colored abbreviations in small text
                slide.addText(assigneeText, {
                  x: x + 0.04, y: itemY + rowH - assigneeLineH - 0.02,
                  w: innerW, h: assigneeLineH + 0.02,
                  fontFace: BODY_FONT, fontSize: 6,
                  color: hex(statusStyle.fg), bold: true,
                  wrap: false, valign: 'bottom',
                });
              } else {
                slide.addText(item.description, {
                  x: x + 0.04, y: itemY + 0.02,
                  w: innerW, h: Math.max(rowH - 0.04, 0.12),
                  fontFace: BODY_FONT, fontSize: CELL_TEXT_SIZE,
                  color: hex(statusStyle.fg),
                  wrap: true, valign: 'middle',
                });
              }
            }
          });

          itemY += rowH;
        });
      }

      currentY += phaseH;
    });
  });

  prs.writeFile({ fileName: safeFileName(data.title) + '.pptx' });
}

// ════════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION ROADMAP (По потокам)
// ════════════════════════════════════════════════════════════════════════════

const IMPL_MILESTONE_H = 0.70;
const IMPL_HEADER_H   = 0.26;
const IMPL_ROW_AREA   = CONTENT_H - IMPL_MILESTONE_H - IMPL_HEADER_H;
const MAX_LANES_PER_SLIDE = Math.floor(IMPL_ROW_AREA / 0.32);

function packLanesIntoSlides<T>(lanes: T[], requestedSlides: number): T[][] {
  if (requestedSlides <= 1 || lanes.length === 0) return [lanes];

  const target = Math.min(
    Math.ceil(lanes.length / requestedSlides),
    MAX_LANES_PER_SLIDE,
  );
  const groups: T[][] = [];
  let current: T[] = [];
  const slidesLeft = () => requestedSlides - groups.length;

  lanes.forEach((lane) => {
    if (current.length >= target && slidesLeft() > 1) {
      groups.push(current);
      current = [lane];
    } else {
      current.push(lane);
    }
  });
  if (current.length > 0) groups.push(current);
  return groups;
}

export function exportImplementationRoadmapToPptx(
  data: ImplementationRoadmapData,
  slideCount = 1,
  assigneeRoles?: AssigneeRole[],
): void {
  const prs = new pptxgen();
  setupLayout(prs);

  const slideGroups = packLanesIntoSlides(data.swimlanes, slideCount);
  const totalSlides = slideGroups.length;

  const LABEL_W  = 2.0;
  const GRID_W   = CW - LABEL_W;
  const periodW  = GRID_W / Math.max(data.periods.length, 1);

  const LEGEND_Y = SLIDE_H - MB - LEGEND_H;
  const BOTTOM_LIMIT = LEGEND_Y - 0.05;

  slideGroups.forEach((slideLanes, slideIdx) => {
    if (slideLanes.length === 0) return;

    const slide = prs.addSlide();
    slide.background = { color: 'FFFFFF' };

    addTitleBar(
      slide,
      totalSlides > 1
        ? `${data.title}  (${slideIdx + 1}/${totalSlides})`
        : data.title,
    );

    // ── Assignee legend ──────────────────────────────────────────────────────
    addAssigneeLegend(slide, assigneeRoles, LEGEND_Y);

    // ── Auto-fit lane heights ─────────────────────────────────────────────────
    const maxRows = Math.max(
      1,
      ...slideLanes.map((sl) => {
        const sorted = [...sl.tasks].sort((a, b) => a.startPeriod - b.startPeriod);
        const rows: typeof sorted[] = [];
        for (const t of sorted) {
          let placed = false;
          for (const r of rows) {
            const last = r[r.length - 1];
            if (last.startPeriod + last.span <= t.startPeriod) {
              r.push(t); placed = true; break;
            }
          }
          if (!placed) rows.push([t]);
        }
        return Math.max(rows.length, 1);
      }),
    );

    const LANE_H     = Math.min(0.75, Math.max(0.32, IMPL_ROW_AREA / slideLanes.length));
    const TASK_ROW_H = LANE_H / maxRows;

    const MILE_Y   = CONTENT_Y;
    const HEADER_Y = MILE_Y + IMPL_MILESTONE_H;
    let laneY      = HEADER_Y + IMPL_HEADER_H;

    // ── Milestone row ─────────────────────────────────────────────────────────
    slide.addShape('line' as any, {
      x: ML + LABEL_W, y: MILE_Y + IMPL_MILESTONE_H - 0.05,
      w: GRID_W, h: 0,
      line: { color: CORP_BLUE, pt: 1.5 },
    });
    data.milestones.forEach((m) => {
      const cx = ML + LABEL_W + m.periodIndex * periodW + periodW * 0.5;
      slide.addShape('rect' as any, {
        x: cx - 0.55, y: MILE_Y, w: 1.1, h: 0.26,
        fill: { color: CORP_BLUE }, line: { color: CORP_BLUE }, rectRadius: 0.02,
      });
      slide.addText(m.label, {
        x: cx - 0.55, y: MILE_Y, w: 1.1, h: 0.26,
        fontFace: BODY_FONT, fontSize: BODY_SIZE - 2,
        bold: true, color: 'FFFFFF', align: 'center', wrap: true,
      });
      slide.addShape('line' as any, {
        x: cx, y: MILE_Y + 0.26, w: 0, h: IMPL_MILESTONE_H - 0.31,
        line: { color: CORP_BLUE, pt: 0.75 },
      });
    });

    // ── Period header (черный текст — fix #5) ─────────────────────────────────
    slide.addShape('rect' as any, {
      x: ML, y: HEADER_Y, w: LABEL_W, h: IMPL_HEADER_H,
      fill: { color: CORP_NAVY }, line: { color: CORP_NAVY, pt: 0.5 },
    });
    data.periods.forEach((period, idx) => {
      const x = ML + LABEL_W + idx * periodW;
      slide.addShape('rect' as any, {
        x, y: HEADER_Y, w: periodW, h: IMPL_HEADER_H,
        fill: { color: 'F0F0F0' }, line: { color: 'CCCCCC', pt: 0.5 },
      });
      slide.addText(period, {
        x, y: HEADER_Y, w: periodW, h: IMPL_HEADER_H,
        fontFace: BODY_FONT, fontSize: BODY_SIZE - 1,
        bold: true,
        color: '111111', // black text, fix #5
        align: 'center',
      });
    });

    // ── Swimlanes ─────────────────────────────────────────────────────────────
    slideLanes.forEach((swimlane, swimIdx) => {
      if (laneY >= BOTTOM_LIMIT - 0.1) return;

      const color = PHASE_COLORS[swimIdx % PHASE_COLORS.length];

      const sorted = [...swimlane.tasks].sort((a, b) => a.startPeriod - b.startPeriod);
      const taskRows: typeof sorted[] = [];
      for (const task of sorted) {
        let placed = false;
        for (const row of taskRows) {
          const last = row[row.length - 1];
          if (last.startPeriod + last.span <= task.startPeriod) {
            row.push(task); placed = true; break;
          }
        }
        if (!placed) taskRows.push([task]);
      }

      // Per-row heights: grow a row if text (or assignee line) needs more space
      const rowHeights: number[] = taskRows.length
        ? taskRows.map((rowTasks) => {
            let maxNeeded = TASK_ROW_H;
            rowTasks.forEach((task) => {
              const w = Math.max(task.span * periodW - 0.04, 0.1);
              const innerW = Math.max(w - 0.08, 0.2);
              const descH = textBlockHeightIn(task.description, CELL_TEXT_SIZE, innerW);
              const hasAssignees = task.assignees && task.assignees.length > 0;
              const assigneeLineH = hasAssignees ? (6 / 72) * 1.4 + 0.03 : 0;
              const needed = 0.08 + descH + assigneeLineH;
              maxNeeded = Math.max(maxNeeded, needed);
            });
            return maxNeeded;
          })
        : [TASK_ROW_H];

      const naturalLaneH = rowHeights.reduce((a, b) => a + b, 0) + 0.06;
      const actualLaneH = Math.min(naturalLaneH, BOTTOM_LIMIT - laneY);

      // Label cell
      slide.addShape('rect' as any, {
        x: ML, y: laneY, w: LABEL_W, h: actualLaneH,
        fill: { color: 'FFFFFF' }, line: { color: 'CCCCCC', pt: 0.5 },
      });
      slide.addShape('rect' as any, {
        x: ML, y: laneY, w: 0.05, h: actualLaneH,
        fill: { color }, line: { color, pt: 0 },
      });
      slide.addText(swimlane.name, {
        x: ML + 0.1, y: laneY, w: LABEL_W - 0.15, h: actualLaneH,
        fontFace: BODY_FONT, fontSize: BODY_SIZE,
        bold: true, color: '222222', valign: 'middle',
      });

      // Grid background
      data.periods.forEach((_, pIdx) => {
        const x = ML + LABEL_W + pIdx * periodW;
        slide.addShape('rect' as any, {
          x, y: laneY, w: periodW, h: actualLaneH,
          fill: { color: 'FAFAFA' }, line: { color: 'E8E8E8', pt: 0.5 },
        });
      });

      // Task bars
      let rowCursorY = laneY;
      taskRows.forEach((rowTasks, rowIdx) => {
        const rowH = rowHeights[rowIdx];
        const taskY = rowCursorY + 0.03;
        if (taskY >= BOTTOM_LIMIT) { rowCursorY += rowH; return; }
        const taskH = Math.min(rowH - 0.06, BOTTOM_LIMIT - taskY);

        rowTasks.forEach((task) => {
          const statusStyle = getStatusStyle(task.status);
          const x = ML + LABEL_W + task.startPeriod * periodW + 0.02;
          const w = Math.max(task.span * periodW - 0.04, 0.1);
          const innerW = w - 0.08;
          const assignees = task.assignees || [];
          const assigneeText = assigneeInlineText(assignees, assigneeRoles);

          slide.addShape('rect' as any, {
            x, y: taskY, w, h: taskH,
            fill: { color: hex(statusStyle.bg) },
            line: { color: hex(statusStyle.border), pt: 1 },
            rectRadius: 0.03,
          });

          if (assigneeText) {
            const assigneeLineH = (6 / 72) * 1.5 + 0.02;
            const descAvailH = Math.max(taskH - assigneeLineH - 0.04, 0.10);

            slide.addText(task.description, {
              x: x + 0.04, y: taskY + 0.01, w: innerW, h: descAvailH,
              fontFace: BODY_FONT, fontSize: CELL_TEXT_SIZE,
              color: hex(statusStyle.fg),
              wrap: true, valign: 'top',
            });
            slide.addText(assigneeText, {
              x: x + 0.04, y: taskY + taskH - assigneeLineH - 0.01,
              w: innerW, h: assigneeLineH + 0.01,
              fontFace: BODY_FONT, fontSize: 6, bold: true,
              color: hex(statusStyle.fg),
              wrap: false, valign: 'bottom',
            });
          } else {
            slide.addText(task.description, {
              x: x + 0.04, y: taskY + 0.01, w: innerW, h: Math.max(taskH - 0.02, 0.12),
              fontFace: BODY_FONT, fontSize: CELL_TEXT_SIZE,
              color: hex(statusStyle.fg),
              wrap: true, valign: 'middle',
            });
          }
        });

        rowCursorY += rowH;
      });

      laneY += actualLaneH;
    });
  });

  prs.writeFile({ fileName: safeFileName(data.title) + '.pptx' });
}

function safeFileName(title: string): string {
  return (
    title.replace(/[^а-яёА-ЯЁa-zA-Z0-9\s\-_]/g, '').trim() || 'roadmap'
  );
}
