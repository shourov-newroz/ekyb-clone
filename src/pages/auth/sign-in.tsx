import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import { AuthContent, AuthForm, AuthFormSection } from '@/components/auth';
import FileTestForm from '@/components/test/FileForm';
import InputWithLabel from '@/components/ui/InputWithLabel';
import useAuth from '@/hooks/useAuth';
import AuthLayout from '@/layouts/AuthLayout';
import { ROUTE_PATH } from '@/routes/routePaths';
import {
  IApiRequestWithMetaData,
  IApiResponse,
  IFormErrors,
} from '@/types/common';
import { ISignInForm, ISignInResponse } from '@/types/pages/sign-in';
import { getMetaData } from '@/utils/getMetaData';
import scrollToErrorElement from '@/utils/scrollToErrorElement';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login, setTempData } = useAuth();

  const [formData, setFormData] = useState<ISignInForm>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<IFormErrors<ISignInForm>>({});

  const validateField = (
    name: keyof ISignInForm,
    value: string
  ): string | null => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
        break;
      case 'password':
        if (!value.trim()) return 'Password is required';
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

    const error = validateField(name as keyof ISignInForm, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const { trigger: signInTrigger, isMutating: isLoadingSignIn } =
    useSWRMutation(BACKEND_ENDPOINTS.SIGN_IN, sendPostRequest, {
      onSuccess: (data: IApiResponse<ISignInResponse>) => {
        if ('body' in data.data) {
          const decodedToken = jwtDecode(data.data.body.access_token);

          if ('email' in decodedToken && 'name' in decodedToken) {
            const email = decodedToken.email as string;
            const name = decodedToken.name as string;

            login({
              email,
              name,
              ...data.data.body,
            });
          }
          // navigate(ROUTE_PATH.form);
        } else {
          setTempData({
            email: formData.email,
            password: formData.password,
          });
          navigate(ROUTE_PATH.resetPassword);
        }
      },
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: IFormErrors<ISignInForm> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field as keyof ISignInForm,
        formData[field as keyof ISignInForm]
      );
      if (error) errors[field as keyof ISignInForm] = error;
    });

    setFormErrors(errors);

    if (Object.keys(errors).length) {
      scrollToErrorElement();
      return;
    }

    const data: IApiRequestWithMetaData<ISignInForm> = {
      metaInfo: getMetaData(),
      attributes: { ...formData },
    };

    await signInTrigger(data);
  };

  return (
    <AuthLayout>
      <main className='w-full max-w-3xl flex-1 py-6 lg:py-[30px]'>
        <AuthContent
          title='Welcome to Newroz BIZ'
          description='Please sign in to continue...'
        />

        <AuthForm
          onSubmit={onSubmit}
          isLoading={isLoadingSignIn}
          submitText='Sign In'
        >
          <AuthFormSection>
            <InputWithLabel
              label='Email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />
            <InputWithLabel
              label='Password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
            />
          </AuthFormSection>
        </AuthForm>
      </main>
      <FileTestForm />
    </AuthLayout>
  );
};

export default SignIn;
