import { ImplementationRoadmapData, Task } from '@/types/roadmap';
import { Flag } from 'lucide-react';
import { getStatusStyle, ASSIGNEE_LABELS, ASSIGNEE_COLORS } from '@/lib/status';

interface ImplementationRoadmapProps {
  data: ImplementationRoadmapData;
}

const SWIMLANE_COLORS = ['#0048F4', '#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5'];

function layoutTasksIntoRows(tasks: Task[]): Task[][] {
  const sorted = [...tasks].sort((a, b) => a.startPeriod - b.startPeriod);
  const rows: Task[][] = [];
  for (const task of sorted) {
    let placed = false;
    for (const row of rows) {
      const lastTask = row[row.length - 1];
      if (lastTask.startPeriod + lastTask.span <= task.startPeriod) {
        row.push(task);
        placed = true;
        break;
      }
    }
    if (!placed) rows.push([task]);
  }
  return rows;
}

export default function ImplementationRoadmap({ data }: ImplementationRoadmapProps) {
  const { title, periods, milestones, swimlanes } = data;

  return (
    <div className="w-full h-full overflow-hidden p-6 bg-[#EBEBEB] flex flex-col items-center">
      <div className="bg-white shadow-lg max-w-[1200px] w-full relative flex-1 flex flex-col min-h-0">
        <div className="absolute top-3 right-3 text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-sm z-10">
          1
        </div>

        <div className="p-6 flex-1 overflow-auto flex flex-col">
          {/* Title */}
          <div
            className="text-white font-bold px-4 py-3 mb-6 tracking-tight border border-border"
            style={{ backgroundColor: '#44546A', fontSize: '13px' }}
          >
            {title}
          </div>

          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Milestones Row */}
            <div className="relative h-16 shrink-0 z-10">
              <div className="absolute bottom-0 w-full h-0 border-b-2" style={{ borderColor: '#0048F4', left: '14rem', width: 'calc(100% - 14rem)' }} />
              <div className="flex h-full pl-56">
                {periods.map((_, idx) => {
                  const milestone = milestones.find((m) => m.periodIndex === idx);
                  const widthPercent = 100 / periods.length;

                  return (
                    <div
                      key={idx}
                      className="relative h-full"
                      style={{ width: `${widthPercent}%` }}
                    >
                      {milestone && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div
                            className="text-white px-2 py-1 text-[9px] font-bold tracking-wider whitespace-nowrap rounded-sm shadow-sm mb-1"
                            style={{ backgroundColor: '#0048F4' }}
                          >
                            {milestone.label}
                          </div>
                          <div className="w-px h-5" style={{ backgroundColor: '#0048F4' }} />
                          <Flag className="w-3.5 h-3.5 absolute bottom-0 -ml-[0.5px]" style={{ color: '#0048F4', fill: '#0048F4' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid Header (Periods) */}
            <div className="flex border-b border-r border-border bg-[#F5F5F5] shrink-0">
              <div className="w-56 shrink-0 border-l border-border bg-white" />
              {periods.map((period, idx) => (
                <div
                  key={idx}
                  className="py-2 text-center text-[11px] font-bold uppercase text-muted-foreground border-l border-border"
                  style={{ width: `${100 / periods.length}%` }}
                >
                  {period}
                </div>
              ))}
            </div>

            {/* Swimlanes */}
            <div className="flex-1 overflow-y-auto border-b border-border">
              {swimlanes.map((swimlane, swimlaneIdx) => {
                const swimlaneColor = SWIMLANE_COLORS[swimlaneIdx % SWIMLANE_COLORS.length];
                const rows = layoutTasksIntoRows(swimlane.tasks);
                const minRows = Math.max(rows.length, 1);
                
                return (
                  <div key={swimlane.id} className="flex border-r border-l border-border border-b last:border-b-0 group">
                    {/* Swimlane label */}
                    <div
                      className="w-56 px-4 py-3 flex items-center font-bold text-[12px] bg-white border-r border-border shrink-0"
                      style={{ borderLeftColor: swimlaneColor, borderLeftWidth: '4px' }}
                    >
                      {swimlane.name}
                    </div>

                    {/* Task grid */}
                    <div className="flex-1 relative bg-[#FAFAFA]">
                      {/* Vertical grid lines */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        {periods.map((_, idx) => (
                          <div
                            key={idx}
                            className="h-full border-r border-border/50"
                            style={{ width: `${100 / periods.length}%` }}
                          />
                        ))}
                      </div>

                      {/* Task Sub-rows */}
                      <div className="relative py-2 flex flex-col gap-1">
                        {rows.map((rowTasks, rowIdx) => (
                          <div key={rowIdx} className="relative w-full" style={{ height: '38px' }}>
                            {rowTasks.map((task) => {
                              const startPercent = (task.startPeriod / periods.length) * 100;
                              const widthPercent = (task.span / periods.length) * 100;
                              const statusStyle = getStatusStyle(task.status);
                              const isDelayed = task.status === 'delayed';

                              return (
                                <div
                                  key={task.id}
                                  className="absolute px-1"
                                  style={{
                                    left: `${startPercent}%`,
                                    width: `${widthPercent}%`,
                                    height: '32px',
                                    top: '3px'
                                  }}
                                >
                                  <div
                                    className="w-full h-full rounded shadow-sm flex flex-col justify-center px-2 py-1 overflow-hidden"
                                    style={{
                                      backgroundColor: statusStyle.bg,
                                      borderLeft: `4px solid ${statusStyle.border}`,
                                      color: statusStyle.fg,
                                      border: isDelayed ? `1px solid ${statusStyle.border}` : undefined,
                                      borderLeftWidth: '4px'
                                    }}
                                    title={task.description}
                                  >
                                    <div className="font-bold text-[10px] truncate leading-tight flex items-center gap-1">
                                      {task.description}
                                      {isDelayed && <span className="text-[#C62828] shrink-0">⚠</span>}
                                    </div>
                                    
                                    {task.assignees && task.assignees.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-0.5">
                                        {task.assignees.map((assignee) => (
                                          <div
                                            key={assignee}
                                            className="px-1 py-[1px] rounded-[2px] text-white font-bold leading-none flex items-center justify-center"
                                            style={{ backgroundColor: ASSIGNEE_COLORS[assignee], fontSize: '7px' }}
                                            title={ASSIGNEE_LABELS[assignee]}
                                          >
                                            {ASSIGNEE_LABELS[assignee].substring(0, 2).toUpperCase()}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                        {rows.length === 0 && <div style={{ height: '38px' }} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
