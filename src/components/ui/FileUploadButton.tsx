import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { Paperclip, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormLabel, useFormField } from './form';

export type FileData = {
  name: string;
  size: number;
  type: string;
  content: string; // Base64 content
  file: File;
};

type FileUploadProps = {
  label: string;
  onFilesChange: (files: FileData[]) => void;
  value?: FileData[]; // New prop for default value
  maxFiles?: number;
  maxSize?: number;
  accept?: { [key: string]: readonly string[] } | 'image/all' | 'image-and-pdf';
  className?: string;
  disabled?: boolean;
  downloadableFile?: {
    content: string;
    name: string;
  };
};

const FileUploadButton: React.FC<FileUploadProps> = ({
  label,
  onFilesChange,
  value = [],
  maxFiles = 5,
  maxSize = 1024 * 1024 * 4,
  accept = 'image-and-pdf',
  className,
  disabled,
  downloadableFile,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { error } = useFormField();

  // Handle shorthand options for accept
  const resolveAccept = (
    accept: FileUploadProps['accept']
  ): { [key: string]: string[] } => {
    if (typeof accept === 'string') {
      switch (accept) {
        case 'image/all':
          return {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/svg+xml': ['.svg'],
            'image/gif': ['.gif'],
            'image/webp': ['.webp'],
          };
        case 'image-and-pdf':
          return {
            ...resolveAccept('image/all'),
            'application/pdf': ['.pdf'],
          };
        default:
          console.warn(`Unknown accept shorthand: ${accept}`);
          return {};
      }
    } else {
      return accept as { [key: string]: string[] };
    }
  };

  const resolvedAccept = resolveAccept(accept);

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Set value if uploadedFiles is empty and value is not empty
  useEffect(() => {
    if (!uploadedFiles?.length && value?.length && value.length > 0) {
      setUploadedFiles(value.map((file) => file.file));
    }
  }, [uploadedFiles]);

  // Handle file changes
  const handleFileChange = async (files: File[] | null) => {
    if (files) {
      try {
        const filteredFiles = files.filter((file) => {
          return resolvedAccept[file.type]?.some((ext) =>
            file.name.endsWith(ext)
          );
        });

        const processedFiles = await Promise.all(
          filteredFiles.map(async (file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            content: await fileToBase64(file),
            file: file,
          }))
        );

        setUploadedFiles(filteredFiles);
        onFilesChange(processedFiles);
      } catch (error) {
        console.error('Error processing files:', error);
        toast.error('Failed to process files. Please try again.');
      }
    }
  };

  // Download the default file
  const handleDownload = () => {
    if (downloadableFile) {
      const link = document.createElement('a');
      link.href = downloadableFile.content;
      link.download = downloadableFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <FormLabel
        className={cn(
          'text-sm scale-90 z-10 font-bukra-semibold font-medium',
          !disabled && error
            ? 'text-error peer-focus:text-error'
            : 'text-gray-800 peer-focus:text-foreground',
          disabled ? 'opacity-80' : 'cursor-pointer'
        )}
      >
        {label}
      </FormLabel>
      <FileUploader
        value={uploadedFiles}
        onValueChange={handleFileChange}
        dropzoneOptions={{
          maxFiles,
          maxSize,
          multiple: false,
          accept: resolvedAccept,
        }}
        className={cn('relative rounded-lg pt-2 pb-0.5 px-0.5', className)}
      >
        <FileInput
          id='fileInput'
          className={cn(
            'outline outline-1 bg-lightBG flex items-center gap-1 px-4 py-2 rounded-lg w-fit font-medium text-sm',
            error ? 'outline-error outline-1 text-error' : 'outline-input',
            !error && disabled && 'bg-gray-200'
          )}
          disabled={disabled}
        >
          <Plus className='size-4 stroke-current' />
          <span>Upload File</span>
        </FileInput>
        <FileUploaderContent>
          {uploadedFiles.length > 0 &&
            uploadedFiles.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className='size-4 stroke-current' />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
        {downloadableFile && disabled && (
          <button
            type='button'
            className='mt-2 text-sm text-blue-500 hover:underline'
            onClick={handleDownload}
          >
            Download Submitted File
          </button>
        )}
      </FileUploader>
    </div>
  );
};

export default FileUploadButton;
