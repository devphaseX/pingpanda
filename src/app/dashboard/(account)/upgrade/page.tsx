import { DashboardPageContent } from "@/app/components/dashboard_page_content";
import { getUserByExternalId } from "@/features/users/server/user.service";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UpgradePageContent } from "./upgrade_page_content";
import { Plan } from "@/server/__internals/constants/enums";

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
    <DashboardPageContent title="Pro Membership">
      <UpgradePageContent plan={user.plan} />
    </DashboardPageContent>
  );
};

export default UpgradePage;
