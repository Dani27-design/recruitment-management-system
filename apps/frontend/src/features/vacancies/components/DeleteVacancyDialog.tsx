import type { Vacancy } from '../../../types/vacancy';

interface DeleteVacancyDialogProps {
  vacancy: Vacancy | null;
  isDeleting?: boolean;
  onCancel(): void;
  onConfirm(): void;
}

export function DeleteVacancyDialog({
  vacancy,
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteVacancyDialogProps) {
  if (!vacancy) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950/40 px-6">
      <section className="w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-950">Delete vacancy</h2>
        <p className="mt-2 text-sm text-slate-600">
          Delete {vacancy.position_name}? This action removes the vacancy record.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="rounded bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isDeleting ? 'Deleting' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  );
}
