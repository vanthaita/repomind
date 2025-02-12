import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion";
import React from 'react'

const faqData = [
  {
    question: "What is RepoMind?",
    answer:
      "RepoMind is an AI-powered tool designed to provide intelligent insights into your GitHub repositories. It uses cutting-edge LLM and RAG technologies to analyze your code, summarize pull requests, and allow you to chat with your repository to understand it better and improve your development workflow.",
  },
  {
    question: "How does RepoMind analyze my code?",
    answer:
      "RepoMind connects to your GitHub repository and analyzes your codebase using AI models. It understands code structure, identifies key areas, and provides summaries and insights based on this analysis. We prioritize security and only access the necessary information to provide the service.",
  },
  {
    question: "What kind of insights can I get from pull requests?",
    answer:
      "RepoMind provides actionable insights from your pull requests, such as summaries of changes, potential issues, and suggestions for improvement. This helps in faster code reviews and better code quality.",
  },
  {
    question: "Can I really chat with my repository?",
    answer:
      "Yes! RepoMind allows you to chat directly with your repository. You can ask questions about your code, understand specific functionalities, and get AI-driven explanations directly within the chat interface.",
  },
  {
    question: "Is RepoMind secure for my private repositories?",
    answer:
      "Security is our top priority. RepoMind uses secure authentication and authorization protocols to access your repositories. We adhere to best practices for data security and privacy. Your code and data are kept confidential and used solely for the purpose of providing the RepoMind service.",
  },
  {
    question: "What plans do you offer?",
    answer:
      "We offer different pricing plans to suit various needs, including a free plan for basic insights, a professional plan with enhanced analytics, and an enterprise plan for ultimate customization and dedicated support. Please check our pricing page for detailed plan information.",
  },
  {
    question: "How do I get started with RepoMind?",
    answer:
      "Getting started is easy! Simply sign up on our website and connect your GitHub account. Follow the instructions to authorize RepoMind to access your repositories, and you can start unlocking AI-powered insights right away.",
  },
];

const Faq = () => {
  return (
    <section className="relative max-w-4xl mx-auto overflow-hidden py-12 text-white bg-transparent lg:px-2 lg:py-12" id="faq">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.h2
              className="text-4xl font-bold text-center mb-4 text-green-500"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              FAQ
          </motion.h2>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-gray-200 max-w-2xl">
            Have questions? We have answers! Here are some of the most common
            questions about Repo<strong className="bg-green-500 text-white px-0.5 rounded">Mind</strong>.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index} className="border-border/50 border-b last:border-b-0 bg-transparent">
              <AccordionTrigger className="text-white hover:underline focus:ring-green-500 focus:text-green-500">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-gray-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default Faq