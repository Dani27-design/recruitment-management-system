interface DownloadButtonProps {
  disabled?: boolean;
  onDownload: () => void;
}

export function DownloadButton({ disabled, onDownload }: DownloadButtonProps) {
  return (
    <button
      className="text-action disabled:text-slate-400 disabled:no-underline"
      disabled={disabled}
      type="button"
      onClick={onDownload}
    >
      Download
    </button>
  );
}
