'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { 
  getUserType, 
  getUserAbilities, 
  hasAbility as checkAbility,
  isAdmin,
  isAttorney,
  Permissions,
  type UserType, 
  type Ability 
} from '@/lib/permissions-client';

// Legacy interface for backward compatibility
export interface UserPermissions {
  addCases: boolean;
  editCases: boolean;
  deleteCases: boolean;
  viewOthers: boolean;
}

// New role-based interface
export interface RoleInfo {
  userType: UserType | null;
  abilities: Ability[];
  isAdmin: boolean;
  isAttorney: boolean;
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

/**
 * Hook for role-based information
 */
export function useRoles(): RoleInfo {
  const { data: session } = useSession();
  
  const userType = getUserType({ grp: session?.user?.group || null });
  const abilities = getUserAbilities({ grp: session?.user?.group || null });
  
  return {
    userType,
    abilities,
    isAdmin: isAdmin({ grp: session?.user?.group || null }),
    isAttorney: isAttorney({ grp: session?.user?.group || null }),
  };
}

/**
 * Hook for checking abilities
 */
export function useAbilities() {
  const { data: session } = useSession();
  const user = { grp: session?.user?.group || null };

  return {
    hasAbility: (ability: Ability) => checkAbility(user, ability),
    canUseResearchTools: Permissions.canUseResearchTools(user),
    canUseInvestigationTools: Permissions.canUseInvestigationTools(user),
    canUseCourtFilingTools: Permissions.canUseCourtFilingTools(user),
    canUseAdminTools: Permissions.canUseAdminTools(user),
    canSignLegalDocuments: Permissions.canSignLegalDocuments(user),
    canProvideLegalAdvice: Permissions.canProvideLegalAdvice(user),
    canMakeCourtAppearances: Permissions.canMakeCourtAppearances(user),
  };
}

/**
 * Hook for case permissions
 */
export function useCasePermissions() {
  const { data: session } = useSession();
  const user = { grp: session?.user?.group || null };

  return {
    canAddCases: Permissions.canAddCases(user),
    canEditOwnCases: Permissions.canEditOwnCases(user),
    canEditAssignedCases: Permissions.canEditAssignedCases(user),
    canEditAllCases: Permissions.canEditAllCases(user),
    canDeleteCases: Permissions.canDeleteCases(user),
    canViewAssignedCases: Permissions.canViewAssignedCases(user),
    canViewAllCases: Permissions.canViewAllCases(user),
  };
}

/**
 * Hook for user management permissions
 */
export function useUserManagement() {
  const { data: session } = useSession();
  const user = { grp: session?.user?.group || null };

  return {
    canManageUsers: Permissions.canManageUsers(user),
    canViewUsers: Permissions.canViewUsers(user),
    canManageGroups: Permissions.canManageGroups(user),
  };
}

/**
 * Hook for journal permissions
 */
export function useJournalPermissions() {
  const { data: session } = useSession();
  const user = { grp: session?.user?.group || null };

  return {
    canWriteJournals: Permissions.canWriteJournals(user),
    canReadOwnJournals: Permissions.canReadOwnJournals(user),
    canReadAllJournals: Permissions.canReadAllJournals(user),
  };
}

/**
 * Hook for board permissions
 */
export function useBoardPermissions() {
  const { data: session } = useSession();
  const user = { grp: session?.user?.group || null };

  return {
    canCreateBoardPosts: Permissions.canCreateBoardPosts(user),
    canEditOwnPosts: Permissions.canEditOwnPosts(user),
    canEditAllPosts: Permissions.canEditAllPosts(user),
    canDeletePosts: Permissions.canDeletePosts(user),
  };
}

// Legacy helper functions for backward compatibility
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
