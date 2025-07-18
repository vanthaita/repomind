import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Alice Nguyen',
    role: 'Business Analyst',
    quote: 'RepoMind helps me understand business logic in code without ever running the project. The AI explanations are clear and save me hours every week.'
  },
  {
    name: 'John Smith',
    role: 'QA Engineer',
    quote: 'I can quickly review API flows and write test cases thanks to RepoMind. The pull request insights are a game changer for our team.'
  },
  {
    name: 'Maria Lee',
    role: 'Technical Writer',
    quote: 'Writing documentation is so much easier now. I get instant, AI-generated explanations for any part of the codebase.'
  },
  {
    name: 'David Tran',
    role: 'Security Analyst',
    quote: 'RepoMind helps me spot security issues and compliance risks fast. It is a must-have for any code audit.'
  },
];

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fff&color=10b981&size=128&bold=true&format=png`;

const Testimonial = () => {
  return (
    <section className="w-full py-16 flex justify-center bg-transparent">
      <div className="w-full max-w-6xl px-4 rounded-2xl py-14 flex flex-col items-center ">
        <h2 className="text-4xl font-bold text-center mb-4 text-green-500 drop-shadow-lg">What Our Users Say</h2>
        <hr className="mb-10 w-full border-neutral-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
          {testimonials.map((t, idx) => (
            <React.Fragment key={idx}>
              <div
                className={
                  `flex flex-col items-center px-8 py-10 bg-transparent rounded-2xl ` +
                  `transition-all duration-300 `
                }
                style={{ animation: `fadeInUp 0.6s ${0.1 * idx + 0.2}s both` }}
              >
                <span className="text-green-400 mb-2 text-2xl"><FaQuoteLeft /></span>
                <img src={getAvatarUrl(t.name)} alt={t.name} className="w-16 h-16 rounded-full mb-4 object-cover border-4 border-white shadow-md" />
                <p className="text-gray-200 text-base mb-4 italic text-center font-medium">"{t.quote}"</p>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-white text-lg">{t.name}</span>
                  <span className="text-xs text-green-400 mt-1 tracking-wide">{t.role}</span>
                </div>
              </div>
              {idx !== testimonials.length - 1 && (
                <div
                  className={
                    `block md:hidden w-full h-px bg-neutral-800 mx-auto` +
                    ` ${(idx + 1) % 2 === 0 ? 'mb-0' : 'mb-0'}`
                  }
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial; 