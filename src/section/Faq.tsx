import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import React from 'react';
import { faqData } from '@/constants/faq';

const Faq = () => {
  return (
    <section className="relative w-full overflow-hidden py-12 flex justify-center bg-gradient-to-b from-neutral-950/80 via-neutral-900/80 to-neutral-950/80" id="faq">
      <div className="w-full max-w-4xl px-0 py-0 flex flex-col items-center">
        <div className="mb-10 flex flex-col items-center text-center w-full">
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
            Have questions? We have answers! Here are some of the most common questions about Repo<strong className="bg-green-500 text-white px-0.5">Mind</strong>.
          </p>
        </div>
        <hr className="mb-10 w-full border-neutral-800" />
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
  );
};

export default Faq;