'use client';

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { ExtendedUser } from '@/next-auth';

export const useCurrentUser = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();

      setUser(session?.user || null);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
};
