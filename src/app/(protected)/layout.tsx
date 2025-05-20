import React, { Suspense } from 'react';
import RippleLoader from '../loading';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <Suspense fallback={<RippleLoader />}>
      {children}
    </Suspense>
  );
};

export default DashboardLayout;