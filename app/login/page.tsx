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
import axios from "axios";
import { useState } from "react";
import makeRequest from "./login_functions";


export default function LoginPage() {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await makeRequest(username, password);
  }








  return (
    <div className="relative flex flex-col items-center p-4 w-full h-screen">
      <div className="flex flex-col justify-center w-full max-w-md mt-10 h-3/5">
        <form>
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
                <Button type="submit" onClick={handleSubmit}>Login</Button>
              </Field>

            </FieldGroup>

          </FieldSet>
        </form>

      </div>
    </div>
  )
}