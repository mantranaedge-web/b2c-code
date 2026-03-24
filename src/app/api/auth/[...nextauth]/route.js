import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Admin credentials from environment variables
const ADMIN_USERS = [
  {
    id: '1',
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@edtech.com',
    password: process.env.ADMIN_PASSWORD_HASH, // Should be bcrypt hashed
    role: 'admin',
  },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@edtech.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        // Find user
        const user = ADMIN_USERS.find((u) => u.email === credentials.email);

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        // If ADMIN_PASSWORD_HASH is not set, use plain text comparison (development only)
        let isValid = false;
        if (user.password) {
          isValid = await bcrypt.compare(credentials.password, user.password);
        } else if (process.env.ADMIN_PASSWORD) {
          // Fallback for plain text password (development only)
          isValid = credentials.password === process.env.ADMIN_PASSWORD;
        }

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        // Return user object (without password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };