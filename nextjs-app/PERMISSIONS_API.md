# Permission Helper API Reference

Quick reference guide for using the role-based permission system.

---

## 📦 Imports

### For Client Components
```typescript
import { 
  getUserType, 
  getUserAbilities, 
  hasAbility,
  isAdmin,
  isAttorney,
  Permissions,
  USER_TYPES,
  ABILITIES,
  type UserType,
  type Ability
} from '@/lib/permissions-client';
```

### For Server Components / API Routes
```typescript
import { 
  getUserType, 
  getUserAbilities, 
  hasAbility,
  Permissions 
} from '@/lib/permissions';
```

### For React Hooks
```typescript
import { 
  useRoles, 
  useAbilities,
  useCasePermissions,
  useUserManagement,
  useJournalPermissions,
  useBoardPermissions
} from '@/hooks/usePermissions';
```

---

## 🔑 Constants

### User Types
```typescript
USER_TYPES.ADMIN      // 'admin'
USER_TYPES.ATTORNEY   // 'attorney'
USER_TYPES.PARALEGAL  // 'paralegal'
USER_TYPES.INTERN     // 'intern'
USER_TYPES.STAFF      // 'staff'
```

### Abilities
```typescript
ABILITIES.ADMIN        // 'admin'
ABILITIES.ATTORNEY     // 'attorney'
ABILITIES.RESEARCHER   // 'researcher'
ABILITIES.INVESTIGATOR // 'investigator'
ABILITIES.CLERK        // 'clerk'
ABILITIES.STAFF        // 'staff'
```

---

## 🎯 Core Functions

### `parseUserRoles(grp: string | null)`
Parse the grp field into type and abilities.

```typescript
const { userType, abilities } = parseUserRoles("attorney,researcher,clerk");
// userType: 'attorney'
// abilities: ['attorney', 'researcher', 'clerk']
```

### `getUserType(user: UserWithRoles)`
Get the user's primary type.

```typescript
const user = { grp: "paralegal,researcher" };
const type = getUserType(user);
// Returns: 'paralegal'
```

### `getUserAbilities(user: UserWithRoles)`
Get all user abilities.

```typescript
const user = { grp: "intern,researcher,investigator" };
const abilities = getUserAbilities(user);
// Returns: ['researcher', 'investigator']
```

### `hasAbility(user: UserWithRoles, ability: Ability)`
Check if user has a specific ability.

```typescript
const user = { grp: "attorney,researcher" };
hasAbility(user, 'researcher');  // true
hasAbility(user, 'clerk');       // false
```

### `hasAnyAbility(user: UserWithRoles, abilities: Ability[])`
Check if user has any of the specified abilities.

```typescript
const user = { grp: "paralegal,clerk" };
hasAnyAbility(user, ['clerk', 'researcher']);  // true (has clerk)
```

### `hasAllAbilities(user: UserWithRoles, abilities: Ability[])`
Check if user has all of the specified abilities.

```typescript
const user = { grp: "paralegal,clerk,investigator" };
hasAllAbilities(user, ['clerk', 'investigator']);  // true
hasAllAbilities(user, ['clerk', 'researcher']);    // false
```

### `isUserType(user: UserWithRoles, type: UserType)`
Check if user is a specific type.

```typescript
const user = { grp: "attorney,researcher" };
isUserType(user, 'attorney');   // true
isUserType(user, 'paralegal');  // false
```

### `isAdmin(user: UserWithRoles)`
Shortcut to check if user is admin.

```typescript
const user = { grp: "admin" };
isAdmin(user);  // true
```

### `isAttorney(user: UserWithRoles)`
Shortcut to check if user is attorney.

```typescript
const user = { grp: "attorney,researcher" };
isAttorney(user);  // true
```

---

## 🎨 Display Functions

### `getUserTypeDisplay(type: UserType)`
Get display name for user type.

```typescript
getUserTypeDisplay('attorney');   // 'Attorney'
getUserTypeDisplay('paralegal');  // 'Paralegal'
```

### `getAbilityDisplay(ability: Ability)`
Get display name for ability.

```typescript
getAbilityDisplay('researcher');    // 'Legal Research'
getAbilityDisplay('investigator');  // 'Fact Investigation'
```

### `getAbilityDescription(ability: Ability)`
Get description for ability.

```typescript
getAbilityDescription('researcher');
// 'Legal research database, research memos, case law citations'
```

### `getAbilityIcon(ability: Ability)`
Get emoji icon for ability.

```typescript
getAbilityIcon('researcher');    // '📚'
getAbilityIcon('investigator');  // '🔍'
getAbilityIcon('clerk');         // '📋'
```

### `getAvailableAbilities(userType: UserType)`
Get abilities that can be assigned to a user type.

```typescript
getAvailableAbilities('attorney');
// ['attorney', 'researcher', 'investigator', 'clerk']

getAvailableAbilities('intern');
// ['researcher', 'investigator', 'clerk']
```

---

## 🔐 Permission Checking

The `Permissions` object provides semantic permission checks:

### Case Permissions
```typescript
Permissions.canAddCases(user)           // Can create new cases
Permissions.canEditOwnCases(user)       // Can edit own cases
Permissions.canEditAssignedCases(user)  // Can edit assigned cases
Permissions.canEditAllCases(user)       // Can edit any case
Permissions.canDeleteCases(user)        // Can delete cases
Permissions.canViewAssignedCases(user)  // Can view assigned cases
Permissions.canViewAllCases(user)       // Can view any case
```

### User/Group Management
```typescript
Permissions.canManageUsers(user)   // Can add/edit/delete users
Permissions.canViewUsers(user)     // Can view user list
Permissions.canManageGroups(user)  // Can manage user groups
```

### Journal Permissions
```typescript
Permissions.canWriteJournals(user)     // Can write journal entries
Permissions.canReadOwnJournals(user)   // Can read own journals
Permissions.canReadAllJournals(user)   // Can read all journals
```

### Board Permissions
```typescript
Permissions.canCreateBoardPosts(user)  // Can create posts
Permissions.canEditOwnPosts(user)      // Can edit own posts
Permissions.canEditAllPosts(user)      // Can edit any post
Permissions.canDeletePosts(user)       // Can delete posts
```

### System Permissions
```typescript
Permissions.canAccessUtilities(user)  // Can access utilities tab
Permissions.canViewReports(user)      // Can view reports
```

### Ability-Specific Permissions
```typescript
Permissions.canUseResearchTools(user)       // Has researcher ability
Permissions.canUseInvestigationTools(user)  // Has investigator ability
Permissions.canUseCourtFilingTools(user)    // Has clerk ability
Permissions.canUseAdminTools(user)          // Has admin ability
```

### Legal Practice Permissions
```typescript
Permissions.canSignLegalDocuments(user)   // Has attorney ability
Permissions.canProvideLegalAdvice(user)   // Has attorney ability
Permissions.canMakeCourtAppearances(user) // Has attorney ability
```

---

## 🪝 React Hooks

### `useRoles()`
Get current user's role information.

```typescript
function MyComponent() {
  const { userType, abilities, isAdmin, isAttorney } = useRoles();
  
  return (
    <div>
      <p>Type: {userType}</p>
      <p>Abilities: {abilities.join(', ')}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### `useAbilities()`
Get ability-specific permission checks.

```typescript
function ToolsMenu() {
  const { 
    hasAbility,
    canUseResearchTools,
    canUseInvestigationTools,
    canUseCourtFilingTools,
    canUseAdminTools 
  } = useAbilities();
  
  return (
    <div>
      {canUseResearchTools && <ResearchTool />}
      {canUseInvestigationTools && <InvestigationTool />}
      {canUseCourtFilingTools && <FilingTool />}
      {canUseAdminTools && <AdminTool />}
    </div>
  );
}
```

### `useCasePermissions()`
Get case-specific permissions.

```typescript
function CaseActions() {
  const { 
    canAddCases,
    canEditAllCases,
    canDeleteCases 
  } = useCasePermissions();
  
  return (
    <div>
      {canAddCases && <button>New Case</button>}
      {canEditAllCases && <button>Edit</button>}
      {canDeleteCases && <button>Delete</button>}
    </div>
  );
}
```

### `useUserManagement()`
Get user management permissions.

```typescript
function UserMenu() {
  const { canManageUsers, canManageGroups } = useUserManagement();
  
  return (
    <nav>
      {canManageUsers && <Link href="/users">Users</Link>}
      {canManageGroups && <Link href="/groups">Groups</Link>}
    </nav>
  );
}
```

### `useJournalPermissions()`
Get journal permissions.

```typescript
function JournalPage() {
  const { 
    canWriteJournals,
    canReadOwnJournals,
    canReadAllJournals 
  } = useJournalPermissions();
  
  // ... use permissions
}
```

### `useBoardPermissions()`
Get board permissions.

```typescript
function BoardPage() {
  const { 
    canCreateBoardPosts,
    canEditOwnPosts,
    canDeletePosts 
  } = useBoardPermissions();
  
  // ... use permissions
}
```

---

## 💡 Usage Patterns

### Pattern 1: Type-Based Access Control
```typescript
const user = { grp: session.user.group };

if (isAdmin(user)) {
  // Show admin features
} else if (isAttorney(user)) {
  // Show attorney features
} else {
  // Show default features
}
```

### Pattern 2: Ability-Based Feature Gates
```typescript
const user = { grp: session.user.group };

return (
  <div>
    {hasAbility(user, 'researcher') && <ResearchDashboard />}
    {hasAbility(user, 'investigator') && <InvestigationDashboard />}
    {hasAbility(user, 'clerk') && <FilingDashboard />}
  </div>
);
```

### Pattern 3: Permission-Based Actions
```typescript
const user = { grp: session.user.group };

if (!Permissions.canDeleteCases(user)) {
  return Response.json({ error: 'Unauthorized' }, { status: 403 });
}

// Proceed with delete
```

### Pattern 4: Multi-Ability Check
```typescript
const user = { grp: session.user.group };

// User needs EITHER research OR investigation ability
if (hasAnyAbility(user, ['researcher', 'investigator'])) {
  // Show legal tools
}

// User needs BOTH clerk AND staff ability
if (hasAllAbilities(user, ['clerk', 'staff'])) {
  // Show admin filing tools
}
```

### Pattern 5: Conditional UI Rendering
```typescript
function CaseDetailPage() {
  const { userType } = useRoles();
  const { canDeleteCases } = useCasePermissions();
  
  return (
    <div>
      <h1>Case Details</h1>
      
      {/* Show edit for all logged-in users */}
      <button>Edit</button>
      
      {/* Show delete only for admin/attorney */}
      {canDeleteCases && <button>Delete</button>}
      
      {/* Show supervisor notice for interns */}
      {userType === 'intern' && (
        <p className="text-yellow-300">
          ⚠️ Changes require supervisor approval
        </p>
      )}
    </div>
  );
}
```

---

## 🎨 UI Component Examples

### Ability Badge Component
```typescript
function AbilityBadge({ ability }: { ability: Ability }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md">
      <span>{getAbilityIcon(ability)}</span>
      <span>{ability}</span>
    </span>
  );
}

// Usage:
<AbilityBadge ability="researcher" />
```

### User Type Badge Component
```typescript
function UserTypeBadge({ type }: { type: UserType }) {
  return (
    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-500/20 border border-brand-500/30">
      <span className="text-sm font-medium text-brand-300">
        {getUserTypeDisplay(type)}
      </span>
    </div>
  );
}

// Usage:
<UserTypeBadge type="attorney" />
```

### Abilities List Component
```typescript
function AbilitiesList({ user }: { user: UserWithRoles }) {
  const abilities = getUserAbilities(user);
  
  if (abilities.length === 0) {
    return <span className="text-xs text-slate-500">Base permissions only</span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1.5">
      {abilities.map(ability => (
        <span 
          key={ability}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded"
          title={getAbilityDisplay(ability)}
        >
          <span>{getAbilityIcon(ability)}</span>
          <span>{ability}</span>
        </span>
      ))}
    </div>
  );
}
```

---

## 🧪 Test Examples

### Sample Users
```typescript
// Full admin
const admin = { grp: "admin" };
isAdmin(admin);  // true
Permissions.canManageUsers(admin);  // true

// Attorney with research
const attorney = { grp: "attorney,researcher" };
isAttorney(attorney);  // true
hasAbility(attorney, 'researcher');  // true
Permissions.canSignLegalDocuments(attorney);  // true

// Paralegal with multiple abilities
const paralegal = { grp: "paralegal,clerk,investigator" };
getUserType(paralegal);  // 'paralegal'
getUserAbilities(paralegal);  // ['staff', 'clerk', 'investigator']
hasAllAbilities(paralegal, ['clerk', 'investigator']);  // true

// Intern researcher
const intern = { grp: "intern,researcher" };
getUserType(intern);  // 'intern'
hasAbility(intern, 'researcher');  // true
Permissions.canDeleteCases(intern);  // false

// Staff with filing ability
const staff = { grp: "staff,clerk" };
getUserType(staff);  // 'staff'
hasAbility(staff, 'clerk');  // true
Permissions.canAddCases(staff);  // true
```

---

## 📖 Related Documentation

- **USER_ROLES_RESTRUCTURED.md** - Complete role structure guide
- **USER_ROLES_IMPLEMENTATION.md** - Implementation summary
- **USER_ROLES_QUICK.md** - Quick reference card

---

**Last Updated**: January 2025
