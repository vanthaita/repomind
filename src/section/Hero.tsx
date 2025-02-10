import TextTicker from "@/components/TextTicker";

export default function Hero() {
  return (
    <section className="py-24 overflow-x-clip">
      <div className="container relative mx-auto px-4">
        <div className="flex justify-center">
          <h1 className="text-6xl font-bold md:text-7xl lg:text-8xl text-center mt-6 text-white">
            Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>: AI-Powered GitHub Insights &amp; Chat
          </h1>
        </div>
        <p className="text-center text-xl text-white/80 mt-8 max-w-2xl mx-auto"> Connect your GitHub projects and unlock <strong className="text-green-300">AI-powered insights</strong>.         Repomind uses advanced <strong className="text-green-300">LLM</strong> and <strong className="text-green-300">RAG</strong> technologies to analyze code, provide pull request insights, and let you <strong className="text-green-300">chat with your repository</strong>. Enhance your workflow with tailored AI recommendations. 
        </p>
        <div className="mt-12 flex justify-center">
          <a
            href="#get-started"
            className="bg-white text-green-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
          >
            Get Started Now
          </a>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
          <div className="p-6   transition-all duration-300">
            <h2 className="text-4xl font-bold">
              <TextTicker value={10} />+
            </h2>
            <p className="text-lg mt-2">Projects Connected</p>
          </div>
          <div className="p-6  transition-all duration-300">
            <h2 className="text-4xl font-bold">
              <TextTicker value={100} />K+
            </h2>
            <p className="text-lg mt-2">Lines of Code Analyzed</p>
          </div>
          <div className="p-6  transition-all duration-300">
            <h2 className="text-4xl font-bold">
              <TextTicker value={500} />+
            </h2>
            <p className="text-lg mt-2">Pull Requests Optimized</p>
          </div>
          <div className="p-6  transition-all duration-300">
            <h2 className="text-4xl font-bold">
              <TextTicker value={1500} />+
            </h2>
            <p className="text-lg mt-2">AI-Powered Insights</p>
          </div>
        </div>
      </div>
    </section>
  );
}