import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { PartnerFormProvider } from '@/context/PartnerFormContext';
import { FormLayout, PartnerFormLayout } from '@/layouts/FormLayout';
import MainLayout from '@/layouts/MainLayout';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { ROUTE_PATH } from './routePaths';

// Auth Pages
const SignIn = lazy(() => import('@/pages/auth/sign-in'));
const SignUp = lazy(() => import('@/pages/auth/sign-up'));
const OtpVerify = lazy(() => import('@/pages/auth/otp-verify'));
const ResetPassword = lazy(() => import('@/pages/auth/reset-password'));

// Dashboard Pages
const Dashboard = lazy(() => import('@/pages/dashboard/dashboard'));
const Issues = lazy(() => import('@/pages/dashboard/issues'));
const FormDashboard = lazy(() => import('@/pages/form/form-dashboard'));

// Company Profile Pages
const CompanyInformation = lazy(
  () => import('@/pages/form/company-profile/information')
);
const CompanyDocument = lazy(
  () => import('@/pages/form/company-profile/document')
);
const CompanyAddress = lazy(
  () => import('@/pages/form/company-profile/address')
);
const CompanyCapital = lazy(
  () => import('@/pages/form/company-profile/capital')
);

// Ownership Pages
const PersonalDocument = lazy(
  () => import('@/pages/form/ownership/personal-document')
);
const PersonalInformation = lazy(
  () => import('@/pages/form/ownership/personal-information')
);
const PersonalAddress = lazy(
  () => import('@/pages/form/ownership/personal-address')
);
const PersonalAdditionalPartners = lazy(
  () => import('@/pages/form/ownership/additional-partners')
);

// Partners Pages
const PartnersManagement = lazy(
  () => import('@/pages/form/partners/management')
);

// Transaction Pages
const TransactionProfilePage = lazy(
  () => import('@/pages/form/transaction/transaction-profile')
);

// Bank Operation Pages
const BankOperationDetailsPage = lazy(
  () => import('@/pages/form/bank-operation/details')
);

// Product Pages
const ProductOfferingsPage = lazy(
  () => import('@/pages/form/product/offerings')
);

// Regulatory Pages
const RegulatoryDeclarations = lazy(
  () => import('@/pages/form/regulatory/regulatory-declarations')
);

const AddPartnerInfo = lazy(() => import('@/pages/form/partners/add/info'));
const AddPartnerAddress = lazy(
  () => import('@/pages/form/partners/add/address')
);
const AddPartnerDocument = lazy(
  () => import('@/pages/form/partners/add/document')
);

const LoadingFallback = () => (
  <div className='flex min-h-screen'>
    <LoadingSpinner />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route element={<PublicRoute />}>
            <Route path={ROUTE_PATH.signUp} element={<SignUp />} />
            <Route path={ROUTE_PATH.signIn} element={<SignIn />} />
            <Route path={ROUTE_PATH.optVerify} element={<OtpVerify />} />
            <Route
              path={ROUTE_PATH.resetPassword}
              element={<ResetPassword />}
            />
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            {/* Dashboard Routes */}
            <Route path={ROUTE_PATH.dashboard} element={<Dashboard />} />
            <Route path={ROUTE_PATH.pendingIssues} element={<Issues />} />

            {/* Form Routes */}
            <Route path={ROUTE_PATH.form} element={<FormDashboard />} />

            {/* Company Profile Routes */}
            <Route element={<FormLayout menuId={1} />}>
              <Route
                path={ROUTE_PATH.companyProfileInformation}
                element={<CompanyInformation />}
              />
              <Route
                path={ROUTE_PATH.companyProfileDocument}
                element={<CompanyDocument />}
              />
              <Route
                path={ROUTE_PATH.companyProfileAddress}
                element={<CompanyAddress />}
              />
              <Route
                path={ROUTE_PATH.companyProfileCapital}
                element={<CompanyCapital />}
              />
            </Route>

            {/* Ownership Routes */}
            <Route element={<FormLayout menuId={2} />}>
              <Route
                path={ROUTE_PATH.ownershipPersonalDocument}
                element={<PersonalDocument />}
              />
              <Route
                path={ROUTE_PATH.ownershipPersonalInformation}
                element={<PersonalInformation />}
              />
              <Route
                path={ROUTE_PATH.ownershipPersonalAddress}
                element={<PersonalAddress />}
              />
              <Route
                path={ROUTE_PATH.ownershipAdditionalPartners}
                element={<PersonalAdditionalPartners />}
              />
            </Route>

            {/* All Partners */}
            <Route element={<FormLayout menuId={3} />}>
              <Route
                path={ROUTE_PATH.partnerManagement}
                element={<PartnersManagement />}
              />
            </Route>

            <Route element={<PartnerFormProvider />}>
              <Route element={<PartnerFormLayout />}>
                <Route
                  path={ROUTE_PATH.addPartner}
                  element={<AddPartnerInfo />}
                />
                <Route
                  path={ROUTE_PATH.addPartnerAddress}
                  element={<AddPartnerAddress />}
                />
                <Route
                  path={ROUTE_PATH.addPartnerDocument}
                  element={<AddPartnerDocument />}
                />
              </Route>
            </Route>

            {/* Transaction Routes */}
            <Route element={<FormLayout menuId={4} />}>
              <Route
                path={ROUTE_PATH.transactionProfile}
                element={<TransactionProfilePage />}
              />
            </Route>

            {/* Bank Operation Routes */}
            <Route element={<FormLayout menuId={5} />}>
              <Route
                path={ROUTE_PATH.bankOperationDetails}
                element={<BankOperationDetailsPage />}
              />
            </Route>

            {/* Product Routes */}
            <Route element={<FormLayout menuId={6} />}>
              <Route
                path={ROUTE_PATH.productOfferings}
                element={<ProductOfferingsPage />}
              />
            </Route>

            {/* Regulatory Routes */}
            <Route element={<FormLayout menuId={7} />}>
              <Route
                path={ROUTE_PATH.regulatoryDeclarations}
                element={<RegulatoryDeclarations />}
              />
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<Navigate to={ROUTE_PATH.signIn} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
