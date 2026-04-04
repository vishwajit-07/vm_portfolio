'use client';
/**
 * ClientOnlyEffects — wraps components that use browser APIs (canvas, window)
 * and must not be SSR'd. Using next/dynamic with ssr:false is only allowed
 * inside Client Components per Next.js 16.
 */
import dynamic from 'next/dynamic';

const LiveBackground = dynamic(() => import('@/components/ui/LiveBackground'), {
  ssr: false,
});

export default function ClientOnlyEffects() {
  return (
    <>
      <LiveBackground />
    </>
  );
}
