import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/', 
  '/progress(.*)',
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/startups(.*)',
  '/startup(.*)',
  '/pricing(.*)',
  '/shola(.*)',
  '/about(.*)',
  '/terms(.*)',
  '/policy(.*)',
  '/join(.*)',
  '/resources(.*)',
  '/events(.*)',
  '/([^/]+)',
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};