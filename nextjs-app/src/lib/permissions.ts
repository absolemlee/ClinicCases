import { prisma } from '@/lib/prisma';

export interface UserPermissions {
  addCases: boolean;
  editCases: boolean;
  deleteCases: boolean;
  viewOthers: boolean;
}

export async function getUserPermissions(groupName: string | null): Promise<UserPermissions> {
  if (!groupName) {
    return {
      addCases: false,
      editCases: false,
      deleteCases: false,
      viewOthers: false,
    };
  }

  const group = await prisma.group.findFirst({
    where: { groupName },
  });

  if (!group) {
    return {
      addCases: false,
      editCases: false,
      deleteCases: false,
      viewOthers: false,
    };
  }

  return {
    addCases: group.addCases === 1,
    editCases: group.editCases === 1,
    deleteCases: group.deleteCases === 1,
    viewOthers: group.viewOthers === 1,
  };
}

export async function requirePermission(
  groupName: string | null,
  permission: keyof UserPermissions
): Promise<boolean> {
  const permissions = await getUserPermissions(groupName);
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
