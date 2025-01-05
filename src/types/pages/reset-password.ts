export interface IResetPasswordForm {
  email: string;
  tempPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IResetPasswordResponse {
  message: string;
}
