"use client";

import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  return (
    <div>
      <p>Welcome to DashBoard</p>{" "}
      <button
        onClick={() => {
          signOut();
          router.push("/sign-in");
        }}
        className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-100 bg-indigo-500"
      >
        Sign Out
      </button>
    </div>
  );
};

export default page;
