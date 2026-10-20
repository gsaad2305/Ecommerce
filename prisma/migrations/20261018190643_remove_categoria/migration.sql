/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoriaToProduto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoriaToProduto" DROP CONSTRAINT "_CategoriaToProduto_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriaToProduto" DROP CONSTRAINT "_CategoriaToProduto_B_fkey";

-- DropTable
DROP TABLE "Categoria";

-- DropTable
DROP TABLE "_CategoriaToProduto";
