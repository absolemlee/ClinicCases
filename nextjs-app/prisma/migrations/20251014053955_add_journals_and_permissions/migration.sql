/*
  Warnings:

  - You are about to drop the `cm_clinic_type` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "cm_clinic_type";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "cm_clinic_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cm_journals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "reader" TEXT,
    "text" TEXT,
    "date_added" DATETIME,
    "archived" TEXT,
    "read" TEXT,
    "commented" TEXT,
    "comments" TEXT
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cm_groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "allowedTabs" TEXT,
    "addCases" INTEGER NOT NULL DEFAULT 0,
    "editCases" INTEGER NOT NULL DEFAULT 0,
    "deleteCases" INTEGER NOT NULL DEFAULT 0,
    "viewOthers" INTEGER NOT NULL DEFAULT 0,
    "writes_journals" INTEGER NOT NULL DEFAULT 0,
    "reads_journals" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_cm_groups" ("addCases", "allowedTabs", "deleteCases", "description", "displayName", "editCases", "groupName", "id", "viewOthers") SELECT "addCases", "allowedTabs", "deleteCases", "description", "displayName", "editCases", "groupName", "id", "viewOthers" FROM "cm_groups";
DROP TABLE "cm_groups";
ALTER TABLE "new_cm_groups" RENAME TO "cm_groups";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
