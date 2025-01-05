export interface ISignInForm {
  email: string;
  password: string;
}

interface IFastSignInResponse {
  passwordChangeRequired: boolean;
}

export interface IExistingSignInResponse {
  body: {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
  };
}

export type ISignInResponse = IFastSignInResponse | IExistingSignInResponse;
