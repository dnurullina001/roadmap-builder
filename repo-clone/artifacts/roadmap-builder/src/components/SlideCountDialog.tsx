import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';

interface SlideCountDialogProps {
  open: boolean;
  onConfirm: (count: number) => void;
  onCancel: () => void;
}

export default function SlideCountDialog({ open, onConfirm, onCancel }: SlideCountDialogProps) {
  const [count, setCount] = useState(1);

  const hint =
    count === 1
      ? 'Всё на одном слайде — контент масштабируется автоматически'
      : `Контент будет равномерно разделён на ${count} слайда(ов)`;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0">
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="text-[14px] font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0048F4]" />
            Экспорт в PowerPoint
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-5 space-y-4">
          <p className="text-[12px] text-foreground font-medium">
            Сколько слайдов нужно сделать?
          </p>

          {/* Tile selector */}
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-14 h-14 rounded-[8px] border-2 text-[18px] font-bold transition-colors ${
                  count === n
                    ? 'border-[#0048F4] bg-[#0048F4] text-white'
                    : 'border-border bg-white text-foreground hover:border-[#0048F4]/50'
                }`}
              >
                {n}
              </button>
            ))}
            {/* Custom number */}
            <div className={`relative w-14 h-14 rounded-[8px] border-2 transition-colors flex items-center justify-center ${
              count > 4 ? 'border-[#0048F4]' : 'border-border'
            }`}>
              <input
                type="number"
                min={1}
                max={20}
                value={count > 4 ? count : ''}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(20, Number(e.target.value)));
                  setCount(v);
                }}
                placeholder="…"
                className="w-full h-full text-center text-[14px] font-bold bg-transparent outline-none rounded-[6px]"
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground bg-muted/40 rounded-[4px] px-3 py-2">
            {hint}
          </p>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-border flex gap-2">
          <Button variant="outline" onClick={onCancel} className="h-8 text-[12px] flex-1">
            Отмена
          </Button>
          <Button
            onClick={() => onConfirm(count)}
            className="h-8 text-[12px] flex-1 bg-[#0048F4] hover:bg-[#0048F4]/90"
          >
            Скачать PPTX
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
