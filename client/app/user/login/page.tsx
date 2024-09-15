'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import FullPageSkeleton from '@/components/FullPageSkeleton';
import { useUser } from '@petercatai/assistant';
import { useFingerprint } from '@/app/hooks/useFingerprint';


const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN!;

export default function Login() {
  const { data: fingerprint } = useFingerprint()
  const { user: currentUser, isLoading } = useUser({ apiDomain, fingerprint: fingerprint?.visitorId || ''})
  const router = useRouter();
  
  const finishLogin = () => {
    if (window.opener) {
      window.opener.postMessage({ status: 'success' }, '*');
      window.close(); 
    } else {
      router.push('/market');
    }
  }

  useEffect(() => {
    if (!isLoading) {
      if (currentUser.id.startsWith('client|')) {
        location.href = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/login`;
      } else {
        finishLogin()
      }
    }
  }, [currentUser, isLoading]);

  return (
    <>
      <FullPageSkeleton />
    </>
  );
}