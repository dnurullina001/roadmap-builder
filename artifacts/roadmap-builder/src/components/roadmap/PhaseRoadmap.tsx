import { PhaseRoadmapData } from '@/types/roadmap';
import { ArrowUp } from 'lucide-react';
import { getStatusStyle, ASSIGNEE_LABELS, ASSIGNEE_COLORS } from '@/lib/status';

interface PhaseRoadmapProps {
  data: PhaseRoadmapData;
}

const PHASE_COLORS = ['#0048F4', '#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5'];

export default function PhaseRoadmap({ data }: PhaseRoadmapProps) {
  const { title, periods, currentPosition, phases, milestones } = data;

  return (
    <div className="w-full h-full overflow-hidden p-6 bg-[#EBEBEB] flex flex-col items-center">
      <div className="bg-white shadow-lg max-w-[1200px] w-full relative flex-1 flex flex-col min-h-0">
        <div className="absolute top-3 right-3 text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-sm z-10">
          1
        </div>

        <div className="p-6 flex-1 overflow-auto">
          <table className="border-collapse w-full table-fixed">
            <thead>
              {/* Title row */}
              <tr>
                <th
                  colSpan={periods.length + 1}
                  className="border border-border text-white font-bold px-4 py-3 text-left tracking-tight"
                  style={{ backgroundColor: '#44546A', fontSize: '13px' }}
                >
                  {title}
                </th>
              </tr>
              {/* Period headers */}
              <tr>
                <th
                  className="border border-border text-white w-56 px-3 py-2 text-left font-bold"
                  style={{ backgroundColor: '#44546A', fontSize: '11px' }}
                >
                  ЭТАП
                </th>
                {periods.map((period, idx) => (
                  <th
                    key={idx}
                    className="border border-border px-3 py-2 text-center relative"
                    style={{
                      backgroundColor: idx === currentPosition ? '#FFF4E6' : '#F5F5F5',
                      borderLeftColor: idx === currentPosition ? '#FFC000' : undefined,
                      borderLeftWidth: idx === currentPosition ? '3px' : undefined,
                      color: idx === currentPosition ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    <div className="uppercase tracking-wide font-bold" style={{ fontSize: '11px' }}>
                      {period}
                    </div>
                    {idx === currentPosition && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="font-bold uppercase tracking-wider mb-0.5" style={{ color: '#FFC000', fontSize: '10px' }}>
                          Мы здесь
                        </div>
                        <ArrowUp className="w-4 h-4" style={{ color: '#FFC000' }} />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {phases.map((phase, phaseIdx) => {
                const phaseColor = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];
                return (
                  <tr key={phase.id}>
                    <td
                      className="border border-border px-3 py-2 bg-card align-top"
                      style={{ borderLeftColor: phaseColor, borderLeftWidth: '3px' }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-muted-foreground shrink-0" style={{ fontSize: '12px' }}>
                          {phase.number}
                        </span>
                        <span className="text-foreground leading-tight font-bold" style={{ fontSize: '12px' }}>
                          {phase.name}
                        </span>
                      </div>
                    </td>
                    <td colSpan={periods.length} className="p-0">
                      <table className="w-full border-collapse table-fixed h-full">
                        <tbody>
                          {phase.subItems.map((item, itemIndex) => (
                            <tr key={item.id}>
                              {periods.map((_, periodIdx) => {
                                const isInRange =
                                  periodIdx >= item.startPeriod &&
                                  periodIdx < item.endPeriod;
                                const isStart = periodIdx === item.startPeriod;
                                const milestone = milestones.find(
                                  (m) => m.periodIndex === periodIdx && m.phaseIndex === phaseIdx
                                );

                                const statusStyle = isInRange ? getStatusStyle(item.status) : undefined;
                                const isDelayed = item.status === 'delayed';

                                // Custom CSS for striped background if delayed
                                const cellStyle: React.CSSProperties = {
                                  backgroundColor: statusStyle?.bg,
                                  color: statusStyle?.fg,
                                };
                                
                                if (isInRange && isDelayed) {
                                  cellStyle.backgroundImage = `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(198, 40, 40, 0.05) 10px, rgba(198, 40, 40, 0.05) 20px)`;
                                }

                                return (
                                  <td
                                    key={periodIdx}
                                    className="border border-border px-3 py-2 relative"
                                    style={cellStyle}
                                  >
                                    {isStart && (
                                      <div className="flex flex-col gap-1.5 h-full">
                                        <div className="flex items-start gap-1.5">
                                          <span className="font-mono opacity-70 mt-0.5 shrink-0" style={{ fontSize: '10px' }}>
                                            {phase.number}.{itemIndex + 1}
                                          </span>
                                          <span className="leading-snug flex-1 font-medium text-[11px] truncate" title={item.description}>
                                            {item.description}
                                          </span>
                                          {isDelayed && (
                                            <span className="text-[#C62828] font-bold shrink-0 ml-1">⚠</span>
                                          )}
                                        </div>
                                        {/* Assignee badges */}
                                        {item.assignees && item.assignees.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-auto pt-1">
                                            {item.assignees.map((assignee) => (
                                              <div
                                                key={assignee}
                                                className="px-1.5 py-0.5 rounded-[3px] text-white font-bold leading-none flex items-center justify-center"
                                                style={{ backgroundColor: ASSIGNEE_COLORS[assignee], fontSize: '8px' }}
                                                title={ASSIGNEE_LABELS[assignee]}
                                              >
                                                {ASSIGNEE_LABELS[assignee].substring(0, 2).toUpperCase()}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {milestone && (
                                      <div className="absolute top-1 right-1 z-10">
                                        <div
                                          className="w-2.5 h-2.5 rotate-45 border-2 border-white shadow-sm"
                                          style={{ backgroundColor: phaseColor }}
                                          title={milestone.label}
                                        />
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
