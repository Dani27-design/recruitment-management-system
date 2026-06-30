import type { Candidate } from '../../../types/candidate';

interface DeleteConfirmationDialogProps {
  candidate: Candidate | null;
  isDeleting?: boolean;
  onCancel(): void;
  onConfirm(): void;
}

export function DeleteConfirmationDialog({
  candidate,
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  if (!candidate) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950/40 px-6">
      <section className="w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-950">Delete candidate</h2>
        <p className="mt-2 text-sm text-slate-600">
          Delete {candidate.full_name}? This action removes the candidate record.
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
