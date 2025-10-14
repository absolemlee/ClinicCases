import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create user type groups
  console.log('Creating user types (groups)...');
  
  // 1. Administrator - Full system access
  const adminGroup = await prisma.group.upsert({
    where: { id: 1 },
    update: {
      displayName: 'Administrator',
      description: 'System administrators with full access',
      writesJournals: 1,
      readsJournals: 1,
      addCases: 1,
      editCases: 1,
      deleteCases: 1,
      viewOthers: 1,
    },
    create: {
      groupName: 'admin',
      displayName: 'Administrator',
      description: 'System administrators with full access',
      allowedTabs: 'a:9:{i:0;s:4:"Home";i:1;s:5:"Cases";i:2;s:5:"Users";i:3;s:6:"Groups";i:4;s:5:"Board";i:5;s:9:"Utilities";i:6;s:8:"Messages";i:7;s:8:"Journals";i:8;s:11:"Preferences";}',
      addCases: 1,
      editCases: 1,
      deleteCases: 1,
      viewOthers: 1,
      writesJournals: 1,
      readsJournals: 1,
    },
  });

  // 2. Attorney - Licensed legal professionals
  const attorneyGroup = await prisma.group.upsert({
    where: { id: 2 },
    update: {
      groupName: 'attorney',
      displayName: 'Attorney',
      description: 'Licensed attorneys handling cases',
    },
    create: {
      groupName: 'attorney',
      displayName: 'Attorney',
      description: 'Licensed attorneys handling cases',
      allowedTabs: 'a:6:{i:0;s:4:"Home";i:1;s:5:"Cases";i:2;s:5:"Board";i:3;s:8:"Messages";i:4;s:8:"Journals";i:5;s:11:"Preferences";}',
      addCases: 1,
      editCases: 1,
      deleteCases: 1,
      viewOthers: 1,
      writesJournals: 1,
      readsJournals: 1,
    },
  });

  // 3. Paralegal - Legal support staff
  const paralegalGroup = await prisma.group.upsert({
    where: { id: 3 },
    update: {},
    create: {
      groupName: 'paralegal',
      displayName: 'Paralegal',
      description: 'Certified paralegals and legal assistants',
      allowedTabs: 'a:6:{i:0;s:4:"Home";i:1;s:5:"Cases";i:2;s:5:"Board";i:3;s:8:"Messages";i:4;s:8:"Journals";i:5;s:11:"Preferences";}',
      addCases: 1,
      editCases: 1,
      deleteCases: 0,
      viewOthers: 1,
      writesJournals: 1,
      readsJournals: 1,
    },
  });

  // 4. Intern - Students and interns
  const internGroup = await prisma.group.upsert({
    where: { id: 4 },
    update: {},
    create: {
      groupName: 'intern',
      displayName: 'Intern',
      description: 'Law students, clinical students, interns',
      allowedTabs: 'a:5:{i:0;s:4:"Home";i:1;s:5:"Cases";i:2;s:5:"Board";i:3;s:8:"Messages";i:4;s:8:"Journals";}',
      addCases: 0,
      editCases: 1,
      deleteCases: 0,
      viewOthers: 0,
      writesJournals: 1,
      readsJournals: 0,
    },
  });

  // 5. Staff - Administrative staff
  const staffGroup = await prisma.group.upsert({
    where: { id: 5 },
    update: {},
    create: {
      groupName: 'staff',
      displayName: 'Staff',
      description: 'Administrative and support staff',
      allowedTabs: 'a:5:{i:0;s:4:"Home";i:1;s:5:"Cases";i:2;s:5:"Board";i:3;s:8:"Messages";i:4;s:11:"Preferences";}',
      addCases: 1,
      editCases: 0,
      deleteCases: 0,
      viewOthers: 1,
      writesJournals: 1,
      readsJournals: 0,
    },
  });

  console.log('✓ User types created');

  // Create sample users with various type+ability combinations
  console.log('Creating sample users...');
  
  // Admin user - Type: admin (has all abilities by default)
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: '$2b$10$Mh25XYl6HfCgdPCQUKR4CuMXycarsvwzzJwYgqtK57w8KFnz7Zv3i', // password: admin
      grp: 'admin',
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

  // Attorney with research ability
  const attorneyUser = await prisma.user.upsert({
    where: { username: 'jdoe' },
    update: {},
    create: {
      username: 'jdoe',
      password: '$2b$10$Mh25XYl6HfCgdPCQUKR4CuMXycarsvwzzJwYgqtK57w8KFnz7Zv3i', // password: admin
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@cliniccases.test',
      grp: 'attorney,researcher', // Type + abilities
      status: 'active',
      dateCreated: new Date(),
    },
  });

  // Paralegal with clerk and investigator abilities
  const paralegalUser = await prisma.user.upsert({
    where: { username: 'msmith' },
    update: {},
    create: {
      username: 'msmith',
      password: '$2b$10$Mh25XYl6HfCgdPCQUKR4CuMXycarsvwzzJwYgqtK57w8KFnz7Zv3i', // password: admin
      firstName: 'Maria',
      lastName: 'Smith',
      email: 'msmith@cliniccases.test',
      grp: 'paralegal,clerk,investigator', // Type + abilities
      status: 'active',
      dateCreated: new Date(),
    },
  });

  // Intern with researcher ability
  const internUser = await prisma.user.upsert({
    where: { username: 'sjones' },
    update: {},
    create: {
      username: 'sjones',
      password: '$2b$10$Mh25XYl6HfCgdPCQUKR4CuMXycarsvwzzJwYgqtK57w8KFnz7Zv3i', // password: admin
      firstName: 'Sarah',
      lastName: 'Jones',
      email: 'sjones@cliniccases.test',
      grp: 'intern,researcher,investigator', // Type + abilities
      status: 'active',
      dateCreated: new Date(),
    },
  });

  // Staff with clerk ability
  const staffUser = await prisma.user.upsert({
    where: { username: 'bwilson' },
    update: {},
    create: {
      username: 'bwilson',
      password: '$2b$10$Mh25XYl6HfCgdPCQUKR4CuMXycarsvwzzJwYgqtK57w8KFnz7Zv3i', // password: admin
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bwilson@cliniccases.test',
      grp: 'staff,clerk', // Type + abilities
      status: 'active',
      dateCreated: new Date(),
    },
  });

  console.log('✓ Sample users created');

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
  console.log('📋 User Types Created:');
  console.log('  1. admin - Administrators');
  console.log('  2. attorney - Licensed Attorneys');
  console.log('  3. paralegal - Paralegals');
  console.log('  4. intern - Students/Interns');
  console.log('  5. staff - Administrative Staff');
  console.log('');
  console.log('👥 Sample Users (all passwords: admin):');
  console.log('  - admin (Administrator)');
  console.log('  - jdoe (Attorney + Researcher)');
  console.log('  - msmith (Paralegal + Clerk + Investigator)');
  console.log('  - sjones (Intern + Researcher + Investigator)');
  console.log('  - bwilson (Staff + Clerk)');
  console.log('');
  console.log('📦 Sample Data:');
  console.log(`  - Sample case: ${sampleCase.caseNumber} - ${sampleCase.firstName} ${sampleCase.lastName}`);
  console.log(`  - System journals for all users`);
  console.log('');
  console.log('🔧 Functional Abilities:');
  console.log('  - researcher: Legal research tools');
  console.log('  - investigator: Fact investigation tools');
  console.log('  - clerk: Court filing tools');
  console.log('  - staff: Administrative support');
  console.log('  - attorney: Legal practice (auto with attorney type)');
  console.log('  - admin: System administration (auto with admin type)');
  console.log('');
  console.log('Next steps:');
  console.log('  - Run "npm run dev" to start the development server');
  console.log('  - Login with any username above (password: admin)');
  console.log('  - Check USER_ROLES_RESTRUCTURED.md for role details');
  console.log('  - Run "node scripts/check-roles.js" to see role details');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
