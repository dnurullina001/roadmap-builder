import pptxgen from 'pptxgenjs';
import { PhaseRoadmapData, ImplementationRoadmapData } from '@/types/roadmap';
import { getStatusStyle, ASSIGNEE_LABELS } from '@/lib/status';

const PHASE_COLORS = ['#0048F4', '#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5'];
const CORP_NAVY = '#44546A';
const CORP_BLUE = '#0048F4';

export function exportPhaseRoadmapToPptx(data: PhaseRoadmapData): void {
  const prs = new pptxgen();
  prs.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5" — standard widescreen

  const slide = prs.addSlide();
  slide.background = { color: 'FFFFFF' };

  // Title bar across full width
  slide.addShape(prs.ShapeType.rect, {
    x: 0.3, y: 0.15, w: 12.73, h: 0.45,
    fill: { color: CORP_NAVY.replace('#', '') },
    line: { color: CORP_NAVY.replace('#', '') },
  });
  slide.addText(data.title, {
    x: 0.4, y: 0.17, w: 12.5, h: 0.4,
    fontSize: 13, bold: true, color: 'FFFFFF',
    fontFace: 'Calibri',
  });

  // Calculate dimensions
  const COL_LABEL_W = 2.2;
  const GRID_W = 12.73 - COL_LABEL_W - 0.3; // remaining width for period columns
  const periodW = GRID_W / data.periods.length;
  const ROW_START_Y = 0.8;
  const HEADER_H = 0.3;
  const ROW_H = 0.28; // height per sub-item row

  // Period header row
  // "ЭТАП" cell
  slide.addShape(prs.ShapeType.rect, {
    x: 0.3, y: ROW_START_Y, w: COL_LABEL_W, h: HEADER_H,
    fill: { color: CORP_NAVY.replace('#', '') },
    line: { color: CORP_NAVY.replace('#', ''), pt: 0.5 },
  });
  slide.addText('ЭТАП', {
    x: 0.3, y: ROW_START_Y, w: COL_LABEL_W, h: HEADER_H,
    fontSize: 8, bold: true, color: 'FFFFFF', align: 'left',
    margin: [0, 0, 0, 4], fontFace: 'Calibri',
  });

  // Period header cells
  data.periods.forEach((period, idx) => {
    const x = 0.3 + COL_LABEL_W + idx * periodW;
    const isCurrent = idx === data.currentPosition;
    slide.addShape(prs.ShapeType.rect, {
      x, y: ROW_START_Y, w: periodW, h: HEADER_H,
      fill: { color: isCurrent ? 'FFF4E6' : 'F5F5F5' },
      line: { color: 'CCCCCC', pt: 0.5 },
    });
    slide.addText(period.toUpperCase(), {
      x, y: ROW_START_Y, w: periodW, h: HEADER_H,
      fontSize: 7, bold: true, color: isCurrent ? 'E67F00' : '555555',
      align: 'center', fontFace: 'Calibri',
    });
    if (isCurrent) {
      slide.addText('▲ МЫ ЗДЕСЬ', {
        x: x - periodW * 0.3, y: ROW_START_Y - 0.22, w: periodW * 1.6, h: 0.2,
        fontSize: 6, bold: true, color: 'E67F00', align: 'center', fontFace: 'Calibri',
      });
    }
  });

  // Phases and sub-items
  let currentY = ROW_START_Y + HEADER_H;

  data.phases.forEach((phase, phaseIdx) => {
    const phaseColor = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];
    const phaseRows = phase.subItems.length || 1;
    const phaseH = phaseRows * ROW_H;

    // Phase label cell (spans all sub-items)
    slide.addShape(prs.ShapeType.rect, {
      x: 0.3, y: currentY, w: COL_LABEL_W, h: phaseH,
      fill: { color: 'FFFFFF' },
      line: { color: 'CCCCCC', pt: 0.5 },
    });
    // Colored left border for phase
    slide.addShape(prs.ShapeType.rect, {
      x: 0.3, y: currentY, w: 0.06, h: phaseH,
      fill: { color: phaseColor.replace('#', '') },
      line: { color: phaseColor.replace('#', ''), pt: 0 },
    });
    slide.addText(`${phase.number}. ${phase.name}`, {
      x: 0.4, y: currentY, w: COL_LABEL_W - 0.12, h: phaseH,
      fontSize: 9, bold: true, color: '333333',
      valign: 'middle', wrap: true, fontFace: 'Calibri',
    });

    // Sub-items
    phase.subItems.forEach((item, itemIdx) => {
      const itemY = currentY + itemIdx * ROW_H;
      const statusStyle = getStatusStyle(item.status);

      data.periods.forEach((_, periodIdx) => {
        const isInRange = periodIdx >= item.startPeriod && periodIdx < item.endPeriod;
        const isStart = periodIdx === item.startPeriod;
        const x = 0.3 + COL_LABEL_W + periodIdx * periodW;
        const bgColor = isInRange ? statusStyle.bg.replace('#', '') : 'FFFFFF';

        slide.addShape(prs.ShapeType.rect, {
          x, y: itemY, w: periodW, h: ROW_H,
          fill: { color: bgColor },
          line: { color: 'CCCCCC', pt: 0.5 },
        });

        if (isStart) {
          const assigneeText = item.assignees.map(a => ASSIGNEE_LABELS[a]).join(', ');
          const prefix = statusStyle.icon + ' ';
          slide.addText(prefix + item.description + (assigneeText ? `  [${assigneeText}]` : ''), {
            x: x + 0.02, y: itemY + 0.01, w: periodW * (item.endPeriod - item.startPeriod) - 0.04, h: ROW_H - 0.02,
            fontSize: 7.5, color: statusStyle.fg.replace('#', ''),
            fontFace: 'Calibri', wrap: true, valign: 'middle',
          });
        }
      });
    });

    currentY += phaseH;
  });

  prs.writeFile({ fileName: data.title.replace(/[^а-яёА-ЯЁa-zA-Z0-9]/g, '_') + '.pptx' });
}

export function exportImplementationRoadmapToPptx(data: ImplementationRoadmapData): void {
  const prs = new pptxgen();
  prs.layout = 'LAYOUT_WIDE';

  const slide = prs.addSlide();
  slide.background = { color: 'FFFFFF' };

  const SWIMLANE_LABEL_W = 2.0;
  const GRID_W = 12.43;
  const periodW = GRID_W / data.periods.length;
  const MILESTONE_ROW_H = 0.8;
  const SWIMLANE_H = 0.7;

  // Title
  slide.addShape(prs.ShapeType.rect, {
    x: 0.3, y: 0.1, w: 12.73, h: 0.4,
    fill: { color: CORP_NAVY.replace('#', '') },
  });
  slide.addText(data.title, {
    x: 0.4, y: 0.12, w: 12.5, h: 0.36,
    fontSize: 12, bold: true, color: 'FFFFFF', fontFace: 'Calibri',
  });

  // Milestones row
  const MILESTONE_Y = 0.6;
  slide.addShape(prs.ShapeType.line, {
    x: 0.3 + SWIMLANE_LABEL_W, y: MILESTONE_Y + MILESTONE_ROW_H - 0.05,
    w: GRID_W, h: 0,
    line: { color: CORP_BLUE.replace('#', ''), pt: 1.5 },
  });

  data.milestones.forEach((m) => {
    const x = 0.3 + SWIMLANE_LABEL_W + m.periodIndex * periodW + periodW * 0.5;
    slide.addShape(prs.ShapeType.rect, {
      x: x - 0.6, y: MILESTONE_Y, w: 1.2, h: 0.28,
      fill: { color: CORP_BLUE.replace('#', '') },
      line: { color: CORP_BLUE.replace('#', '') },
      rectRadius: 0.02,
    });
    slide.addText(m.label, {
      x: x - 0.6, y: MILESTONE_Y, w: 1.2, h: 0.28,
      fontSize: 5.5, bold: true, color: 'FFFFFF', align: 'center',
      fontFace: 'Calibri', wrap: true,
    });
    slide.addShape(prs.ShapeType.line, {
      x, y: MILESTONE_Y + 0.28, w: 0, h: MILESTONE_ROW_H - 0.33,
      line: { color: CORP_BLUE.replace('#', ''), pt: 0.75 },
    });
  });

  // Period headers
  const HEADER_Y = MILESTONE_Y + MILESTONE_ROW_H;
  data.periods.forEach((period, idx) => {
    const x = 0.3 + SWIMLANE_LABEL_W + idx * periodW;
    slide.addShape(prs.ShapeType.rect, {
      x, y: HEADER_Y, w: periodW, h: 0.25,
      fill: { color: 'F0F0F0' }, line: { color: 'CCCCCC', pt: 0.5 },
    });
    slide.addText(period, {
      x, y: HEADER_Y, w: periodW, h: 0.25,
      fontSize: 7, color: '666666', align: 'center', fontFace: 'Calibri',
    });
  });

  // Swimlanes
  const SWIMLANE_COLORS = ['#0048F4', '#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5'];
  let swimY = HEADER_Y + 0.25;

  data.swimlanes.forEach((swimlane, swimIdx) => {
    const color = SWIMLANE_COLORS[swimIdx % SWIMLANE_COLORS.length];

    // Compute rows to avoid overlap
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
    const rowH = SWIMLANE_H / rowCount;

    // Swimlane label
    slide.addShape(prs.ShapeType.rect, {
      x: 0.3, y: swimY, w: SWIMLANE_LABEL_W, h: SWIMLANE_H,
      fill: { color: 'FFFFFF' }, line: { color: 'CCCCCC', pt: 0.5 },
    });
    slide.addShape(prs.ShapeType.rect, {
      x: 0.3, y: swimY, w: 0.06, h: SWIMLANE_H,
      fill: { color: color.replace('#', '') },
    });
    slide.addText(swimlane.name, {
      x: 0.4, y: swimY, w: SWIMLANE_LABEL_W - 0.12, h: SWIMLANE_H,
      fontSize: 9, bold: true, color: '333333', valign: 'middle', fontFace: 'Calibri',
    });

    // Grid background cells
    data.periods.forEach((_, pIdx) => {
      const x = 0.3 + SWIMLANE_LABEL_W + pIdx * periodW;
      slide.addShape(prs.ShapeType.rect, {
        x, y: swimY, w: periodW, h: SWIMLANE_H,
        fill: { color: 'FAFAFA' }, line: { color: 'E0E0E0', pt: 0.5 },
      });
    });

    // Tasks in each row
    taskRows.forEach((rowTasks, rowIdx) => {
      const taskY = swimY + rowIdx * rowH + 0.03;
      rowTasks.forEach((task) => {
        const statusStyle = getStatusStyle(task.status);
        const x = 0.3 + SWIMLANE_LABEL_W + task.startPeriod * periodW + 0.02;
        const w = task.span * periodW - 0.04;
        const assigneeText = task.assignees.map(a => ASSIGNEE_LABELS[a]).join(', ');

        slide.addShape(prs.ShapeType.rect, {
          x, y: taskY, w, h: rowH - 0.06,
          fill: { color: statusStyle.bg.replace('#', '') },
          line: { color: statusStyle.border.replace('#', ''), pt: 1 },
          rectRadius: 0.04,
        });
        slide.addText(task.description + (assigneeText ? `  [${assigneeText}]` : ''), {
          x: x + 0.04, y: taskY + 0.01, w: w - 0.08, h: rowH - 0.08,
          fontSize: 7, color: statusStyle.fg.replace('#', ''),
          fontFace: 'Calibri', wrap: true, valign: 'middle',
        });
      });
    });

    swimY += SWIMLANE_H;
  });

  prs.writeFile({ fileName: data.title.replace(/[^а-яёА-ЯЁa-zA-Z0-9]/g, '_') + '.pptx' });
}
