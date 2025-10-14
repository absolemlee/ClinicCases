# User Roles System - Restructured

**Date**: October 14, 2025  
**Status**: 🔄 Revised Structure

## Core Concept

Users have a **User Type** (who they are) and can have multiple **Functional Abilities** (what they can do).

---

## User Types (Who They Are)

### 1. **Administrator** (`admin`)
**Identity**: System administrators, IT staff, clinic directors  
**Base Access**: Full system access, can do everything

**Default Abilities**: All abilities enabled by default
- Can manage users and groups
- Can configure system settings
- Can access all cases and data
- Can assign abilities to users

---

### 2. **Attorney** (`attorney`)
**Identity**: Licensed attorneys (staff attorneys, supervising attorneys, clinical professors)  
**Base Access**: Professional case handling

**Default Abilities**: `attorney` (legal work)
**Common Additional Abilities**: `researcher`, `investigator`

**Base Permissions**:
- Add/edit/delete own cases
- View assigned cases
- Sign legal documents
- Appear in court
- Supervise students
- Write journals
- Message case team

---

### 3. **Paralegal** (`paralegal`)
**Identity**: Certified paralegals, legal assistants  
**Base Access**: Support staff case access

**Default Abilities**: `staff`
**Common Additional Abilities**: `clerk`, `investigator`, `researcher`

**Base Permissions**:
- Add cases (intake)
- Edit assigned cases
- View assigned cases (+ coordination view of others)
- Document management
- Client communication
- Write journals (case updates)
- Message case team

---

### 4. **Intern** (`intern`)
**Identity**: Law students, clinical students, student workers, pre-law interns  
**Base Access**: Learning/supervised access

**Default Abilities**: None (must be assigned)
**Common Additional Abilities**: `researcher`, `investigator`, `clerk`

**Base Permissions**:
- View assigned cases only
- Edit assigned cases (supervised)
- Write journals (learning reflections)
- View board announcements
- Message case team
- Requires approval for most actions

---

### 5. **Staff** (`staff`)
**Identity**: Administrative staff, office managers, intake coordinators  
**Base Access**: Administrative support

**Default Abilities**: `staff`
**Common Additional Abilities**: `clerk`

**Base Permissions**:
- Client intake
- Appointment scheduling
- Document organization
- View assigned cases (administrative purposes)
- Message coordination
- Board announcements view

---

### 6. **Client** (`client`) - FUTURE
**Identity**: Actual clients receiving services  
**Base Access**: Self-service portal (not implemented yet)

**Future Permissions**:
- View own case only
- Upload documents to own case
- Message assigned team
- View appointments
- Update contact information

---

## Functional Abilities (What They Can Do)

Abilities are **additive** - users can have multiple abilities based on their work functions.

### 1. **Admin Ability** (`admin`)
**Function**: System administration and management  
**Automatically Granted To**: Administrator user type

**Enables**:
- ✅ Full system configuration (utilities)
- ✅ User management (add/edit/delete users)
- ✅ Group management (add/edit/delete groups)
- ✅ Assign abilities to users
- ✅ View all data (cases, journals, messages)
- ✅ System reports and analytics
- ✅ Database maintenance

**Typically Combined With**: None (admin is standalone)

---

### 2. **Attorney Ability** (`attorney`)
**Function**: Licensed legal practice work  
**Automatically Granted To**: Attorney user type

**Enables**:
- ✅ Legal document signing
- ✅ Court appearances
- ✅ Provide legal advice
- ✅ Attorney-client privilege access
- ✅ Case strategy decisions
- ✅ Supervise student work
- ✅ Full case editing rights

**Typically Combined With**: `researcher`, `investigator`

---

### 3. **Researcher Ability** (`researcher`)
**Function**: Legal research and analysis  
**Can Be Granted To**: Any user type

**Enables**:
- ✅ Legal research database access
- ✅ Research memo templates
- ✅ Case law citation tools
- ✅ Research task tracking
- ✅ Research notes in cases
- ✅ Legal research library
- ✅ Scholarly article access
- ✅ Research hour logging

**Special Tools**:
- Research assignment tracker
- Citation manager
- Research memo generator
- Case law annotations

**Typically Combined With**: `attorney`, `investigator`, `clerk`

---

### 4. **Investigator Ability** (`investigator`)
**Function**: Factual investigation and evidence gathering  
**Can Be Granted To**: Any user type

**Enables**:
- ✅ Witness interview forms
- ✅ Evidence tracking/logging
- ✅ Investigation timeline builder
- ✅ Photo/video evidence upload
- ✅ Site visit documentation
- ✅ Chain of custody tracking
- ✅ GPS location tagging
- ✅ Investigation notes

**Special Tools**:
- Investigation checklist templates
- Witness contact database
- Evidence inventory system
- Timeline visualization
- Field notes mobile app

**Typically Combined With**: `attorney`, `researcher`, `clerk`

---

### 5. **Clerk Ability** (`clerk`)
**Function**: Court filings and docket management  
**Can Be Granted To**: Any user type

**Enables**:
- ✅ Court filing management
- ✅ Docket calendar access
- ✅ Court document preparation
- ✅ Filing deadline tracking
- ✅ Service of process tracking
- ✅ Court appearance scheduling
- ✅ Court forms library
- ✅ E-filing integration

**Special Tools**:
- Court calendar integration
- Filing deadline calculator
- Court-specific form templates
- Service tracking system
- Docket number management

**Typically Combined With**: `researcher`, `staff`

---

### 6. **Staff Ability** (`staff`)
**Function**: Administrative support and coordination  
**Automatically Granted To**: Paralegal, Staff user types

**Enables**:
- ✅ Client intake forms
- ✅ Appointment scheduling
- ✅ Document management
- ✅ Time tracking
- ✅ Task coordination
- ✅ Calendar management
- ✅ Client communication (non-legal)
- ✅ Office coordination

**Special Tools**:
- Intake form builder
- Appointment calendar
- Document organizer
- Task management system
- Communication logs

**Typically Combined With**: `clerk`, `investigator`

---

## User Type + Ability Matrix

| User Type | Auto Abilities | Common Additions | Possible Additions |
|-----------|---------------|------------------|-------------------|
| **Administrator** | `admin` | None | All (but rarely needed) |
| **Attorney** | `attorney` | `researcher`, `investigator` | `clerk`, `staff` |
| **Paralegal** | `staff` | `clerk`, `investigator` | `researcher` |
| **Intern** | None | `researcher`, `investigator` | `clerk`, `staff` |
| **Staff** | `staff` | `clerk` | `investigator` |
| **Client** | None | None | None |

---

## Permission Matrix

### Case Permissions by User Type

| Permission | Admin | Attorney | Paralegal | Intern | Staff |
|------------|-------|----------|-----------|--------|-------|
| Add Cases | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| Edit Own Cases | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Edit Assigned | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Edit All Cases | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Delete Cases | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| View Assigned | ✅ | ✅ | ✅ | ✅ | ✅ |
| View All Cases | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ |

### Tool Access by Functional Ability

| Tool/Feature | admin | attorney | researcher | investigator | clerk | staff |
|--------------|-------|----------|------------|--------------|-------|-------|
| **System** | | | | | | |
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| System Config | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Legal** | | | | | | |
| Sign Documents | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Court Appearances | ✅ | ✅ | ❌ | ❌ | ⚠️ | ❌ |
| Legal Advice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Research** | | | | | | |
| Research DB | ✅ | ⚠️ | ✅ | ❌ | ❌ | ❌ |
| Research Memos | ✅ | ⚠️ | ✅ | ❌ | ❌ | ❌ |
| Citations | ✅ | ⚠️ | ✅ | ❌ | ⚠️ | ❌ |
| **Investigation** | | | | | | |
| Witness Interviews | ✅ | ⚠️ | ❌ | ✅ | ❌ | ❌ |
| Evidence Tracking | ✅ | ⚠️ | ❌ | ✅ | ⚠️ | ⚠️ |
| Site Visits | ✅ | ⚠️ | ❌ | ✅ | ❌ | ❌ |
| **Court/Filing** | | | | | | |
| Court Filings | ✅ | ⚠️ | ❌ | ❌ | ✅ | ⚠️ |
| Docket Calendar | ✅ | ⚠️ | ❌ | ❌ | ✅ | ✅ |
| Deadlines | ✅ | ⚠️ | ❌ | ❌ | ✅ | ✅ |
| **Administrative** | | | | | | |
| Client Intake | ✅ | ⚠️ | ❌ | ❌ | ⚠️ | ✅ |
| Scheduling | ✅ | ⚠️ | ❌ | ❌ | ⚠️ | ✅ |
| Doc Management | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |

**Legend**:
- ✅ = Full access (enabled by ability)
- ⚠️ = Limited/view access (may have without ability)
- ❌ = No access

---

## Real-World Examples

### Example 1: Clinical Professor
**User Type**: `attorney`  
**Abilities**: `attorney`, `researcher`

**Can Do**:
- Handle cases as licensed attorney
- Conduct legal research
- Supervise students
- Sign legal documents
- Teach research methods

---

### Example 2: 2L Law Student
**User Type**: `intern`  
**Abilities**: `researcher`, `investigator`

**Can Do**:
- Work on assigned cases (supervised)
- Conduct legal research
- Interview witnesses
- Document evidence
- Write learning journals

**Cannot Do**:
- Sign legal documents
- Provide legal advice
- View unassigned cases
- Access admin functions

---

### Example 3: Senior Paralegal
**User Type**: `paralegal`  
**Abilities**: `staff`, `clerk`, `investigator`, `researcher`

**Can Do**:
- Client intake and coordination
- Court filings and docket management
- Factual investigations
- Limited legal research
- Document management
- Scheduling and admin

**Cannot Do**:
- Sign legal documents
- Provide legal advice
- System administration

---

### Example 4: Office Manager
**User Type**: `staff`  
**Abilities**: `staff`, `clerk`

**Can Do**:
- Administrative coordination
- Appointment scheduling
- Court calendar management
- Filing deadline tracking
- Document organization

**Cannot Do**:
- Edit case legal content
- Conduct research or investigations
- Sign documents

---

### Example 5: Research Fellow
**User Type**: `intern`  
**Abilities**: `researcher`, `clerk`

**Can Do**:
- Comprehensive legal research
- Research memo writing
- Help prepare court documents
- Track filing deadlines

**Cannot Do**:
- Handle cases independently
- Provide legal advice
- Conduct investigations

---

## Database Implementation

### Simple Approach (Current Schema Compatible)

```typescript
// User record
{
  username: "sarah",
  userType: "intern",  // New field OR use grp for primary type
  abilities: "researcher,investigator"  // Comma-separated abilities
}

// Parse in application
const abilities = user.abilities.split(',');
const hasResearchAccess = abilities.includes('researcher');
const hasInvestigationAccess = abilities.includes('investigator');
```

### Schema Changes Needed

```prisma
model User {
  // ... existing fields
  userType    String?  // admin, attorney, paralegal, intern, staff, client
  abilities   String?  // Comma-separated: researcher,investigator,clerk
  
  // Legacy
  grp         String?  // Keep for backward compatibility
}

model Group {
  id          Int
  groupName   String   // Maps to userType
  displayName String
  // ... rest of fields
}
```

---

## Implementation Plan

### Phase 1: Define User Types & Abilities in Database
- [ ] Create 5 User Type groups (admin, attorney, paralegal, intern, staff)
- [ ] Define base permissions for each user type
- [ ] Create ability definitions (admin, attorney, researcher, investigator, clerk, staff)

### Phase 2: Update Seed Data
- [ ] Seed all user types
- [ ] Seed ability definitions
- [ ] Create sample users with various type+ability combinations

### Phase 3: Permission System
- [ ] Create helper function: `hasAbility(user, ability)`
- [ ] Create helper function: `getUserType(user)`
- [ ] Implement permission checking middleware

### Phase 4: UI Updates
- [ ] User management: Show user type + abilities
- [ ] User creation: Select type + checkboxes for abilities
- [ ] Navigation: Show/hide based on abilities
- [ ] Feature gates: Enable tools based on abilities

---

## Next Steps

Ready to implement! Please confirm:

1. **User Types**: admin, attorney, paralegal, intern, staff ✅
2. **Abilities**: admin, attorney, researcher, investigator, clerk, staff ✅
3. **Ignore client for now** ✅

Shall I proceed with:
- **Option A**: Update seed.ts with all 5 user types + 6 abilities
- **Option B**: Full implementation (seed + permission helpers + UI)
- **Option C**: Just seed data for now, implementation later
