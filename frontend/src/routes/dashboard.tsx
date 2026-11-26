import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, ArrowRight, LogIn, UserCheck, ArrowLeft } from "lucide-react";
import { HandoverLogo } from "@/components/common/HandoverLogo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Handover — College Teacher & Student Management System" },
      {
        name: "description",
        content:
          "Professional, spreadsheet-first college management system for teachers and students.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is unauthenticated, present a clean entrance modal / card
  if (!user) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-7 max-w-md w-full shadow-xs text-center space-y-6">
          <div className="flex justify-center mx-auto">
            <HandoverLogo size="lg" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-900">Handover Academic OS</h1>
            <p className="text-xs text-slate-500">
              Sign in or register to access your Faculty or Student portal.
            </p>
          </div>

          <div className="space-y-2.5">
            <Link to="/auth" search={{ tab: "signin" }} className="w-full block">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs h-9 font-medium justify-between px-3.5 shadow-xs rounded-lg">
                <div className="flex items-center gap-2">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In to Your Account</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link to="/auth" search={{ tab: "signup", role: "student" }} className="w-full block">
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-800 hover:bg-slate-50 text-xs h-9 font-medium justify-between px-3.5 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Register as Student</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Button>
            </Link>

            <Link to="/auth" search={{ tab: "signup", role: "teacher" }} className="w-full block">
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-800 hover:bg-slate-50 text-xs h-9 font-medium justify-between px-3.5 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                  <span>Register as Faculty</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Button>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Handover Home</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated: Render the role-appropriate workspace
  return <AppLayout />;
}
