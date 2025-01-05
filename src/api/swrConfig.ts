import api from '@/config/apiConfig';
import serverErrorHandler from '@/utils/serverErrorHandler';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { SWRConfiguration } from 'swr';

// Default fetcher for SWR using Axios
export const fetcher = async (url: string) => {
  const res = await api.get(url);
  return res.data;
};

// Interface for Server Error Response
export interface IServerErrorResponse {
  error?: { reason: string[] };
}

export interface IFormErrors {
  [key: string]: string | undefined | null;
}

// SWR Default Configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateOnMount: true,
  refreshWhenOffline: false,
  shouldRetryOnError: false,
  onError: (error: AxiosError<IServerErrorResponse>) => {
    serverErrorHandler(error);
  },
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    console.log('🚀 ~ config, key:', config, key);
    // Never retry on 404.
    if (error.status === 404) return;

    // Only retry up to 10 times.
    if (retryCount >= 10) return;

    // Retry after 5 seconds.
    setTimeout(() => revalidate({ retryCount }), 5000);
  },
};

// Function to send a POST request
export async function sendPostRequest<T>(url: string, { arg }: { arg: T }) {
  return api
    .post(url, arg)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

// Function to send a POST request for file upload
export async function sendPostRequestWithFile<
  T extends { [s: string]: string | Blob | File | unknown } | FormData
>(url: string, { arg }: { arg: T }) {
  if (arg instanceof FormData) {
    return api
      .post(url, arg, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  }

  const formData = new FormData();

  Object.entries(arg).forEach(([key, value]) => {
    if (typeof value !== 'undefined' && value !== null) {
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (typeof value === 'object' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(JSON.stringify(value)));
        // if (value.length) {
        //     value.forEach((id, index) => {
        //         formData.append(`${key}[${index}]`, id);
        //     });
        // } else {
        //     formData.append(key, "null");
        // }
      } else if (typeof value === 'object') {
        const jsonValue = JSON.stringify(value);
        const blobValue = new Blob([jsonValue], {
          type: 'application/json',
        });

        formData.append(key, blobValue, `${key}.json`);
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  const headers = {
    'Content-Type': 'multipart/form-data',
    // Add any additional headers here
  };

  return api
    .post(url, formData, { headers })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

// Function to send a PUT request
export async function sendPutRequest<T>(url: string, { arg }: { arg: T }) {
  return api
    .put(url, arg)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

// Function to send a Delete request
export async function sendDeleteRequest<T extends AxiosRequestConfig>(
  url: string,
  data?: T['data']
) {
  return api
    .delete(url, { data: data?.arg?.data })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}
