export interface ICountry {
  id: string;
  countryCode: string;
  countryName: string;
  currency: string;
  flagIcon: string;
  maxNumberLength: number;
  validationRegex: string;
  status: boolean;
}

export interface ICountryListData {
  countryList: ICountry[];
}

export interface ISignUpForm {
  firstName: string;
  lastName: string;
  emailAddress: string;
  confirmEmail: string;
  mobileNumber: string;
}

export interface ISignUpPayload extends ISignUpForm {
  countryId: string;
}

export interface ISignUpResponse {
  metaData: {
    requestId: string;
    transactionId: string;
    eventTime: string;
    status: boolean;
  };
  data: {
    expiryTime: number;
    intervalTime: number;
    token: string;
  };
  error: null;
}
