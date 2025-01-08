import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="relative bg-gradient-to-bl from-primary-foreground via-primary-foreground to-background">
        <div className="container py-10 sm:py-20">
          <div className="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="mt-4 md:mb-12 max-w-2xl">
                <h1 className="hidden sm:block mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  BuildersCabal: Connecting founders, operators, & innovators
                </h1>
                <p className="text-xl text-muted-foreground">
                  Find startups, tools, and products in Africa.
                </p>
              </div>

              <blockquote className="hidden md:block relative max-w-sm">
                <svg
                  className="absolute top-0 start-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-foreground/10"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                    fill="currentColor"
                  />
                </svg>
                <div className="relative z-10">
                  <p className="text-xl italic">
                    The goal was simple - to build a platform where founders can support each other to build and launch their startups.
                  </p>
                </div>
                <footer className="mt-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-8 w-8 rounded-full"
                        src="/images/victor_onyekere.jpeg"
                        alt="Image Description"
                        width={100}
                        height={100}
                        quality={100}
                        unoptimized
                      />
                    </div>
                    <div className="grow ms-4">
                      <div className="font-semibold">Victor Onyekere</div>
                      <div className="text-xs text-muted-foreground">
                        Founder | BuildersCabal
                      </div>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
            <div>
              {children}
            </div>
          </div>
          <div className="mt-6 md:mt-12 py-3 flex items-center text-muted-foreground text-sm gap-x-1.5 after:flex-[1_1_0%] after:border-t after:ms-6 after:border-t-muted-foreground/50">
            <span className="font-semibold text-lg text-blue-500">
              500+
            </span>
            founders, operators, innovators and investors trust BuildersCabal
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 flex-wrap gap-x-6 sm:gap-x-12 lg:gap-x-24">
            <p className="py-3 lg:py-5 w-28 h-auto sm:w-28 text-xl text-muted-foreground">GoNomad</p>
            <p className="py-3 lg:py-5 w-28 h-auto sm:w-28 text-xl text-muted-foreground">Stustle</p>
            <p className="py-3 lg:py-5 w-28 h-auto sm:w-28 text-xl text-muted-foreground">GasFeel</p>
            <p className="py-3 lg:py-5 w-28 h-auto sm:w-28 text-xl text-muted-foreground">Oxtra</p>
            <p className="py-3 lg:py-5 w-28 h-auto sm:w-28 text-xl text-muted-foreground">FriendnPal</p>
            <p className="py-3 lg:py-5 w-28 h-auto sm:w-28 text-xl text-muted-foreground">Swiftyhost</p>
            <p className="py-3 lg:py-5 w-28 h-auto sm:w-28 text-xl text-muted-foreground">BCP Origins</p>
          </div>
        </div>
      </div>
  );
};