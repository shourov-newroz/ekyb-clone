import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { CloudUpload, ExternalLinkIcon, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { Button } from './button';
import { FormLabel, useFormField } from './form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

export type FileData = {
  name: string;
  size: number;
  type: string;
  content: string; // Base64 content
  file: File;
};

type FileUploadProps = {
  label?: string;
  boxLabel?: string;
  onFilesChange: (files: FileData[]) => void;
  value?: FileData[] | string; // New prop for default value
  maxFiles?: number;
  maxSize?: number;
  accept?: { [key: string]: readonly string[] } | 'image/all' | 'image-and-pdf';
  className?: string;
  disabled?: boolean;
  downloadableFile?: {
    content: string;
    name: string;
  };
  onCancelPreview?: () => void;
};

const FileUploadWithLabel: React.FC<FileUploadProps> = ({
  label,
  boxLabel,
  onFilesChange,
  value = [],
  maxFiles = 5,
  maxSize = 1024 * 1024 * 4,
  accept = 'image-and-pdf',
  className,
  disabled,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { error } = useFormField();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Check if value is a URL string
  const isPreviewMode = typeof value === 'string' && value.length > 0;

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

  // Set value if uploadedFiles is empty and value is not empty
  // useEffect(() => {
  //   if (
  //     typeof value !== 'string' &&
  //     !uploadedFiles?.length &&
  //     value?.length &&
  //     value.length > 0
  //   ) {
  //     setUploadedFiles(value.map((file) => file.file));
  //   }
  // }, [uploadedFiles]);

  useEffect(() => {
    if (typeof value !== 'string' && !uploadedFiles?.length) {
      if (Array.isArray(value) && value.length > 0) {
        setUploadedFiles(value.map((file) => file.file as File));
      } else if (value && 'file' in value) {
        setUploadedFiles([value.file as File]);
      }
    }
  }, [value, uploadedFiles]);

  // Handle file changes
  const handleFileChange = async (files: File[] | null) => {
    if (files && files?.length) {
      try {
        // Add file size validation first
        const oversizedFiles = files.filter((file) => file.size > maxSize);
        if (oversizedFiles.length > 0) {
          toast.error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
          return;
        }

        // Validate file types
        const filteredFiles = files.filter((file) => {
          const fileType = file.type || '';
          const extension = '.' + file.name.split('.').pop()?.toLowerCase();

          // Check if the file type is accepted
          const isAcceptedType = Object.entries(resolvedAccept).some(
            ([mimeType, extensions]) => {
              return (
                fileType.includes(mimeType) || extensions.includes(extension)
              );
            }
          );

          if (!isAcceptedType) {
            toast.error(`File type not supported: ${file.name}`);
            return false;
          }
          return true;
        });

        if (filteredFiles.length === 0) {
          return;
        }

        // Process files with size limit checks
        const processedFiles = await Promise.all(
          filteredFiles.map(async (file) => {
            try {
              const content = await fileToBase64(file);
              return {
                name: file.name,
                size: file.size,
                type: file.type || '',
                content,
                file,
              };
            } catch (error) {
              console.error(`Error processing file ${file.name}:`, error);
              toast.error(`Failed to process ${file.name}. Please try again.`);
              return null;
            }
          })
        );

        // Filter out any failed conversions
        const validFiles = processedFiles.filter(
          (file): file is FileData => file !== null
        );

        if (validFiles.length > 0) {
          setUploadedFiles(filteredFiles);
          onFilesChange(validFiles);
        }
      } catch (error) {
        console.error('Error processing files:', error);
        toast.error('Failed to process files. Please try again.');
      }
    } else {
      setUploadedFiles([]);
      onFilesChange([]);
    }
  };

  // Improved Base64 conversion with chunking for large files
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Set a reasonable chunk size (e.g., 2MB)
      const CHUNK_SIZE = 2 * 1024 * 1024;

      if (file.size > CHUNK_SIZE) {
        // For large files, use URL.createObjectURL instead of base64
        try {
          const objectUrl = URL.createObjectURL(file);
          resolve(objectUrl);
        } catch (error) {
          reject(error);
        }
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };

      reader.onerror = (error) => {
        reader.abort();
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  // Handle opening file in new tab
  const handleOpenFile = () => {
    window.open(value as string, '_blank');
  };

  // Handle cancel preview
  const handleCancelPreview = () => {
    setUploadedFiles([]);
    onFilesChange([]);
  };

  // Preview component
  const PreviewComponent = () => (
    <div className='relative flex w-52 flex-col items-center justify-center rounded-lg border border-input bg-lightBG p-2'>
      <div className='aspect-square w-full max-w-sm'>
        {/* Image Preview */}
        <img
          src={value as string}
          alt='File Preview'
          className='size-full rounded-lg bg-white object-contain'
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTMgOUgxMVYxMUgxM1Y5WiIgZmlsbD0iY3VycmVudENvbG9yIi8+PHBhdGggZD0iTTEzIDEzSDExVjE3SDEzVjEzWiIgZmlsbD0iY3VycmVudENvbG9yIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyMkMxNy41MjI4IDIyIDIyIDE3LjUyMjggMjIgMTJDMjIgNi40NzcxNSAxNy41MjI4IDIgMTIgMkM2LjQ3NzE1IDIgMiA2LjQ3NzE1IDIgMTJDMiAxNy41MjI4IDYuNDc3MTUgMjIgMTIgMjJaTTEyIDIwQzE2LjQxODMgMjAgMjAgMTYuNDE4MyAyMCAxMkMyMCA3LjU4MTcyIDE2LjQxODMgNCAxMiA0QzcuNTgxNzIgNCA0IDcuNTgxNzIgNCAxMkM0IDE2LjQxODMgNy41ODE3MiAyMCAxMiAyMFoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==';
          }}
        />

        {/* Action Buttons - Positioned absolutely over the image */}
        <div className='absolute right-2 top-2 flex gap-1'>
          <TooltipProvider>
            {!disabled && (
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        type='button'
                        variant='secondary'
                        size='icon'
                        className='group size-8 shrink-0 rounded-full bg-destructive/10 p-1 shadow-sm backdrop-blur-sm hover:bg-destructive/20'
                      >
                        <XIcon className='size-4 text-gray-700 group-hover:stroke-destructive' />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Remove File</TooltipContent>
                </Tooltip>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will remove the uploaded file.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelPreview}>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='secondary'
                  size='icon'
                  onClick={handleOpenFile}
                  className='size-8 rounded-full bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white'
                >
                  <ExternalLinkIcon className='size-4 text-gray-700' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open Preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-2'>
      {label && (
        <FormLabel
          className={cn(
            'text-sm scale-90 z-10 font-bukra-semibold font-medium',
            !disabled && error
              ? 'text-error peer-focus:text-error'
              : 'text-gray-800 peer-focus:text-foreground',
            disabled ? '' : 'cursor-pointer'
          )}
        >
          {label}
        </FormLabel>
      )}

      {isPreviewMode ? (
        <PreviewComponent />
      ) : (
        <FileUploader
          value={uploadedFiles}
          onValueChange={handleFileChange}
          dropzoneOptions={{
            maxFiles,
            maxSize,
            multiple: false,
            accept: resolvedAccept,
          }}
          className={cn(
            'relative rounded-lg w-fit',
            !disabled && uploadedFiles.length !== maxFiles && 'p-0.5',
            className
          )}
        >
          <FileUploaderContent>
            {uploadedFiles.length > 0 &&
              uploadedFiles.map((file, i) => (
                <FileUploaderItem key={i} index={i} disabled={disabled}>
                  <span
                    className={cn(
                      'flex items-center text-xs font-semibold text-secondary',
                      disabled && 'text-gray-500 cursor-default'
                    )}
                  >
                    {file.name.length > 66
                      ? file.name.substring(0, 66) + '...'
                      : file.name}
                  </span>
                </FileUploaderItem>
              ))}
          </FileUploaderContent>
          {uploadedFiles.length !== maxFiles && (
            <FileInput
              id='fileInput'
              className={cn(
                'outline-dashed outline-1 bg-lightBG aspect-square h-full flex items-center justify-center',
                error ? 'outline-error outline-2' : 'outline-input',
                !error && disabled && 'bg-gray-200'
              )}
              disabled={disabled}
            >
              <div
                className={cn(
                  'flex items-center justify-center flex-col p-4 space-y-1.5 w-52'
                )}
              >
                <CloudUpload
                  className={cn(
                    'w-10 h-10',
                    error ? 'text-error' : 'text-gray-700',
                    !error && disabled && 'text-gray-500'
                  )}
                />
                {boxLabel && (
                  <h1
                    className={cn(
                      'text-sm font-medium font-bukra-semibold md:text-base text-center px-2',
                      error ? 'text-error' : 'text-gray-800',
                      !error && disabled && 'text-gray-500'
                    )}
                  >
                    {boxLabel}
                  </h1>
                )}
                <p
                  className={cn(
                    'mb-1 text-[10px] text-center',
                    error ? 'text-error' : 'text-gray-700',
                    !error && disabled && 'text-gray-500'
                  )}
                >
                  Drag and drop or Click to upload
                </p>
              </div>
            </FileInput>
          )}
        </FileUploader>
      )}
    </div>
  );
};

export default FileUploadWithLabel;
