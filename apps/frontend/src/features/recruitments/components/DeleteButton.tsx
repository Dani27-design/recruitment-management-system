interface DeleteButtonProps {
  disabled?: boolean;
  onDelete: () => void;
}

export function DeleteButton({ disabled, onDelete }: DeleteButtonProps) {
  return (
    <button
      className="danger-text-action disabled:text-slate-400 disabled:no-underline"
      disabled={disabled}
      type="button"
      onClick={onDelete}
    >
      Delete
    </button>
  );
}
