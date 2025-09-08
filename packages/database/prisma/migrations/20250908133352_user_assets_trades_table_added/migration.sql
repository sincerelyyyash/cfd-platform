-- CreateEnum
CREATE TYPE "public"."OrderType" AS ENUM ('long', 'short');

-- CreateEnum
CREATE TYPE "public"."StatusType" AS ENUM ('open', 'closed', 'pending');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lastLoggedIn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asset" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimal" INTEGER NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExistingTrade" (
    "id" TEXT NOT NULL,
    "type" "public"."OrderType" NOT NULL,
    "status" "public"."StatusType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "entryPrice" INTEGER NOT NULL,
    "exitPrice" INTEGER NOT NULL,
    "pnL" INTEGER NOT NULL,
    "leverage" INTEGER,
    "margin" INTEGER,
    "stopLoss" INTEGER,
    "takeProfit" INTEGER,
    "liquidated" BOOLEAN,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "ExistingTrade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ExistingTrade" ADD CONSTRAINT "ExistingTrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExistingTrade" ADD CONSTRAINT "ExistingTrade_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
