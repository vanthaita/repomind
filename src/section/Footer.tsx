import { FaGithub, FaDiscord } from 'react-icons/fa';
import { AiOutlineTwitter } from 'react-icons/ai';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { appDescription } from '@/constants/app';
import Link from 'next/link';

const footerIcons = [
    { icon: <FaGithub size={28} />, href: "#", label: "Github" },
    { icon: <AiOutlineTwitter size={28} />, href: "#", label: "Twitter" },
    { icon: <FaDiscord size={28} />, href: "#", label: "Discord" },
];

const sitemap = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
];

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 pt-14 pb-6 border-t border-neutral-800 shadow-[0_-2px_16px_0_rgba(16,16,16,0.12)]">
            <div className="container ">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 md:gap-0">
                    {/* Logo & Description */}
                    <div className="flex-1 flex flex-col items-start min-w-[220px] md:pr-8 md:border-r md:border-neutral-800">
                        <h1 className="font-extrabold text-[1.7rem] leading-[3rem] cursor-pointer text-white mb-1">
                            Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
                        </h1>
                        <p className="text-gray-400 text-sm max-w-xs mb-6">
                            {appDescription}
                        </p>
                        <p className="text-gray-500 text-xs mt-auto hidden md:block">© {new Date().getFullYear()} RepoMind. All rights reserved.</p>
                    </div>
                    {/* Sitemap */}
                    <div className="flex-1 flex flex-col items-start min-w-[160px] md:px-8 md:border-r md:border-neutral-800">
                        <h2 className="text-white font-semibold mb-2 text-base tracking-wide">Sitemap</h2>
                        <nav className="flex flex-col gap-2 mb-6 md:mb-0">
                            {sitemap.map((item, idx) => (
                                <Link key={idx} href={item.href} className="text-gray-400 hover:text-green-400 text-sm transition-colors hover:underline underline-offset-4">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    {/* Legal & Social */}
                    <div className="flex-1 flex flex-col items-start min-w-[180px] md:pl-8">
                        <div className="flex items-center gap-2 mb-1">
                            <HiOutlineShieldCheck className="text-green-400" size={20} />
                            <h2 className="text-white font-semibold text-base tracking-wide">Legal</h2>
                        </div>
                        <div className="w-full border-b border-neutral-800 mb-2" />
                        <p className="text-xs text-gray-400 mb-3">Your privacy and rights are protected.</p>
                        <nav className="flex flex-col gap-2 mb-6 md:mb-0 w-full">
                            <Link href="/terms" className="flex items-center gap-1 text-gray-400 hover:text-green-400 text-sm transition-colors hover:underline underline-offset-4 group">
                                <span>Terms of Service</span>
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">›</span>
                            </Link>
                            <Link href="/privacy" className="flex items-center gap-1 text-gray-400 hover:text-green-400 text-sm transition-colors hover:underline underline-offset-4 group">
                                <span>Privacy Policy</span>
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">›</span>
                            </Link>
                        </nav>
                        <div className="flex space-x-4 mt-4">
                            {footerIcons.map((icon, index) => (
                                <Link
                                    key={index}
                                    href={icon.href}
                                    aria-label={icon.label}
                                    className="text-white/70 hover:text-white transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 hover:bg-green-500/20 bg-neutral-800"
                                >
                                    {icon.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <hr className="my-10 border-neutral-800" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs md:hidden">© {new Date().getFullYear()} RepoMind. All rights reserved.</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                        <Link href="/terms" className="hover:text-green-400 hover:underline underline-offset-4 transition-colors">Terms</Link>
                        <span>|</span>
                        <Link href="/privacy" className="hover:text-green-400 hover:underline underline-offset-4 transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}