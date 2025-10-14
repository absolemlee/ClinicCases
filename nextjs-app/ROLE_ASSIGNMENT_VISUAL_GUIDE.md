# Admin Role Assignment - Visual Guide

## 📸 What Admins Will See

### 1. Users List Page (`/users`)

```
┌──────────────────────────────────────────────────────────────┐
│  User Management                        [+ Add New User]     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  User Info          │ User Type      │ Functional Abilities  │
│  ──────────────────────────────────────────────────────────  │
│  Jane Doe           │ ┌──────────┐   │ 📚 researcher        │
│  @jdoe              │ │ Attorney │   │                       │
│  jdoe@law.com       │ └──────────┘   │                       │
│  ──────────────────────────────────────────────────────────  │
│  Mike Smith         │ ┌──────────┐   │ 📋 clerk             │
│  @msmith            │ │Paralegal │   │ 🔍 investigator      │
│  msmith@law.com     │ └──────────┘   │                       │
│  ──────────────────────────────────────────────────────────  │
│  Sarah Jones        │ ┌──────────┐   │ 📚 researcher        │
│  @sjones            │ │  Intern  │   │ 🔍 investigator      │
│  sjones@law.com     │ └──────────┘   │                       │
└──────────────────────────────────────────────────────────────┘
```

---

### 2. Edit User Page (`/users/:id/edit`)

#### Step 1: Select User Type

```
┌──────────────────────────────────────────────────────────────┐
│  Edit User: Jane Doe                     [← Back to Users]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Role & Permissions                                           │
│  Select the user type and assign functional abilities        │
│                                                               │
│  User Type *                                                  │
│  ┌─────────────────┬─────────────────┬─────────────────┐    │
│  │ Administrator   │ Attorney        │ Paralegal       │    │
│  │ Full system     │ Licensed legal  │ Legal support   │    │
│  │ access          │ professional    │ staff           │    │
│  │                 │ ✓ SELECTED      │                 │    │
│  └─────────────────┴─────────────────┴─────────────────┘    │
│  ┌─────────────────┬─────────────────┐                      │
│  │ Intern          │ Staff           │                      │
│  │ Student/        │ Administrative  │                      │
│  │ learning role   │ support         │                      │
│  └─────────────────┴─────────────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

#### Step 2: Select Abilities

```
┌──────────────────────────────────────────────────────────────┐
│  Functional Abilities                                         │
│  (Optional - grant additional permissions)                    │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ☑ ⚖️  Legal Practice                                  │  │
│  │     Legal document signing, court appearances,          │  │
│  │     legal advice                    [auto-included]     │  │
│  │                                                         │  │
│  │  ☑ 📚 Legal Research                                   │  │
│  │     Legal research database, research memos,            │  │
│  │     case law citations                                  │  │
│  │                                                         │  │
│  │  ☐ 🔍 Fact Investigation                               │  │
│  │     Witness interviews, evidence tracking,              │  │
│  │     site visits                                         │  │
│  │                                                         │  │
│  │  ☐ 📋 Court Filing                                     │  │
│  │     Court filings, docket calendar,                     │  │
│  │     filing deadlines                                    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

#### Step 3: Review Summary

```
┌──────────────────────────────────────────────────────────────┐
│  Current Role Configuration:                                  │
│                                                               │
│  ┌──────────┐  ┌────────────┐                               │
│  │ Attorney │  │📚 researcher│                               │
│  └──────────┘  └────────────┘                               │
│                                                               │
│  Database value: attorney,researcher                          │
│                                                               │
│  [Save Changes]  [Cancel]                                    │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. Groups Page (`/groups`)

```
┌──────────────────────────────────────────────────────────────┐
│  Group Management                       [+ Add New Group]    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  User Type    │ Available Abilities      │ Case Permissions  │
│  ────────────────────────────────────────────────────────    │
│  Attorney     │ ⚖️  attorney             │ Add Edit Delete  │
│  Licensed...  │ 📚 researcher            │ View All         │
│               │ 🔍 investigator          │                   │
│               │ 📋 clerk                 │                   │
│  ────────────────────────────────────────────────────────    │
│  Paralegal    │ 📂 staff                 │ Add Edit         │
│  Legal...     │ 📚 researcher            │ View All         │
│               │ 🔍 investigator          │                   │
│               │ 📋 clerk                 │                   │
│  ────────────────────────────────────────────────────────    │
│  Intern       │ 📚 researcher            │ Edit (assigned)  │
│  Student/...  │ 🔍 investigator          │                   │
│               │ 📋 clerk                 │                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Legend

### Badges & Cards

**User Type Badge**: 
- Background: Teal/Cyan (brand color)
- Text: White/Light
- Border: Teal border

**Ability Badge**:
- Background: Purple
- Text: White/Light
- Border: Purple border

**Auto-Included Badge**:
- Background: Teal (lighter)
- Text: Teal (darker)
- Small, inline badge

**Status Badge (Active)**:
- Background: Green
- Text: Green (darker)

**Status Badge (Inactive)**:
- Background: Yellow
- Text: Yellow (darker)

---

## 📱 Mobile View

### Users List (Mobile)

```
┌──────────────────────┐
│ User Management      │
│ [+ Add New User]     │
├──────────────────────┤
│                      │
│ Jane Doe             │
│ @jdoe                │
│ jdoe@law.com         │
│                      │
│ ┌────────┐          │
│ │Attorney│          │
│ └────────┘          │
│                      │
│ 📚 researcher        │
│                      │
│ [Edit] [Delete]      │
│ ─────────────────    │
│                      │
│ Mike Smith           │
│ @msmith              │
│ msmith@law.com       │
│                      │
│ ┌──────────┐        │
│ │Paralegal │        │
│ └──────────┘        │
│                      │
│ 📋 clerk             │
│ 🔍 investigator      │
│                      │
│ [Edit] [Delete]      │
└──────────────────────┘
```

### Edit User (Mobile)

```
┌──────────────────────┐
│ Edit User: Jane Doe  │
│ [← Back]             │
├──────────────────────┤
│                      │
│ User Type *          │
│                      │
│ ┌──────────────────┐│
│ │ Administrator    ││
│ │ Full system      ││
│ │ access           ││
│ └──────────────────┘│
│                      │
│ ┌──────────────────┐│
│ │ Attorney ✓       ││
│ │ Licensed legal   ││
│ │ professional     ││
│ └──────────────────┘│
│                      │
│ ┌──────────────────┐│
│ │ Paralegal        ││
│ │ Legal support    ││
│ │ staff            ││
│ └──────────────────┘│
│                      │
│ (scroll for more)    │
│                      │
│ Abilities            │
│                      │
│ ☑ ⚖️  Legal Practice│
│   [auto-included]    │
│                      │
│ ☑ 📚 Research        │
│                      │
│ ☐ 🔍 Investigation   │
│                      │
│ ☐ 📋 Court Filing    │
│                      │
│ Summary:             │
│ ┌────────┐          │
│ │Attorney│          │
│ └────────┘          │
│ ┌────────────┐      │
│ │📚 researcher│      │
│ └────────────┘      │
│                      │
│ [Save Changes]       │
└──────────────────────┘
```

---

## 🎯 Interactive Elements

### Clickable Areas

1. **User Type Cards**
   - Entire card is clickable
   - Hover: Border color change
   - Selected: Teal border + background

2. **Ability Checkboxes**
   - Checkbox itself
   - Label text and description
   - Disabled state for auto-included

3. **Action Buttons**
   - Edit (teal/brand color)
   - Delete (red)
   - Save (brand color)
   - Cancel (gray)

### Hover States

- **Cards**: Border brightens
- **Buttons**: Background darkens slightly
- **Links**: Underline appears
- **Badges**: No hover (static)

---

## 🔄 User Flow Example

### Scenario: Make Paralegal a Researcher

1. **Start**: Users page
   ```
   Mike Smith | Paralegal | 📋 clerk, 🔍 investigator
   ```

2. **Click**: Edit button
   ```
   → Navigate to /users/:id/edit
   ```

3. **See**: Current role loaded
   ```
   User Type: Paralegal ✓
   Abilities: ☑ clerk, ☑ investigator
   ```

4. **Action**: Check "Legal Research"
   ```
   ☑ 📂 staff [auto]
   ☑ 📚 researcher [NEW]
   ☑ 🔍 investigator
   ☑ 📋 clerk
   ```

5. **Review**: Summary updates
   ```
   Paralegal | 📂 staff 📚 researcher 🔍 investigator 📋 clerk
   Database: paralegal,researcher,investigator,clerk
   ```

6. **Save**: Click "Save Changes"
   ```
   → Return to users page
   → See updated badges
   ```

7. **Result**: Users page shows
   ```
   Mike Smith | Paralegal | 📚 researcher 🔍 investigator 📋 clerk
   ```

---

## ✅ Visual Checklist

### Admin Can See:
- [x] User's current type (badge)
- [x] User's current abilities (badges with icons)
- [x] All available user types (cards)
- [x] All available abilities (checkboxes)
- [x] Auto-included abilities (marked)
- [x] Real-time summary (preview)
- [x] Database value (for verification)
- [x] Clear save/cancel buttons
- [x] Responsive on all devices
- [x] Accessible with keyboard

---

**Visual Guide Complete** ✅  
Ready for admin user testing and training.
