# User Roles Quick Reference

## Role Types

### 🎯 Primary Roles (Choose ONE)
Every user must have exactly one primary role:

1. **Administrator** - System management
2. **Supervisor** - Oversee students and cases  
3. **Attorney** - Licensed attorney handling cases
4. **Student** - Learning under supervision
5. **Paralegal** - Legal support staff
6. **Intern** - Observer/minimal access
7. **Auditor** - Compliance/reporting

### 🔧 Functional Roles (Choose ANY)
Users can have multiple functional roles for specialized tools:

8. **Researcher** - Legal research tools
9. **Investigator** - Fact investigation tools
10. **Clerk** - Court filing tools

---

## Common Role Combinations

```
👨‍⚖️ Attorney + Researcher
   → Licensed attorney who conducts own research

👨‍🎓 Student + Researcher + Investigator  
   → Law student doing research and investigations

👩‍💼 Paralegal + Clerk + Investigator
   → Paralegal handling filings and investigations

🔬 Student + Researcher
   → Student focused on legal research

📋 Paralegal + Clerk
   → Paralegal managing court filings

🔍 Attorney + Investigator
   → Attorney conducting factual investigations
```

---

## Permission Levels

### Cases
| Role | Add | Edit Own | Edit Assigned | Edit All | Delete | View All |
|------|-----|----------|---------------|----------|--------|----------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Supervisor** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Attorney** | ✅ | ✅ | ✅ | ❌ | ⚠️ | ⚠️ |
| **Student** | ⚠️ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Paralegal** | ✅ | ✅ | ✅ | ❌ | ❌ | ⚠️ |
| **Intern** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Auditor** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Special Tools (Functional Roles)
| Tool Set | Researcher | Investigator | Clerk |
|----------|------------|--------------|-------|
| **Research Database** | ✅ | ❌ | ❌ |
| **Research Memos** | ✅ | ❌ | ❌ |
| **Case Law Citations** | ✅ | ❌ | ⚠️ |
| **Witness Interviews** | ❌ | ✅ | ❌ |
| **Evidence Tracking** | ❌ | ✅ | ⚠️ |
| **Investigation Timeline** | ❌ | ✅ | ❌ |
| **Court Filings** | ❌ | ❌ | ✅ |
| **Docket Calendar** | ❌ | ❌ | ✅ |
| **Filing Deadlines** | ❌ | ❌ | ✅ |

---

## Real-World Examples

### Example 1: Small Clinic
```
Director: admin
Professor 1: supervisor
Professor 2: supervisor
Attorney: attorney + researcher
Students (10): student + researcher
Paralegal: paralegal + clerk + investigator
```

### Example 2: Large Clinic
```
IT Manager: admin
Clinical Director: supervisor
Professors (3): supervisor
Staff Attorneys (2): attorney + researcher
Students (30): student (some with researcher, some with investigator)
Paralegals (2): paralegal + clerk
Research Assistant: researcher + clerk
Investigator: investigator
```

### Example 3: Specialized Clinic
```
Director: supervisor
Attorneys (4): attorney
Research Fellows (2): researcher
Investigation Team (2): investigator
Students (15): student + researcher
Admin Staff: paralegal + clerk
```

---

## Implementation in Database

### Current (Simple)
```sql
-- Users table
username | grp
---------|------------------------
john     | attorney,researcher
sarah    | student,researcher,investigator
maria    | paralegal,clerk
```

### Future (Enhanced)
```sql
-- Users table
id | username | primaryRole
---|----------|------------
1  | john     | attorney
2  | sarah    | student
3  | maria    | paralegal

-- UserFunctionalRoles table
userId | functionalRole
-------|---------------
1      | researcher
2      | researcher
2      | investigator
3      | clerk
```

---

## Quick Decision Guide

**Adding a New User? Ask:**

1. **What's their primary role?**
   - System admin? → `admin`
   - Teaching/supervising? → `supervisor`
   - Licensed attorney? → `attorney`
   - Law student? → `student`
   - Support staff? → `paralegal`
   - Just observing? → `intern`
   - Auditing/compliance? → `auditor`

2. **What specialized work will they do?**
   - Legal research? → Add `researcher`
   - Investigations? → Add `investigator`
   - Court filings? → Add `clerk`
   - All of the above? → Add all three!

3. **Example Assignments:**
   - "2L student doing research" → `student,researcher`
   - "Attorney who investigates" → `attorney,investigator`
   - "Paralegal handling everything" → `paralegal,researcher,investigator,clerk`

---

## Next Steps

1. Review USER_ROLES.md for complete details
2. Decide which roles to implement
3. Let me know if you want:
   - All 10 roles implemented
   - Just core 5-7 roles
   - Custom role selection
