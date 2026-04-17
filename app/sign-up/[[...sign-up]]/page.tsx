import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}