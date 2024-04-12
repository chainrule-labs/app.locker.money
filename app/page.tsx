import { database } from "@/lib/database";
import LandingPage from "@/pages/LandingPage";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const db = await database();
  const { userId } = auth();

  // if (!userId) {
  //   throw new Error("You must be signed in to view this page.");
  // }

  // const _accounts: Account[] = await db
  //   .select()
  //   .from(accounts)
  //   .where(eq(accounts.userId, userId));

  return <LandingPage />;
}
