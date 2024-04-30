import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
// import { sql } from "@vercel/postgres";
import { compare } from "bcrypt";
import prisma from "@/prisma/db";

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const response = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email
                    }
                })
                if (!response) {
                    return {
                        success: false,
                        message: "user not found"
                    } as any
                }


                const passwordCorrect = await compare(
                    credentials?.password || "",
                    response.password
                );

                if (passwordCorrect) {
                    return {
                        success: true,
                        message: 'login succesful',

                    };
                } else {

                    return {
                        success: false,
                        message: "wrong password"
                    }
                }


            },
        }),
    ],
});

export { handler as GET, handler as POST };