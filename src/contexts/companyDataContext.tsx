import { IServerErrorResponse } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import useAuth from '@/hooks/useAuth';
import { ROUTE_PATH } from '@/routes/routePaths';
import {
  IApiResponse,
  ICompanyData,
  ICompanyInfoResponse,
  IMenus,
} from '@/types/common';
import getMenuHref from '@/utils/getMenuHref';
import {
  BankIcon,
  BuildingIcon,
  OwnershipIcon,
  ProductIcon,
  RegulatoryIcon,
  TransactionIcon,
} from '@/utils/Icons';
import React, { createContext, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';

interface CompanyDataContextType {
  companyData: ICompanyInfoResponse['company'] | null;
  refreshData: () => Promise<IApiResponse<ICompanyInfoResponse> | undefined>;
  menus: IMenus[] | null;
  isLoading: boolean;
  isCalculating: boolean;
  error: IServerErrorResponse;
  // formProgress: {
  //   totalSteps: number;
  //   completedSteps: number;
  //   percentageComplete: number;
  // };
}

export const CompanyDataContext = createContext<
  CompanyDataContextType | undefined
>(undefined);

const calculateMenuStructure = async (
  companyData: ICompanyData
): Promise<IMenus[]> => {
  const calculateComplete = (fields: boolean[]) => {
    if (!fields || fields.length === 0) return 0;
    const completedFields = fields.filter((field) => field);
    return Math.round((completedFields.length / fields.length) * 100);
  };

  return [
    {
      id: 1,
      name: 'Company Profile',
      description:
        'Upload your Trade license and other company documents to start with an application.',
      Icon: BuildingIcon,
      complete: calculateComplete([
        companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_INFORMATION ||
          false,
        companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_DOCUMENT ||
          false,
        companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_ADDRESS ||
          false,
        companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_CAPITAL ||
          false,
      ]),
      link: getMenuHref(companyData, 'Company Profile'),
      disabled: false,
      showInList: true,
      subMenus: [
        {
          title: 'Company Information',
          href: ROUTE_PATH.companyProfileInformation,
          disabled: false,
          girding: "Let's start with your",
          description:
            'We need your company basic information to begin the application.',
        },
        {
          title: 'Company Document',
          href: ROUTE_PATH.companyProfileDocument,
          disabled:
            !companyData?.profileCompletion?.COMPANY_PROFILE
              ?.COMPANY_INFORMATION,
          description:
            'First we need your company basic information to begin the application',
        },
        {
          title: 'Company Address',
          href: ROUTE_PATH.companyProfileAddress,
          disabled:
            !companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_DOCUMENT,
          girding: "Let's Capture your company",
          description:
            'We need address details of your company from where you are operating',
        },
        {
          title: 'Company Capital',
          href: ROUTE_PATH.companyProfileCapital,
          disabled:
            !companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_ADDRESS,
          girding: 'One more step, we need your company',
        },
      ],
    },
    {
      id: 2,
      name: 'Company Ownership Details',
      description:
        'Add details of key individuals such as the sole proprietor, owners, and those with power of attorney (PoA).',
      Icon: OwnershipIcon,
      complete: calculateComplete([
        companyData?.profileCompletion?.COMPANY_OWNERSHIP?.PERSONAL_DOCUMENT ||
          false,
        companyData?.profileCompletion?.COMPANY_OWNERSHIP
          ?.PERSONAL_INFORMATION || false,
        companyData?.profileCompletion?.COMPANY_OWNERSHIP
          ?.OWNER_PERMANENT_ADDRESS || false,
      ]),
      link: getMenuHref(companyData, 'Company Ownership Details'),
      disabled:
        !companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_CAPITAL,
      showInList: true,
      subMenus: [
        {
          title: 'Personal Document',
          href: ROUTE_PATH.ownershipPersonalDocument,
          disabled:
            !companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_CAPITAL,
        },
        {
          title: 'Personal Information',
          href: ROUTE_PATH.ownershipPersonalInformation,
          disabled:
            !companyData?.profileCompletion?.COMPANY_OWNERSHIP
              ?.PERSONAL_DOCUMENT,
        },
        {
          title: 'Personal Address',
          href: ROUTE_PATH.ownershipPersonalAddress,
          disabled:
            !companyData?.profileCompletion?.COMPANY_OWNERSHIP
              ?.PERSONAL_INFORMATION,
        },
        // {
        //   title: 'Additional Partners',
        //   href: ROUTE_PATH.ownershipAdditionalPartners,
        //   disabled:
        //     !companyData?.profileCompletion?.COMPANY_OWNERSHIP
        //       ?.OWNER_PERMANENT_ADDRESS,
        // },
      ],
    },
    {
      id: 3,
      name: 'All Partners',
      description:
        'Manage and view details of all partners associated with your company.',
      Icon: OwnershipIcon,
      complete: calculateComplete([
        (companyData?.partners?.length && companyData?.partners?.length > 2) ||
          false,
      ]),
      link: ROUTE_PATH.partnerManagement,
      disabled:
        !companyData?.profileCompletion?.COMPANY_OWNERSHIP
          ?.OWNER_PERMANENT_ADDRESS,
      showInList: true,
      subMenus: [
        {
          title: 'Partner Management',
          href: ROUTE_PATH.partnerManagement,
          disabled:
            !companyData?.profileCompletion?.COMPANY_OWNERSHIP
              ?.OWNER_PERMANENT_ADDRESS,
          girding: 'Manage your',
        },
      ],
    },
    {
      id: 8,
      name: 'Add New Partner',
      description: '',
      complete: 0,
      link: ROUTE_PATH.addPartner,
      disabled:
        !companyData?.profileCompletion?.COMPANY_OWNERSHIP
          ?.OWNER_PERMANENT_ADDRESS,
      showInList: false,
      subMenus: [
        {
          title: 'Personal Info',
          href: ROUTE_PATH.addPartner,
          disabled: false,
          girding: "Let's fill your Partner",
        },
        {
          title: 'Address',
          href: ROUTE_PATH.addPartnerAddress,
          disabled: false,
          girding: 'Fill your Partner',
        },
        {
          title: 'Documents',
          href: ROUTE_PATH.addPartnerDocument,
          disabled: false,
          girding: 'Fill your Partner',
        },
      ],
    },
    {
      id: 4,
      name: 'Transaction Details',
      description:
        'Help us to know your business relations with your top customers and suppliers.',
      Icon: TransactionIcon,
      complete: calculateComplete([
        companyData?.profileCompletion?.TRANSACTION_DETAILS
          ?.TRANSACTION_DETAILS || false,
      ]),
      link: ROUTE_PATH.transactionProfile,
      disabled:
        !companyData?.profileCompletion?.COMPANY_OWNERSHIP
          ?.OWNER_PERMANENT_ADDRESS,
      showInList: true,
      subMenus: [
        {
          title: 'Transaction Profile',
          href: ROUTE_PATH.transactionProfile,
          disabled:
            !companyData?.profileCompletion?.COMPANY_OWNERSHIP
              ?.PERSONAL_INFORMATION,
          girding: "Let's fill your",
        },
      ],
    },
    {
      id: 5,
      name: 'Bank Operation Details',
      description:
        'Define your bank account operating instructions as per the MOA and Board Resolution.',
      Icon: BankIcon,
      complete: calculateComplete([
        companyData?.profileCompletion?.BANK_DETAILS?.BANK_DETAILS || false,
      ]),
      link: ROUTE_PATH.bankOperationDetails,
      disabled:
        !companyData?.profileCompletion?.TRANSACTION_DETAILS
          ?.TRANSACTION_DETAILS,
      showInList: true,
      subMenus: [
        {
          title: 'Bank Details',
          href: ROUTE_PATH.bankOperationDetails,
          disabled:
            !companyData?.profileCompletion?.TRANSACTION_DETAILS
              ?.TRANSACTION_DETAILS,
          girding: "Let's fill your",
        },
      ],
    },
    {
      id: 6,
      name: 'Product Selection & Add-ons',
      description:
        'Pick your suitable business banking product(s) and powerful add-ons to enjoy all our services.',
      Icon: ProductIcon,
      complete: calculateComplete([
        companyData?.profileCompletion?.PRODUCTS_ADD_ONES?.PRODUCTS || false,
      ]),
      link: ROUTE_PATH.productOfferings,
      disabled: !companyData?.profileCompletion?.BANK_DETAILS?.BANK_DETAILS,
      showInList: true,
      subMenus: [
        {
          title: 'Product Offerings',
          href: ROUTE_PATH.productOfferings,
          disabled: !companyData?.profileCompletion?.BANK_DETAILS?.BANK_DETAILS,
          girding: "Let's fill your",
        },
      ],
    },
    {
      id: 7,
      name: 'Regulatory Declarations',
      description:
        'Provide minimum information of your FATCA, CRS, and Sanctions declarations.',
      Icon: RegulatoryIcon,
      complete: calculateComplete([
        companyData?.submissionStatus !== null &&
          companyData?.submissionStatus === 'PENDING',
      ]),
      link: ROUTE_PATH.regulatoryDeclarations,
      disabled: !companyData?.profileCompletion?.PRODUCTS_ADD_ONES?.PRODUCTS,
      showInList: true,
      subMenus: [
        {
          title: 'Regulatory Declarations',
          href: ROUTE_PATH.regulatoryDeclarations,
          disabled:
            !companyData?.profileCompletion?.PRODUCTS_ADD_ONES?.PRODUCTS,
          girding: "Let's declare your",
          description: 'Compliance Information',
        },
      ],
    },
  ];
};

export const CompanyDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [menus, setMenus] = useState<IMenus[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateMenus = useCallback(
    async (companyData: ICompanyInfoResponse['company']) => {
      setIsCalculating(true);
      try {
        const updatedMenus = await calculateMenuStructure(companyData);
        setMenus(updatedMenus);
      } catch (error) {
        console.error('Error calculating menus:', error);
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  const { data, error, isLoading, mutate } = useSWR<
    IApiResponse<ICompanyInfoResponse>
  >(isAuthenticated ? BACKEND_ENDPOINTS.COMPANY_INFO : null, {
    onSuccess(data) {
      updateMenus(data.data.company);
    },
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const companyData = data?.data?.company || null;

  // const formProgress = useMemo(() => {
  //   if (!menus) {
  //     return {
  //       totalSteps: 0,
  //       completedSteps: 0,
  //       percentageComplete: 0,
  //     };
  //   }

  //   const visibleMenus = menus.filter((menu) => menu.showInList);
  //   const totalSteps = visibleMenus.length;
  //   const completedSteps = visibleMenus.filter(
  //     (menu) => menu.complete === 100
  //   ).length;

  //   return {
  //     totalSteps,
  //     completedSteps,
  //     percentageComplete: Math.round((completedSteps / totalSteps) * 100),
  //   };
  // }, [menus]);

  const refreshData = useCallback(() => mutate(), [mutate]);

  const value = useMemo(
    () => ({
      companyData,
      refreshData,
      menus,
      isLoading,
      isCalculating,
      error,
      // formProgress,
    }),
    [
      companyData,
      refreshData,
      menus,
      isLoading,
      isCalculating,
      error,
      // formProgress,
    ]
  );

  return (
    <CompanyDataContext.Provider value={value}>
      {children}
    </CompanyDataContext.Provider>
  );
};
