"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  X,
  Menu,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";
import { APP_LINK } from "@/contants/link_constant";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "tickets", label: "Tickets" },
    { id: "merchandise", label: "Merchandise" },
    { id: "dashboard", label: "Dashboard" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-10">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-red-800">
              Event<span className="text-yellow-600">Hub</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 w-full">
            <Input
              placeholder="Search..."
              className="border border-gray-300 rounded-full max-w-2xl w-full"
            />
            <Link
              href={APP_LINK.MERCHANDISE}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 text-gray-700 hover:text-red-800`}
            >
              Merchandise
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link
              href={APP_LINK.SIGN.IN}
              className={buttonVariants({ variant: "primary" })}
            >
              <LogIn /> Login
            </Link>
            <Link
              href={APP_LINK.SIGN.UP}
              className={buttonVariants({ variant: "secondary" })}
            >
              <UserPlus /> Register
            </Link>
            {/* <button className="p-2 text-gray-700 hover:text-red-800 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-red-800 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                10
              </span>
            </button>
            <button className="p-2 text-gray-700 hover:text-red-800 transition-colors">
              <User className="h-5 w-5" />
            </button> */}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-red-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-left text-sm font-medium transition-colors duration-200 text-gray-700 hover:text-red-800 hover:bg-gray-50`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
