"use client";

import { useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  days: string;
  description: string;
}

const FEATURED_JOBS: Job[] = [
  {
    id: 1,
    title: "Product Manager",
    company: "Facebook",
    location: "Vancouver",
    salary: "$10k-$15k",
    type: "On-site",
    logo: "👨‍💼",
    days: "4 hrs ago",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "Google",
    location: "Silicon Valley",
    salary: "$150k",
    type: "Remote",
    logo: "🔍",
    days: "8 hrs ago",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "Twitter",
    location: "Vancouver",
    salary: "$8k-$8k",
    type: "Hybrid",
    logo: "🕊️",
    days: "12 Nov 22",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 4,
    title: "Business Analyst",
    company: "Stripe",
    location: "London",
    salary: "$10k",
    type: "Hybrid",
    logo: "💼",
    days: "4 hrs ago",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 5,
    title: "DevOps",
    company: "Microsoft",
    location: "Lagos",
    salary: "$1k-$1.5k",
    type: "Remote",
    logo: "⚙️",
    days: "13 Nov 22",
    description: "Explore the best job offers across several industries.",
  },
  {
    id: 6,
    title: "Visual Designer",
    company: "Twitter",
    location: "Vancouver",
    salary: "$10k-$15k",
    type: "Remote",
    logo: "🎨",
    days: "14 Nov 22",
    description: "Explore the best job offers across several industries.",
  },
];

const COMPANIES = [
  { name: "Stripe", logo: "💳" },
  { name: "Facebook", logo: "👨‍💼" },
  { name: "Shopify", logo: "🛍️" },
  { name: "Microsoft", logo: "⚙️" },
  { name: "Google", logo: "🔍" },
];

const JobsPage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSearch = () => {
    console.log({ jobTitle, location, jobType });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 text-center sm:px-6 lg:px-8 lg:py-16">
        <span className="inline-block text-xs font-bold tracking-wide text-cyan-400 uppercase">
          OVER 2000+ JOBS LISTED
        </span>

        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mt-6 mb-4">
          Find your new Job in a Few Clicks
        </h1>

        <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
          HireLink is a job search platform that helps employers and job seekers
          to find their perfect match in jobs and career.
        </p>
      </div>
    </div>
  );
};

export default JobsPage;
