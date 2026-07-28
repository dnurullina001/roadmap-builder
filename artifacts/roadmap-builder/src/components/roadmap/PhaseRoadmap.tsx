import { PhaseRoadmapData } from '@/types/roadmap';
import { Check, ArrowUp } from 'lucide-react';

interface PhaseRoadmapProps {
  data: PhaseRoadmapData;
}

const PHASE_COLORS = ['#0048F4', '#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5'];

export default function PhaseRoadmap({ data }: PhaseRoadmapProps) {
  const { title, periods, currentPosition, phases, milestones } = data;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'done':
        return {
          backgroundColor: 'var(--status-done-bg)',
          color: 'var(--status-done-fg)',
        };
      case 'in-progress':
        return {
          backgroundColor: 'var(--status-inprogress-bg)',
          color: 'var(--status-inprogress-fg)',
        };
      case 'backlog':
        return {
          backgroundColor: 'var(--status-backlog-bg)',
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
          <table className="border-collapse w-full text-[9px] table-fixed">
            {/* Title row */}
            <thead>
              <tr>
                <th
                  colSpan={periods.length + 1}
                  className="border border-border text-white font-semibold text-[11px] px-4 py-2.5 text-left tracking-tight"
                  style={{ backgroundColor: '#44546A' }}
                >
                  {title}
                </th>
              </tr>
              {/* Period headers */}
              <tr>
                <th
                  className="border border-border text-white w-48 px-3 py-2 text-left font-medium text-[9px]"
                  style={{ backgroundColor: '#44546A' }}
                >
                  ЭТАП
                </th>
                {periods.map((period, idx) => (
                  <th
                    key={idx}
                    className={`border border-border px-3 py-2 text-center font-bold relative ${
                      idx === currentPosition
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                    style={{
                      backgroundColor: idx === currentPosition ? '#FFF4E6' : '#F5F5F5',
                      borderLeftColor: idx === currentPosition ? '#FFC000' : undefined,
                      borderLeftWidth: idx === currentPosition ? '3px' : undefined,
                    }}
                  >
                    <div className="uppercase tracking-wide text-[9px] font-bold">
                      {period}
                    </div>
                    {idx === currentPosition && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#FFC000' }}>
                          Мы здесь
                        </div>
                        <ArrowUp className="w-3 h-3" style={{ color: '#FFC000' }} />
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
                      className="border border-border px-3 py-2 font-medium bg-card align-top text-[10px]"
                      style={{ borderLeftColor: phaseColor, borderLeftWidth: '3px' }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-muted-foreground shrink-0">
                          {phase.number}
                        </span>
                        <span className="text-foreground leading-tight font-semibold">{phase.name}</span>
                      </div>
                    </td>
                    <td colSpan={periods.length} className="p-0">
                      <table className="w-full border-collapse table-fixed">
                        <tbody>
                          {phase.subItems.map((item) => (
                            <tr key={item.id}>
                              {periods.map((_, periodIdx) => {
                                const isInRange =
                                  periodIdx >= item.startPeriod &&
                                  periodIdx < item.endPeriod;
                                const isStart = periodIdx === item.startPeriod;
                                const milestone = milestones.find(
                                  (m) => m.periodIndex === periodIdx && m.phaseIndex === phaseIdx
                                );

                                const statusStyle = isInRange ? getStatusStyle(item.status) : {};

                                return (
                                  <td
                                    key={periodIdx}
                                    className="border border-border px-2 py-1.5 text-[9px] leading-tight relative"
                                    style={statusStyle}
                                  >
                                    {isStart && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="font-mono text-[8px] shrink-0 opacity-70">
                                          {item.number}
                                        </span>
                                        <span className="leading-snug">{item.description}</span>
                                        {item.status === 'done' && (
                                          <Check
                                            className="w-3 h-3 shrink-0 ml-auto"
                                            style={{ color: 'var(--status-done-border)' }}
                                          />
                                        )}
                                        {item.status === 'in-progress' && (
                                          <div className="w-2 h-2 rounded-full shrink-0 ml-auto animate-pulse" style={{ backgroundColor: 'var(--status-inprogress-border)' }} />
                                        )}
                                      </div>
                                    )}
                                    {milestone && (
                                      <div className="absolute top-1 right-1">
                                        <div
                                          className="w-2 h-2 rotate-45 border border-current"
                                          style={{ color: phaseColor }}
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
