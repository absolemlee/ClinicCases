const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testJournalsQuery() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    console.log('User:', user.username, 'Group:', user.grp);
    
    const group = await prisma.group.findFirst({
      where: { groupName: user.grp }
    });
    
    console.log('writesJournals:', group.writesJournals);
    console.log('readsJournals:', group.readsJournals);
    
    const writesJournals = group?.writesJournals === 1;
    const readsJournals = group?.readsJournals === 1;
    
    console.log('\nPermissions:');
    console.log('  Can write:', writesJournals);
    console.log('  Can read:', readsJournals);
    
    let whereClause = {};
    
    if (writesJournals && !readsJournals) {
      whereClause.username = user.username;
      console.log('\nQuery type: Writer only - own journals');
    } else if (readsJournals) {
      whereClause.OR = [
        { reader: { contains: user.username } },
        { reader: { equals: user.username } },
      ];
      console.log('\nQuery type: Reader - journals where listed as reader');
    } else {
      console.log('\nQuery type: NO PERMISSION');
    }
    
    console.log('\nWhere clause:', JSON.stringify(whereClause, null, 2));
    
    const journals = await prisma.journal.findMany({
      where: whereClause,
      orderBy: { dateAdded: 'desc' },
      take: 5
    });
    
    console.log('\n✅ Journals found:', journals.length);
    if (journals.length > 0) {
      journals.forEach((j, i) => {
        console.log(`  ${i + 1}. ID: ${j.id}, Username: ${j.username}, Reader: ${j.reader}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testJournalsQuery();
