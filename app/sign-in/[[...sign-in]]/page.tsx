import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex items-center space-x-2">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
          <CalendarDays className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight">EventFlow</span>
      </div>
      <div className="w-full max-w-md flex justify-center">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              card: "shadow-xl border rounded-2xl",
            },
          }}
          fallback={
            <div className="p-8 border bg-card rounded-2xl shadow-xl text-center space-y-4">
              <h2 className="text-xl font-bold">Sign In to EventFlow</h2>
              <p className="text-sm text-muted-foreground">Demo authentication mode is active.</p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium shadow hover:bg-primary/90 transition-all"
              >
                Continue to Dashboard
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
}
