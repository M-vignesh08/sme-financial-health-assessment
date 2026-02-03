"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileUploaderProps = {
  onFileSelect: (file: File | null) => void;
  acceptedFileTypes?: string;
  labelText?: string;
};

export function FileUploader({
  onFileSelect,
  acceptedFileTypes = ".csv, .xlsx, .pdf",
  labelText = "Upload a CSV, XLSX, or PDF file",
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (selectedFile: File | null) => {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0] ?? null;
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    handleFileChange(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <File className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemoveFile} aria-label="Remove file">
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors",
            isDragging ? "border-primary bg-accent/20" : "hover:border-primary/50 hover:bg-secondary/30"
          )}
          onClick={handleButtonClick}
        >
          <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="font-semibold text-foreground">Click to upload or drag and drop</p>
          <p className="text-sm text-muted-foreground">{labelText}</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
        </div>
      )}
    </div>
  );
}
