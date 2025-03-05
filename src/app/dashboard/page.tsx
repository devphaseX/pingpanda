import { getUserByExternalId } from "@/features/users/server/user.service";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageContent } from "../components/dashboard_page_content";
import { MainDashboardPageContent } from "./main_dashboard_page_content";

const DashboardPage = async () => {
  const auth = await currentUser();

  if (!auth) {
    return redirect("/sign-in");
  }

  const user = await getUserByExternalId(auth.id);

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <DashboardPageContent title="Dashboard">
      <MainDashboardPageContent></MainDashboardPageContent>
    </DashboardPageContent>
  );
};

export default DashboardPage;
