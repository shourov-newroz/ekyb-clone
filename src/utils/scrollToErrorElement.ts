import { ERROR_CLASS } from '@/config/config';

const scrollToErrorElement = () => {
  const firstError = document.querySelector(`.${ERROR_CLASS}`);
  firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export default scrollToErrorElement;
