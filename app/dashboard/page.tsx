"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Dashboard = () => {
    return (
        <>
            <div>Dashboard</div>
            <Button onClick={() => signOut({
                redirect: true,
                callbackUrl: '/'
            })}>Signout</Button>
        </>
    )
}

export default Dashboard