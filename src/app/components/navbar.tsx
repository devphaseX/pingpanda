import Link from "next/link";
import { MaxWidthWrapper } from "./max_width_wrapper";
import { SignOutButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

export const Navbar = async () => {
  const user = await auth();
  return (
    <nav
      className="sticky z-[100px] h-16 inset-x-0 top-0 w-full border-b
      border-gray-200 bg-white/80 backdrop-blur-lg transition-all"
    >
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-10 font-semibold">
            Ping<span className="text-brand-700">Panda</span>
          </Link>
          <div className="h-full flex items-center space-x-4">
            {user?.userId ? (
              <>
                <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Sign out
                  </Button>
                </SignOutButton>
                <Button asChild size="sm" className="flex items-center gap-1">
                  <Link href="/dashboard">
                    Dashboard <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="sm"
                  className="flex items-center gap-1"
                  variant="ghost"
                >
                  <Link href="/pricing">Pricing</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/sign-in">Sign in</Link>
                </Button>

                <div className="h-8 w-px bg-gray-200" />
                <Button asChild size="sm" className="flex items-center gap-1.5">
                  <Link href="/sign-up">
                    Sign up <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
