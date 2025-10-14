const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRoles() {
  console.log('\n📋 Current User Roles/Groups in System:\n');
  
  const groups = await prisma.group.findMany({
    orderBy: { id: 'asc' }
  });
  
  groups.forEach(grp => {
    console.log(`ID: ${grp.id}`);
    console.log(`  Name: ${grp.displayName} (${grp.groupName})`);
    console.log(`  Description: ${grp.description || 'N/A'}`);
    console.log(`  Permissions:`);
    console.log(`    - Add Cases: ${grp.addCases ? '✓' : '✗'}`);
    console.log(`    - Edit Cases: ${grp.editCases ? '✓' : '✗'}`);
    console.log(`    - Delete Cases: ${grp.deleteCases ? '✓' : '✗'}`);
    console.log(`    - View Others' Cases: ${grp.viewOthers ? '✓' : '✗'}`);
    console.log(`    - Write Journals: ${grp.writesJournals ? '✓' : '✗'}`);
    console.log(`    - Read Journals: ${grp.readsJournals ? '✓' : '✗'}`);
    console.log(`  Allowed Tabs: ${grp.allowedTabs || 'All'}`);
    console.log('');
  });
  
  const users = await prisma.user.findMany({
    select: {
      username: true,
      firstName: true,
      lastName: true,
      grp: true,
      status: true
    }
  });
  
  console.log(`\n👥 Users by Role:\n`);
  groups.forEach(grp => {
    const groupUsers = users.filter(u => u.grp === grp.groupName);
    console.log(`${grp.displayName} (${groupUsers.length} users):`);
    groupUsers.forEach(u => {
      console.log(`  - ${u.username} (${u.firstName} ${u.lastName}) - ${u.status}`);
    });
  });
  
  await prisma.$disconnect();
}

checkRoles();
