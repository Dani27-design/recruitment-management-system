import { useState, type FormEvent } from 'react';
import type {
  RecruitmentDocumentType,
  RecruitmentDocumentUploadInput,
} from '../../../types/recruitment-document';

interface UploadDialogProps {
  disabled?: boolean;
  onUpload: (input: RecruitmentDocumentUploadInput) => void;
}

export function UploadDialog({ disabled, onUpload }: UploadDialogProps) {
  const [documentType, setDocumentType] = useState<RecruitmentDocumentType>('CV');
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (file) {
      onUpload({ document_type: documentType, file });
      setFile(null);
    }
  }

  return (
    <form className="mt-4 grid gap-3 rounded border border-slate-200 bg-white p-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Document type
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-950"
            disabled={disabled}
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value as RecruitmentDocumentType)}
          >
            <option value="CV">CV</option>
            <option value="PORTFOLIO">Portfolio</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          File
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-950"
            disabled={disabled}
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      <button
        className="w-fit rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={disabled || !file}
        type="submit"
      >
        Upload
      </button>
    </form>
  );
}
