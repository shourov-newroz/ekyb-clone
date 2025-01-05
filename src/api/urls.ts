const BACKEND_ENDPOINTS = {
  COUNTRY_CODES: '/public/countries',
  SIGN_UP: '/public/auth/save-business-profile',
  OTP_VERIFY: '/public/auth/verify-otp',
  RESEND_OTP: '/public/sign-up/send-mobile-otp',
  SIGN_IN: '/public/auth/business-user/sign-in',
  RESET_PASSWORD: '/public/auth/first-time/change-password',
  REFRESH_TOKEN: '/public/auth/refresh-token',

  // company all data
  COMPANY_INFO: '/private/company-profile',

  // company profile
  SAVE_COMPANY_INFO: '/private/company-profile/company-information',
  SAVE_COMPANY_DOCUMENT: '/private/company-profile/company-document',
  SAVE_COMPANY_ADDRESS: '/private/company-profile/company-address/present',
  SAVE_COMPANY_CAPITAL: '/private/company-profile/company-capital',

  // ownership
  SAVE_PERSONAL_DOCUMENT: '/private/company-ownership/personal-document',
  SAVE_PERSONAL_INFORMATION: '/private/company-ownership/personal-information',
  SAVE_PERSONAL_PRESENT_ADDRESS:
    '/private/company-ownership/personal/present-address',
  SAVE_PERSONAL_PERMANENT_ADDRESS:
    '/private/company-ownership/personal/permanent-address',
  SAVE_ADDITIONAL_PARTNERS: '/private/company-ownership/additional-partners',

  // Partner Management
  SAVE_PARTNER: '/private/save/company-partner',
  SAVE_PARTNER_INFO: '/private/save/company-partner',
  SAVE_PARTNER_ADDRESS: '/private/save/company-partner-address',
  SAVE_PARTNER_DOCUMENT: '/private/save/company-partner-document',

  UPDATE_PARTNER_SIGNATORY: '/private/company-partner/change-signatory',
  UPDATE_PARTNER_SHARE: '/private/company-partner/change-percentage',
  DELETE_PARTNER: (uniqueId: string) =>
    `/private/delete/company-partner?uniqueId=${uniqueId}`,

  // transaction
  SAVE_TRANSACTION_DETAILS: '/private/transaction-details',

  // bank
  SAVE_BANK_DETAILS: '/private/bank-details',

  // product
  SAVE_PRODUCT_OFFERINGS: '/private/products',

  // Regulatory Declarations
  SAVE_REGULATORY_DECLARATIONS: '/private/business-profile/submit',

  // dashboard issues
  GET_ISSUES: '/private/business-profile/fetch-issues',
  UPDATE_ISSUE: '/private/business-profile/issues/solve-by-user',
} as const;

export default BACKEND_ENDPOINTS;
