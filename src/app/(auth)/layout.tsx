import { currentUser } from "@clerk/nextjs/server";
import { Navbar } from "../components/navbar";
import { getUserByExternalId } from "@/features/users/server/user.service";
import { redirect } from "next/navigation";

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

export default async function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  const auth = await currentUser();
  const user = auth ? getUserByExternalId(auth.id) : null;

  if (auth) {
    if (user) {
      return redirect("/welcome");
    }
    return redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
