"use server";

import { getNeonDrizzleDb } from "@/lib/database";
import { currentUser } from "@clerk/nextjs";
import { transactions } from "db/schema";
import { eq } from "drizzle-orm";

export async function getTx(txHash: string) {
  const user = await currentUser();

  if (!user) {
    return { tx: null };
  }

  const db = getNeonDrizzleDb();

  const tx = await db
    .select()
    .from(transactions)
    .where(eq(transactions.hash, txHash));

  return tx[0];
}
