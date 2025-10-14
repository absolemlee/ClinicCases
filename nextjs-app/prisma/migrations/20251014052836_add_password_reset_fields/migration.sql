-- AlterTable
ALTER TABLE "cm_users" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "cm_users" ADD COLUMN "resetTokenExpiry" DATETIME;
