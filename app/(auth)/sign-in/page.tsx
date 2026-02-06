import { Card } from "@/components/Card";
import { SignInForm } from "@/components/AuthForms";

export default function SignInPage() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted mt-2">Sign in to continue preparing for IEP meetings.</p>
        <SignInForm />
      </Card>
    </div>
  );
}
