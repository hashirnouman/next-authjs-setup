import prisma from "@/prisma/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const userExists = await prisma.user.findMany({
            where: {
                email: email
            }
        })
        
        if (userExists.length > 0) {
            return NextResponse.json({ success: false, message: "user already exists" });
        }
        const hashedPassword = await hash(password, 10);
        const response = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })
        if (response) {
            return NextResponse.json({ success: true, message: "user created successfull" });
        } else {
            return NextResponse.json({ success: false, message: "failed to create user" });
        }
    } catch (e) {
        console.log({ e });
    }


}