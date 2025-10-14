const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Create system journal for existing user (retroactive)
 */
async function createSystemJournal(username, reader, text) {
  try {
    const journal = await prisma.journal.create({
      data: {
        username,
        reader: reader || username,
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
    console.error(`Failed to create journal for ${username}:`, error.message);
    return null;
  }
}

/**
 * Populate system journals for all existing users
 */
async function populateSystemJournals() {
  try {
    console.log('🌱 Starting system journal population...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        grp: true,
        dateCreated: true,
      },
    });

    console.log(`Found ${users.length} users\n`);

    let created = 0;
    let skipped = 0;

    for (const user of users) {
      // Check if user already has any journals
      const existingJournals = await prisma.journal.count({
        where: { username: user.username },
      });

      if (existingJournals > 0) {
        console.log(`⏭️  Skipping ${user.username} (already has ${existingJournals} journal(s))`);
        skipped++;
        continue;
      }

      // Create welcome journal
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;
      const creationDate = user.dateCreated 
        ? new Date(user.dateCreated).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })
        : 'Unknown date';

      const welcomeText = `Account Information

Welcome to ClinicCases, ${fullName}!

This is your personal journal where you should document your work, learning, and professional development.

Account Details:
- Username: ${user.username}
- Full Name: ${fullName}
- Email: ${user.email || 'Not provided'}
- Group: ${user.grp || 'Not assigned'}
- Account Created: ${creationDate}

📝 Journal Guidelines:

Use this journal to document:
• Daily activities and case work
• Client interactions and meetings
• Research and analysis
• Learning objectives and insights
• Challenges and solutions
• Professional development

💡 Best Practices:
• Write regular entries (at least weekly)
• Be specific and detailed in your descriptions
• Include dates and case references when relevant
• Reflect on what you've learned
• Ask questions and seek feedback

Your supervisors and professors may read and comment on your entries. This is a valuable tool for tracking your progress and development.

Start documenting your journey today by creating your first journal entry!`;

      const journal = await createSystemJournal(
        user.username,
        user.username,
        welcomeText
      );

      if (journal) {
        console.log(`✓ Created system journal for: ${user.username} (${fullName})`);
        created++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ System journal population complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped} (already had journals)`);
    console.log(`   Total users: ${users.length}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error populating system journals:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateSystemJournals();
