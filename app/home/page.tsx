import DashboardPage from "@/pages/DashboardPage";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  // query for locker
  const user = await currentUser();
  const lockerAddress = user?.privateMetadata?.lockerAddress as string;
  // find transactions belonging to locker

  return <DashboardPage lockerAddress={lockerAddress} />;
}
