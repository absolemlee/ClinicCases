# Board System Implementation Complete

## Overview
The Board (Announcements/Bulletin) system has been successfully implemented, allowing users to create, view, edit, and delete announcement posts with viewer permissions, color customization, and file attachments.

## Database Schema

### Models Added (via migration: 20251014054830_add_board_system)

1. **BoardPost** (`cm_board`)
   - `id`: Auto-incrementing primary key
   - `title`: Post title
   - `body`: Post content/message
   - `color`: Background color for the post (default: #3b82f6)
   - `author`: Username of the post creator
   - `timeAdded`: Post creation timestamp
   - `timeEdited`: Last edit timestamp
   - Relations: viewers[], attachments[]

2. **BoardViewer** (`cm_board_viewers`)
   - `id`: Auto-incrementing primary key
   - `postId`: Foreign key to BoardPost (cascade delete)
   - `viewer`: Username or group identifier
   - Supports: individual users, group names, special groups ("All Administrators", "All Professors", "All Users")

3. **BoardAttachment** (`cm_board_attachments`)
   - `id`: Auto-incrementing primary key
   - `name`: Original filename
   - `localFileName`: Stored filename
   - `extension`: File extension
   - `username`: User who uploaded the file
   - `postId`: Foreign key to BoardPost (cascade delete)
   - `timeAdded`: Upload timestamp

## API Endpoints

### POST `/api/board`
Create a new board post
- **Request Body**: `{ title, text, color, viewers[] }`
- **Response**: Created post with viewers and attachments
- **Auth**: Required

### GET `/api/board?search=query`
List all posts visible to current user
- **Query Params**: `search` (optional) - searches title and body
- **Response**: Array of posts filtered by viewer permissions
- **Filtering**: Shows posts where user is viewer (by username, group, or "All X" groups)
- **Auth**: Required

### GET `/api/board/[id]`
Get a specific post
- **Response**: Post details with viewers and attachments
- **Auth**: Required, checks viewer permission

### PATCH `/api/board/[id]`
Update a post
- **Request Body**: `{ title, text, color, viewers[] }`
- **Permission**: Author or admin only
- **Auth**: Required

### DELETE `/api/board/[id]`
Delete a post
- **Permission**: Author or admin only
- **Cascades**: Deletes all viewers and attachments
- **Auth**: Required

### POST `/api/board/[id]/attachments`
Upload attachment to a post
- **Request**: multipart/form-data with file
- **Storage**: Saved to `../uploads/board/board_{postId}_{timestamp}.{ext}`
- **Auth**: Required

## Frontend Pages

### `/app/board/page.tsx`
Main board view with:
- **Post Display**: Color-coded cards with title, body, author, timestamps
- **Search**: Real-time search through post titles and bodies
- **New Post Button**: Opens modal for creating posts
- **Edit/Delete Actions**: Visible only to author or admin
- **Viewer Information**: Shows who can see each post
- **Attachments**: Displays file attachments with icons

### Post Creation/Edit Modal
- **Title Field**: Post title input
- **Body Field**: Multi-line textarea for content
- **Color Picker**: 6 preset colors + custom color picker
- **Viewer Selection**:
  - Special Groups: "All Administrators", "All Professors", "All Users"
  - System Groups: All groups from `cm_groups` table
  - Individual Users: All users with scrollable multi-select
- **Validation**: Title required, at least one viewer required

## Features

### 1. Viewer Permissions
- Posts visible only to designated viewers
- Supports three viewer types:
  - **Individual users**: Username-based
  - **Groups**: Group name from cm_groups
  - **Special groups**: "All Administrators", "All Professors", "All Users"
- Query filters posts based on current user's username and group

### 2. Edit/Delete Permissions
- **Author**: Can edit/delete their own posts
- **Admins**: Can edit/delete any post (group name contains "admin")
- Buttons visible only when user has permission

### 3. Color Customization
- 6 preset colors: Blue, Green, Orange, Red, Purple, Pink
- Custom color picker for any hex color
- Default: Blue (#3b82f6)

### 4. Search
- Real-time search through post titles and bodies
- Case-sensitive (SQLite limitation)
- Updates post list as user types

### 5. Timestamps
- Shows post creation time
- Shows edit time if post was edited
- Format: "MMM d, yyyy h:mm a" (e.g., "Oct 14, 2024 2:30 PM")

### 6. File Attachments (API Ready)
- Upload endpoint implemented
- Files stored in `../uploads/board/`
- Displays attachment list with file icons
- Frontend UI shows attachments but upload UI not yet implemented

## Navigation

Added to main navigation menu:
- Position: After "Cases", before "Messages"
- Label: "Board"
- Route: `/board`

## Technical Implementation

### Database
- Prisma ORM with SQLite
- Cascade delete for viewers and attachments
- Foreign key constraints enforced

### API Pattern
- Next.js 14 App Router API routes
- Auth.js v5 session authentication
- Error handling with try/catch
- Consistent response format: `{ success, data/error }`

### Frontend
- React 18 with TypeScript
- Client component with hooks (useState, useEffect)
- date-fns for timestamp formatting
- TailwindCSS for styling
- Dark theme consistent with app design

### Permissions
- Session-based authentication
- Username and group from session.user
- Admin detection via group name check

## SQLite Considerations

1. **No createMany**: Used loop to create viewers one by one
2. **No case-insensitive search**: Removed `mode: 'insensitive'` from queries
3. **Buffer handling**: Used Uint8Array for file writing

## Future Enhancements (Not Implemented)

1. **Email Notifications**: Original PHP system sent emails to viewers
2. **Attachment Upload UI**: Frontend attachment upload interface
3. **Attachment Download**: Download endpoint for attachments
4. **Attachment Deletion**: Individual attachment removal
5. **Rich Text Editor**: WYSIWYG editor for post body
6. **Post Pinning**: Pin important posts to top
7. **Post Categories**: Categorize announcements
8. **Read Receipts**: Track who has viewed posts

## Testing Checklist

- [ ] Create new post with viewers
- [ ] View posts as different users (check viewer filtering)
- [ ] Edit post as author
- [ ] Try to edit someone else's post (should fail unless admin)
- [ ] Delete post as author
- [ ] Search posts by title/body
- [ ] Test color picker (presets and custom)
- [ ] Add multiple viewer types (users, groups, special groups)
- [ ] Check timestamps display correctly
- [ ] Verify cascade delete (delete post removes viewers/attachments)

## Files Created

1. `/src/app/api/board/route.ts` - List/create endpoints
2. `/src/app/api/board/[id]/route.ts` - Get/update/delete endpoints
3. `/src/app/api/board/[id]/attachments/route.ts` - Attachment upload
4. `/src/app/board/page.tsx` - Main board UI
5. `/prisma/migrations/20251014054830_add_board_system/` - Database migration

## Files Modified

1. `/prisma/schema.prisma` - Added 3 board models
2. `/src/components/Navigation.tsx` - Added Board link

## Build Status

✅ Production build successful
✅ TypeScript compilation clean
✅ All API routes typed correctly
✅ No lint errors

---

**Implementation Date**: October 14, 2024  
**Status**: ✅ Complete and Ready for Testing
