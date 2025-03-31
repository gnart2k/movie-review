/*
  Warnings:

  - A unique constraint covering the columns `[userId,categoryId]` on the table `UserCategoryStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserCategoryStats_userId_categoryId_key` ON `UserCategoryStats`(`userId`, `categoryId`);
