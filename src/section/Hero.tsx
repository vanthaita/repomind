import { motion } from "framer-motion";
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

const stats = [
  { value: 10, label: "Projects Connected" },
  { value: 100, label: "Lines of Code Analyzed" },
  { value: 500, label: "Pull Requests Optimized" },
  { value: 1500, label: "AI-Powered Insights" },
];

export default function Hero() {
  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      className="py-12 overflow-x-clip relative"
    >
      <div className="absolute top-0 left-0 w-full h-16 md:h-24 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-green-400/80 via-green-500/60 to-transparent blur-sm opacity-80" />
      </div>
      <div className="container relative mx-auto px-4 flex flex-col items-center z-10">
        <motion.h1 
          variants={containerVariants}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mt-4 text-white tracking-tight"
        >
          Understand code without <span className="text-white px-2 rounded">coding</span>
          <span className="text-white"> — </span>
          <span className="text-green-400">RepoMind</span> for <span className="text-white px-2 rounded">every IT role</span>!
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-center text-lg text-white/80 mt-4 max-w-2xl mx-auto font-normal"
        >
          <span className="text-green-400 font-semibold">AI</span> empowers every IT role—from Business Analyst, QA, Technical Writer, Security Analyst to Developer—to easily read, analyze, and review GitHub codebases <span className="bg-green-500 text-white px-2 rounded">without installation or running the project</span>.
        </motion.p>
        <motion.div 
          variants={itemVariants}
          className="mt-6 flex justify-center"
        >
          <motion.a
            href="#get-started"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-green-500 text-white font-medium py-2 px-6 rounded-full hover:bg-green-600 transition-all duration-200 text-base shadow-sm"
          >
            Get Started
          </motion.a>
        </motion.div>
        <motion.div
          variants={statsVariants}
          className="mt-10 w-full max-w-4xl overflow-x-auto"
        >
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                {stats.map((stat, idx) => (
                  <td
                    key={stat.label}
                    className={`align-top px-6 py-4 text-center border-neutral-800 ${idx !== 0 ? 'border-l' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-2xl md:text-3xl font-bold text-green-400">
                        <TextTicker value={stat.value} />+
                      </span>
                      <span className="text-base mt-1 text-white/90">
                        {stat.label}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="mt-10 max-w-3xl mx-auto w-full"
        >
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-neutral-800">
            <iframe 
              width="100%"
              height="350"
              src="https://www.youtube.com/embed/0UlmJsTIOD8?rel=0&modestbranding=1&controls=1&disablekb=1&fs=0"
              title="RepoMind Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}