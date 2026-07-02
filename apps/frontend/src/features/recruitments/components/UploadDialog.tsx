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
    <form className="mt-4 grid gap-4 rounded-lg border border-teal-100 bg-teal-50/40 p-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="form-label">
          Document type
          <select
            className="form-input text-sm"
            disabled={disabled}
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value as RecruitmentDocumentType)}
          >
            <option value="CV">CV</option>
            <option value="PORTFOLIO">Portfolio</option>
          </select>
        </label>
        <label className="form-label">
          File
          <input
            className="form-input text-sm"
            disabled={disabled}
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      <button
        className="primary-action w-fit"
        disabled={disabled || !file}
        type="submit"
      >
        Upload
      </button>
    </form>
  );
}
