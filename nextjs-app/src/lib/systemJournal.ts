import { prisma } from '@/lib/prisma';

/**
 * System Journal Service
 * Creates automatic journal entries for system events
 */

interface SystemJournalOptions {
  username: string;
  reader?: string;
  text: string;
  automated?: boolean;
}

/**
 * Create a system-generated journal entry
 */
export async function createSystemJournal(options: SystemJournalOptions) {
  const { username, reader, text, automated = true } = options;

  try {
    const journal = await prisma.journal.create({
      data: {
        username,
        reader: reader || username, // Default to self if no reader specified
        text: `[System Generated Entry]\n\n${text}`,
        dateAdded: new Date(),
        archived: null,
        read: null,
        commented: null,
        comments: null,
      },
    });

    return journal;
  } catch (error) {
    console.error('Failed to create system journal:', error);
    throw error;
  }
}

/**
 * Create journal entry when a new user is created
 */
export async function createUserCreationJournal(
  newUsername: string,
  creatorUsername: string,
  userDetails: {
    firstName?: string;
    lastName?: string;
    email?: string;
    group?: string;
  }
) {
  const { firstName, lastName, email, group } = userDetails;
  
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || newUsername;
  
  const text = `User Account Created

Username: ${newUsername}
Full Name: ${fullName}
Email: ${email || 'Not provided'}
Group: ${group || 'Not assigned'}

This account was created by: ${creatorUsername}
Creation Date: ${new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  })}

This is an automatically generated journal entry to document the creation of this user account. The user should begin documenting their work and activities in this journal.`;

  // Create journal for the new user (they are both writer and reader)
  const journal = await createSystemJournal({
    username: newUsername,
    reader: newUsername,
    text,
  });

  // Also create a journal entry for the creator if different
  if (creatorUsername !== newUsername) {
    await createSystemJournal({
      username: creatorUsername,
      reader: creatorUsername,
      text: `Created New User Account

You created a new user account for ${fullName} (${newUsername}).

User Details:
- Username: ${newUsername}
- Email: ${email || 'Not provided'}
- Group: ${group || 'Not assigned'}
- Created: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

The new user has been notified and provided with initial access to the system.`,
    });
  }

  return journal;
}

/**
 * Create journal entry when a user is updated
 */
export async function createUserUpdateJournal(
  username: string,
  updaterUsername: string,
  changes: Record<string, { old: any; new: any }>
) {
  const changesList = Object.entries(changes)
    .map(([field, { old, new: newVal }]) => `- ${field}: "${old}" → "${newVal}"`)
    .join('\n');

  const text = `User Account Updated

The following changes were made to the user account:

${changesList}

Updated by: ${updaterUsername}
Update Date: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

This is an automatically generated journal entry to document changes to this user account.`;

  return await createSystemJournal({
    username,
    reader: username,
    text,
  });
}

/**
 * Create journal entry when a user is assigned to a case
 */
export async function createCaseAssignmentJournal(
  username: string,
  caseNumber: string,
  caseTitle: string,
  assignedBy: string
) {
  const text = `Case Assignment

You have been assigned to a new case:

Case Number: ${caseNumber}
Case Title: ${caseTitle}
Assigned By: ${assignedBy}
Assignment Date: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

Please review the case details and begin your work. Remember to document your progress and any significant developments in your journal entries.`;

  return await createSystemJournal({
    username,
    reader: username,
    text,
  });
}

/**
 * Create journal entry when user joins a group
 */
export async function createGroupMembershipJournal(
  username: string,
  groupName: string,
  addedBy: string
) {
  const text = `Group Membership Updated

You have been added to the group: ${groupName}

This group membership may grant you additional permissions and access within the system.

Added By: ${addedBy}
Date: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

Please review your new permissions and responsibilities associated with this group.`;

  return await createSystemJournal({
    username,
    reader: username,
    text,
  });
}

/**
 * Create journal entry when password is reset
 */
export async function createPasswordResetJournal(username: string) {
  const text = `Password Reset

Your password was reset at your request.

Reset Date: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

If you did not request this password reset, please contact your system administrator immediately.

This is an automatically generated journal entry for security purposes.`;

  return await createSystemJournal({
    username,
    reader: username,
    text,
  });
}

/**
 * Create welcome journal for new users (run on first login)
 */
export async function createWelcomeJournal(username: string) {
  const text = `Welcome to ClinicCases!

This is your personal journal where you should document:

📝 Daily Activities
- Work performed on cases
- Client interactions
- Research conducted
- Meetings attended

🎯 Learning Objectives
- Skills you're developing
- Questions that arise
- Insights gained

📊 Progress Tracking
- Milestones achieved
- Challenges encountered
- Solutions implemented

💡 Best Practices
- Regular entries (at least weekly)
- Be specific and detailed
- Include dates and case references
- Reflect on your learning

Your supervisors and professors may read and comment on your journal entries. This is a valuable tool for your professional development.

Start your journey by creating your first journal entry above!`;

  return await createSystemJournal({
    username,
    reader: username,
    text,
  });
}
