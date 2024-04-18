"use server";

import { getNeonDrizzleDb } from "@/lib/database";
import { currentUser } from "@clerk/nextjs";
import { lockers, transactions } from "db/schema";
import { eq } from "drizzle-orm";

export async function getLocker() {
  const user = await currentUser();
  if (!user) {
    return { locker: null, txs: [] };
  }

  const db = getNeonDrizzleDb();

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
