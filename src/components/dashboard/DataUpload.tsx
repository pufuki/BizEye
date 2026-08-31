import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowRight } from 'lucide-react';
import { readFileAsText, parseCSV, validateCSVHeaders, computeAnalytics } from '@/utils/csvParser';
import type { DashboardData } from '@/utils/csvParser';

interface Props {
  onDataLoaded: (data: DashboardData) => void;
  currentData: DashboardData | null;
}

export default function DataUpload({ onDataLoaded, currentData }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setSuccess(false);

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum size is 50MB.');
      return;
    }

    setLoading(true);
    setFileName(file.name);

    try {
      const text = await readFileAsText(file);

      // Validate headers
      const validation = validateCSVHeaders(text);
      if (!validation.valid) {
        setError(`Missing columns: ${validation.missing.join(', ')}`);
        setLoading(false);
        return;
      }

      // Parse CSV
      const rows = parseCSV(text);
      if (rows.length === 0) {
        setError('No data rows found in the file.');
        setLoading(false);
        return;
      }

      // Compute analytics
      const data = computeAnalytics(rows);

      // Small delay for UX polish
      await new Promise((r) => setTimeout(r, 600));

      onDataLoaded(data);
      setSuccess(true);
    } catch (err) {
      setError('Failed to parse the file. Please check the format.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Upload Dataset</h2>
        <p className="text-sm text-gray-500">
          Upload a CSV file with your sales data to generate real-time intelligence across all dashboard tabs.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
          dragOver
            ? 'border-sky-400 bg-sky-50/50 scale-[1.01]'
            : error
            ? 'border-red-300 bg-red-50/30'
            : success
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50/20'
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-sm font-medium text-gray-700">Processing {fileName}…</p>
              <p className="text-xs text-gray-400 mt-1">Parsing data and computing analytics</p>
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700">Dataset loaded successfully!</p>
              <p className="text-xs text-gray-500 mt-1">{fileName} • Click to upload a different file</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-600">Upload failed</p>
              <p className="text-xs text-red-500 mt-1">{error}</p>
              <p className="text-xs text-gray-400 mt-2">Click to try again</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-sky-50 border border-sky-200 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Drag & drop your CSV file here
              </p>
              <p className="text-xs text-gray-400 mt-1">or click to browse • Max 50MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Expected format */}
      <div className="bg-white border border-gray-200/60 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Expected CSV Format</h3>
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-2">
            {[
              'Product ID', 'Transaction ID', 'Date', 'Product Category',
              'Product Name', 'Units Sold', 'Unit Price', 'Total Revenue',
              'Payment Method', 'Rating', 'Reviews',
            ].map((col) => (
              <span
                key={col}
                className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-mono"
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset summary (when data is loaded) */}
      {currentData && (
        <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-sky-400/10 rounded-full blur-[80px]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-400/20 border border-sky-400/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Dataset Loaded</p>
                  <p className="text-xs text-gray-400">{fileName || 'retail_sales_dataset.csv'}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSuccess(false);
                  setFileName('');
                }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400">Total Rows</p>
                <p className="text-lg font-bold text-sky-400">{currentData.totalOrders.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400">Date Range</p>
                <p className="text-sm font-semibold text-white">
                  {currentData.dateRange.from} → {currentData.dateRange.to}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400">Categories</p>
                <p className="text-lg font-bold text-sky-400">{currentData.categories.length}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400">Unique Products</p>
                <p className="text-lg font-bold text-sky-400">{currentData.totalSKUs}</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              Navigate to Overview, Performance, Sentiment, or Predictive tabs to explore your data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
