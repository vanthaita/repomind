'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; 
import { signIn, signOut, useSession } from "next-auth/react";
import CollapsibleBanner from "@/components/Banner";
import { LoadingButton } from '@/components/ui/loading';
import { Logo } from '@/components/ui/logo';

const navlinks = [
    { label: "Interactive Demo", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSmoothScroll = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        if (href === '/') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetId = href.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                const offset = 80; // Adjust this value based on your navbar height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
        setIsMenuOpen(false);
    };

    return (
        <section className={`py-2 lg:py-4 shadow-sm sticky top-0 z-50 bg-black transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 items-center">
                    <div className="flex justify-start lg:justify-center">
                        <Link href="/" className="cursor-pointer">
                            <Logo size="lg" animated={false} />
                        </Link>
                    </div>
                    <div className="lg:flex justify-center items-center hidden">
                        <nav className="flex gap-8 font-medium">
                            {navlinks.map((link) => (
                                <Link
                                    href={link.href}
                                    key={link.label}
                                    className="text-neutral-300 hover:text-green-500 transition-colors duration-300"
                                    onClick={(e) => handleSmoothScroll(e, link.href)}
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
                        {!session ? (
                            <>
                                <Button onClick={() => signIn()} className="bg-transition border-none hover:bg-neutral-800 hover:text-white transition-colors duration-300" variant={"outline"}>
                                    Sign In
                                </Button>
                                <Button onClick={() => signIn()} className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href={'/dashboard'}>
                                    <Button className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                        Dashboard
                                    </Button>
                                </Link>
                            </>
                        )}
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
                                    onClick={(e) => handleSmoothScroll(e, link.href)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex flex-col gap-4 mt-4">
                            {!session ? (
                                <>
                                    <Button onClick={() => signIn()} className="w-full text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors duration-300">
                                        Sign In
                                    </Button>
                                    <Button onClick={() => signIn()} className="w-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                        Sign Up
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href={'/dashboard'}>
                                        <Button className="w-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                            Dashboard
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Navbar;