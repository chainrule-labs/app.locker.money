"use server";

import { getDrizzleDb } from "@/lib/drizzle";
import { currentUser } from "@clerk/nextjs";
import { lockers, transactions } from "db/schema";
import { eq } from "drizzle-orm";

export async function getLocker() {
  const user = await currentUser();

  if (!user) {
    return { locker: null, txs: [] };
  }

  const db = getDrizzleDb();

  const _locker = await db
    .select()
    .from(lockers)
    .where(eq(lockers.userId, user.id));

  const txs = await db
    .select()
    .from(transactions)
    .leftJoin(lockers, eq(transactions.lockerId, lockers.id))
    .where(eq(lockers.userId, user.id));

  return { locker: _locker[0], txs };
}
