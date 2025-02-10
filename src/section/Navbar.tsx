'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";

const navlinks = [
    { label: "Interactive Demo", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {isSignedIn} = useAuth();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <section className="py-4 lg:py-8 shadow-sm sticky top-0 z-50 bg-black">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 items-center">
                    <div className="flex justify-start lg:justify-center">
                        <h1 className="font-extrabold text-[1.7rem] leading-[3rem] cursor-pointer text-white">
                            Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
                        </h1>
                    </div>
                    <div className="lg:flex justify-center items-center hidden">
                        <nav className="flex gap-8 font-medium">
                            {navlinks.map((link) => (
                                <Link
                                    href={link.href}
                                    key={link.label}
                                    className="text-neutral-300 hover:text-green-500 transition-colors duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex justify-end lg:hidden">
                        <button onClick={toggleMenu} className="text-neutral-300 focus:outline-none">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <div className="hidden lg:flex justify-end gap-4">
                            {
                                !isSignedIn ?
                                (
                                    <>
                                        <SignInButton mode="modal">
                                            <Button className="bg-transition border-none hover:bg-neutral-800 hover:text-white transition-colors duration-300" variant={"outline"}>
                                                Sign In
                                            </Button>
                                        </SignInButton>
                                    
                                        <SignUpButton mode="modal">
                                            <Button className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                                Sign Up
                                            </Button>
                                        </SignUpButton>
                                    </>
                                ) : 
                                (
                                    <Link href={'/dashboard'}>
                                        <Button className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                            Dashboard
                                        </Button>
                                    </Link>
                                )
                            }
                            
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden mt-4">
                        <nav className="flex flex-col gap-4 font-medium">
                            {navlinks.map((link) => (
                                <Link
                                    href={link.href}
                                    key={link.label}
                                    className="text-neutral-300 hover:text-green-500 transition-colors duration-300 py-2"
                                    onClick={toggleMenu}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex flex-col gap-4 mt-4">
                            <Link href="/dashboard">
                                <Button className="w-full text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors duration-300">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button className="w-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Navbar;