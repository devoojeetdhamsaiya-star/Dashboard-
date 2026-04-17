
import React, { useCallback } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { parseExcel } from '../lib/data-utils';
import { Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadProps {
  onDataLoaded: (data: Transaction[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setStatus('loading');
    setError(null);

    try {
      const transactions = await parseExcel(file);
      onDataLoaded(transactions);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError('Failed to parse Excel file. Please ensure it has Date, Category, Amount, and Type columns.');
    }
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    useFsAccessApi: false, // Helps with some type issues in certain environments
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all duration-300
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'}
          ${status === 'error' ? 'border-destructive/50 bg-destructive/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <AnimatePresence mode="wait">
            {status === 'loading' ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-4 rounded-full bg-primary/10"
              >
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-4 rounded-full bg-green-500/10"
              >
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </motion.div>
            ) : status === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-4 rounded-full bg-destructive/10"
              >
                <AlertCircle className="w-8 h-8 text-destructive" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-4 rounded-full bg-primary/10 group-hover:scale-110 transition-transform duration-300"
              >
                <Upload className="w-8 h-8 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              {status === 'loading' ? 'Processing File...' : isDragActive ? 'Drop Excel Here' : 'Upload Financial Spreadsheet'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Drag and drop your .xlsx or .xls file here, or click to browse.
            </p>
          </div>

          {error && (
            <p className="text-xs text-destructive font-medium bg-destructive/10 px-3 py-1 rounded-full">
              {error}
            </p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              <FileText className="w-3 h-3" />
              <span>sample.xlsx</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
