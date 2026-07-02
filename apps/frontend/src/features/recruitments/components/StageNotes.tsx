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
      <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
        {notes?.trim() ? notes : 'No notes.'}
      </p>
    );
  }

  return (
    <div className="mt-3">
      <label className="form-label" htmlFor={id}>
        Notes
      </label>
      <textarea
        className="form-input min-h-24 text-sm"
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        className="secondary-action mt-2"
        type="button"
        onClick={onSave}
      >
        Save notes
      </button>
    </div>
  );
}
