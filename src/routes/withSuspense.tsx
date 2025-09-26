import { Suspense } from 'react';

export const withSuspense = (element: React.ReactNode, fallback: React.ReactNode = null) => {
  return <Suspense fallback={fallback}>{element}</Suspense>;
};
