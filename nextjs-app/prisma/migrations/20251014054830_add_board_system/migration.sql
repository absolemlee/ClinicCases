-- CreateTable
CREATE TABLE "cm_board" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "body" TEXT,
    "color" TEXT,
    "author" TEXT NOT NULL,
    "time_added" DATETIME,
    "time_edited" DATETIME
);

-- CreateTable
CREATE TABLE "cm_board_viewers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "viewer" TEXT NOT NULL,
    CONSTRAINT "cm_board_viewers_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "cm_board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cm_board_attachments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "local_file_name" TEXT,
    "extension" TEXT,
    "username" TEXT,
    "post_id" INTEGER NOT NULL,
    "time_added" DATETIME,
    CONSTRAINT "cm_board_attachments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "cm_board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
