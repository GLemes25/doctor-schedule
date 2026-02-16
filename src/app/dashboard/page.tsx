import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SingOutButton } from "./components/sing-ou-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  return (
    <div>
      <h1>{session?.user?.name}</h1>
      <h1>{session?.user?.email}</h1>
      <SingOutButton></SingOutButton>
    </div>
  );
};

export default DashboardPage;
