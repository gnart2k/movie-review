"use client";

import React from "react";
import Link from "next/link";
import "@/styles/components/layout/Navbar.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/assets/image/logo.svg";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { LanguageSwitcher } from "../LanguageSwitcher";


const Navbar = () => {
  const router = useRouter();

  function onSubmitAi(searchValue: string) {
    if (!searchValue) return;
    router.push(`/search?q=${searchValue}`);
  }

  return (
    <nav className="navbar">
      <section
        className="title"
        onClick={() => {
          router.push("/home");
        }}
      >
        <Image className="w-[40px]" src={logo} alt="logo Not Found" priority />
      </section>
      <section className="form-container">
        <SearchBar onSubmit={onSubmitAi} />
      </section>
      <section className="flex justify-self-end justify-end w-fit me-5">
        <SignedOut>
          <SignInButton>
            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2 me-2 my-auto dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Login</button>
          </SignInButton>
          <SignUpButton>
            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2 me-2 my-auto dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Register</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </section>
    </nav>
  );
};

export default Navbar;
