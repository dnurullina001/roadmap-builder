import { PhaseRoadmapData } from '@/types/roadmap';
import { Check, Flag } from 'lucide-react';

interface PhaseRoadmapProps {
  data: PhaseRoadmapData;
}

export default function PhaseRoadmap({ data }: PhaseRoadmapProps) {
  const { title, periods, currentPosition, phases, milestones } = data;

  return (
    <div className="w-full h-full overflow-auto p-6 bg-card">
      <div className="inline-block min-w-full">
        <table className="border-collapse w-full text-xs">
          {/* Title row */}
          <thead>
            <tr>
              <th
                colSpan={periods.length + 1}
                className="border border-border bg-secondary text-secondary-foreground font-semibold text-sm px-4 py-3 text-left tracking-tight"
              >
                {title}
              </th>
            </tr>
            {/* Period headers */}
            <tr>
              <th className="border border-border bg-muted w-48 px-3 py-2 text-left font-medium text-muted-foreground">
                Этап
              </th>
              {periods.map((period, idx) => (
                <th
                  key={idx}
                  className={`border border-border px-3 py-2 text-center font-medium relative ${
                    idx === currentPosition
                      ? 'bg-accent/10 text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="uppercase tracking-wide text-[10px] font-semibold">
                    {period}
                  </div>
                  {idx === currentPosition && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <Flag className="w-3 h-3 text-accent fill-accent" />
                      <div className="text-[9px] font-bold text-accent uppercase tracking-wider mt-0.5 whitespace-nowrap">
                        Мы здесь
                      </div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {phases.map((phase, phaseIdx) => (
              <tr key={phase.id}>
                <td
                  className="border border-border px-3 py-2 font-medium bg-card align-top"
                  style={{ borderLeftColor: phase.color, borderLeftWidth: '3px' }}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-muted-foreground shrink-0">
                      {phase.number}
                    </span>
                    <span className="text-foreground leading-tight">{phase.name}</span>
                  </div>
                </td>
                <td colSpan={periods.length} className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      {phase.subItems.map((item) => (
                        <tr key={item.id}>
                          {periods.map((_, periodIdx) => {
                            const isInRange =
                              periodIdx >= item.startPeriod &&
                              periodIdx < item.endPeriod;
                            const isStart = periodIdx === item.startPeriod;
                            const isCompleted = periodIdx < currentPosition;
                            const milestone = milestones.find(
                              (m) => m.periodIndex === periodIdx && m.phaseIndex === phaseIdx
                            );

                            return (
                              <td
                                key={periodIdx}
                                className={`border border-border px-2 py-1.5 text-[10px] leading-tight relative ${
                                  isInRange
                                    ? 'bg-opacity-5'
                                    : ''
                                }`}
                                style={{
                                  backgroundColor: isInRange
                                    ? `${phase.color}15`
                                    : undefined,
                                }}
                              >
                                {isStart && (
                                  <div className="flex items-start gap-1.5">
                                    <span className="font-mono text-muted-foreground text-[9px] shrink-0">
                                      {item.number}
                                    </span>
                                    <span className="text-foreground">{item.description}</span>
                                    {isCompleted && (
                                      <Check className="w-3 h-3 text-primary shrink-0 ml-auto" />
                                    )}
                                  </div>
                                )}
                                {milestone && (
                                  <div className="absolute top-1 right-1">
                                    <div
                                      className="w-2 h-2 rotate-45 border border-current"
                                      style={{ color: phase.color }}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
