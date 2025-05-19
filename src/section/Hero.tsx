import { motion } from "framer-motion";
import StaticLogoCloud from "@/components/LogoCloud";
import TextTicker from "@/components/TextTicker";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 120 }
  }
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Hero() {
  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      className="py-24 overflow-x-clip"
    >
      <div className="container relative mx-auto px-4">
        <div className="flex justify-center">
          <motion.h1 
            variants={containerVariants}
            className="text-6xl font-bold md:text-7xl lg:text-8xl text-center mt-6 text-white"
          >
            Repo
            <motion.strong 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260 }}
              className="bg-green-500 text-white px-1 rounded"
            >
              Mind
            </motion.strong>
            : AI-Powered GitHub Insights &amp; Chat
          </motion.h1>
        </div>

        <motion.p 
          variants={itemVariants}
          className="text-center text-xl text-white/80 mt-8 max-w-2xl mx-auto"
        >
          Connect your GitHub projects and unlock <strong className="text-green-300">AI-powered insights</strong>. Repomind uses advanced <strong className="text-green-300">LLM</strong> and <strong className="text-green-300">RAG</strong> technologies to analyze code, provide pull request insights, and let you <strong className="text-green-300">chat with your repository</strong>. Enhance your workflow with tailored AI recommendations.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="mt-12 flex justify-center"
        >
          <motion.a
            href="#get-started"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
          >
            Get Started Now
          </motion.a>
        </motion.div>
      <motion.div 
          variants={statsVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white"
        >
          {[10, 100, 500, 1500].map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 transition-all duration-300"
            >
              <h2 className="text-4xl font-bold">
                <TextTicker value={value} />+
              </h2>
              <p className="text-lg mt-2">
                {[
                  "Projects Connected",
                  "Lines of Code Analyzed",
                  "Pull Requests Optimized",
                  "AI-Powered Insights"
                ][index]}
              </p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          variants={itemVariants}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl">
            <iframe 
              width="100%"
              height="450"
              src="https://www.youtube.com/embed/0UlmJsTIOD8?rel=0&modestbranding=1&controls=1&disablekb=1&fs=0"
              title="RepoMind Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl"
            ></iframe>
          </div>
        </motion.div>

        
      </div>
    </motion.section>
  );
}