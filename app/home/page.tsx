import { RainbowProvider } from "@/components/context/RainbowProvider";
import { getPortfolio } from "@/lib/moralis";
import DashboardPage from "@/pages/DashboardPage";
import { getLocker } from "app/actions/getLocker";

export default async function Home() {
  // find transactions belonging to locker
  const { locker, txs } = await getLocker();

  const lockerAddress = locker?.lockerAddress;

  let lockerUsdValue = "$0.00";
  if (!!lockerAddress) {
    console.log("get portfolio");
    const result = await getPortfolio(lockerAddress);
    lockerUsdValue = result!.totalNetworthUsd;
  }

  return (
    <RainbowProvider>
      <DashboardPage
        locker={locker}
        lockerUsdValue={lockerUsdValue}
        transaction={txs[0] || null}
      />
    </RainbowProvider>
  );
}
