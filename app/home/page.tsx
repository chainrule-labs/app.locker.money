import DashboardPage from "@/pages/DashboardPage";
import { getLocker } from "app/actions/getLocker";

export default async function Home() {
  // find transactions belonging to locker
  const { locker, txs } = await getLocker();

  const lockerAddress = locker?.lockerAddress;

  return <DashboardPage lockerAddress={lockerAddress} numTxs={txs.length} />;
}
