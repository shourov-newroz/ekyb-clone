export const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://34.244.192.41/api/v1';

export const ERROR_CLASS = 'input_error';

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  REFRESH_EXPIRY: 'refresh_expiry',
  USER: 'user',
  TEMP_USER: 'temp_user',
  TEMP_TOKEN: 'temp_token',
  PARTNER_FORM_STORAGE_KEY: 'partner_form_data',
};
