import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Only scroll to top on PUSH and REPLACE navigation types
    // This prevents scrolling when using the browser's back/forward buttons
    if (navigationType !== 'POP') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname, navigationType]);
};

export default useScrollToTop;
