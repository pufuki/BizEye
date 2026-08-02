import { Upload } from 'lucide-react';

interface Props {
  title?: string;
  desc?: string;
  onUploadClick?: () => void;
}

export default function NoDataBanner({
  title = 'No Dataset Loaded',
  desc = 'Upload your CSV sales dataset to populate intelligence reports, charts, and forecasts.',
  onUploadClick,
}: Props) {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-10 text-center my-4 shadow-sm">
      <div className="w-14 h-14 bg-sky-50 border border-sky-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <Upload className="w-6 h-6 text-sky-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-xs max-w-md mx-auto mb-5 leading-relaxed">{desc}</p>
      {onUploadClick && (
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 bg-sky-400 text-black font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-sky-300 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload CSV Dataset
        </button>
      )}
    </div>
  );
}
