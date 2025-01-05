import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import {
  AuthContent,
  AuthForm,
  AuthFormSection,
  AuthInfoBox,
} from '@/components/auth';
import LoadingSvg from '@/components/loading/LoadingSvg';
import InputWithLabel from '@/components/ui/InputWithLabel';
import useAuth from '@/hooks/useAuth';
import AuthLayout from '@/layouts/AuthLayout';
import { ROUTE_PATH } from '@/routes/routePaths';
import {
  IApiRequestWithMetaData,
  IApiResponse,
  IFormErrors,
} from '@/types/common';
import {
  ICountry,
  ICountryListData,
  ISignUpForm,
  ISignUpPayload,
  ISignUpResponse,
} from '@/types/pages/sign-up';
import { getMetaData } from '@/utils/getMetaData';
import { localStorageUtil } from '@/utils/localStorageUtil';
import scrollToErrorElement from '@/utils/scrollToErrorElement';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { setTempToken, setTempUser } = useAuth();

  const [formData, setFormData] = useState<ISignUpForm>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    confirmEmail: '',
    mobileNumber: '',
  });

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [formErrors, setFormErrors] = useState<IFormErrors<ISignUpForm>>({});

  const { isLoading: isLoadingCountryCodes } = useSWR<
    IApiResponse<ICountryListData>
  >(BACKEND_ENDPOINTS.COUNTRY_CODES, {
    onSuccess: (data) => {
      if (data?.data?.countryList?.length) {
        setSelectedCountry(data.data.countryList[0]);
      }
    },
  });

  const validateField = (
    name: keyof ISignUpForm,
    value: string
  ): string | null => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        break;

      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        break;

      case 'emailAddress':
        if (!value.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
        break;

      case 'confirmEmail':
        if (!value.trim()) return 'Please confirm your email';
        if (value !== formData.emailAddress) return 'Emails do not match';
        break;

      case 'mobileNumber':
        if (!value.trim()) return 'Mobile number is required';
        if (selectedCountry) {
          const regex = new RegExp(selectedCountry.validationRegex);
          if (!regex.test(value))
            return `Enter a valid mobile number (${selectedCountry.maxNumberLength} digits)`;
        }
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

    const error = validateField(name as keyof ISignUpForm, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const { trigger: signUpTrigger, isMutating: isLoadingSignUp } =
    useSWRMutation(BACKEND_ENDPOINTS.SIGN_UP, sendPostRequest, {
      onSuccess: (data: ISignUpResponse) => {
        localStorageUtil.setItem('expiryTime', data.data.expiryTime);
        localStorageUtil.setItem('intervalTime', data.data.intervalTime);
        localStorageUtil.setItem('phoneCode', selectedCountry?.countryCode);

        setTempToken(data.data.token);
        setTempUser({ ...formData, countryId: selectedCountry?.id || '' });
        navigate(ROUTE_PATH.optVerify);
      },
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: IFormErrors<ISignUpForm> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field as keyof ISignUpForm,
        formData[field as keyof ISignUpForm]
      );
      if (error) errors[field as keyof ISignUpForm] = error;
    });

    setFormErrors(errors);

    if (Object.keys(errors).length) {
      scrollToErrorElement();
      return;
    }

    const data: IApiRequestWithMetaData<ISignUpPayload> = {
      metaInfo: getMetaData(),
      attributes: {
        ...formData,
        countryId: selectedCountry?.id || '',
      },
    };

    await signUpTrigger(data);
  };

  return (
    <AuthLayout>
      <main className='w-full max-w-3xl flex-1 py-6 lg:py-[30px]'>
        <AuthContent
          title='Welcome to Newroz BIZ'
          description='First things first, we would like to begin with your contact details to register your application with us. We would need this information to keep you informed about your application status.'
        />

        <AuthForm onSubmit={onSubmit} isLoading={isLoadingSignUp}>
          <AuthFormSection variant='grid'>
            <InputWithLabel
              label='First Name'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              error={formErrors.firstName}
            />
            <InputWithLabel
              label='Last Name'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              error={formErrors.lastName}
            />
            <InputWithLabel
              label='Email'
              name='emailAddress'
              autoComplete='off'
              value={formData.emailAddress}
              onChange={handleChange}
              error={formErrors.emailAddress}
            />
            <InputWithLabel
              label='Confirm Email'
              name='confirmEmail'
              type='password'
              autoComplete='off'
              value={formData.confirmEmail}
              onChange={handleChange}
              error={formErrors.confirmEmail}
            />
          </AuthFormSection>

          <AuthInfoBox>
            Kindly provide contact details (Mobile Number/ Email ID) of the
            account holder. Bank reserves the right to reject the application in
            case third party contact details are provided.
          </AuthInfoBox>

          <h2 className='text-sm font-semibold sm:text-base'>
            For international numbers, please make sure you are contactable on
            the number you have provided.
          </h2>

          <div className='flex flex-row gap-2 sm:gap-6'>
            <div className='flex h-16 w-full basis-1/5 items-center justify-center gap-2 rounded-md border border-gray-300 bg-lightBG text-sm font-medium sm:w-auto'>
              {isLoadingCountryCodes ? (
                <LoadingSvg />
              ) : (
                <>
                  <img
                    src={selectedCountry?.flagIcon}
                    alt={selectedCountry?.countryName}
                    className='hidden size-6 rounded-full object-cover sm:block sm:size-8'
                  />
                  <span className='text-sm'>
                    {selectedCountry?.countryCode}
                  </span>
                </>
              )}
            </div>
            <div className='w-full basis-4/5'>
              <InputWithLabel
                label='Mobile Number'
                name='mobileNumber'
                value={formData.mobileNumber}
                onChange={handleChange}
                error={formErrors.mobileNumber}
              />
            </div>
          </div>
        </AuthForm>
      </main>
    </AuthLayout>
  );
};

export default SignUp;
