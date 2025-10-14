'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export interface UserPermissions {
  addCases: boolean;
  editCases: boolean;
  deleteCases: boolean;
  viewOthers: boolean;
}

export function usePermissions() {
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<UserPermissions>({
    addCases: false,
    editCases: false,
    deleteCases: false,
    viewOthers: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      if (!session?.user?.group) {
        setPermissions({
          addCases: false,
          editCases: false,
          deleteCases: false,
          viewOthers: false,
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/permissions?group=${encodeURIComponent(session.user.group)}`);
        const data = await res.json();
        
        if (data.success) {
          setPermissions(data.data);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, [session?.user?.group]);

  return { permissions, loading };
}

export function hasPermission(permissions: UserPermissions, permission: keyof UserPermissions): boolean {
  return permissions[permission];
}

export function hasAnyPermission(
  permissions: UserPermissions,
  requiredPermissions: (keyof UserPermissions)[]
): boolean {
  return requiredPermissions.some((perm) => permissions[perm]);
}

export function hasAllPermissions(
  permissions: UserPermissions,
  requiredPermissions: (keyof UserPermissions)[]
): boolean {
  return requiredPermissions.every((perm) => permissions[perm]);
}
