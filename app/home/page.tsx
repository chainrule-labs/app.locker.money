import { RainbowProvider } from "@/components/context/RainbowProvider";
import DashboardPage from "@/pages/DashboardPage";

export default async function Home() {
  // query for locker

  return (
    <RainbowProvider>
      <DashboardPage />
    </RainbowProvider>
  );
}
