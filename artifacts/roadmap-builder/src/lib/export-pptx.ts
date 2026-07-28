import pptxgen from 'pptxgenjs';
import { PhaseRoadmapData, ImplementationRoadmapData, Phase } from '@/types/roadmap';
import { getStatusStyle, ASSIGNEE_LABELS } from '@/lib/status';

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
const CONTENT_H = SLIDE_H - CONTENT_Y - MB; // ≈ 5.9"

const TITLE_FONT = 'Times New Roman';
const TITLE_SIZE = 28;
const BODY_FONT  = 'Arial';
const BODY_SIZE  = 10;

const CORP_NAVY = '44546A';
const CORP_BLUE = '0048F4';
const PHASE_COLORS = ['0048F4', '4472C4', 'ED7D31', '70AD47', 'FFC000', '5B9BD5'];

// Minimum readable row height — never place shapes below this height
const MIN_ROW_H = 0.18; // inches

function setupLayout(prs: pptxgen) {
  (prs as any).defineLayout({ name: 'CORP', width: SLIDE_W, height: SLIDE_H });
  prs.layout = 'CORP' as any;
}

function addTitleBar(slide: pptxgen.Slide, title: string) {
  slide.addShape('rect' as any, {
    x: ML, y: TITLE_Y, w: CW, h: TITLE_H,
    fill: { color: 'FFFFFF' },
    line: { color: 'DDDDDD', pt: 0.5 },
  });
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

/** Strip # and ensure valid 6-char hex; fall back to white */
function hex(colorStr: string): string {
  const cleaned = colorStr.replace('#', '').trim();
  return /^[0-9A-Fa-f]{6}$/.test(cleaned) ? cleaned : 'FFFFFF';
}

// ────────────────────────────────────────────────────────────────────────────
// PHASE SLIDE PACKING
// Strategy: fill each slide as full as possible (respecting MIN_ROW_H and
// slide bounds), then put the remainder on the next slide — so early slides
// are always full and the last slide has only what's left.
// ────────────────────────────────────────────────────────────────────────────

const PHASE_HEADER_H = 0.28;
const PHASE_ROW_AREA = CONTENT_H - PHASE_HEADER_H; // rows-only height ≈ 5.3"
const MAX_ROWS_PER_SLIDE = Math.floor(PHASE_ROW_AREA / MIN_ROW_H); // ≈ 29

function packPhasesIntoSlides(phases: Phase[], requestedSlides: number): Phase[][] {
  if (requestedSlides <= 1 || phases.length === 0) return [phases];

  const phaseRowCounts = phases.map(p => Math.max(p.subItems.length, 1));
  const totalRows = phaseRowCounts.reduce((a, b) => a + b, 0);

  // Target rows per slide: distribute evenly, but cap at physical maximum
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
export function exportPhaseRoadmapToPptx(data: PhaseRoadmapData, slideCount = 1): void {
  const prs = new pptxgen();
  setupLayout(prs);

  const slideGroups = packPhasesIntoSlides(data.phases, slideCount);
  const totalSlides = slideGroups.length;

  const COL_LABEL_W = 2.0;
  const GRID_W = CW - COL_LABEL_W;
  const periodW = GRID_W / Math.max(data.periods.length, 1);

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

    // ── Row height: auto-fit to available area, capped for readability ──────
    const totalItemRows = slidePhases.reduce(
      (sum, p) => sum + Math.max(p.subItems.length, 1),
      0,
    );
    const ROW_H = Math.min(
      0.45,
      Math.max(MIN_ROW_H, PHASE_ROW_AREA / totalItemRows),
    );

    const GRID_START_Y = CONTENT_Y;
    // Hard bottom limit — no shape may cross this line
    const BOTTOM_LIMIT = SLIDE_H - MB;

    // ── ЭТАП header ─────────────────────────────────────────────────────────
    slide.addShape('rect' as any, {
      x: ML, y: GRID_START_Y, w: COL_LABEL_W, h: PHASE_HEADER_H,
      fill: { color: CORP_NAVY }, line: { color: CORP_NAVY, pt: 0.5 },
    });
    slide.addText('ЭТАП', {
      x: ML + 0.1, y: GRID_START_Y, w: COL_LABEL_W - 0.1, h: PHASE_HEADER_H,
      fontFace: BODY_FONT, fontSize: BODY_SIZE, bold: true, color: 'FFFFFF',
    });

    // ── Period headers ───────────────────────────────────────────────────────
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
        color: isCurrent ? 'CC6600' : '555555',
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
      // Safety: skip if we're already past the bottom margin
      if (currentY >= BOTTOM_LIMIT - MIN_ROW_H) return;

      const phaseColor = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];
      const rowCount = Math.max(phase.subItems.length, 1);
      // Clamp phase block so it never bleeds past BOTTOM_LIMIT
      const phaseH = Math.min(rowCount * ROW_H, BOTTOM_LIMIT - currentY);

      // Phase label cell
      slide.addShape('rect' as any, {
        x: ML, y: currentY, w: COL_LABEL_W, h: phaseH,
        fill: { color: 'FFFFFF' }, line: { color: 'CCCCCC', pt: 0.5 },
      });
      // Colored left border stripe
      slide.addShape('rect' as any, {
        x: ML, y: currentY, w: 0.05, h: phaseH,
        fill: { color: phaseColor }, line: { color: phaseColor, pt: 0 },
      });
      slide.addText(`${phase.number}. ${phase.name}`, {
        x: ML + 0.1, y: currentY, w: COL_LABEL_W - 0.15, h: phaseH,
        fontFace: BODY_FONT, fontSize: BODY_SIZE - 1,
        bold: true, color: '222222', valign: 'middle', wrap: true,
      });

      // Sub-items grid
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
        phase.subItems.forEach((item, itemIdx) => {
          const itemY = currentY + itemIdx * ROW_H;
          if (itemY >= BOTTOM_LIMIT) return; // clip rows that overflow
          const rowH = Math.min(ROW_H, BOTTOM_LIMIT - itemY);
          const statusStyle = getStatusStyle(item.status);

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
              const assigneeText = (item.assignees || [])
                .map((a) => ASSIGNEE_LABELS[a])
                .join(', ');
              const spanW = periodW * Math.max(item.endPeriod - item.startPeriod, 1);
              const textContent =
                item.description + (assigneeText ? `  [${assigneeText}]` : '');
              slide.addText(textContent, {
                x: x + 0.03, y: itemY + 0.01,
                w: spanW - 0.06, h: rowH - 0.02,
                fontFace: BODY_FONT, fontSize: BODY_SIZE,
                color: hex(statusStyle.fg),
                wrap: true, valign: 'middle',
              });
            }
          });
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
const MAX_LANES_PER_SLIDE = Math.floor(IMPL_ROW_AREA / 0.32); // ≈ 16 lanes

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
): void {
  const prs = new pptxgen();
  setupLayout(prs);

  const slideGroups = packLanesIntoSlides(data.swimlanes, slideCount);
  const totalSlides = slideGroups.length;

  const LABEL_W  = 2.0;
  const GRID_W   = CW - LABEL_W;
  const periodW  = GRID_W / Math.max(data.periods.length, 1);
  const BOTTOM_LIMIT = SLIDE_H - MB;

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

    // ── Auto-fit lane heights ────────────────────────────────────────────────
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

    // ── Milestone row ────────────────────────────────────────────────────────
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

    // ── Period header ────────────────────────────────────────────────────────
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
        color: '666666', align: 'center',
      });
    });

    // ── Swimlanes ────────────────────────────────────────────────────────────
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
      const rowCount = Math.max(taskRows.length, 1);
      const actualLaneH = Math.min(
        rowCount * TASK_ROW_H + 0.06,
        BOTTOM_LIMIT - laneY,
      );

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
      taskRows.forEach((rowTasks, rowIdx) => {
        const taskY = laneY + rowIdx * TASK_ROW_H + 0.03;
        if (taskY >= BOTTOM_LIMIT) return;
        const taskH = Math.min(TASK_ROW_H - 0.06, BOTTOM_LIMIT - taskY);

        rowTasks.forEach((task) => {
          const statusStyle = getStatusStyle(task.status);
          const x = ML + LABEL_W + task.startPeriod * periodW + 0.02;
          const w = Math.max(task.span * periodW - 0.04, 0.1);
          const assigneeText = (task.assignees || [])
            .map((a) => ASSIGNEE_LABELS[a])
            .join(', ');
          const taskText =
            task.description + (assigneeText ? `  [${assigneeText}]` : '');

          slide.addShape('rect' as any, {
            x, y: taskY, w, h: taskH,
            fill: { color: hex(statusStyle.bg) },
            line: { color: hex(statusStyle.border), pt: 1 },
            rectRadius: 0.03,
          });
          slide.addText(taskText, {
            x: x + 0.04, y: taskY + 0.01, w: w - 0.08, h: taskH - 0.02,
            fontFace: BODY_FONT, fontSize: BODY_SIZE,
            color: hex(statusStyle.fg),
            wrap: true, valign: 'middle',
          });
        });
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
