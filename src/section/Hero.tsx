import TextTicker from "@/components/TextTicker";

export default function Hero() {
    return (
        <section className="py-24 overflow-x-clip">
            <div className="container relative mx-auto px-4">
                <div className="flex justify-center">
                    <h1 className="text-6xl font-bold md:text-7xl lg:text-8xl text-center mt-6 text-white">
                        AI-Powered Repository Insights
                    </h1>
                </div>
                <p className="text-center text-xl text-white/70 mt-8 max-w-2xl mx-auto">
                    Transform your Git data into actionable insights. Get deep analysis, case studies, and strategic recommendations in minutes.
                </p>
                <div className="mt-12 flex justify-center">
                    <button className="inline-flex items-center whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:text-accent-foreground py-3 px-6 relative h-16 justify-between rounded-2xl text-base transition-all duration-200 group bg-white hover:border-primary/50 hover:bg-white/90 hover:shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-5 h-5">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </svg>
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-lg font-semibold text-foreground">Analyze Repository</span>
                                <div className="text-sm text-muted-foreground overflow-hidden">
                                    <span className="inline-flex items-center">Explore code quality metrics</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <kbd className="hidden sm:flex h-8 select-none items-center gap-1 rounded border bg-muted px-5 font-mono text-sm text-muted-foreground">
                                <span className="text-xs">⌘</span>
                            </kbd>
                            <kbd className="hidden sm:flex h-8 select-none items-center gap-1 rounded border bg-muted px-5 font-mono text-sm text-muted-foreground">
                                <span className="text-xs">K</span>
                            </kbd>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
                    <div>
                        <h2 className="text-4xl font-bold">10+</h2>
                        <p className="text-lg">PRs</p>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold">5+</h2>
                        <p className="text-lg">Releases</p>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold">15+</h2>
                        <p className="text-lg">Developer Tools</p>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold">  <TextTicker value={150000} />+</h2>
                        <p className="text-lg">Repositories Analyzed</p>
                    </div>
                </div>
            </div>
        </section>
    );
}