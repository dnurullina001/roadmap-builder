import pptxgen from 'pptxgenjs';
import { PhaseRoadmapData, ImplementationRoadmapData } from '@/types/roadmap';
import { getStatusStyle, ASSIGNEE_LABELS } from '@/lib/status';

// ── Corporate slide layout (matches provided template) ──────────────────────
const SLIDE_W = 12.598; // inches — from template XML (11520488 EMU)
const SLIDE_H = 7.086;  // inches — from template XML (6480175 EMU)

// Margins
const ML = 0.5;   // left margin
const MR = 0.5;   // right margin
const MB = 0.35;  // bottom margin

const CW = SLIDE_W - ML - MR; // content width = 11.598"

// Title box
const TITLE_Y = 0.28;
const TITLE_H = 0.62;
const TITLE_FONT = 'Times New Roman';
const TITLE_SIZE = 28;

// Accent line below title
const ACCENT_Y = TITLE_Y + TITLE_H;

// Content area starts below accent line
const CONTENT_Y = ACCENT_Y + 0.15;
const CONTENT_H = SLIDE_H - CONTENT_Y - MB; // ≈ 5.9"

// Body text
const BODY_FONT = 'Arial';
const BODY_SIZE = 10;

const CORP_NAVY = '44546A';
const CORP_BLUE = '0048F4';
const PHASE_COLORS = ['0048F4', '4472C4', 'ED7D31', '70AD47', 'FFC000', '5B9BD5'];

function setupLayout(prs: pptxgen) {
  (prs as any).defineLayout({ name: 'CORP', width: SLIDE_W, height: SLIDE_H });
  prs.layout = 'CORP' as any;
}

function addTitleBar(slide: pptxgen.Slide, title: string) {
  // White background for title
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
  // Accent line in corporate blue
  slide.addShape('line' as any, {
    x: ML, y: ACCENT_Y, w: CW, h: 0,
    line: { color: CORP_BLUE, pt: 2 },
  });
}

// ════════════════════════════════════════════════════════════════════════════
// PHASE ROADMAP (По этапам)
// ════════════════════════════════════════════════════════════════════════════
export function exportPhaseRoadmapToPptx(data: PhaseRoadmapData, slideCount = 1): void {
  const prs = new pptxgen();
  setupLayout(prs);

  // Split phases across slides
  const allPhases = data.phases;
  const phasesPerSlide = Math.ceil(allPhases.length / slideCount);

  for (let slideIdx = 0; slideIdx < slideCount; slideIdx++) {
    const slidePhases = allPhases.slice(
      slideIdx * phasesPerSlide,
      (slideIdx + 1) * phasesPerSlide
    );
    if (slidePhases.length === 0) continue;

    const slide = prs.addSlide();
    slide.background = { color: 'FFFFFF' };

    addTitleBar(slide, slideCount > 1
      ? `${data.title}  (${slideIdx + 1}/${slideCount})`
      : data.title
    );

    // ── Grid dimensions ─────────────────────────────────────────────────
    const COL_LABEL_W = 2.0;
    const GRID_W = CW - COL_LABEL_W;
    const periodW = GRID_W / data.periods.length;

    const HEADER_H = 0.28;

    // Auto-fit: total sub-item rows for phases on this slide
    const totalItemRows = slidePhases.reduce(
      (sum, p) => sum + Math.max(p.subItems.length, 1), 0
    );
    const availableH = CONTENT_H - HEADER_H;
    const ROW_H = Math.min(0.38, Math.max(0.18, availableH / totalItemRows));

    const GRID_START_Y = CONTENT_Y;

    // ── ЭТАП header cell ─────────────────────────────────────────────────
    slide.addShape('rect' as any, {
      x: ML, y: GRID_START_Y, w: COL_LABEL_W, h: HEADER_H,
      fill: { color: CORP_NAVY }, line: { color: CORP_NAVY, pt: 0.5 },
    });
    slide.addText('ЭТАП', {
      x: ML + 0.1, y: GRID_START_Y, w: COL_LABEL_W - 0.1, h: HEADER_H,
      fontFace: BODY_FONT, fontSize: BODY_SIZE, bold: true, color: 'FFFFFF',
    });

    // ── Period header cells ──────────────────────────────────────────────
    data.periods.forEach((period, idx) => {
      const x = ML + COL_LABEL_W + idx * periodW;
      const isCurrent = idx === data.currentPosition;
      slide.addShape('rect' as any, {
        x, y: GRID_START_Y, w: periodW, h: HEADER_H,
        fill: { color: isCurrent ? 'FFF4E6' : 'F5F5F5' },
        line: { color: 'CCCCCC', pt: 0.5 },
      });
      slide.addText(period.toUpperCase(), {
        x, y: GRID_START_Y, w: periodW, h: HEADER_H,
        fontFace: BODY_FONT, fontSize: BODY_SIZE - 1,
        bold: true, color: isCurrent ? 'CC6600' : '555555', align: 'center',
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

    // ── Phases & sub-items ───────────────────────────────────────────────
    let currentY = GRID_START_Y + HEADER_H;

    slidePhases.forEach((phase, phaseIdx) => {
      const phaseColor = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];
      const rows = Math.max(phase.subItems.length, 1);
      const phaseH = rows * ROW_H;

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

      // Sub-items grid
      if (phase.subItems.length === 0) {
        data.periods.forEach((_, periodIdx) => {
          const x = ML + COL_LABEL_W + periodIdx * periodW;
          slide.addShape('rect' as any, {
            x, y: currentY, w: periodW, h: ROW_H,
            fill: { color: 'FAFAFA' }, line: { color: 'DDDDDD', pt: 0.5 },
          });
        });
      } else {
        phase.subItems.forEach((item, itemIdx) => {
          const itemY = currentY + itemIdx * ROW_H;
          const statusStyle = getStatusStyle(item.status);

          data.periods.forEach((_, periodIdx) => {
            const x = ML + COL_LABEL_W + periodIdx * periodW;
            const inRange = periodIdx >= item.startPeriod && periodIdx < item.endPeriod;
            const isStart = periodIdx === item.startPeriod;
            const bgColor = inRange ? statusStyle.bg.replace('#', '') : 'FFFFFF';

            slide.addShape('rect' as any, {
              x, y: itemY, w: periodW, h: ROW_H,
              fill: { color: bgColor }, line: { color: 'DDDDDD', pt: 0.5 },
            });

            if (isStart) {
              const assigneeText = (item.assignees || []).map((a) => ASSIGNEE_LABELS[a]).join(', ');
              const spanW = periodW * (item.endPeriod - item.startPeriod);
              const textContent = item.description + (assigneeText ? `  [${assigneeText}]` : '');
              slide.addText(textContent, {
                x: x + 0.03, y: itemY + 0.01,
                w: spanW - 0.06, h: ROW_H - 0.02,
                fontFace: BODY_FONT, fontSize: BODY_SIZE,
                color: statusStyle.fg.replace('#', ''),
                wrap: true, valign: 'middle',
              });
            }
          });
        });
      }

      currentY += phaseH;
    });
  }

  prs.writeFile({ fileName: safeFileName(data.title) + '.pptx' });
}

// ════════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION ROADMAP (По потокам)
// ════════════════════════════════════════════════════════════════════════════
export function exportImplementationRoadmapToPptx(
  data: ImplementationRoadmapData,
  slideCount = 1
): void {
  const prs = new pptxgen();
  setupLayout(prs);

  const allLanes = data.swimlanes;
  const lanesPerSlide = Math.ceil(allLanes.length / slideCount);

  for (let slideIdx = 0; slideIdx < slideCount; slideIdx++) {
    const slideLanes = allLanes.slice(
      slideIdx * lanesPerSlide,
      (slideIdx + 1) * lanesPerSlide
    );
    if (slideLanes.length === 0) continue;

    const slide = prs.addSlide();
    slide.background = { color: 'FFFFFF' };

    addTitleBar(slide, slideCount > 1
      ? `${data.title}  (${slideIdx + 1}/${slideCount})`
      : data.title
    );

    // ── Dimensions ─────────────────────────────────────────────────────
    const LABEL_W = 2.0;
    const GRID_W = CW - LABEL_W;
    const periodW = GRID_W / data.periods.length;

    const MILESTONE_H = 0.7;
    const HEADER_H = 0.26;

    // Auto-fit swimlane heights
    const maxRows = Math.max(
      ...slideLanes.map((sl) => {
        const sorted = [...sl.tasks].sort((a, b) => a.startPeriod - b.startPeriod);
        const rows: typeof sorted[] = [];
        for (const t of sorted) {
          let placed = false;
          for (const r of rows) {
            if (r[r.length - 1].startPeriod + r[r.length - 1].span <= t.startPeriod) {
              r.push(t); placed = true; break;
            }
          }
          if (!placed) rows.push([t]);
        }
        return Math.max(rows.length, 1);
      }),
      1
    );

    const availableH = CONTENT_H - MILESTONE_H - HEADER_H;
    const LANE_H = Math.min(0.75, Math.max(0.32, availableH / slideLanes.length));
    const TASK_ROW_H = LANE_H / maxRows;

    const MILE_Y = CONTENT_Y;
    const HEADER_Y = MILE_Y + MILESTONE_H;
    let laneY = HEADER_Y + HEADER_H;

    // ── Milestone row ──────────────────────────────────────────────────
    slide.addShape('line' as any, {
      x: ML + LABEL_W, y: MILE_Y + MILESTONE_H - 0.05,
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
        x: cx, y: MILE_Y + 0.26, w: 0, h: MILESTONE_H - 0.31,
        line: { color: CORP_BLUE, pt: 0.75 },
      });
    });

    // ── Period header ──────────────────────────────────────────────────
    slide.addShape('rect' as any, {
      x: ML, y: HEADER_Y, w: LABEL_W, h: HEADER_H,
      fill: { color: CORP_NAVY }, line: { color: CORP_NAVY, pt: 0.5 },
    });
    data.periods.forEach((period, idx) => {
      const x = ML + LABEL_W + idx * periodW;
      slide.addShape('rect' as any, {
        x, y: HEADER_Y, w: periodW, h: HEADER_H,
        fill: { color: 'F0F0F0' }, line: { color: 'CCCCCC', pt: 0.5 },
      });
      slide.addText(period, {
        x, y: HEADER_Y, w: periodW, h: HEADER_H,
        fontFace: BODY_FONT, fontSize: BODY_SIZE - 1,
        color: '666666', align: 'center',
      });
    });

    // ── Swimlanes ──────────────────────────────────────────────────────
    const SWIMLANE_COLORS = PHASE_COLORS;

    slideLanes.forEach((swimlane, swimIdx) => {
      const color = SWIMLANE_COLORS[swimIdx % SWIMLANE_COLORS.length];

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
      const actualLaneH = rowCount * TASK_ROW_H + 0.06;

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

      // Tasks
      taskRows.forEach((rowTasks, rowIdx) => {
        const taskY = laneY + rowIdx * TASK_ROW_H + 0.03;
        rowTasks.forEach((task) => {
          const statusStyle = getStatusStyle(task.status);
          const x = ML + LABEL_W + task.startPeriod * periodW + 0.02;
          const w = task.span * periodW - 0.04;
          const assigneeText = (task.assignees || []).map((a) => ASSIGNEE_LABELS[a]).join(', ');
          const taskText = task.description + (assigneeText ? `  [${assigneeText}]` : '');

          slide.addShape('rect' as any, {
            x, y: taskY, w, h: TASK_ROW_H - 0.06,
            fill: { color: statusStyle.bg.replace('#', '') },
            line: { color: statusStyle.border.replace('#', ''), pt: 1 },
            rectRadius: 0.03,
          });
          slide.addText(taskText, {
            x: x + 0.04, y: taskY + 0.01, w: w - 0.08, h: TASK_ROW_H - 0.08,
            fontFace: BODY_FONT, fontSize: BODY_SIZE,
            color: statusStyle.fg.replace('#', ''),
            wrap: true, valign: 'middle',
          });
        });
      });

      laneY += actualLaneH;
    });
  }

  prs.writeFile({ fileName: safeFileName(data.title) + '.pptx' });
}

function safeFileName(title: string): string {
  return title.replace(/[^а-яёА-ЯЁa-zA-Z0-9\s\-_]/g, '').trim() || 'roadmap';
}
