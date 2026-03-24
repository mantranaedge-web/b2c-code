import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // This function runs for all protected routes
    // You can add additional logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated and has admin role
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
        const isLoginPage = req.nextUrl.pathname === '/admin/login';
        
        // Allow access to login page without authentication
        if (isLoginPage) {
          return true;
        }
        
        // For admin routes, require authentication
        if (isAdminRoute) {
          return !!token && token.role === 'admin';
        }
        
        // Allow all other routes
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/courses/:path*',
    '/api/course-details/:path*',
    '/api/leads/:path*',
  ],
};