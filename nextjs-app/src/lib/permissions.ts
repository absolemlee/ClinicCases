import { prisma } from '@/lib/prisma';

/**
 * Permission and Role Management System
 * 
 * User Types (who they are):
 * - admin: System administrators
 * - attorney: Licensed attorneys
 * - paralegal: Certified paralegals
 * - intern: Students/interns
 * - staff: Administrative staff
 * 
 * Functional Abilities (what they can do):
 * - admin: System administration
 * - attorney: Legal practice
 * - researcher: Legal research tools
 * - investigator: Fact investigation tools
 * - clerk: Court filing tools
 * - staff: Administrative support
 */

// User type definitions
export const USER_TYPES = {
  ADMIN: 'admin',
  ATTORNEY: 'attorney',
  PARALEGAL: 'paralegal',
  INTERN: 'intern',
  STAFF: 'staff',
} as const;

// Functional ability definitions
export const ABILITIES = {
  ADMIN: 'admin',
  ATTORNEY: 'attorney',
  RESEARCHER: 'researcher',
  INVESTIGATOR: 'investigator',
  CLERK: 'clerk',
  STAFF: 'staff',
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];
export type Ability = typeof ABILITIES[keyof typeof ABILITIES];

// User interface with roles
export interface UserWithRoles {
  grp: string | null; // Format: "userType,ability1,ability2"
}

// Legacy permission interface for backward compatibility
export interface UserPermissions {
  addCases: boolean;
  editCases: boolean;
  deleteCases: boolean;
  viewOthers: boolean;
}

/**
 * Parse user's type and abilities from grp field
 */
export function parseUserRoles(grp: string | null): {
  userType: UserType | null;
  abilities: Ability[];
} {
  if (!grp) {
    return { userType: null, abilities: [] };
  }

  const roles = grp.split(',').map(r => r.trim());
  
  // First role is always the user type
  const userType = roles[0] as UserType;
  
  // Rest are abilities (including implicit ones from type)
  const abilities = roles.slice(1) as Ability[];
  
  // Add implicit abilities based on user type
  if (userType === USER_TYPES.ADMIN && !abilities.includes(ABILITIES.ADMIN)) {
    abilities.push(ABILITIES.ADMIN);
  }
  if (userType === USER_TYPES.ATTORNEY && !abilities.includes(ABILITIES.ATTORNEY)) {
    abilities.push(ABILITIES.ATTORNEY);
  }
  if ((userType === USER_TYPES.PARALEGAL || userType === USER_TYPES.STAFF) && 
      !abilities.includes(ABILITIES.STAFF)) {
    abilities.push(ABILITIES.STAFF);
  }

  return { userType, abilities };
}

/**
 * Get user's type
 */
export function getUserType(user: UserWithRoles): UserType | null {
  const { userType } = parseUserRoles(user.grp);
  return userType;
}

/**
 * Get user's abilities
 */
export function getUserAbilities(user: UserWithRoles): Ability[] {
  const { abilities } = parseUserRoles(user.grp);
  return abilities;
}

/**
 * Check if user has a specific ability
 */
export function hasAbility(user: UserWithRoles, ability: Ability): boolean {
  const { abilities } = parseUserRoles(user.grp);
  return abilities.includes(ability);
}

/**
 * Check if user has any of the specified abilities
 */
export function hasAnyAbility(user: UserWithRoles, abilities: Ability[]): boolean {
  const userAbilities = getUserAbilities(user);
  return abilities.some(ability => userAbilities.includes(ability));
}

/**
 * Check if user has all of the specified abilities
 */
export function hasAllAbilities(user: UserWithRoles, abilities: Ability[]): boolean {
  const userAbilities = getUserAbilities(user);
  return abilities.every(ability => userAbilities.includes(ability));
}

/**
 * Check if user is a specific type
 */
export function isUserType(user: UserWithRoles, type: UserType): boolean {
  return getUserType(user) === type;
}

/**
 * Check if user is an admin
 */
export function isAdmin(user: UserWithRoles): boolean {
  return isUserType(user, USER_TYPES.ADMIN);
}

/**
 * Check if user is an attorney
 */
export function isAttorney(user: UserWithRoles): boolean {
  return isUserType(user, USER_TYPES.ATTORNEY);
}

/**
 * Get display name for user type
 */
export function getUserTypeDisplay(type: UserType): string {
  const displays: Record<UserType, string> = {
    admin: 'Administrator',
    attorney: 'Attorney',
    paralegal: 'Paralegal',
    intern: 'Intern',
    staff: 'Staff',
  };
  return displays[type] || type;
}

/**
 * Get display name for ability
 */
export function getAbilityDisplay(ability: Ability): string {
  const displays: Record<Ability, string> = {
    admin: 'System Administration',
    attorney: 'Legal Practice',
    researcher: 'Legal Research',
    investigator: 'Fact Investigation',
    clerk: 'Court Filing',
    staff: 'Administrative Support',
  };
  return displays[ability] || ability;
}

/**
 * Get description for ability
 */
export function getAbilityDescription(ability: Ability): string {
  const descriptions: Record<Ability, string> = {
    admin: 'Full system access, user management, configuration',
    attorney: 'Legal document signing, court appearances, legal advice',
    researcher: 'Legal research database, research memos, case law citations',
    investigator: 'Witness interviews, evidence tracking, site visits',
    clerk: 'Court filings, docket calendar, filing deadlines',
    staff: 'Client intake, scheduling, document management',
  };
  return descriptions[ability] || '';
}

/**
 * Get icon for ability (emoji or icon name)
 */
export function getAbilityIcon(ability: Ability): string {
  const icons: Record<Ability, string> = {
    admin: '⚙️',
    attorney: '⚖️',
    researcher: '📚',
    investigator: '🔍',
    clerk: '📋',
    staff: '📂',
  };
  return icons[ability] || '•';
}

/**
 * Permission checking based on user type and abilities
 */
export const Permissions = {
  // Case permissions
  canAddCases(user: UserWithRoles): boolean {
    const type = getUserType(user);
    return type === USER_TYPES.ADMIN || 
           type === USER_TYPES.ATTORNEY || 
           type === USER_TYPES.PARALEGAL ||
           type === USER_TYPES.STAFF;
  },

  canEditOwnCases(user: UserWithRoles): boolean {
    const type = getUserType(user);
    return type !== null; // All user types can edit own cases
  },

  canEditAssignedCases(user: UserWithRoles): boolean {
    const type = getUserType(user);
    return type !== null; // All user types can edit assigned cases
  },

  canEditAllCases(user: UserWithRoles): boolean {
    const type = getUserType(user);
    return type === USER_TYPES.ADMIN || type === USER_TYPES.ATTORNEY;
  },

  canDeleteCases(user: UserWithRoles): boolean {
    return isAdmin(user) || isAttorney(user);
  },

  canViewAssignedCases(user: UserWithRoles): boolean {
    return getUserType(user) !== null; // All users can view assigned
  },

  canViewAllCases(user: UserWithRoles): boolean {
    const type = getUserType(user);
    return type === USER_TYPES.ADMIN || 
           type === USER_TYPES.ATTORNEY ||
           type === USER_TYPES.PARALEGAL ||
           type === USER_TYPES.STAFF;
  },

  // User management permissions
  canManageUsers(user: UserWithRoles): boolean {
    return isAdmin(user);
  },

  canViewUsers(user: UserWithRoles): boolean {
    return isAdmin(user);
  },

  // Group management permissions
  canManageGroups(user: UserWithRoles): boolean {
    return isAdmin(user);
  },

  // Journal permissions
  canWriteJournals(user: UserWithRoles): boolean {
    return getUserType(user) !== null; // All users can write journals
  },

  canReadOwnJournals(user: UserWithRoles): boolean {
    return getUserType(user) !== null;
  },

  canReadAllJournals(user: UserWithRoles): boolean {
    return isAdmin(user) || isAttorney(user);
  },

  // Board permissions
  canCreateBoardPosts(user: UserWithRoles): boolean {
    return isAdmin(user) || isAttorney(user);
  },

  canEditOwnPosts(user: UserWithRoles): boolean {
    return isAdmin(user) || isAttorney(user);
  },

  canEditAllPosts(user: UserWithRoles): boolean {
    return isAdmin(user);
  },

  canDeletePosts(user: UserWithRoles): boolean {
    return isAdmin(user);
  },

  // System permissions
  canAccessUtilities(user: UserWithRoles): boolean {
    return isAdmin(user);
  },

  canViewReports(user: UserWithRoles): boolean {
    return isAdmin(user) || isAttorney(user);
  },

  // Ability-specific permissions
  canUseResearchTools(user: UserWithRoles): boolean {
    return hasAbility(user, ABILITIES.RESEARCHER);
  },

  canUseInvestigationTools(user: UserWithRoles): boolean {
    return hasAbility(user, ABILITIES.INVESTIGATOR);
  },

  canUseCourtFilingTools(user: UserWithRoles): boolean {
    return hasAbility(user, ABILITIES.CLERK);
  },

  canUseAdminTools(user: UserWithRoles): boolean {
    return hasAbility(user, ABILITIES.ADMIN);
  },

  // Legal practice permissions
  canSignLegalDocuments(user: UserWithRoles): boolean {
    return hasAbility(user, ABILITIES.ATTORNEY);
  },

  canProvideLegalAdvice(user: UserWithRoles): boolean {
    return hasAbility(user, ABILITIES.ATTORNEY);
  },

  canMakeCourtAppearances(user: UserWithRoles): boolean {
    return hasAbility(user, ABILITIES.ATTORNEY);
  },
};

/**
 * Get all abilities that can be assigned to a user type
 */
export function getAvailableAbilities(userType: UserType): Ability[] {
  // Admin gets all abilities by default
  if (userType === USER_TYPES.ADMIN) {
    return [ABILITIES.ADMIN];
  }

  // Attorney can have all except admin
  if (userType === USER_TYPES.ATTORNEY) {
    return [
      ABILITIES.ATTORNEY, // Auto-included
      ABILITIES.RESEARCHER,
      ABILITIES.INVESTIGATOR,
      ABILITIES.CLERK,
    ];
  }

  // Paralegal can have most
  if (userType === USER_TYPES.PARALEGAL) {
    return [
      ABILITIES.STAFF, // Auto-included
      ABILITIES.RESEARCHER,
      ABILITIES.INVESTIGATOR,
      ABILITIES.CLERK,
    ];
  }

  // Intern can have research and investigation
  if (userType === USER_TYPES.INTERN) {
    return [
      ABILITIES.RESEARCHER,
      ABILITIES.INVESTIGATOR,
      ABILITIES.CLERK,
    ];
  }

  // Staff can have clerk
  if (userType === USER_TYPES.STAFF) {
    return [
      ABILITIES.STAFF, // Auto-included
      ABILITIES.CLERK,
    ];
  }

  return [];
}

// Legacy functions for backward compatibility
export async function getUserPermissions(groupName: string | null): Promise<UserPermissions> {
  if (!groupName) {
    return {
      addCases: false,
      editCases: false,
      deleteCases: false,
      viewOthers: false,
    };
  }

  // Handle multi-role by getting first role (user type)
  const primaryRole = groupName.split(',')[0].trim();

  const group = await prisma.group.findFirst({
    where: { groupName: primaryRole },
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
