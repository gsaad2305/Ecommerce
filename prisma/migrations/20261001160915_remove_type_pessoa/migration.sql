/*
  Warnings:

  - You are about to drop the column `tipoPessoa` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tipoPessoa";

-- DropEnum
DROP TYPE "TIPOPESSOA";
