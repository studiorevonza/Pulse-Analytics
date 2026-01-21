import { useState } from 'react';
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    setStatus('uploading');
    
    // Simulate upload
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  const handleClose = () => {
    setFile(null);
    setStatus('idle');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {status === 'idle' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/50 hover:border-primary/50 hover:bg-secondary/30'
                }
              `}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-6 h-6 text-primary" />
              </div>
              <p className="font-medium mb-1">Drop your file here</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports CSV, JSON, Excel files
              </p>
              <label>
                <input
                  type="file"
                  accept=".csv,.json,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Button variant="glass" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
          )}

          {status === 'uploading' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
              <p className="font-medium">Uploading {file?.name}...</p>
              <p className="text-sm text-muted-foreground">Analyzing data structure</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-success" />
              </div>
              <p className="font-medium text-success mb-1">Upload Complete!</p>
              <p className="text-sm text-muted-foreground mb-4">
                {file?.name} has been processed successfully
              </p>
              <div className="glass-card p-4 text-left">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">File Size</span>
                  <span>{((file?.size || 0) / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Detected Rows</span>
                  <span className="text-primary">240</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Columns</span>
                  <span className="text-primary">6</span>
                </div>
              </div>
              <Button variant="glow" className="mt-4" onClick={handleClose}>
                Start Analysis
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <p className="font-medium text-destructive mb-1">Upload Failed</p>
              <p className="text-sm text-muted-foreground mb-4">
                Please check your file format and try again
              </p>
              <Button variant="glass" onClick={() => setStatus('idle')}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
