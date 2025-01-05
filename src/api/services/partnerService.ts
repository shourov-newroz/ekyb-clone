import { IAddressResponse, ISelectResponse } from '@/types/common';

export interface IPartnerResponse {
  uniqueId: string;
  isSignatory: boolean;
  sharePercent: number;
  // Personal Information
  firstName: string;
  lastName: string;
  gender: ISelectResponse | null;
  dateOfBirth: Date;
  nationality: ISelectResponse | null;
  fatherName: string;
  motherName: string;
  spouseName: string;
  residentStatus: boolean;
  occupation: string;
  relationWithOrganization: string;
  sourceOfFunds: ISelectResponse | null;
  monthlyIncome: string;
  IDType: ISelectResponse | null;
  IDNumber: string;
  IDExpiryDate: Date;
  tinNumber: string;

  // Address Information
  presentAddress: IAddressResponse;
  permanentAddress: IAddressResponse;
  isSamePresentAndPermanentAddressPartner: boolean;

  // Document Information
  nidFrontPhoto?: string;
  nidBackPhoto?: string;
  passportPhoto?: string;
  ownerPhoto: string;
  signaturePhoto: string;
}

export interface PartnerInfoAttributes {
  firstName: string;
  lastName: string;
  gender: number;
  dateOfBirth: string;
  nationality: number;
  fatherName: string;
  motherName: string;
  spouseName?: string;
  residentStatus: boolean;
  occupation: string;
  relationWithOrganization: string;
  sourceOfFunds: number;
  monthlyIncome: string;
  IDType: number;
  IDNumber: string;
  IDExpiryDate: string;
  tinNumber: string;
}

export type AddressAttributes = {
  tinNumber: string;
  isSamePresentAndPermanentAddressPartner: boolean;
  presentAddress: {
    division: number;
    district: number;
    thana: number;
    village: string;
    address: string;
    postCode: number;
    postOffice: string;
  };
  permanentAddress?: {
    division: number;
    district: number;
    thana: number;
    village: string;
    address: string;
    postCode: number;
    postOffice: string;
  };
};

export type DocumentAttributes = {
  tinNumber: string;
  nidFrontPhoto: string;
  nidBackPhoto: string;
  passportPhoto: string;
  workPermitPhoto: string;
  ownerPhoto: string;
  signaturePhoto: string;
};

export type PartnerAttributes = PartnerInfoAttributes &
  AddressAttributes &
  DocumentAttributes;

export interface SignatoryAttributes {
  type: string; // OWNER, PARTNER
  uniqueId: string; // not required for owner
  isSignatory: boolean;
}

export interface ShareAttributes {
  type: string; // OWNER, PARTNER
  uniqueId: string; // not required for owner
  sharePercent: number;
}
