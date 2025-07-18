export const pricingPlans = [
  {
    name: 'Free',
    description: 'For individuals who want to explore basic AI-powered code insights.',
    monthlyPrice: 0,
    annualPrice: 0,
    link: 'https://github.com/',
    features: [
      '1 repository',
      '100 AI messages/month',
      'Basic code analysis',
      'AI chat with codebase',
      'Pull request insights',
    ],
  },
  {
    name: 'Pro',
    description: 'For professionals and small teams needing advanced features and more usage.',
    monthlyPrice: 19,
    annualPrice: 190, // 2 months free if paid annually
    link: 'https://github.com/',
    features: [
      '5 repositories',
      '1000 AI messages/month',
      'Advanced code analysis',
      'AI chat with codebase',
      'Pull request insights',
      'Priority support',
    ],
  },
  {
    name: 'Team',
    description: 'For teams and organizations requiring collaboration and API access.',
    monthlyPrice: 49,
    annualPrice: 490, // 2 months free if paid annually
    link: 'https://github.com/',
    features: [
      '20 repositories',
      '5000 AI messages/month',
      'All Pro features',
      'Team collaboration',
      'API access',
      'Dedicated support',
    ],
  },
]; 