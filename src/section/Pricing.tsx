'use client'
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { pricingPlans } from '@/constants/pricing';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'M' | 'A'>('M');

  const Heading = () => (
    <div className="relative z-10 my-12 flex flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-start justify-center space-y-4 md:items-center">
        <motion.h2
          className="text-4xl font-bold text-center mb-4 text-green-500"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          PRICING
        </motion.h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl dark:text-white">
          Unlock AI-powered insights for every IT role.
        </p>
        <p className="text-md max-w-xl text-gray-200 md:text-center dark:text-gray-200">
          RepoMind: AI for GitHub. Code analysis, pull request insights, and repository chat for BA, QA, Technical Writer, Security Analyst, Auditor, Developer.
        </p>
      </div>
    </div>
  );

  const PricingCards = () => (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:gap-0">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className={cn(
            "w-full p-6 text-left",
            index !== 0 ? 'lg:border-l lg:border-neutral-800' : ''
          )}
        >
          <p className="mb-1 mt-0 text-sm font-medium uppercase text-green-500">
            {plan.name}
          </p>
          <p className="my-0 mb-6 text-sm text-gray-400">{plan.description}</p>
          <div className="mb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={billingCycle === 'M' ? 'monthly' : 'annual'}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="my-0 text-3xl font-semibold text-white dark:text-gray-100"
              >
                <span>
                  {plan.monthlyPrice === 0 ? 'Free' : `$${plan.monthlyPrice}`}
                </span>
                {plan.monthlyPrice !== 0 && (
                  <span className="text-sm font-medium text-gray-400">
                    /month
                  </span>
                )}
              </motion.p>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                window.open(plan.link);
              }}
              className="mt-8 w-full rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-500/90"
            >
              Get Started
            </motion.button>
          </div>
          <div className="mb-3">
            {plan.features.map((feature, idx) => (
              <div key={idx} className="mb-3 flex items-center gap-2">
                <Check className="text-green-500" size={18} />
                <span className="text-sm text-gray-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden py-12 flex justify-center bg-gradient-to-b from-neutral-950/80 via-neutral-900/80 to-neutral-950/80" id='pricing'>
      <div className="w-full max-w-6xl px-0 py-0 flex flex-col items-center">
        <Heading />
        <hr className="my-10 w-full border-neutral-800" />
        <PricingCards />
      </div>
    </section>
  );
};

export default Pricing;