import { RainbowProvider } from "@/components/context/RainbowProvider";
import DashboardPage from "@/pages/DashboardPage";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  // query for locker
  const user = await currentUser();

  // console.log("userss");
  // console.log(user);
  return (
    <RainbowProvider>
      <DashboardPage
        lockerAddress={user?.privateMetadata?.lockerAddress as string}
      />
    </RainbowProvider>
  );
}
