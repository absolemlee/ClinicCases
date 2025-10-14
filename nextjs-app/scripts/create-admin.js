const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Username:', existingAdmin.username);
      console.log('Group:', existingAdmin.grp);
      console.log('First Name:', existingAdmin.first_name);
      console.log('Last Name:', existingAdmin.last_name);
      
      // Update password to ensure it's "admin"
      const hashedPassword = await bcrypt.hash('admin', 10);
      await prisma.user.update({
        where: { username: 'admin' },
        data: { password: hashedPassword }
      });
      console.log('✅ Password reset to "admin"');
      
    } else {
      // Check if Administrators group exists
      let adminGroup = await prisma.group.findFirst({
        where: { groupName: 'Administrators' }
      });

      if (!adminGroup) {
        console.log('Creating Administrators group...');
        adminGroup = await prisma.group.create({
          data: {
            groupName: 'Administrators',
            groupDesc: 'System Administrators',
            addCases: 1,
            editCases: 1,
            deleteCases: 1,
            viewOthers: 1,
            can_assign_users_to_case: 1,
            can_view_users: 1,
            writesJournals: 1,
            readsJournals: 1,
          }
        });
        console.log('✅ Administrators group created');
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash('admin', 10);
      const admin = await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          grp: 'Administrators',
          first_name: 'System',
          last_name: 'Administrator',
          email: 'admin@cliniccases.local',
          user_status: 'Active',
          notes: 'Default system administrator account'
        }
      });

      console.log('✅ Admin user created successfully!');
      console.log('Username: admin');
      console.log('Password: admin');
      console.log('Group:', admin.grp);
    }

    // List all users
    const allUsers = await prisma.user.findMany({
      select: {
        username: true,
        grp: true,
        first_name: true,
        last_name: true,
        user_status: true
      }
    });

    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.first_name} ${user.last_name}) - Group: ${user.grp} - Status: ${user.user_status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
