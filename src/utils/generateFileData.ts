import { IFileData } from '@/types/common';

/**
 * Converts a File object or URL to FileData with Base64 content.
 * @param fileUrl - A URL pointing to a file.
 * @param key - A unique key or identifier for the file.
 * @returns A promise resolving to an IFileData object.
 */
export const generateFileData = async (
  fileUrl: string,
  key: string
): Promise<IFileData> => {
  try {
    const fileContent = await urlToBase64(fileUrl);
    return {
      name: key,
      size: 0,
      type: '',
      content: fileContent,
      url: fileUrl,
    };
  } catch (error) {
    console.error('Error generating file data:', error);
    throw new Error('Failed to generate file data');
  }
};

/**
 * Converts a file URL to a Base64-encoded string.
 * @param url - The file URL to convert.
 * @returns A promise resolving to a Base64-encoded string.
 */
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the file from URL: ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error('Failed to convert Blob to Base64'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file as Base64'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting URL to Base64:', error);
    throw new Error('Failed to convert URL to Base64');
  }
};
