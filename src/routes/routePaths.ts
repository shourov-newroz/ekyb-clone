export const ROUTE_PATH = {
  // Auth Routes
  signUp: '/',
  signIn: '/sign-in',
  optVerify: '/opt-verify',
  resetPassword: '/reset-password',

  // Dashboard Routes
  dashboard: '/dashboard',
  pendingIssues: '/dashboard/issues',

  // Form Routes
  form: '/form',

  // Company Profile Routes
  companyProfileInformation: '/form/company-profile/information',
  companyProfileDocument: '/form/company-profile/document',
  companyProfileAddress: '/form/company-profile/address',
  companyProfileCapital: '/form/company-profile/capital',

  // Ownership Routes
  ownershipPersonalDocument: '/form/ownership/personal-document',
  ownershipPersonalInformation: '/form/ownership/personal-information',
  ownershipPersonalAddress: '/form/ownership/personal-address',
  ownershipAdditionalPartners: '/form/ownership/additional-partners',

  // All Partners
  partnerManagement: '/form/partners/management',
  addPartner: '/form/partners/add/info',
  addPartnerAddress: '/form/partners/add/address',
  addPartnerDocument: '/form/partners/add/document',

  // Transaction Routes
  transactionProfile: '/form/transaction/transaction-profile',

  // Bank Operation Routes
  bankOperationDetails: '/form/bank-operation/details',

  // Product Routes
  productOfferings: '/form/product/offerings',

  // Regulatory Routes
  regulatoryDeclarations: '/form/regulatory/regulatory-declarations',

  // Dynamic Routes (if needed)
  issueDetails: (issueId: string) => `/dashboard/issues/${issueId}`,
  partnerDetails: (partnerId: string) => `/form/ownership/partner/${partnerId}`,
} as const;

// Type for route paths
export type RoutePath = keyof typeof ROUTE_PATH;

// Helper function to ensure type safety when using dynamic routes
// export const getPath = (path: RoutePath, param?: string) => {
//   const routePath = routePaths[path];
//   if (typeof routePath === 'function' ) {
//     return routePath(param);
//   }
//   return routePath;
// };
