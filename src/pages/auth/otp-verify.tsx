import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import { AuthContent, AuthForm } from '@/components/auth';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import AuthLayout from '@/layouts/AuthLayout';
import { ROUTE_PATH } from '@/routes/routePaths';
import { IApiRequestWithMetaData, IApiResponse } from '@/types/common';
import { ISignUpPayload } from '@/types/pages/sign-up';
import { getMetaData } from '@/utils/getMetaData';
import { localStorageUtil } from '@/utils/localStorageUtil';
import { PhoneIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

const OtpVerify: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tempUser, tempToken } = useAuth();
  const phoneCode = localStorageUtil.getItem<string>('phoneCode');

  const expiryTime = parseInt(
    localStorageUtil.getItem('expiryTime') || '300',
    10
  );
  const intervalTime = parseInt(
    localStorageUtil.getItem('intervalTime') || '60',
    10
  );

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState<number>(intervalTime);
  const [countdownExpiry, setCountdownExpiry] = useState<number>(expiryTime);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
  };

  const { trigger: verifyOtpTrigger } = useSWRMutation(
    BACKEND_ENDPOINTS.OTP_VERIFY,
    sendPostRequest,
    {
      onSuccess: (data: IApiResponse<{ message: string }>) => {
        toast({
          duration: 5000,
          title: data.data.message || 'OTP verified successfully.',
        });
        localStorageUtil.removeItem('expiryTime');
        localStorageUtil.removeItem('intervalTime');
        localStorageUtil.removeItem('phoneCode');
        navigate(ROUTE_PATH.signIn);
      },
    }
  );

  const verifyOtp = () => {
    verifyOtpTrigger({
      metaInfo: getMetaData(),
      attributes: {
        token: tempToken,
        otp: Number(otp),
      },
    });
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      setIsResendDisabled(true);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  useEffect(() => {
    if (countdownExpiry > 0) {
      const timer = setTimeout(
        () => setCountdownExpiry(countdownExpiry - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      toast({
        variant: 'destructive',
        title: 'OTP has expired. Please request a new one.',
      });
    }
  }, [countdownExpiry]);

  const { trigger: resendOtpTrigger } = useSWRMutation(
    BACKEND_ENDPOINTS.SIGN_UP,
    sendPostRequest,
    {
      onSuccess: () => {
        toast({
          title: 'OTP has been resent.',
        });
        setCountdown(intervalTime);
        setCountdownExpiry(expiryTime);
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Failed to resend OTP. Please try again.',
        });
      },
    }
  );

  const resendOtp = () => {
    if (!isResendDisabled && tempUser) {
      const data: IApiRequestWithMetaData<ISignUpPayload> = {
        metaInfo: getMetaData(),
        attributes: {
          ...tempUser,
        },
      };
      resendOtpTrigger(data);
    }
  };

  const isSubmitDisable = otp.length !== 6 || countdownExpiry === 0;

  return (
    <AuthLayout showAside={false}>
      <main className='w-full max-w-3xl flex-1 py-6 lg:py-[30px]'>
        <AuthContent
          title='We would like to verify your mobile number'
          description='Please enter the 6-digit code sent to your mobile number'
        >
          <div className='flex items-center gap-2'>
            <span className='text-xl sm:text-2xl'>
              <PhoneIcon />
            </span>
            <span className='font-bukra-semibold text-lg text-gray-700 sm:text-xl'>
              {phoneCode}
              {tempUser?.mobileNumber}
            </span>
          </div>
        </AuthContent>

        <AuthForm
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp();
          }}
          submitText='Next'
          className='space-y-6'
          disabled={isSubmitDisable}
        >
          <label className='block text-sm font-semibold text-gray-700 sm:text-base'>
            Please enter your security code
          </label>
          <div className='mb-4'>
            <InputOTP maxLength={6} onChange={handleOtpChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className='flex flex-col justify-between gap-4 pb-6 font-bukra-semibold text-xs sm:flex-row sm:items-center sm:gap-6 sm:pb-10 sm:text-sm'>
            <div className='text-gray-500'>
              {!isResendDisabled && <span>Didn't receive the OTP? &nbsp;</span>}
              <button
                type='button'
                onClick={resendOtp}
                disabled={isResendDisabled}
                className={`${
                  isResendDisabled ? 'text-gray-400' : 'text-primary'
                }`}
              >
                {isResendDisabled
                  ? `Resend OTP in ${countdown}s`
                  : 'Resend OTP'}
              </button>
            </div>
            <p className='text-gray-700'>
              OTP will expire in {Math.floor(countdownExpiry / 60)}:
              {`0${countdownExpiry % 60}`.slice(-2)} minutes
            </p>
          </div>
        </AuthForm>
      </main>
    </AuthLayout>
  );
};

export default OtpVerify;
