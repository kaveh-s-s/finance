import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { ParsedCSVData } from '../types';
import { parseCSVFile } from '../utils/dataUtils';

interface FileUploaderProps {
  onDataLoaded: (data: ParsedCSVData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const result = await parseCSVFile(file);
      onDataLoaded(result);
    }
  }, [onDataLoaded]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await parseCSVFile(file);
      onDataLoaded(result);
    }
  }, [onDataLoaded]);

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-4"
      >
        <Upload size={48} className="text-gray-400" />
        <div>
          <p className="text-lg font-medium text-gray-700">
            Drop your CSV file here or click to upload
          </p>
          <p className="text-sm text-gray-500 mt-1">
            File should include "Negar_share" and "Flag1" columns
          </p>
        </div>
      </label>
    </div>
  );
};

export default FileUploader;