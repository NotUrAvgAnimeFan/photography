'use server'

import { cookies } from "next/headers";

export default async function getToken(): Promise<string> {

  const cookieStore = await cookies();
  const bearer = cookieStore.get('bearer')?.value;
  if (bearer) {
    return bearer;
  }
  return "";

}