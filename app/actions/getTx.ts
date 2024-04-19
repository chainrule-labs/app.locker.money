"use server";

import { getNeonDrizzleDb } from "@/lib/database";
import { transactions } from "db/schema";
import { eq } from "drizzle-orm";

export async function getTx(txHash: string) {
  const db = getNeonDrizzleDb();

  const tx = await db
    .select()
    .from(transactions)
    .where(eq(transactions.hash, txHash));

  return tx[0];
}
