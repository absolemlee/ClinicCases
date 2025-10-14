import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample groups
  console.log('Creating groups...');
  const adminGroup = await prisma.group.upsert({
    where: { id: 1 },
    update: {
      writesJournals: 1,
      readsJournals: 1,
    },
    create: {
      groupName: 'admin',
      displayName: 'Administrators',
      description: 'Full system access',
      allowedTabs: 'a:6:{i:0;s:4:"Home";i:1;s:5:"Cases";i:2;s:5:"Users";i:3;s:5:"Board";i:4;s:9:"Utilities";i:5;s:8:"Messages";}',
      addCases: 1,
      editCases: 1,
      deleteCases: 1,
      viewOthers: 1,
      writesJournals: 1,
      readsJournals: 1,
    },
  });

  const studentGroup = await prisma.group.upsert({
    where: { id: 2 },
    update: {},
    create: {
      groupName: 'student',
      displayName: 'Students',
      description: 'Limited access for students',
      allowedTabs: 'a:3:{i:0;s:4:"Home";i:1;s:5:"Cases";i:2;s:8:"Messages";}',
      addCases: 0,
      editCases: 0,
      deleteCases: 0,
      viewOthers: 0,
    },
  });

  console.log('✓ Groups created');

  // Create sample users
  console.log('Creating users...');
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: '$2b$10$Mh25XYl6HfCgdPCQUKR4CuMXycarsvwzzJwYgqtK57w8KFnz7Zv3i', // password: admin
    },
    create: {
      username: 'admin',
      password: '$2b$10$Mh25XYl6HfCgdPCQUKR4CuMXycarsvwzzJwYgqtK57w8KFnz7Zv3i', // password: admin
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@cliniccases.test',
      grp: 'admin',
      status: 'active',
      dateCreated: new Date(),
    },
  });

  console.log('✓ Users created');

  // Create sample case types
  console.log('Creating case types...');
  const caseTypes = [
    { code: 'FAMILY', name: 'Family Law' },
    { code: 'CIVIL', name: 'Civil Rights' },
    { code: 'HOUSING', name: 'Housing' },
    { code: 'IMMIGRATION', name: 'Immigration' },
  ];
  
  for (const type of caseTypes) {
    try {
      await prisma.caseType.create({ data: type });
    } catch (e) {
      // Already exists, skip
    }
  }

  console.log('✓ Case types created');

  // Create sample clinic types
  console.log('Creating clinic types...');
  const clinicTypes = [
    { code: 'LEGAL', name: 'Legal Clinic' },
    { code: 'MEDICAL', name: 'Medical Clinic' },
    { code: 'SOCIAL', name: 'Social Services' },
  ];
  
  for (const type of clinicTypes) {
    try {
      await prisma.clinicType.create({ data: type });
    } catch (e) {
      // Already exists, skip
    }
  }

  console.log('✓ Clinic types created');

  // Create a sample case
  console.log('Creating sample case...');
  const sampleCase = await prisma.case.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      caseNumber: '2025-001',
      dateOpen: '2025-10-14',
      timeOpened: new Date(),
      openedBy: 'admin',
      caseType: 'FAMILY',
      clinicType: 'LEGAL',
      notes: {
        create: {
          username: 'admin',
          date: '2025-10-14',
          description: 'Initial intake completed. Client seeking assistance with custody matter.',
          datestamp: new Date(),
        },
      },
      assignees: {
        create: {
          username: 'admin',
          status: 'active',
          dateAssigned: new Date(),
        },
      },
    },
  });

  console.log('✓ Sample case created');

  // Create system journal for admin user
  console.log('Creating system journals...');
  const existingJournals = await prisma.journal.count({
    where: { username: 'admin' },
  });

  if (existingJournals === 0) {
    await prisma.journal.create({
      data: {
        username: 'admin',
        reader: 'admin',
        text: `[System Generated Entry]

Account Information

Welcome to ClinicCases, Admin User!

This is your personal journal where you should document your work, learning, and professional development.

Account Details:
- Username: admin
- Full Name: Admin User
- Email: admin@cliniccases.test
- Group: admin
- Role: System Administrator

📝 Journal Guidelines:

Use this journal to document:
• Daily activities and case work
• Client interactions and meetings
• Research and analysis
• Learning objectives and insights
• Challenges and solutions
• System administration tasks

💡 Best Practices:
• Write regular entries (at least weekly)
• Be specific and detailed in your descriptions
• Include dates and case references when relevant
• Reflect on what you've learned
• Document system changes and updates

As an administrator, your journal entries may serve as system logs and documentation for future reference.

Start documenting your journey today by creating your first journal entry!`,
        dateAdded: new Date(),
        archived: null,
        read: null,
        commented: null,
        comments: null,
      },
    });
    console.log('✓ System journal created for admin user');
  } else {
    console.log('⏭️  Admin user already has journals, skipping...');
  }

  console.log('');
  console.log('✅ Seed complete!');
  console.log('');
  console.log('Sample data created:');
  console.log(`  - Admin user: admin (password: admin)`);
  console.log(`  - Sample case: ${sampleCase.caseNumber} - ${sampleCase.firstName} ${sampleCase.lastName}`);
  console.log(`  - System journal for admin user`);
  console.log('');
  console.log('Next steps:');
  console.log('  - Run "npm run dev" to start the development server');
  console.log('  - Visit http://localhost:3000/api/cases to see the API response');
  console.log('  - Run "npx prisma studio" to explore the database');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
