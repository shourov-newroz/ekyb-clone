import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Trash2 as RemoveIcon } from 'lucide-react';
import {
  Dispatch,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  DropzoneOptions,
  DropzoneState,
  FileRejection,
  useDropzone,
} from 'react-dropzone';
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

type DirectionOptions = 'rtl' | 'ltr' | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: 'horizontal' | 'vertical';
  direction: DirectionOptions;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploaderProvider');
  }
  return context;
};

type FileUploaderProps = {
  value: File[] | null;
  reSelect?: boolean;
  onValueChange: (value: File[] | null) => void;
  dropzoneOptions: DropzoneOptions;
  orientation?: 'horizontal' | 'vertical';
};

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      dropzoneOptions,
      value,
      onValueChange,
      orientation = 'vertical',
      children,
      dir,
      ...props
    },
    ref
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [isLOF, setIsLOF] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const {
      accept,
      maxFiles = 1,
      maxSize = 4 * 1024 * 1024,
      multiple = true,
    } = dropzoneOptions;

    const direction: DirectionOptions = dir === 'rtl' ? 'rtl' : 'ltr';

    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!value) return;
        const newFiles = value.filter((_, index) => index !== i);
        onValueChange(newFiles);
      },
      [value, onValueChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) return;

        const moveNext = () => {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
        };

        const movePrev = () => {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
        };

        const prevKey =
          orientation === 'horizontal'
            ? direction === 'ltr'
              ? 'ArrowLeft'
              : 'ArrowRight'
            : 'ArrowUp';

        const nextKey =
          orientation === 'horizontal'
            ? direction === 'ltr'
              ? 'ArrowRight'
              : 'ArrowLeft'
            : 'ArrowDown';

        if (e.key === nextKey) {
          moveNext();
        } else if (e.key === prevKey) {
          movePrev();
        } else if (e.key === 'Enter' || e.key === 'Space') {
          if (activeIndex === -1) {
            dropzoneState.inputRef.current?.click();
          }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex);
            if (value.length - 1 === 0) {
              setActiveIndex(-1);
              return;
            }
            movePrev();
          }
        } else if (e.key === 'Escape') {
          setActiveIndex(-1);
        }
      },
      [value, activeIndex, removeFileFromSet]
    );

    const onDrop = useCallback(
      async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        console.log('acceptedFiles', acceptedFiles);
        console.log('rejectedFiles', rejectedFiles);
        try {
          // Early validation of rejected files
          if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0]; // Only show first rejection to avoid overwhelming
            if (rejection.errors[0]) {
              toast.error(
                `${rejection.file.name}: ${rejection.errors[0].message}`
              );
            }
            return;
          }

          // Basic validation
          if (!acceptedFiles?.length) return;

          // Process files sequentially to prevent memory issues
          const newValues: File[] = [];
          const existingNames = new Set(value?.map((f) => f.name) || []);

          for (const file of acceptedFiles) {
            // Check file limit
            if (newValues.length >= maxFiles) {
              toast.error(`Maximum ${maxFiles} files allowed`);
              break;
            }

            // Check duplicates
            if (existingNames.has(file.name)) {
              toast.error(`File "${file.name}" already exists`);
              continue;
            }

            // Size validation
            if (file.size > maxSize) {
              toast.error(
                `File "${file.name}" exceeds ${maxSize / (1024 * 1024)}MB limit`
              );
              continue;
            }

            // Add file to new values
            newValues.push(file);
            existingNames.add(file.name);
          }

          // Only update if we have valid files
          if (newValues.length > 0) {
            onValueChange(newValues);
          }
        } catch (error) {
          console.error('Drop error:', error);
          toast.error('Failed to process files');
          setIsFileTooBig(false);
        }
      },
      [value, maxFiles, maxSize, onValueChange]
    );

    useEffect(() => {
      if (!value) return;
      if (value.length === maxFiles) {
        setIsLOF(true);
        return;
      }
      setIsLOF(false);
    }, [value, maxFiles]);

    // Add preventive drag event handlers
    const preventDefaults = useCallback((e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    useEffect(() => {
      // Prevent default drag behaviors on the window
      const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
      events.forEach((event) => {
        window.addEventListener(event, preventDefaults, false);
      });

      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, preventDefaults, false);
        });
      };
    }, [preventDefaults]);

    const opts = {
      ...(dropzoneOptions || {}),
      accept,
      maxFiles,
      maxSize,
      multiple,
      disabled: isLOF || (value?.length ?? 0) >= maxFiles,
      noClick: false,
      noDrag: false,
      noKeyboard: false,
      preventDropOnDocument: true,
      useFsAccessApi: false,
      validator: (file: File) => {
        if (!file?.type) {
          return { code: 'invalid-file-type', message: 'Invalid file type' };
        }
        return null;
      },
    };

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropRejected: () => {
        setIsFileTooBig(true);
        // Reset after a short delay
        setTimeout(() => setIsFileTooBig(false), 2000);
      },
      onDropAccepted: () => setIsFileTooBig(false),
      onError: (error) => {
        console.error('Dropzone error:', error);
        toast.error('Upload error occurred');
      },
    });

    // Prevent default drag behaviors
    useEffect(() => {
      const preventDefault = (e: Event) => {
        e.preventDefault();
      };

      window.addEventListener('dragover', preventDefault, false);
      window.addEventListener('drop', preventDefault, false);

      return () => {
        window.removeEventListener('dragover', preventDefault);
        window.removeEventListener('drop', preventDefault);
      };
    }, []);

    // Cleanup function to prevent memory leaks
    useEffect(() => {
      return () => {
        // Cleanup any object URLs or file references
        if (value?.length) {
          value.forEach((file) => {
            if (file instanceof File) {
              try {
                const objectUrl = URL.createObjectURL(file);
                URL.revokeObjectURL(objectUrl);
              } catch (error) {
                console.error('Error cleaning up file:', error);
              }
            }
          });
        }
      };
    }, [value]);

    // Add error boundary effect
    useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        console.error('Global error caught:', event.error);
        toast.error(
          'An error occurred while processing files. Please try again.'
        );
        setIsFileTooBig(false);
      };

      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);

    return (
      <FileUploaderContext.Provider
        value={{
          dropzoneState,
          isLOF,
          isFileTooBig,
          removeFileFromSet,
          activeIndex,
          setActiveIndex,
          orientation,
          direction,
        }}
      >
        <div
          ref={ref}
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            'grid w-full focus:outline-none overflow-hidden',
            className,
            {
              'gap-2': value && value.length > 0,
            }
          )}
          dir={dir}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  }
);

FileUploader.displayName = 'FileUploader';

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { orientation } = useFileUpload();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn('w-full')}
      ref={containerRef}
      aria-description='content file holder'
    >
      <div
        {...props}
        ref={ref}
        className={cn(
          'flex rounded-xl gap-2',
          orientation === 'horizontal' ? 'flex-raw flex-wrap' : 'flex-col',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
});

FileUploaderContent.displayName = 'FileUploaderContent';

export const FileUploaderItem = forwardRef<
  HTMLDivElement,
  { index: number; disabled?: boolean } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, disabled, ...props }, ref) => {
  const { removeFileFromSet, activeIndex } = useFileUpload();
  const isSelected = index === activeIndex;
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleRemove = () => {
    removeFileFromSet(index);
    setIsAlertOpen(false);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center w-full p-3 rounded-lg border border-input',
        ' transition-colors',
        disabled
          ? 'text-gray-500 bg-gray-200 cursor-default'
          : 'hover:bg-accent/50',
        className,
        isSelected && 'bg-lightBG'
      )}
      {...props}
    >
      {/* Document Icon */}
      <div className='mr-1 shrink-0'>
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
          <polyline points='14 2 14 8 20 8' />
          <line x1='16' y1='13' x2='8' y2='13' />
          <line x1='16' y1='17' x2='8' y2='17' />
          <line x1='10' y1='9' x2='8' y2='9' />
        </svg>
      </div>

      {/* Content */}
      <div className='min-w-0 flex-1 truncate font-medium'>{children}</div>

      {/* Remove Button with Alert Dialog */}
      {!disabled && (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <button
              type='button'
              className={cn(
                'flex-shrink-0 ml-3 p-1 rounded-full hover:bg-destructive/10 group',
                'transition-colors'
              )}
            >
              <span className='sr-only'>remove item {index}</span>
              <RemoveIcon className='size-4 group-hover:stroke-destructive' />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will remove the selected file.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemove}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
});

FileUploaderItem.displayName = 'FileUploaderItem';

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean }
>(({ className, children, disabled, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();
  const isDisable = isLOF || disabled;

  return (
    <div
      ref={ref}
      {...props}
      className={`relative w-full ${
        isDisable ? 'cursor-default ' : 'cursor-pointer '
      }`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out
         ${
           dropzoneState.isDragAccept
             ? 'border-green-500'
             : dropzoneState.isDragReject || isFileTooBig
             ? 'border-red-500'
             : 'border-gray-300'
         }`,
          className
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        ref={dropzoneState.inputRef}
        disabled={isDisable}
        {...dropzoneState.getInputProps()}
        className={`${isDisable ? 'cursor-default' : ''}`}
        type='file'
      />
    </div>
  );
});

FileInput.displayName = 'FileInput';
