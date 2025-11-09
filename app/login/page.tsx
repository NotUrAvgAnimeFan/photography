'use client'

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import loginAction from "./login_functions";
import { useRouter } from 'next/navigation';
import {toast} from 'sonner'


export default function LoginPage() {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await loginAction(username, password);


    if (response === 1) {
      router.push('/owner');
    } else {
      toast.error("incorrect credentials");
    }

  }


  return (
    <div className="relative flex flex-col items-center p-4 w-full h-screen">
      <div className="flex flex-col justify-center w-full max-w-md mt-10 h-3/5">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </Field>
              <FieldSeparator />
              <Field orientation="responsive">
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>

          </FieldSet>
        </form>

      </div>
    </div>
  )
}