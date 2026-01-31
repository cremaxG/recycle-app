import React, { ReactNode } from 'react';
import Toast from 'react-native-toast-message';
import toastConfig from '../components/CustomToast';

type Props = {
  children: ReactNode;
};

const ToastProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
};

export default ToastProvider;
