import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: '1',
    title: 'Выберите вид',
    body: '«По потокам» — горизонтальный Ганtt-план по командам. «По этапам» — таблица этап × период. Любой вид можно скрыть кнопкой ✕ на вкладке.',
  },
  {
    icon: '2',
    title: 'Настройте основное',
    body: 'Введите название проекта и периоды (месяцы, кварталы, недели — любое название). Добавляйте периоды кнопкой «Добавить».',
  },
  {
    icon: '3',
    title: 'Добавьте работы',
    body: 'В «По потокам»: создайте потоки (команды) и задачи внутри каждого. Укажите стартовый период и длительность. В «По этапам»: добавляйте этапы и подпункты с датами начала и конца.',
  },
  {
    icon: '4',
    title: 'Проставьте статусы',
    body: 'Для каждой задачи выберите: Готово / В работе / Бэклог / Задержка. Назначьте ответственных: ПМ, Аналитик, Разработчик, Тестировщик.',
  },
  {
    icon: '5',
    title: 'Добавьте вехи',
    body: 'Вехи — ключевые точки на временной шкале. Укажите название (заглавными) и период. Они отображаются флажком над сеткой.',
  },
  {
    icon: '6',
    title: 'Сохраните проект',
    body: 'Кнопка 💾 (сохранить) создаёт новую версию текущего проекта. Через «Проекты» можно создавать новые проекты, переименовывать, удалять или восстанавливать любую версию.',
  },
  {
    icon: '7',
    title: 'Экспортируйте',
    body: 'PDF — печать текущего вида. PPTX — скачать корпоративный слайд. Перед экспортом в PPTX выберите, сколько слайдов нужно (контент разделится равномерно).',
  },
];

export default function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
          <DialogTitle
            className="text-[17px] font-bold"
            style={{ color: '#0048F4', fontFamily: 'Times New Roman, serif' }}
          >
            Как работать в Векторе
          </DialogTitle>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Семь шагов от нуля до готового слайда
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh]">
          <div className="px-6 py-4 space-y-3">
            {steps.map((step) => (
              <div key={step.icon} className="flex gap-3 items-start">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: '#0048F4', fontSize: '11px' }}
                >
                  {step.icon}
                </div>
                <div>
                  <p className="text-[12px] font-bold text-foreground leading-tight mb-0.5">
                    {step.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className="mx-6 mb-5 mt-1 bg-[#0048F4]/5 border border-[#0048F4]/20 rounded-md px-4 py-3">
            <p className="text-[11px] text-[#0048F4] font-medium">
              💡 Данные сохраняются автоматически в браузере. Используйте проекты для хранения нескольких роадмап.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
