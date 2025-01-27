import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
   providers: [
     GoogleProvider({
       clientId: process.env.GOOGLE_CLIENT_ID || '',
       clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
       authorization: {
         params: {
           response_type: "code",
           scope: 'openid https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify',
         }
       }
     }),
   ],
   secret: process.env.NEXTAUTH_SECRET,
   callbacks: {
     async session({ session, token }) {
       session.accessToken = token.accessToken as string;
       return session;
     },
     async jwt({ token, account }) {
       if (account) {
         token.accessToken = account.access_token;
       }
       return token;
     },
   },
   debug: true, // Enable debug mode to log responses
};
