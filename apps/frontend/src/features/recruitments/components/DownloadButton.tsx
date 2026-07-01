interface DownloadButtonProps {
  disabled?: boolean;
  onDownload: () => void;
}

export function DownloadButton({ disabled, onDownload }: DownloadButtonProps) {
  return (
    <button
      className="font-medium text-slate-900 underline disabled:text-slate-400"
      disabled={disabled}
      type="button"
      onClick={onDownload}
    >
      Download
    </button>
  );
}
