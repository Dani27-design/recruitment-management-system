import type { RecruitmentDocument } from '../../../types/recruitment-document';
import { DeleteButton } from './DeleteButton';
import { DownloadButton } from './DownloadButton';

interface DocumentTableProps {
  documents: RecruitmentDocument[];
  canDelete: boolean;
  isDeleting?: boolean;
  isDownloading?: boolean;
  onDelete: (documentId: string) => void;
  onDownload: (documentId: string) => void;
}

export function DocumentTable({
  documents,
  canDelete,
  isDeleting,
  isDownloading,
  onDelete,
  onDownload,
}: DocumentTableProps) {
  if (documents.length === 0) {
    return <p className="rounded border border-slate-200 bg-white p-4 text-slate-600">No documents found.</p>;
  }

  return (
    <div className="mt-3 overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">File</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Uploaded by</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {documents.map((document) => (
            <tr key={document.id}>
              <td className="px-4 py-3 text-sm text-slate-950">{document.document_type}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{document.original_filename}</td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {document.uploader?.email ?? '-'}
              </td>
              <td className="space-x-3 px-4 py-3 text-sm">
                <DownloadButton
                  disabled={isDownloading}
                  onDownload={() => onDownload(document.id)}
                />
                {canDelete ? (
                  <DeleteButton disabled={isDeleting} onDelete={() => onDelete(document.id)} />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
