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
    return <p className="empty-state">No documents found.</p>;
  }

  return (
    <div className="table-shell mt-3 overflow-x-auto">
      <table className="data-table">
        <thead>
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
              <td>
                <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                  {document.document_type}
                </span>
              </td>
              <td className="font-semibold text-slate-950">{document.original_filename}</td>
              <td>
                {document.uploader?.email ?? '-'}
              </td>
              <td className="space-x-3 whitespace-nowrap">
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
