'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 登录页、注册页或 API 路径不做校验，避免死循环
    if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api')) return;

    const fullPath =
      typeof window !== 'undefined'
        ? window.location.pathname + window.location.search
        : pathname;

    // 验证 JWT
    (async () => {
      try {
        const res = await fetch('/api/auth/check');

        if (!res.ok) {
          // 校验未通过，跳转登录
          router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
        }
      } catch (error) {
        // 网络错误等也认为未登录
        router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
      }
    })();
  }, [pathname, router]);

  return <>{children}</>;
}
