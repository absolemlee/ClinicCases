-- CreateTable
CREATE TABLE "cm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clinicId" INTEGER,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "caseNumber" TEXT,
    "dateOpen" TEXT,
    "dateClose" TEXT,
    "timeOpened" DATETIME,
    "timeClosed" DATETIME,
    "openedBy" TEXT,
    "closedBy" TEXT,
    "caseType" TEXT,
    "clinicType" TEXT,
    "assignedUsers" TEXT,
    "adverseParties" TEXT,
    "deleted" INTEGER DEFAULT 0
);

-- CreateTable
CREATE TABLE "cm_columns" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dbName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "includeInCaseTable" INTEGER NOT NULL DEFAULT 1,
    "inputType" TEXT NOT NULL,
    "selectOptions" TEXT,
    "displayByDefault" INTEGER NOT NULL DEFAULT 1,
    "required" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "cm_case_notes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "date" TEXT,
    "time" TEXT,
    "description" TEXT,
    "datestamp" DATETIME,
    CONSTRAINT "cm_case_notes_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_case_assignees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "caseId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "dateAssigned" DATETIME,
    "dateRemoved" DATETIME,
    CONSTRAINT "cm_case_assignees_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_contacts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT,
    "lastName" TEXT,
    "organization" TEXT,
    "type" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "assocCase" INTEGER NOT NULL,
    CONSTRAINT "cm_contacts_assocCase_fkey" FOREIGN KEY ("assocCase") REFERENCES "cm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" INTEGER,
    "displayName" TEXT,
    "localFileName" TEXT,
    "extension" TEXT,
    "folder" TEXT,
    "containingFolder" TEXT,
    "editableText" TEXT,
    "writer" TEXT,
    "addedBy" TEXT,
    "timeAdded" DATETIME,
    CONSTRAINT "cm_documents_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "to" TEXT,
    "from" TEXT,
    "ccs" TEXT,
    "subject" TEXT,
    "body" TEXT,
    "assocCase" INTEGER,
    "timeSent" DATETIME,
    "threadId" INTEGER,
    "readFlag" INTEGER DEFAULT 0,
    "archived" INTEGER DEFAULT 0,
    "starred" INTEGER DEFAULT 0,
    CONSTRAINT "cm_messages_assocCase_fkey" FOREIGN KEY ("assocCase") REFERENCES "cm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" INTEGER,
    "setBy" TEXT,
    "task" TEXT,
    "start" DATETIME,
    "startText" TEXT,
    "end" DATETIME,
    "endText" TEXT,
    "allDay" INTEGER DEFAULT 0,
    "status" TEXT DEFAULT 'pending',
    "notes" TEXT,
    "location" TEXT,
    "timeAdded" DATETIME,
    CONSTRAINT "cm_events_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_events_responsibles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "timeAdded" DATETIME,
    CONSTRAINT "cm_events_responsibles_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "cm_events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_adverse_parties" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "cm_adverse_parties_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "mobilePhone" TEXT,
    "officePhone" TEXT,
    "homePhone" TEXT,
    "grp" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "supervisors" TEXT,
    "pictureUrl" TEXT DEFAULT 'people/no_picture.png',
    "timezoneOffset" TEXT DEFAULT '1',
    "status" TEXT DEFAULT 'inactive',
    "newUser" TEXT,
    "dateCreated" DATETIME,
    "prefCase" TEXT DEFAULT 'on',
    "prefJournal" TEXT DEFAULT 'on',
    "prefCaseProf" TEXT DEFAULT 'on',
    "evals" TEXT,
    "privateKey" TEXT,
    "forceNewPassword" INTEGER DEFAULT 0
);

-- CreateTable
CREATE TABLE "cm_groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "allowedTabs" TEXT,
    "addCases" INTEGER NOT NULL DEFAULT 0,
    "editCases" INTEGER NOT NULL DEFAULT 0,
    "deleteCases" INTEGER NOT NULL DEFAULT 0,
    "viewOthers" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "cm_case_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cm_clinic_type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "cm_users_username_key" ON "cm_users"("username");
