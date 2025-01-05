import { SWRConfig } from 'swr';
import { swrConfig } from './api/swrConfig';
import { Toaster } from './components/ui/toaster';
import AuthProvider from './contexts/authContext';
import { CompanyDataProvider } from './contexts/companyDataContext';
import useScrollToTop from './hooks/useScrollToTop';
import AppRoutes from './routes/AppRoutes';

function App() {
  useScrollToTop();
  return (
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        <CompanyDataProvider>
          <AppRoutes />
          <Toaster />
        </CompanyDataProvider>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
