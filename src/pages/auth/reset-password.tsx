import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import { AuthContent, AuthForm, AuthFormSection } from '@/components/auth';
import InputWithLabel from '@/components/ui/InputWithLabel';
import useAuth from '@/hooks/useAuth';
import { toast } from '@/hooks/useToast';
import AuthLayout from '@/layouts/AuthLayout';
import { ROUTE_PATH } from '@/routes/routePaths';
import {
  IApiRequestWithMetaData,
  IApiResponse,
  IFormErrors,
} from '@/types/common';
import {
  IResetPasswordForm,
  IResetPasswordResponse,
} from '@/types/pages/reset-password';
import { getMetaData } from '@/utils/getMetaData';
import scrollToErrorElement from '@/utils/scrollToErrorElement';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { tempData } = useAuth();

  const [formData, setFormData] = useState<IResetPasswordForm>({
    email: tempData?.email || '',
    tempPassword: tempData?.password || '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [formErrors, setFormErrors] = useState<IFormErrors<IResetPasswordForm>>(
    {}
  );

  const validateField = (
    name: keyof IResetPasswordForm,
    value: string
  ): string | null => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
        break;
      case 'tempPassword':
        if (!value.trim()) return 'Temporary password is required';
        break;
      case 'newPassword':
        if (!value.trim()) return 'Password is required';
        if (value.length < 8)
          return 'Password must be at least 8 characters in length';
        if (!/[a-zA-Z]/.test(value))
          return 'Password must contain at least one letter';
        if (!/[0-9]/.test(value))
          return 'Password must contain at least one digit';
        if (/(\w)\1\1/.test(value))
          return 'Password must not have repeated characters more than twice';
        break;
      case 'confirmNewPassword':
        if (!value.trim()) return 'Please confirm your new password';
        if (value !== formData.newPassword) return 'Passwords do not match';
        break;
      default:
        return null;
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    const error = validateField(name as keyof IResetPasswordForm, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const { trigger: resetPasswordTrigger, isMutating: isLoadingReset } =
    useSWRMutation(BACKEND_ENDPOINTS.RESET_PASSWORD, sendPostRequest, {
      onSuccess: (data: IApiResponse<IResetPasswordResponse>) => {
        toast({
          title: data.data.message || 'Password reset successfully.',
        });
        navigate(ROUTE_PATH.signIn);
      },
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: IFormErrors<IResetPasswordForm> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field as keyof IResetPasswordForm,
        formData[field as keyof IResetPasswordForm]
      );
      if (error) errors[field as keyof IResetPasswordForm] = error;
    });

    setFormErrors(errors);

    if (Object.keys(errors).length) {
      scrollToErrorElement();
      return;
    }

    const data: IApiRequestWithMetaData<IResetPasswordForm> = {
      metaInfo: getMetaData(),
      attributes: formData,
    };

    await resetPasswordTrigger(data);
  };

  return (
    <AuthLayout showAside={false}>
      <main className='w-full max-w-3xl flex-1 py-6 lg:py-[30px]'>
        <AuthContent
          title='Reset Your Password'
          description='Please enter your email and the temporary password sent to you. Then set a new password to secure your account.'
        />

        <AuthForm
          onSubmit={onSubmit}
          isLoading={isLoadingReset}
          submitText='Reset Password'
        >
          <AuthFormSection>
            <InputWithLabel
              label='Email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              disabled={!!tempData?.email}
            />
            <InputWithLabel
              label='Temporary Password'
              name='tempPassword'
              type='password'
              value={formData.tempPassword}
              onChange={handleChange}
              error={formErrors.tempPassword}
              disabled={!!tempData?.password}
            />
            <InputWithLabel
              label='New Password'
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
              error={formErrors.newPassword}
            />
            <InputWithLabel
              label='Confirm New Password'
              name='confirmNewPassword'
              type='password'
              value={formData.confirmNewPassword}
              onChange={handleChange}
              error={formErrors.confirmNewPassword}
            />
          </AuthFormSection>
        </AuthForm>
      </main>
    </AuthLayout>
  );
};

export default ResetPassword;
