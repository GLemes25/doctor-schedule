import { requiereAuthAndClinic } from "@/lib/auth";
import { SingOutButton } from "./components/sing-ou-button";

const DashboardPage = async () => {
  const session = await requiereAuthAndClinic();

  return (
    <div>
      <h1>{session?.user?.name}</h1>
      <h1>{session?.user?.email}</h1>
      <SingOutButton></SingOutButton>
      {/* <Image src={session?.user?.image as string} alt="user" width={100} height={100} /> */}
    </div>
  );
};

export default DashboardPage;
