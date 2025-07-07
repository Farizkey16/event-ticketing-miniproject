import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Dummy user (ganti dengan logic ke DB nanti)
        const user = {
          id: "1",
          name: "harry kurniawan",
          email: credentials?.email,
        };

        if (credentials?.email === "test@example.com" && credentials.password === "123456") {
          return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/organizer/signin", // opsional, arahkan ke halaman login custom kamu
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
