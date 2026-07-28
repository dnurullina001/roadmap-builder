import { ImplementationRoadmapData } from '@/types/roadmap';
import { Flag } from 'lucide-react';

interface ImplementationRoadmapProps {
  data: ImplementationRoadmapData;
}

export default function ImplementationRoadmap({ data }: ImplementationRoadmapProps) {
  const { title, periods, milestones, swimlanes } = data;

  return (
    <div className="w-full h-full overflow-auto p-6 bg-card">
      <div className="inline-block min-w-full">
        {/* Title */}
        <div className="border border-border bg-secondary text-secondary-foreground font-semibold text-sm px-4 py-3 mb-4 tracking-tight">
          {title}
        </div>

        {/* Milestones row */}
        <div className="relative h-16 mb-6 border-b border-border">
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
                      <div className="bg-accent text-accent-foreground px-2 py-1 text-[9px] font-bold tracking-wider whitespace-nowrap rounded-sm mb-1">
                        {milestone.label}
                      </div>
                      <div className="w-px h-4 bg-accent" />
                      <Flag className="w-3 h-3 text-accent fill-accent -mt-px" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Swimlanes */}
        <div className="space-y-1">
          {swimlanes.map((swimlane) => (
            <div key={swimlane.id} className="flex items-stretch border border-border">
              {/* Swimlane label */}
              <div
                className="w-48 px-3 py-3 flex items-center font-medium text-xs bg-card border-r border-border shrink-0"
                style={{ borderLeftColor: swimlane.color, borderLeftWidth: '3px' }}
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
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground uppercase tracking-wide py-0.5">
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
                          className="rounded px-2 py-1.5 text-white text-[10px] leading-tight shadow-sm"
                          style={{ backgroundColor: swimlane.color }}
                        >
                          <div className="font-medium">{task.description}</div>
                          {task.notes && (
                            <div className="text-[9px] opacity-90 mt-0.5 italic">
                              {task.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
