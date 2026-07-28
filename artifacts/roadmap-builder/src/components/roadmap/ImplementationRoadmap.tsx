import { ImplementationRoadmapData } from '@/types/roadmap';
import { Flag } from 'lucide-react';

interface ImplementationRoadmapProps {
  data: ImplementationRoadmapData;
}

const SWIMLANE_COLORS = ['#0048F4', '#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5'];

export default function ImplementationRoadmap({ data }: ImplementationRoadmapProps) {
  const { title, periods, milestones, swimlanes } = data;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'done':
        return {
          backgroundColor: 'var(--status-done-bg)',
          borderColor: 'var(--status-done-border)',
          color: 'var(--status-done-fg)',
        };
      case 'in-progress':
        return {
          backgroundColor: 'var(--status-inprogress-bg)',
          borderColor: 'var(--status-inprogress-border)',
          color: 'var(--status-inprogress-fg)',
        };
      case 'backlog':
        return {
          backgroundColor: 'var(--status-backlog-bg)',
          borderColor: 'var(--status-backlog-border)',
          color: 'var(--status-backlog-fg)',
        };
      default:
        return {};
    }
  };

  return (
    <div className="w-full h-full overflow-auto p-6 bg-[#EBEBEB] flex items-center justify-center">
      <div className="bg-white shadow-lg max-w-[1200px] w-full relative">
        {/* Slide number badge */}
        <div className="absolute top-3 right-3 text-[9px] text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
          1
        </div>

        <div className="p-6">
          {/* Title */}
          <div
            className="text-white font-semibold text-[11px] px-4 py-2.5 mb-4 tracking-tight border border-border"
            style={{ backgroundColor: '#44546A' }}
          >
            {title}
          </div>

          {/* Milestones row */}
          <div className="relative h-16 mb-6 border-b-2" style={{ borderColor: '#0048F4' }}>
            <div className="flex items-end h-full">
              {periods.map((period, idx) => {
                const milestone = milestones.find((m) => m.periodIndex === idx);
                const widthPercent = 100 / periods.length;

                return (
                  <div
                    key={idx}
                    className="relative flex-shrink-0 h-full flex items-end justify-center"
                    style={{ width: `${widthPercent}%` }}
                  >
                    {milestone && (
                      <div className="absolute bottom-0 flex flex-col items-center">
                        <div
                          className="text-white px-2 py-1 text-[8px] font-bold tracking-wider whitespace-nowrap rounded-sm mb-1"
                          style={{ backgroundColor: '#0048F4' }}
                        >
                          {milestone.label}
                        </div>
                        <div className="w-px h-4" style={{ backgroundColor: '#0048F4' }} />
                        <Flag className="w-3 h-3 -mt-px" style={{ color: '#0048F4', fill: '#0048F4' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Swimlanes */}
          <div className="space-y-1">
            {swimlanes.map((swimlane, swimlaneIdx) => {
              const swimlaneColor = SWIMLANE_COLORS[swimlaneIdx % SWIMLANE_COLORS.length];
              return (
                <div key={swimlane.id} className="flex items-stretch border border-border min-h-[60px]">
                  {/* Swimlane label */}
                  <div
                    className="w-48 px-3 py-3 flex items-center font-medium text-[10px] bg-card border-r border-border shrink-0"
                    style={{ borderLeftColor: swimlaneColor, borderLeftWidth: '3px' }}
                  >
                    {swimlane.name}
                  </div>

                  {/* Task timeline */}
                  <div className="flex-1 relative bg-muted/30">
                    <div className="flex h-full">
                      {periods.map((period, idx) => {
                        const widthPercent = 100 / periods.length;
                        return (
                          <div
                            key={idx}
                            className="border-r border-border last:border-r-0 relative"
                            style={{ width: `${widthPercent}%` }}
                          >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[7px] text-muted-foreground uppercase tracking-wide py-0.5">
                              {period}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tasks overlay */}
                    <div className="absolute inset-0 flex flex-col justify-center gap-1 px-1 py-2">
                      {swimlane.tasks.map((task) => {
                        const startPercent = (task.startPeriod / periods.length) * 100;
                        const widthPercent = (task.span / periods.length) * 100;
                        const statusStyle = getStatusStyle(task.status);

                        return (
                          <div
                            key={task.id}
                            className="absolute"
                            style={{
                              left: `${startPercent}%`,
                              width: `${widthPercent}%`,
                              top: '50%',
                              transform: 'translateY(-50%)',
                            }}
                          >
                            <div
                              className="rounded px-2 py-1.5 text-[9px] leading-tight shadow-sm border-l-2"
                              style={statusStyle}
                            >
                              <div className="font-medium">{task.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
