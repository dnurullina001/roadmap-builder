import { useState, useEffect } from 'react';
import { RoadmapState } from '@/types/roadmap';
import {
  SavedProject,
  ProjectVersion,
  listProjects,
  createProject,
  saveNewVersion,
  deleteProject,
  deleteVersion,
  renameProject,
  formatDate,
} from '@/lib/projects';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ChevronRight, ChevronDown, FolderOpen, Save, Plus, RotateCcw, Edit2, Check, X } from 'lucide-react';

interface ProjectsModalProps {
  open: boolean;
  onClose: () => void;
  currentState: RoadmapState;
  currentProjectId: string | null;
  onLoad: (state: RoadmapState, projectId: string) => void;
  onProjectCreated: (project: SavedProject) => void;
  onVersionSaved: (project: SavedProject) => void;
}

export default function ProjectsModal({
  open,
  onClose,
  currentState,
  currentProjectId,
  onLoad,
  onProjectCreated,
  onVersionSaved,
}: ProjectsModalProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [versionLabel, setVersionLabel] = useState('');

  const refresh = () => setProjects(listProjects());

  useEffect(() => {
    if (open) refresh();
  }, [open]);

  const handleCreate = () => {
    const name = newProjectName.trim() || 'Новый проект';
    const p = createProject(name, currentState);
    setNewProjectName('');
    setShowNewInput(false);
    refresh();
    onProjectCreated(p);
  };

  const handleSaveVersion = (projectId: string) => {
    const label = versionLabel.trim() || undefined;
    const updated = saveNewVersion(projectId, currentState, label);
    if (updated) {
      setVersionLabel('');
      refresh();
      onVersionSaved(updated);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить проект?')) {
      deleteProject(id);
      refresh();
    }
  };

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      renameProject(id, editingName.trim());
      refresh();
    }
    setEditingId(null);
  };

  const handleDeleteVersion = (projectId: string, versionId: string) => {
    deleteVersion(projectId, versionId);
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-[14px] font-bold flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[#0048F4]" />
            Мои проекты
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-5 py-3 space-y-2">
          {projects.length === 0 && !showNewInput && (
            <div className="text-center py-10 text-muted-foreground text-[12px]">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Нет сохранённых проектов.<br />Создайте первый проект ниже.
            </div>
          )}

          {projects.map((project) => (
            <div
              key={project.id}
              className={`border rounded-[6px] overflow-hidden ${currentProjectId === project.id ? 'border-[#0048F4] bg-blue-50/40' : 'border-border bg-white'}`}
            >
              {/* Project header */}
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  onClick={() => setExpanded(expanded === project.id ? null : project.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {expanded === project.id
                    ? <ChevronDown className="w-3.5 h-3.5" />
                    : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {editingId === project.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-6 text-[11px] flex-1"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRename(project.id); if (e.key === 'Escape') setEditingId(null); }}
                      autoFocus
                    />
                    <button onClick={() => handleRename(project.id)} className="text-green-600 hover:text-green-700"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-[12px] font-bold truncate">{project.name}</span>
                    {currentProjectId === project.id && (
                      <span className="text-[9px] bg-[#0048F4] text-white px-1.5 py-0.5 rounded-sm font-bold shrink-0">
                        АКТИВНЫЙ
                      </span>
                    )}
                  </div>
                )}

                <span className="text-[10px] text-muted-foreground shrink-0">
                  {project.versions.length} верс.
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:block">
                  {formatDate(project.updatedAt)}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditingId(project.id); setEditingName(project.name); }}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    title="Переименовать"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                    title="Удалить проект"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Expanded: versions + save version */}
              {expanded === project.id && (
                <div className="border-t border-border bg-muted/20 px-3 py-2 space-y-2">
                  {/* Save new version to this project */}
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Примечание к версии (необязательно)"
                      value={versionLabel}
                      onChange={(e) => setVersionLabel(e.target.value)}
                      className="h-6 text-[10px] flex-1"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveVersion(project.id); }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveVersion(project.id)}
                      className="h-6 px-2 text-[10px] bg-[#0048F4] hover:bg-[#0048F4]/90 shrink-0"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Сохранить версию
                    </Button>
                  </div>

                  {/* Version list */}
                  <div className="space-y-1">
                    {[...project.versions].reverse().map((version, idx) => (
                      <VersionRow
                        key={version.id}
                        version={version}
                        isLatest={idx === 0}
                        onLoad={() => { onLoad(version.state, project.id); onClose(); }}
                        onDelete={() => handleDeleteVersion(project.id, version.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* New project input */}
          {showNewInput && (
            <div className="border border-dashed border-[#0048F4] rounded-[6px] p-3 space-y-2 bg-blue-50/30">
              <p className="text-[11px] font-medium text-foreground">Название нового проекта:</p>
              <div className="flex gap-2">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Название проекта"
                  className="h-7 text-[11px] flex-1"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowNewInput(false); }}
                  autoFocus
                />
                <Button onClick={handleCreate} className="h-7 px-3 text-[11px] bg-[#0048F4] hover:bg-[#0048F4]/90">
                  Создать
                </Button>
                <Button variant="outline" onClick={() => setShowNewInput(false)} className="h-7 px-2 text-[11px]">
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Текущее состояние дорожной карты будет сохранено как «Версия 1»
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-5 py-3 flex justify-between items-center bg-white">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewInput(true)}
            className="h-7 text-[11px]"
          >
            <Plus className="w-3 h-3 mr-1" />
            Новый проект
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 text-[11px]">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VersionRow({
  version,
  isLatest,
  onLoad,
  onDelete,
}: {
  version: ProjectVersion;
  isLatest: boolean;
  onLoad: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-white rounded border border-border/60 group">
      <RotateCcw className="w-3 h-3 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium truncate">{version.label}</span>
          {isLatest && (
            <span className="text-[9px] bg-green-100 text-green-700 px-1 py-0.5 rounded font-bold">
              ПОСЛЕДНЯЯ
            </span>
          )}
        </div>
        <div className="text-[9px] text-muted-foreground">{formatDate(version.savedAt)}</div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          onClick={onLoad}
          className="h-6 px-2 text-[10px] bg-[#0048F4] hover:bg-[#0048F4]/90"
        >
          Загрузить
        </Button>
        <button onClick={onDelete} className="p-1 text-muted-foreground hover:text-destructive">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
