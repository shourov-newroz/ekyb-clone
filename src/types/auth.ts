import { ISignUpPayload } from './pages/sign-up';

export enum AUTH_STATUS {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export interface ITokenData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface IRefreshTokenResponse {
  accessTokenResponse: ITokenData;
}

export interface IUser extends ITokenData {
  email: string;
  name: string;
}

export type ITempUser = ISignUpPayload;

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  status: AUTH_STATUS;
  tempUser: ITempUser | null;
  tempToken: string | null;
  tempData?: {
    email: string;
    password: string;
  } | null;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
