import { IPartnerResponse } from '@/api/services/partnerService';
import { IconType } from '@/utils/Icons';
import { z } from 'zod';

export type IFormErrors<T> = Partial<Record<keyof T, string>> & {
  non_field_errors?: string;
};

// server response
export interface IErrorInfo {
  reason: string | null;
}

export interface IMetaData {
  requestId: string | null;
  transactionId: string;
  eventTime: string;
  status: boolean;
}

export interface IApiResponse<T> {
  metaData: IMetaData;
  data: T;
  error: IErrorInfo;
}

export interface IFormSubmissionResponse {
  message: string;
}

export interface IRequestMetaInfo {
  requestId: string;
  source: string;
  versionCode: string;
  versionName: string;
  networkType: string;
  deviceID: string;
  deviceOSCode: number;
  deviceOSName: string;
  deviceName: string;
  language: string;
  latitude: number;
  longitude: number;
}

export interface IApiRequestWithMetaData<T> {
  attributes: T;
  metaInfo: IRequestMetaInfo;
}

export interface IOptionResponse {
  data: {
    id: number;
    value: string;
  }[];
}

export interface ISelectResponse {
  key: number;
  value: string;
}

export interface IAddressResponse {
  division: ISelectResponse;
  district: ISelectResponse;
  thana: ISelectResponse;
  village: string;
  address: string;
  postCode: number;
  postOffice: string;
  landLineNumber?: string;
}

export interface IAdditionalPartner {
  documentType: ISelectResponse | null;
  passportPhoto: string | null;
  workPermitPhoto: string | null;
  nidFrontPhoto: string | null;
  nidBackPhoto: string | null;
  ownerPhoto: string | null;
  role: string;
  fullName: string | null;
  dateOfBirth: Date | null;
  dateOfIssue: Date | null;
  dateOfExpiry: Date | null;
  nationality: ISelectResponse | null;
  gender: ISelectResponse | null;
  sharePercent: string | null;
  idNumber: string | null;
}

export interface ICompanyData {
  id: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileNumber: string;
  businessName: string | null;
  accountType: ISelectResponse | null;
  organizationType: ISelectResponse | null;
  businessCategory: ISelectResponse | null;
  tradeLicense: string | null;
  partnershipDeedFirstPage: string | null;
  partnershipDeedSixthPage: string | null;
  certificateOfIncorporation: string | null;
  certificateOfCoOperation: string | null;
  chairmanRecommendationLetter: string | null;
  TINorBIN: string | null;
  MOA: string | null;
  AOA: string | null;
  officeType: ISelectResponse | null;
  addressProofDocumentType: ISelectResponse | null;
  addressProofDocument: string | null;
  sameAsCompanyAddress: boolean | null;
  presentCompanyAddress: IAddressResponse | null;
  mailingAddress: IAddressResponse | null;
  documentType: ISelectResponse | null;
  passportPhoto: string | null;
  workPermitPhoto: string | null;
  nidFrontPhoto: string | null;
  nidBackPhoto: string | null;
  ownerPhoto: string | null;
  fullName: string | null;
  designation: string | null;
  fatherName: string | null;
  motherName: string | null;
  husbandWifeName: string | null;
  dateOfBirth: Date | null;
  dateOfIssue: Date | null;
  dateOfExpiry: Date | null;
  nationality: ISelectResponse | null;
  gender: ISelectResponse | null;
  businessMobileNumber: string | null;
  sharePercent: string | null;
  nidNumber: string | null;
  ownerPresentAddress: IAddressResponse | null;
  ownerPermanentAddress: IAddressResponse | null;
  additionalPartners: IAdditionalPartner[];
  transactionHighestVolume: string | null;
  transactionAssetRange: ISelectResponse | null;
  transactionAmount: ISelectResponse | null;
  transactionNumber: ISelectResponse | null;
  bankDetailsBank: ISelectResponse | null;
  bankBranch: ISelectResponse | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankAutoSettlement: boolean | null;
  productList:
    | {
        productOrServiceName: string;
        productDetails: string;
        websiteLink: string | null;
      }[]
    | null;
  partners: IPartnerResponse[] | null;
  capitalInvestment: number | null;
  sourceOfFunds: ISelectResponse | null;
  annualTurnover: number | null;
  expectedAnnualTurnover: number | null;
  expectedAnnualTurnoverInWords: string | null;
  isBankStatementPresent: boolean | null;
  bankStatements: string | null;
  isBankStatementPasswordProtected: boolean | null;
  bankStatementPassword: string | null;
  profileCompletion?: {
    COMPANY_PROFILE?: {
      COMPANY_INFORMATION: boolean;
      COMPANY_DOCUMENT: boolean;
      COMPANY_ADDRESS: boolean;
      COMPANY_CAPITAL: boolean;
    };
    COMPANY_OWNERSHIP?: {
      PERSONAL_DOCUMENT: boolean;
      PERSONAL_INFORMATION: boolean;
      OWNER_PERMANENT_ADDRESS: boolean;
      // OWNER_ADDITIONAL_PARTNERS: boolean;
    };
    // ALL_PARTNERS?: {
    //   PARTNER_MANAGEMENT: boolean;
    // };
    TRANSACTION_DETAILS?: {
      TRANSACTION_DETAILS: boolean;
    };
    BANK_DETAILS?: {
      BANK_DETAILS: boolean;
    };
    PRODUCTS_ADD_ONES?: {
      PRODUCTS: boolean;
    };
  };
  status: boolean;
  submissionStatus: 'PENDING' | 'ON_PROCESS' | 'APPROVED' | 'REJECTED';
  createdDate: string;
  updatedDate: string;
}

export interface ICompanyInfoResponse {
  company: ICompanyData;
}

export interface IMenus {
  id: number;
  name: string;
  description: string;
  complete: number;
  link: string;
  disabled: boolean;
  Icon?: IconType;
  showInList?: boolean;
  subMenus: {
    title: string;
    href: string;
    disabled: boolean;
    girding?: string;
    description?: string;
  }[];
}

export type IFileData = {
  name: string; // File name
  size: number; // File size in bytes
  type: string; // MIME type, e.g., "image/png"
  content: string; // Base64 encoded string of the file content
  url: string;
};

export const documentSchema = z.object({
  name: z.string().optional(),
  size: z
    .number()
    .max(1024 * 1024 * 4, 'File size must not exceed 4MB')
    .optional(), // File size validation
  content: z.string().optional(),
});

export type IDocumentSchema = z.infer<typeof documentSchema>;
