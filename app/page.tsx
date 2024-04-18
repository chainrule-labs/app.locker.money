import LandingPage from "@/pages/LandingPage";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();

  return <LandingPage userId={userId} />;
}
