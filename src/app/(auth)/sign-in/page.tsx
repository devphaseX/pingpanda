"use client";

import { SignIn } from "@clerk/nextjs";

const SigninPage = () => {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn />
    </div>
  );
};

export default SigninPage;
