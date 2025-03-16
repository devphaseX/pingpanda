import { DashboardPageContent } from "@/app/components/dashboard_page_content";
import { getUserByExternalId } from "@/features/users/server/user.service";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AccountSettings } from "./setting_page_content";

const UpgradePage = async () => {
  const auth = await currentUser();

  if (!auth) {
    return redirect("/sign-in");
  }

  const user = await getUserByExternalId(auth.id);

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <DashboardPageContent title="Account Settings">
      <AccountSettings discordId={user.discord_id ?? ""} />
    </DashboardPageContent>
  );
};

export default UpgradePage;
