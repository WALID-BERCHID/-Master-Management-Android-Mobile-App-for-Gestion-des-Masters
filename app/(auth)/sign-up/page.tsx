import { Card } from "@/components/Card";
import { SignUpForm } from "@/components/AuthForms";

export default function SignUpPage() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="text-sm text-muted mt-2">Get started with secure meeting preparation.</p>
        <SignUpForm />
      </Card>
    </div>
  );
}
