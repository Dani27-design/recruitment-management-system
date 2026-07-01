interface StageNotesProps {
  id: string;
  notes: string | null;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function StageNotes({ id, notes, value, disabled, onChange, onSave }: StageNotesProps) {
  if (disabled) {
    return (
      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
        {notes?.trim() ? notes : 'No notes.'}
      </p>
    );
  }

  return (
    <div className="mt-3">
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        Notes
      </label>
      <textarea
        className="mt-1 min-h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-950"
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        className="mt-2 rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
        type="button"
        onClick={onSave}
      >
        Save notes
      </button>
    </div>
  );
}
