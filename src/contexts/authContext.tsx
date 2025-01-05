import { useToast } from '@/hooks/useToast';
import authReducer, { initialState } from '@/reducers/authReducer';
import { AUTH_STATUS, IAuthState, IUser } from '@/types/auth';
import { authService } from '@/utils/authService';
import React, { createContext, useCallback, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
// import { mutate } from 'swr';

export interface IAuthContextType extends IAuthState {
  login: (user: IUser) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
  setAuthenticationStatus: (status: AUTH_STATUS) => void;
  setTempUser: (tempUser: IAuthState['tempUser']) => void;
  setTempToken: (tempToken: string) => void;
  setTempData: (tempData: IAuthState['tempData']) => void;
  clearTempData: () => void;
}

export const AuthContext = createContext<IAuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  const login = useCallback((user: IUser) => {
    authService.saveUser(user);
    dispatch({ type: 'LOGIN', payload: { user } });
    toast({
      title: 'Login Success',
      description: 'You have successfully logged in.',
    });
    dispatch({ type: 'CLEAR_TEMP' });
  }, []);

  const logout = useCallback(() => {
    authService.clearUser();
    dispatch({ type: 'LOGOUT' });
    navigate('/sign-in');
    toast({
      title: 'Logout Success',
      description: 'Your session has been logged out.',
      duration: 3000,
    });
    // mutate(BACKEND_ENDPOINTS.COMPANY_INFO, undefined, { revalidate: false });
  }, []);

  const updateUser = useCallback((user: IUser) => {
    dispatch({ type: 'UPDATE_USER', payload: { user } });
  }, []);

  const setAuthenticationStatus = useCallback((status: AUTH_STATUS) => {
    dispatch({ type: 'STATUS', payload: { status } });
  }, []);

  const setTempUser = useCallback((tempUser: IAuthState['tempUser']) => {
    dispatch({ type: 'SET_TEMP_USER', payload: { tempUser } });
  }, []);

  const setTempToken = useCallback((tempToken: string) => {
    dispatch({ type: 'SET_TEMP_TOKEN', payload: { tempToken } });
  }, []);

  const setTempData = useCallback((tempData: IAuthState['tempData']) => {
    dispatch({ type: 'SET_TEMP_DATA', payload: { tempData } });
  }, []);

  const clearTempData = useCallback(() => {
    dispatch({ type: 'CLEAR_TEMP' });
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      logout,
      updateUser,
      setAuthenticationStatus,
      setTempUser,
      setTempToken,
      setTempData,
      clearTempData,
    }),
    [
      state,
      login,
      logout,
      updateUser,
      setAuthenticationStatus,
      setTempUser,
      setTempToken,
      setTempData,
      clearTempData,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
