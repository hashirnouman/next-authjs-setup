"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from 'axios'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
type FormData = z.infer<typeof FormSchema>;

export default function FormPage() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {


    const { email, password } = data;

    try {
      const response = await axios.post("/api/auth/register", data);
      console.log(response)

      if (!response.data?.success) {
        throw new Error("Network response was not ok");

      } else {
        
        signIn("credentials", {
          email,
          password,
          redirect: false,
        }).then(() => {
          router.push(
            '/dashboard'
          )
        })

      }



    } catch (error: any) {
      console.error("Registration Failed:", error);
      toast({ title: "Registration Failed" });
    }
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <br />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} type="password" />
              </FormControl>
              <FormDescription>
                Enter atleast 6 characters long password
              </FormDescription>
              <FormMessage />
            </FormItem>

          )}
        />
        <br />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}