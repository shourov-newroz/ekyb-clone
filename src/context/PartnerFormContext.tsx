import { LOCAL_STORAGE_KEYS } from '@/config/config';
import { ROUTE_PATH } from '@/routes/routePaths';
import { IMenus } from '@/types/common';
import { localStorageUtil } from '@/utils/localStorageUtil';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { z } from 'zod';

export const PartnerInformationFormSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First Name is required.' }),
    lastName: z.string().min(1, { message: 'Last Name is required.' }),
    gender: z.string().min(1, { message: 'Gender is required.' }),
    dateOfBirth: z
      .date({ required_error: 'Date of Birth is required.' })
      .optional(),
    nationality: z.string().min(1, { message: 'Nationality is required.' }),
    fatherName: z.string().min(1, { message: "Father's Name is required." }),
    motherName: z.string().min(1, { message: "Mother's Name is required." }),
    spouseName: z.string().optional(),
    residentStatus: z
      .string()
      .min(1, { message: 'Resident Status is required.' }),
    occupation: z.string().min(1, { message: 'Occupation is required.' }),
    relationWithOrganization: z
      .string()
      .min(1, { message: 'Relation with Organization is required.' }),
    sourceOfFunds: z
      .string()
      .min(1, { message: 'Source of Income is required.' }),
    monthlyIncome: z
      .string()
      .min(1, { message: 'Monthly Income is required.' }),
    IDType: z.string().min(1, { message: 'ID Type is required.' }),
    idNumber: z
      .string()
      .min(1, { message: 'NID/Passport Number is required.' }),
    IDExpiryDate: z
      .date({ required_error: 'Expiry Date is required.' })
      .optional(),
    tin: z.string().min(1, { message: 'TIN is required.' }),
  })
  .superRefine((data, ctx) => {
    if (!data.dateOfBirth) {
      ctx.addIssue({
        code: 'custom',
        path: ['dateOfBirth'],
        message: 'Date of Birth is required.',
      });
    }
    if (!data.IDExpiryDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['IDExpiryDate'],
        message: 'Expiry Date is required.',
      });
    }
  });

export type IPartnerInformationForm = z.infer<
  typeof PartnerInformationFormSchema
>;

export const PartnerAddressFormSchema = z
  .object({
    presentDivision: z.string().min(1, { message: 'Division is required.' }),
    presentDistrict: z.string().min(1, { message: 'District is required.' }),
    presentThana: z.string().min(1, { message: 'Thana is required.' }),
    presentVillage: z.string().min(1, { message: 'Village is required.' }),
    presentPostCode: z.string().min(1, { message: 'Post Code is required.' }),
    presentPostOffice: z
      .string()
      .min(1, { message: 'Post Office is required.' }),
    presentAddress: z.string().min(1, { message: 'Address Line is required.' }),
    isSameAsPermanent: z
      .string()
      .min(1, { message: 'Please select Yes or No' }),
    permanentDivision: z.string().optional(),
    permanentDistrict: z.string().optional(),
    permanentThana: z.string().optional(),
    permanentVillage: z.string().optional(),
    permanentPostCode: z.string().optional(),
    permanentPostOffice: z.string().optional(),
    permanentAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isSameAsPermanent === 'no') {
      if (!data.permanentDivision) {
        ctx.addIssue({
          code: 'custom',
          path: ['permanentDivision'],
          message: 'Division is required.',
        });
      }
      if (!data.permanentDistrict) {
        ctx.addIssue({
          code: 'custom',
          path: ['permanentDistrict'],
          message: 'District is required.',
        });
      }
      if (!data.permanentThana) {
        ctx.addIssue({
          code: 'custom',
          path: ['permanentThana'],
          message: 'Thana is required.',
        });
      }
      if (!data.permanentVillage) {
        ctx.addIssue({
          code: 'custom',
          path: ['permanentVillage'],
          message: 'Village is required.',
        });
      }
      if (!data.permanentPostCode) {
        ctx.addIssue({
          code: 'custom',
          path: ['permanentPostCode'],
          message: 'Post Code is required.',
        });
      }
      if (!data.permanentPostOffice) {
        ctx.addIssue({
          code: 'custom',
          path: ['permanentPostOffice'],
          message: 'Post Office is required.',
        });
      }
      if (!data.permanentAddress) {
        ctx.addIssue({
          code: 'custom',
          path: ['permanentAddress'],
          message: 'Address Line is required.',
        });
      }
    }
  });

export type IPartnerAddressForm = z.infer<typeof PartnerAddressFormSchema>;

// Validation Schema
export const PartnerDocumentFormSchema = z
  .object({
    documentType: z.string(),
    passportPhoto: z.any().optional(),
    workPermitPhoto: z.any().optional(),
    nidFrontPhoto: z.any().optional(),
    nidBackPhoto: z.any().optional(),
    ownerPhoto: z.any().refine((file) => file && file.size <= 1024 * 1024 * 4, {
      message: 'Owner photo is required and must not exceed 4MB.',
    }),
    signature: z.any().refine((file) => file && file.size <= 1024 * 1024 * 2, {
      message: 'Signature is required and must not exceed 2MB.',
    }),
  })
  .superRefine((data, ctx) => {
    // If documentType is '1' (NID), nidFrontPhoto and nidBackPhoto are required
    if (data.documentType === '1') {
      if (!data.nidFrontPhoto) {
        ctx.addIssue({
          code: 'custom',
          path: ['nidFrontPhoto'],
          message: 'NID front photo is required.',
        });
      }
      if (!data.nidBackPhoto) {
        ctx.addIssue({
          code: 'custom',
          path: ['nidBackPhoto'],
          message: 'NID back photo is required.',
        });
      }
    }

    // If documentType is '2' (Passport), passportPhoto is required
    if (data.documentType === '2') {
      if (!data.passportPhoto) {
        ctx.addIssue({
          code: 'custom',
          path: ['passportPhoto'],
          message: 'Passport photo is required.',
        });
      }
      if (!data.workPermitPhoto) {
        ctx.addIssue({
          code: 'custom',
          path: ['workPermitPhoto'],
          message: 'Work permit photo is required.',
        });
      }
    }
  });

export type IPartnerDocumentForm = z.infer<typeof PartnerDocumentFormSchema>;

interface IPartnerFormData {
  information: IPartnerInformationForm;
  address: IPartnerAddressForm;
  document: IPartnerDocumentForm;
}

interface IPartnerFormContextType {
  formData: IPartnerFormData;
  formNavigation: IMenus['subMenus'];
  formState: {
    isValid: boolean;
    isDirty: boolean;
    isSubmitting: boolean;
    currentStep: number;
    totalSteps: number;
  };
  updateInformation: (data: IPartnerInformationForm) => void;
  updateAddress: (data: IPartnerAddressForm) => void;
  updateDocument: (data: IPartnerDocumentForm) => void;
  clearForm: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const PartnerFormContext = createContext<IPartnerFormContextType | undefined>(
  undefined
);

export const usePartnerForm = () => {
  const context = useContext(PartnerFormContext);
  if (!context) {
    throw new Error('usePartnerForm must be used within a PartnerFormProvider');
  }
  return context;
};

const initFormData: IPartnerFormData = {
  information: {
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: undefined,
    nationality: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    residentStatus: '',
    occupation: '',
    relationWithOrganization: '',
    sourceOfFunds: '',
    monthlyIncome: '',
    IDType: '',
    idNumber: '',
    IDExpiryDate: undefined,
    tin: '',
  },
  address: {
    presentDivision: '',
    presentDistrict: '',
    presentThana: '',
    presentVillage: '',
    presentPostCode: '',
    presentPostOffice: '',
    presentAddress: '',
    isSameAsPermanent: 'yes',
    permanentDivision: '',
    permanentDistrict: '',
    permanentThana: '',
    permanentVillage: '',
    permanentPostCode: '',
    permanentPostOffice: '',
    permanentAddress: '',
  },
  document: {
    documentType: '',
    passportPhoto: null,
    workPermitPhoto: null,
    nidFrontPhoto: null,
    nidBackPhoto: null,
    ownerPhoto: null,
  },
};

export const PartnerFormProvider = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IPartnerFormData>(() => {
    const savedData = localStorageUtil.getItem<IPartnerFormData>(
      LOCAL_STORAGE_KEYS.PARTNER_FORM_STORAGE_KEY
    );
    return savedData
      ? {
          ...savedData,
          information: {
            ...savedData.information,
            dateOfBirth: savedData.information.dateOfBirth
              ? new Date(savedData.information.dateOfBirth)
              : undefined,
            IDExpiryDate: savedData.information.IDExpiryDate
              ? new Date(savedData.information.IDExpiryDate)
              : undefined,
          },
        }
      : initFormData;
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // // Clear form data when navigating to partner management
  // useEffect(() => {
  //   if (location.pathname === ROUTE_PATH.partnerManagement) {
  //     localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.PARTNER_FORM_STORAGE_KEY);
  //     setFormData(initFormData);
  //     setIsDirty(false);
  //     setIsSubmitting(false);
  //   }
  // }, [location.pathname]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (isDirty) {
      localStorageUtil.setItem(
        LOCAL_STORAGE_KEYS.PARTNER_FORM_STORAGE_KEY,
        formData
      );
    }
  }, [formData, isDirty]);

  const formNavigation: IMenus['subMenus'] = useMemo(
    () => [
      {
        title: 'Personal Info',
        href: ROUTE_PATH.addPartner,
        disabled: false,
        girding: "Let's fill your Partner",
      },
      {
        title: 'Address',
        href: ROUTE_PATH.addPartnerAddress,
        disabled: !formData.information.firstName,
        girding: 'Fill your Partner',
      },
      {
        title: 'Documents',
        href: ROUTE_PATH.addPartnerDocument,
        disabled: !formData.address.presentDivision,
        girding: 'Fill your Partner',
      },
    ],
    [formData.information.firstName, formData.address.presentDivision]
  );

  const currentStep = useMemo(() => {
    const currentPath = window.location.pathname;
    return formNavigation.findIndex((item) => item.href === currentPath);
  }, [formNavigation]);

  const isValid = useMemo(() => {
    switch (currentStep) {
      case 0:
        return !!formData.information.firstName;
      case 1:
        return !!formData.address.presentDivision;
      case 2:
        return true; // Document step validation
      default:
        return false;
    }
  }, [currentStep, formData]);

  const updateInformation = useCallback((data: IPartnerInformationForm) => {
    setFormData((prev) => ({
      ...prev,
      information: data,
    }));
    setIsDirty(true);
  }, []);

  const updateAddress = useCallback((data: IPartnerAddressForm) => {
    setFormData((prev) => ({
      ...prev,
      address: data,
    }));
    setIsDirty(true);
  }, []);

  const updateDocument = useCallback((data: IPartnerDocumentForm) => {
    setFormData((prev) => ({
      ...prev,
      document: data,
    }));
    setIsDirty(true);
  }, []);

  const clearForm = useCallback(() => {
    setFormData(initFormData);
    setIsDirty(false);
    setIsSubmitting(false);
    localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.PARTNER_FORM_STORAGE_KEY);
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStep < formNavigation.length - 1) {
      const nextStep = formNavigation[currentStep + 1];
      if (!nextStep.disabled) {
        navigate(nextStep.href);
      }
    }
  }, [currentStep, formNavigation, navigate]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      navigate(formNavigation[currentStep - 1].href);
    }
  }, [currentStep, formNavigation, navigate]);

  const value = useMemo(
    () => ({
      formData,
      formNavigation,
      formState: {
        isValid,
        isDirty,
        isSubmitting,
        currentStep,
        totalSteps: formNavigation.length,
      },
      updateInformation,
      updateAddress,
      updateDocument,
      clearForm,
      goToNextStep,
      goToPreviousStep,
    }),
    [
      formData,
      formNavigation,
      isValid,
      isDirty,
      isSubmitting,
      currentStep,
      updateInformation,
      updateAddress,
      updateDocument,
      clearForm,
      goToNextStep,
      goToPreviousStep,
    ]
  );

  return (
    <PartnerFormContext.Provider value={value}>
      <Outlet />
    </PartnerFormContext.Provider>
  );
};
