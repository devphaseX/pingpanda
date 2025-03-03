import { Navbar } from "../components/navbar";

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

export default function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
