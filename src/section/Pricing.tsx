'use client'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'

const pricingPlans = [
  {
    name: 'Basic Insights',
    description: 'Explore fundamental project analysis.',
    monthlyPrice: 0,
    annualPrice: 0, 
    link: 'https://github.com/', 
    features: [
      'Codebase Analysis Overview',
      'Pull Request Insight Summaries',
      'Basic Code Chat Functionality',
    ],
  },
  {
    name: 'Professional Analytics',
    description:
      'Enhance workflow with advanced AI insights.',
    monthlyPrice: 49,
    annualPrice: 30, 
    link: 'https://github.com/',
    features: [
      'Everything in Basic Insights plan',
      'Advanced Pull Request Insights',
      'Enhanced Code Chat with Context',
      'Priority Support',
    ],
  },
  {
    name: 'Enterprise Intelligence',
    description:
      'For large organizations with advanced needs.',
    monthlyPrice: 199,
    annualPrice: 123,
    link: 'https://github.com/',
    features: [
      'Everything in Professional Analytics plan',
      'Unlimited Repository Analysis',
      'Integrate Custom LLM Key',
      'Dedicated Support & Training',
    ],
  },
]

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'M' | 'A'>('M')

  const Heading = () => (
    <div className="relative z-10 my-12 flex flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-start justify-center space-y-4 md:items-center">
        <div className="mb-2 inline-block rounded-full bg-green-100 px-2 py-[0.20rem] text-xs font-medium uppercase text-green-500 dark:bg-green-200">
          {' '}
          Pricing
        </div>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl dark:text-white">
          Unlock AI-powered insights for GitHub.
        </p>
        <p className="text-md max-w-xl text-gray-200 md:text-center dark:text-gray-200">
          RepoMind: AI for GitHub. Code analysis, pull request insights, and repository chat.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBillingCycle('M')}
          className={cn(
            `rounded-lg px-4 py-2 text-sm font-medium `,
            billingCycle === 'M'
              ? 'relative bg-green-500 text-white '
              : 'text-gray-200 hover:bg-green-100 dark:text-gray-300 dark:hover:text-black hover:text-black',
          )}
        >
          Monthly
          {billingCycle === 'M' && <BackgroundShift shiftKey="monthly" />}
        </button>
        <button
          onClick={() => setBillingCycle('A')}
          className={cn(
            `rounded-lg px-4 py-2 text-sm font-medium `,
            billingCycle === 'A'
              ? 'relative bg-green-500 text-white '
              : 'text-gray-200 hover:bg-green-100 dark:text-gray-300 dark:hover:text-black hover:text-black',
          )}
        >
          Annual
          {billingCycle === 'A' && <BackgroundShift shiftKey="annual" />}
        </button>
      </div>
    </div>
  )

  const PricingCards = () => (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:gap-4">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className="w-full rounded-xl border-[1px] border-border/50 bg-neutral-900 p-6 text-left"
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
                window.open(plan.link)
              }}
              className="mt-8 w-full rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-500/90"
            >
              Get Started
            </motion.button>
          </div>
          {plan.features.map((feature, idx) => (
            <div key={idx} className="mb-3 flex items-center gap-2">
              <Check className="text-green-500" size={18} />
              <span className="text-sm text-gray-400">{feature}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <section className="relative w-full overflow-hidden py-12 text-white bg-gray-950 lg:px-2 lg:py-12" id='pricing'>
      <Heading />
      <PricingCards />
    </section>
  )
}

const BackgroundShift = ({ shiftKey }: { shiftKey: string }) => (
  <motion.span
    key={shiftKey}
    layoutId="bg-shift"
    className="absolute inset-0 -z-10 rounded-lg bg-green-500"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
  />
)

export default function PricingPage() {
  return <Pricing />
}