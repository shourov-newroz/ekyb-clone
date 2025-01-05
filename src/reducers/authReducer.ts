import { LOCAL_STORAGE_KEYS } from '@/config/config';
import { AUTH_STATUS, IAuthState, IUser } from '@/types/auth';
import { authService } from '@/utils/authService';
import { localStorageUtil } from '@/utils/localStorageUtil';

export const authActionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  STATUS: 'STATUS',
  ERROR: 'ERROR',
  OPEN_AUTH_DIALOG: 'OPEN_AUTH_DIALOG',
  SET_TEMP_USER: 'SET_TEMP_USER',
  SET_TEMP_TOKEN: 'SET_TEMP_TOKEN',
  SET_TEMP_DATA: 'SET_TEMP_DATA',
  CLEAR_TEMP: 'CLEAR_TEMP',
} as const;

type ActionType = typeof authActionTypes;

type IAuthAction =
  | {
      type: ActionType['LOGIN'];
      payload: {
        user: IUser;
      };
    }
  | { type: ActionType['LOGOUT'] }
  | { type: ActionType['UPDATE_USER']; payload: { user: IUser } }
  | { type: ActionType['STATUS']; payload: { status: IAuthState['status'] } }
  | { type: ActionType['ERROR'] }
  | {
      type: ActionType['OPEN_AUTH_DIALOG'];
      payload: { isAuthModalOpen: boolean };
    }
  | {
      type: ActionType['SET_TEMP_USER'];
      payload: { tempUser: IAuthState['tempUser'] };
    }
  | {
      type: ActionType['SET_TEMP_TOKEN'];
      payload: { tempToken: string };
    }
  | {
      type: ActionType['SET_TEMP_DATA'];
      payload: { tempData: IAuthState['tempData'] };
    }
  | { type: ActionType['CLEAR_TEMP'] };

export const initialState: IAuthState = {
  user: localStorageUtil.getItem<IUser>(LOCAL_STORAGE_KEYS.USER),
  tempUser: localStorageUtil.getItem(LOCAL_STORAGE_KEYS.TEMP_USER),
  tempToken: localStorageUtil.getItem(LOCAL_STORAGE_KEYS.TEMP_TOKEN),
  isAuthenticated: !!localStorageUtil.getItem(LOCAL_STORAGE_KEYS.USER),
  status: localStorageUtil.getItem(LOCAL_STORAGE_KEYS.USER)
    ? AUTH_STATUS.SUCCEEDED
    : AUTH_STATUS.IDLE,
};

const updateLocalStorage = (user: IUser | null) => {
  if (user) {
    authService.saveUser(user);
  } else {
    authService.clearUser();
  }
};

const authReducer = (state: IAuthState, action: IAuthAction): IAuthState => {
  switch (action.type) {
    case authActionTypes.LOGIN:
      updateLocalStorage(action.payload.user);
      return {
        ...state,
        user: action.payload.user,
        tempUser: null,
        tempToken: null,
        isAuthenticated: true,
        status: AUTH_STATUS.SUCCEEDED,
      };
    case authActionTypes.LOGOUT:
      updateLocalStorage(null);
      return {
        ...initialState,
        user: null,
        tempUser: null,
        tempToken: null,
        isAuthenticated: false,
        status: AUTH_STATUS.IDLE,
      };
    case authActionTypes.UPDATE_USER:
      return { ...state, user: action.payload.user };
    case authActionTypes.STATUS:
      return { ...state, status: action.payload.status };
    case authActionTypes.SET_TEMP_USER:
      localStorageUtil.setItem(
        LOCAL_STORAGE_KEYS.TEMP_USER,
        action.payload.tempUser
      );
      return { ...state, tempUser: action.payload.tempUser };
    case authActionTypes.SET_TEMP_TOKEN:
      localStorageUtil.setItem(
        LOCAL_STORAGE_KEYS.TEMP_TOKEN,
        action.payload.tempToken
      );
      return { ...state, tempToken: action.payload.tempToken };
    case authActionTypes.SET_TEMP_DATA:
      return { ...state, tempData: action.payload.tempData };
    case authActionTypes.CLEAR_TEMP:
      localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.TEMP_USER);
      localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.TEMP_TOKEN);
      return { ...state, tempUser: null, tempToken: null, tempData: null };
    default:
      return state;
  }
};

export default authReducer;
