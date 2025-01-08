"use client";

import { Suspense } from "react";
import PageLoader from "@/components/page-loader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import SignIn from "@/app/(auth)/sign-in/[[...sign-in]]/_component/signin";
import { Toaster } from "@/components/ui/sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  router: ReturnType<typeof useRouter>;
}>;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <Suspense fallback={<PageLoader />}>
      <MainLayout isLoaded={isLoaded} isSignedIn={isSignedIn} router={router}>
        {children}
      </MainLayout>
    </Suspense>
  );
}

function MainLayout({
  children,
  isLoaded,
  isSignedIn,
  router,
}: MainLayoutProps) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

  if (!isLoaded) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`);
    return null;
  }

  return (
    <main>
      <Unauthenticated>
        <Dialog>
          <DialogContent className="bg-transparent border-transparent">
            <SignIn />
          </DialogContent>
        </Dialog>
      </Unauthenticated>
      <Authenticated>
        <TooltipProvider delayDuration={0}>
          {children}
          <Toaster richColors />
        </TooltipProvider>
      </Authenticated>
    </main>
  );
};