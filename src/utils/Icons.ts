import { AiOutlineProduct } from 'react-icons/ai';
import { CiBank, CiCalendar, CiMobile1 } from 'react-icons/ci';
import { FaAngleLeft, FaBuilding, FaUser } from 'react-icons/fa';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import { LuRefreshCcw, LuShieldCheck } from 'react-icons/lu';
import { MdLogin, MdLogout } from 'react-icons/md';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import { TbTransactionDollar } from 'react-icons/tb';
import { TfiEmail } from 'react-icons/tfi';

export const RightArrowIcon = SlArrowRight;
export const DownArrowIcon = SlArrowDown;
export const BuildingIcon = FaBuilding;
export const OwnershipIcon = FaUser;
export const TransactionIcon = TbTransactionDollar;
export const BankIcon = CiBank;
export const ProductIcon = AiOutlineProduct;
export const RegulatoryIcon = LuShieldCheck;

export const CalendarIcon = CiCalendar;
export const AddIcon = IoMdAddCircleOutline;
export const RemoveIcon = IoMdRemoveCircleOutline;
export const LogoutIcon = MdLogout;
export const LoginIcon = MdLogin;

export const RefreshIcon = LuRefreshCcw;
export const MailIcon = TfiEmail;
export const MobileIcon = CiMobile1;
export const BackIcon = FaAngleLeft;

export type IconType = typeof SlArrowRight;
