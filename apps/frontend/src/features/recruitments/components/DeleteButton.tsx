interface DeleteButtonProps {
  disabled?: boolean;
  onDelete: () => void;
}

export function DeleteButton({ disabled, onDelete }: DeleteButtonProps) {
  return (
    <button
      className="font-medium text-red-700 underline disabled:text-slate-400"
      disabled={disabled}
      type="button"
      onClick={onDelete}
    >
      Delete
    </button>
  );
}
