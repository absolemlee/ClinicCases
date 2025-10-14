# Journal Permissions Fix

## Issue

When accessing `/journals` as the admin user, an error occurred:
- Error message: "No permission to view journals" (403)
- Root cause: Admin group did not have `writesJournals` and `readsJournals` permissions set

## Diagnosis

Checked the database and found:
```javascript
Admin group:
  groupName: 'admin'
  writesJournals: 0  // ❌ Should be 1
  readsJournals: 0   // ❌ Should be 1
```

The journals API (`/api/journals`) checks these permissions:
1. If user has `writesJournals` → shows their own journals
2. If user has `readsJournals` → shows journals where they are listed as reader
3. If neither → returns 403 error

## Solution Applied

### 1. Updated Admin Group Permissions

Ran database update to set permissions:
```javascript
✅ Admin group updated:
  groupName: admin
  writesJournals: 1  // ✓ Can write journals
  readsJournals: 1   // ✓ Can read journals
```

### 2. Updated Seed File

Modified `/prisma/seed.ts` to ensure admin group always has journal permissions:

```typescript
const adminGroup = await prisma.group.upsert({
  where: { id: 1 },
  update: {
    writesJournals: 1,  // ← Added
    readsJournals: 1,   // ← Added
  },
  create: {
    // ... existing fields
    writesJournals: 1,  // ← Added
    readsJournals: 1,   // ← Added
  },
});
```

### 3. Testing

Created test script (`scripts/test-journals-query.js`) and verified:
```
✅ Journals found: 1
  1. ID: 1, Username: admin, Reader: admin
```

## Verification

- ✅ Admin group now has correct permissions
- ✅ Journals query returns results
- ✅ Production build passing
- ✅ Seed file updated for future deployments

## How to Test

1. Log in as admin user
2. Navigate to `/journals`
3. Should see the system-generated welcome journal
4. Should be able to create new journals
5. No permission errors

## Related Files

- `/src/app/api/journals/route.ts` - Journals API with permission checks
- `/prisma/seed.ts` - Database seed with admin permissions
- `/scripts/test-journals-query.js` - Test script for journal queries

## Prevention

Going forward:
- All admin/supervisor groups should have journal permissions set
- Seed file now includes these permissions by default
- Can verify permissions via: `node scripts/test-journals-query.js`

---

**Status**: ✅ Fixed  
**Date**: October 14, 2024  
**Build**: Passing
