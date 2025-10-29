import { Button } from "./ui/button";
import { ShowHome } from "@/lib/types";
import React from "react";

export default function Start({ setShowHome }: ShowHome) {

  const handleClick = () => {
    setShowHome(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black text-3xl">
      Welcome to my portfolio...
      <Button className="mt-4 text-xl" variant="secondary" onClick={handleClick}>
        Enter
      </Button>
    </div>
    )

}