# User Roles & Permissions System

**Date**: October 14, 2025  
**Status**: 🚧 In Progress

## Current State

### Existing Roles (2)
1. **Administrators** (`admin`)
   - ✅ Add Cases
   - ✅ Edit Cases
   - ✅ Delete Cases
   - ✅ View Others' Cases
   - ✅ Write Journals
   - ✅ Read Journals
   - Tabs: Home, Cases, Users, Board, Utilities, Messages

2. **Students** (`student`)
   - ❌ Add Cases
   - ❌ Edit Cases
   - ❌ Delete Cases
   - ❌ View Others' Cases
   - ❌ Write Journals
   - ❌ Read Journals
   - Tabs: Home, Cases, Messages

## Proposed Role Structure

### Clinical/Legal Context Roles

> **Note on Multiple Roles**: Users can have multiple functional roles (e.g., someone can be both a Paralegal AND a Researcher). The system combines permissions from all assigned roles. See "Multi-Role Assignments" section below.

#### 1. **Administrator** (`admin`)
**Purpose**: System management, full oversight  
**Typical Users**: IT staff, clinic directors, system managers

**Permissions**:
- ✅ All case operations (add, edit, delete)
- ✅ View all cases
- ✅ Manage users and groups
- ✅ System configuration (utilities)
- ✅ Full journal access (read/write)
- ✅ Board announcements (create/edit/delete)
- ✅ Message all users
- ✅ Access all features

**Tabs**: All (Home, Cases, Users, Groups, Board, Utilities, Messages, Journals, Preferences)

**Primary Role**: Yes (cannot be combined with other roles)

---

#### 2. **Supervising Attorney/Professor** (`supervisor`)
**Purpose**: Oversight of students and cases, teaching  
**Typical Users**: Clinical professors, supervising attorneys, clinic managers

**Permissions**:
- ✅ All case operations (add, edit, delete)
- ✅ View all cases (supervisory access)
- ✅ Assign cases to students
- ✅ Read all journals (supervisory oversight)
- ✅ Write journals
- ✅ Board announcements (create/edit)
- ✅ Message students and staff
- ⚠️ Limited user management (can activate/deactivate students)
- ❌ No system utilities access

**Tabs**: Home, Cases, Board, Messages, Journals, Preferences

**Primary Role**: Yes (cannot be combined with functional roles)

---

#### 3. **Attorney** (`attorney`)
**Purpose**: Licensed attorney handling cases  
**Typical Users**: Staff attorneys, clinic attorneys, visiting practitioners

**Permissions**:
- ✅ Add cases
- ✅ Edit own cases
- ✅ Edit assigned cases
- ✅ Delete own cases (with approval)
- ✅ View assigned cases
- ⚠️ View others' cases (read-only, for consultation)
- ✅ Write journals
- ✅ Read journals (assigned cases)
- ✅ Board announcements (create/edit own)
- ✅ Message case team
- ✅ Sign legal documents
- ✅ Appear in court (case events)
- ❌ No user management
- ❌ No system utilities

**Tabs**: Home, Cases, Board, Messages, Journals, Preferences

**Primary Role**: Yes (can be combined with functional roles like Researcher)

---

#### 4. **Student** (`student`)
**Purpose**: Learn while working on assigned cases under supervision  
**Typical Users**: Law students, clinical students

**Permissions**:
- ⚠️ Add cases (requires approval)
- ✅ Edit assigned cases (supervised)
- ❌ Delete cases
- ✅ View assigned cases only
- ❌ View others' cases
- ✅ Write journals (own work, learning reflections)
- ⚠️ Read journals (assigned cases only)
- ✅ View board announcements
- ✅ Message case team
- ⚠️ Draft documents (requires attorney review)
- ⚠️ Case research (assigned topics)
- ❌ No user management
- ❌ No system utilities

**Tabs**: Home, Cases, Board, Messages, Journals, Preferences

**Primary Role**: Yes (can be combined with functional roles like Researcher, Investigator)

---

### Functional Roles (Can Be Combined)

> **Key Concept**: These roles are **additive** and focus on specific functions. A user with a primary role (Attorney, Student, etc.) can also have one or more functional roles. For example, a Student can also be assigned Researcher + Investigator roles to enable those specific toolsets.

#### 5. **Researcher** (`researcher`)
**Purpose**: Legal research, case law analysis, memo writing  
**Typical Users**: Can be assigned to students, attorneys, dedicated research staff

**Additional Permissions** (added to primary role):
- ✅ Access to research tools/databases
- ✅ Legal research document templates
- ✅ Research memo creation
- ✅ Case law annotation tools
- ✅ Research assignment tracking
- ✅ Create/edit research notes in cases
- ✅ Tag cases with research topics
- ✅ Access research library resources

**Special Features**:
- Research task assignment and tracking
- Legal citation management
- Research memo templates
- Case law database integration
- Research hour logging

**Can Be Combined With**: Attorney, Student, Clerk, Paralegal

---

#### 6. **Investigator** (`investigator`)
**Purpose**: Fact investigation, witness interviews, evidence gathering  
**Typical Users**: Can be assigned to students, attorneys, dedicated investigators, paralegals

**Additional Permissions** (added to primary role):
- ✅ Access to investigation tools
- ✅ Witness interview forms/templates
- ✅ Evidence tracking and logging
- ✅ Investigation timeline creation
- ✅ Photo/document upload for evidence
- ✅ Create/edit investigation notes
- ✅ Site visit documentation
- ✅ Chain of custody tracking

**Special Features**:
- Investigation checklist templates
- Witness contact management
- Evidence inventory system
- Investigation timeline builder
- Field notes and photos
- GPS location tagging for site visits

**Can Be Combined With**: Attorney, Student, Paralegal, Clerk

---

#### 7. **Clerk** (`clerk`)
**Purpose**: Court filings, docket management, administrative case processing  
**Typical Users**: Can be assigned to students, paralegals, dedicated court clerks

**Additional Permissions** (added to primary role):
- ✅ Access to court filing tools
- ✅ Docket calendar management
- ✅ Court document preparation
- ✅ Filing deadline tracking
- ✅ Court appearance scheduling
- ✅ Service of process tracking
- ✅ Create/edit court events
- ✅ Generate court-specific forms

**Special Features**:
- Court calendar integration
- Filing deadline calculator
- Court forms library
- Service of process tracking
- Court appearance reminders
- Docket number management
- E-filing integration (future)

**Can Be Combined With**: Student, Paralegal, Attorney

---

#### 8. **Paralegal** (`paralegal`)
**Purpose**: General legal support, document management, client communication  
**Typical Users**: Certified paralegals, legal assistants

**Permissions**:
- ✅ Add cases (intake)
- ✅ Edit assigned cases
- ❌ Delete cases
- ✅ View assigned cases
- ⚠️ View others' cases (read-only, for coordination)
- ✅ Write journals (case updates)
- ✅ Read journals (assigned cases)
- ✅ Document management (upload, organize)
- ✅ Client intake and communication
- ✅ Appointment scheduling
- ✅ View board announcements
- ✅ Message case team
- ❌ No user management
- ❌ No system utilities

**Special Features**:
- Client intake forms
- Document templates
- Time tracking
- Appointment calendaring
- Task management
- Client communication logs

**Tabs**: Home, Cases, Board, Messages, Journals, Preferences

**Primary Role**: Yes (can be combined with Researcher, Investigator, Clerk)

---

#### 9. **Intern/Observer** (`intern`)
**Purpose**: Observe and learn, minimal access  
**Typical Users**: Pre-law interns, observers, volunteers, shadowing students

**Permissions**:
- ❌ Add cases
- ❌ Edit cases
- ❌ Delete cases
- ✅ View assigned cases only (read-only)
- ❌ View others' cases
- ✅ Write journals (reflections only)
- ❌ Read others' journals
- ✅ View board announcements
- ⚠️ Limited messaging (can receive, limited sending)
- ❌ No user management
- ❌ No system utilities

**Tabs**: Home, Cases (read-only), Board, Messages (limited), Journals, Preferences

**Primary Role**: Yes (minimal functional role combinations)

---

#### 10. **Auditor** (`auditor`)
**Purpose**: Compliance review, auditing, reporting  
**Typical Users**: Compliance officers, external auditors, grant reviewers

**Permissions**:
- ❌ Add cases
- ❌ Edit cases
- ❌ Delete cases
- ✅ View all cases (read-only)
- ❌ No case modifications
- ✅ Read all journals (audit purposes)
- ⚠️ Write journals (audit notes only)
- ✅ View board announcements
- ⚠️ Limited messaging (official communications only)
- ❌ No user management
- ⚠️ Limited utilities (reports only)

**Tabs**: Home, Cases (read-only), Board, Messages (limited), Journals (read-only), Utilities (reports), Preferences

**Primary Role**: Yes (cannot be combined)

---

## Multi-Role Assignments

### Concept
Users can have **one primary role** (defines base permissions) and **multiple functional roles** (add specific tool access).

### Examples

**Example 1: Student Who Researches**
- Primary Role: `student`
- Functional Roles: `researcher`
- **Result**: Student permissions + research tools access

**Example 2: Attorney Who Investigates**
- Primary Role: `attorney`
- Functional Roles: `investigator`
- **Result**: Attorney permissions + investigation tools

**Example 3: Paralegal Who Does Everything**
- Primary Role: `paralegal`
- Functional Roles: `researcher`, `investigator`, `clerk`
- **Result**: Paralegal permissions + all three functional toolsets

**Example 4: Student Investigator/Researcher**
- Primary Role: `student`
- Functional Roles: `investigator`, `researcher`
- **Result**: Student permissions + investigation tools + research tools

### Implementation in Database

```typescript
// User table
grp: "student,researcher,investigator"  // Comma-separated roles

// Or future enhancement with many-to-many relationship
UserRoles {
  userId: 1
  roles: ["student", "researcher", "investigator"]
  primaryRole: "student"
}
```

---

## Permission Matrix

### Primary Roles

| Permission                  | Admin | Supervisor | Attorney | Student | Paralegal | Intern | Auditor |
|-----------------------------|-------|------------|----------|---------|-----------|--------|---------|
| **Cases**                   |       |            |          |         |           |        |         |
| Add Cases                   | ✅     | ✅          | ✅        | ⚠️      | ✅         | ❌      | ❌       |
| Edit Own Cases              | ✅     | ✅          | ✅        | ✅       | ✅         | ❌      | ❌       |
| Edit Assigned Cases         | ✅     | ✅          | ✅        | ✅       | ✅         | ❌      | ❌       |
| Edit All Cases              | ✅     | ✅          | ❌        | ❌       | ❌         | ❌      | ❌       |
| Delete Cases                | ✅     | ✅          | ⚠️       | ❌       | ❌         | ❌      | ❌       |
| View Own Cases              | ✅     | ✅          | ✅        | ✅       | ✅         | ✅      | ✅       |
| View Assigned Cases         | ✅     | ✅          | ✅        | ✅       | ✅         | ✅      | ✅       |
| View All Cases              | ✅     | ✅          | ⚠️       | ❌       | ⚠️        | ❌      | ✅       |
| **Users**                   |       |            |          |         |           |        |         |
| View Users                  | ✅     | ⚠️         | ❌        | ❌       | ❌         | ❌      | ❌       |
| Add Users                   | ✅     | ❌          | ❌        | ❌       | ❌         | ❌      | ❌       |
| Edit Users                  | ✅     | ⚠️         | ❌        | ❌       | ❌         | ❌      | ❌       |
| Delete Users                | ✅     | ❌          | ❌        | ❌       | ❌         | ❌      | ❌       |
| **Groups**                  |       |            |          |         |           |        |         |
| View Groups                 | ✅     | ❌          | ❌        | ❌       | ❌         | ❌      | ❌       |
| Manage Groups               | ✅     | ❌          | ❌        | ❌       | ❌         | ❌      | ❌       |
| **Journals**                |       |            |          |         |           |        |         |
| Write Journals              | ✅     | ✅          | ✅        | ✅       | ✅         | ✅      | ⚠️      |
| Read Own Journals           | ✅     | ✅          | ✅        | ✅       | ✅         | ✅      | ✅       |
| Read Assigned Journals      | ✅     | ✅          | ✅        | ⚠️      | ✅         | ❌      | ✅       |
| Read All Journals           | ✅     | ✅          | ❌        | ❌       | ❌         | ❌      | ✅       |
| **Board**                   |       |            |          |         |           |        |         |
| View Board                  | ✅     | ✅          | ✅        | ✅       | ✅         | ✅      | ✅       |
| Create Posts                | ✅     | ✅          | ✅        | ❌       | ❌         | ❌      | ❌       |
| Edit Own Posts              | ✅     | ✅          | ✅        | ❌       | ❌         | ❌      | ❌       |
| Edit All Posts              | ✅     | ✅          | ❌        | ❌       | ❌         | ❌      | ❌       |
| Delete Posts                | ✅     | ✅          | ⚠️       | ❌       | ❌         | ❌      | ❌       |
| **Messages**                |       |            |          |         |           |        |         |
| Send Messages               | ✅     | ✅          | ✅        | ✅       | ✅         | ⚠️     | ⚠️      |
| Message All                 | ✅     | ✅          | ❌        | ❌       | ❌         | ❌      | ❌       |
| **Utilities**               |       |            |          |         |           |        |         |
| System Configuration        | ✅     | ❌          | ❌        | ❌       | ❌         | ❌      | ❌       |
| View Reports                | ✅     | ✅          | ⚠️       | ❌       | ⚠️        | ❌      | ✅       |

### Functional Roles (Additive)

| Tool/Feature                | Researcher | Investigator | Clerk | Paralegal |
|-----------------------------|------------|--------------|-------|-----------|
| **Research Tools**          |            |              |       |           |
| Legal Research Database     | ✅          | ❌            | ❌     | ⚠️        |
| Research Memo Templates     | ✅          | ❌            | ❌     | ❌         |
| Case Law Citations          | ✅          | ❌            | ⚠️    | ❌         |
| Research Task Tracking      | ✅          | ❌            | ❌     | ❌         |
| Research Notes              | ✅          | ⚠️           | ❌     | ⚠️        |
| **Investigation Tools**     |            |              |       |           |
| Witness Interview Forms     | ❌          | ✅            | ❌     | ⚠️        |
| Evidence Tracking           | ❌          | ✅            | ⚠️    | ✅         |
| Investigation Timeline      | ❌          | ✅            | ❌     | ❌         |
| Photo/Document Upload       | ⚠️         | ✅            | ⚠️    | ✅         |
| Site Visit Documentation    | ❌          | ✅            | ❌     | ❌         |
| Chain of Custody            | ❌          | ✅            | ⚠️    | ⚠️        |
| **Court/Filing Tools**      |            |              |       |           |
| Court Filing Management     | ❌          | ❌            | ✅     | ✅         |
| Docket Calendar             | ❌          | ❌            | ✅     | ✅         |
| Court Document Prep         | ⚠️         | ❌            | ✅     | ✅         |
| Filing Deadline Tracking    | ❌          | ❌            | ✅     | ✅         |
| Service of Process          | ❌          | ⚠️           | ✅     | ✅         |
| Court Forms Library         | ❌          | ❌            | ✅     | ✅         |
| **General Support Tools**   |            |              |       |           |
| Document Management         | ⚠️         | ⚠️           | ✅     | ✅         |
| Client Intake               | ❌          | ❌            | ⚠️    | ✅         |
| Appointment Scheduling      | ❌          | ⚠️           | ✅     | ✅         |
| Time Tracking               | ✅          | ✅            | ✅     | ✅         |
| Task Management             | ✅          | ✅            | ✅     | ✅         |

**Legend**:
- ✅ = Full access
- ⚠️ = Limited/conditional access
- ❌ = No access

---

## Implementation Plan

### Phase 1: Database Schema Updates ✅
- [x] Schema already supports all needed fields
- [x] Permission fields exist in Group model

### Phase 2: Seed Additional Roles
- [ ] Create 5 additional group definitions
- [ ] Update seed.ts with all role definitions
- [ ] Create sample users for each role

### Phase 3: Permission Checking Middleware
- [ ] Create permission helper functions
- [ ] Add middleware to API routes
- [ ] Implement role-based UI hiding

### Phase 4: UI Updates
- [ ] Update Groups page to show all permissions
- [ ] Create role assignment UI
- [ ] Add permission indicators in navigation
- [ ] Show role-based help text

### Phase 5: Documentation
- [ ] User guide for each role
- [ ] Administrator guide for role management
- [ ] Permission troubleshooting guide

---

## Database Fields for Permissions

### Group Model (cm_groups)
```prisma
model Group {
  id             Int
  groupName      String      // admin, supervisor, attorney, student, etc.
  displayName    String      // "Administrators", "Supervisors", etc.
  description    String?
  allowedTabs    String?     // Serialized array of tab names
  addCases       Int         // Can create new cases
  editCases      Int         // Can edit cases
  deleteCases    Int         // Can delete cases
  viewOthers     Int         // Can view cases not assigned to them
  writesJournals Int         // Can write journal entries
  readsJournals  Int         // Can read journals
}
```

### Additional Fields Needed (Future Enhancement)
```prisma
// Future extensions:
  manageUsers      Int  // Can add/edit users
  manageGroups     Int  // Can modify groups/permissions
  accessUtilities  Int  // Can access system utilities
  createBoard      Int  // Can create board posts
  editAllBoard     Int  // Can edit any board post
  messageAll       Int  // Can message all users
  viewReports      Int  // Can access reports
  approveActions   Int  // Can approve student actions
```

---

## Practical Use Cases

### Scenario 1: Law Student Working on Case
**User**: Sarah (Law Student, 2L)
**Assigned Roles**: `student`, `researcher`, `investigator`

**What Sarah Can Do**:
- View and edit her assigned cases (student permission)
- Use research tools to find case law (researcher tools)
- Conduct witness interviews and log evidence (investigator tools)
- Write journal entries about her work
- Message her supervising attorney

**What Sarah Cannot Do**:
- View cases she's not assigned to
- Delete any cases
- Add new cases without approval
- Access system utilities
- Manage other users

---

### Scenario 2: Paralegal Supporting Multiple Attorneys
**User**: Maria (Certified Paralegal)
**Assigned Roles**: `paralegal`, `clerk`, `investigator`

**What Maria Can Do**:
- Manage client intake and documentation (paralegal)
- Handle court filings and docket management (clerk)
- Conduct factual investigations when needed (investigator)
- Coordinate across multiple cases for scheduling
- Upload and organize documents

**What Maria Cannot Do**:
- Provide legal advice or sign legal documents
- Delete cases
- Access other attorneys' cases (unless assigned)
- Manage system settings

---

### Scenario 3: Staff Attorney Who Also Mentors
**User**: David (Licensed Attorney)
**Assigned Roles**: `attorney`, `researcher`

**What David Can Do**:
- Handle his own cases independently (attorney)
- Supervise student work on assigned cases
- Conduct complex legal research (researcher tools)
- Sign pleadings and legal documents
- View cases for consultation purposes

**What David Cannot Do**:
- View all cases (only assigned + consultation access)
- Manage users or system settings
- Access supervisor-only features

---

### Scenario 4: Graduate Research Assistant
**User**: Alex (Graduate Student)
**Assigned Roles**: `researcher`, `clerk`

**What Alex Can Do**:
- Conduct legal research for multiple cases (researcher)
- Help prepare court documents (clerk)
- Access research databases
- Track filing deadlines

**What Alex Cannot Do**:
- Access full case details
- Communicate directly with clients
- Make court appearances
- Edit case information

---

## Implementation Strategy

### Phase 1: Core Roles Setup ✅
**Primary Roles** (Must have one):
1. Administrator
2. Supervisor
3. Attorney
4. Student
5. Paralegal
6. Intern
7. Auditor

### Phase 2: Functional Roles ✅
**Additive Roles** (Can have multiple):
8. Researcher
9. Investigator
10. Clerk

### Phase 3: Database Implementation

#### Option A: Simple (Current Schema Compatible)
```typescript
// Store multiple roles as comma-separated string
User {
  grp: "student,researcher,investigator"
}

// Parse roles in application
const roles = user.grp.split(',');
const isPrimary = (role) => ['admin', 'supervisor', 'attorney', 'student', 'paralegal', 'intern', 'auditor'].includes(role);
const isFunctional = (role) => ['researcher', 'investigator', 'clerk'].includes(role);
```

#### Option B: Enhanced (Future Schema)
```prisma
model User {
  id              Int
  username        String
  primaryRole     String  // One of: admin, supervisor, attorney, student, etc.
  functionalRoles String? // Comma-separated: researcher,investigator,clerk
  roles           UserRole[] // Many-to-many relationship
}

model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id])
  role   Role @relation(fields: [roleId], references: [id])
}

model Role {
  id          Int
  roleName    String @unique
  roleType    String // "primary" or "functional"
  permissions Json   // Flexible permission storage
}
```

### Phase 4: Permission Checking

```typescript
// Helper function to check permissions
function hasPermission(user: User, permission: string): boolean {
  const roles = user.grp.split(',');
  
  // Check primary role permissions
  const primaryRole = roles.find(r => isPrimaryRole(r));
  if (rolePermissions[primaryRole]?.[permission]) {
    return true;
  }
  
  // Check functional role permissions
  const functionalRoles = roles.filter(r => isFunctionalRole(r));
  return functionalRoles.some(role => 
    functionalPermissions[role]?.[permission]
  );
}

// Usage in API routes
if (!hasPermission(user, 'research.database.access')) {
  return res.status(403).json({ error: 'Research tools not enabled for your role' });
}
```

### Phase 5: UI Adaptation

```typescript
// Show/hide features based on roles
const roles = useRoles(); // Hook to get user roles

// Show research tools only if user has researcher role
{roles.includes('researcher') && (
  <ResearchToolsSection />
)}

// Show investigation tools only if user has investigator role
{roles.includes('investigator') && (
  <InvestigationToolsSection />
)}

// Combine permissions
{(roles.includes('attorney') || roles.includes('supervisor')) && (
  <SupervisoryFeatures />
)}
```

---

## Next Steps

### Immediate Actions
1. ✅ **Document role structure** (Complete)
2. ⬜ **Update seed.ts** with all 10 roles
3. ⬜ **Create role helper utilities** for permission checking
4. ⬜ **Add role selection UI** in user management
5. ⬜ **Implement role-based navigation** showing/hiding tabs

### Implementation Phases

**Phase 1** (2-3 hours): Core 7 Primary Roles
- Update Group model seed
- Create all primary role definitions
- Basic permission checking

**Phase 2** (1-2 hours): Add 3 Functional Roles
- Add functional role groups
- Implement multi-role parsing
- Update permission helpers

**Phase 3** (2-3 hours): UI Integration
- Role selection dropdowns (multi-select for functional)
- Permission-based feature showing/hiding
- Role indicators in navigation

**Phase 4** (1-2 hours): Testing
- Create test users for each role combination
- Test all permission scenarios
- Document edge cases

---

## Ready to Implement?

I can now proceed with:

**Option A**: Implement all 10 roles (7 primary + 3 functional)
- Most complete solution
- Supports all use cases described above
- ~4-5 hours total implementation

**Option B**: Implement core 5 roles first (admin, supervisor, attorney, student, paralegal)
- Cover 90% of use cases
- Add functional roles later
- ~2-3 hours implementation

**Option C**: Implement with simplified multi-role support
- Current schema (comma-separated)
- Quicker implementation
- Can enhance later

Which approach would you like me to take?
