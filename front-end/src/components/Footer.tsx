import Link from "next/link";
// import { Facebook, Twitter, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        {/* Brand Segment */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link
            href="/"
            className="text-white text-2xl font-black tracking-tighter flex items-center gap-1"
          >
            Hire<span className="text-blue-500">Link</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Connecting world-class talent with the fastest-growing companies.
            Find remote, hybrid, and local careers designed around your
            lifestyle.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-700 transition-all duration-200"
            >
              {/* <Twitter size={18} /> */}
            </Link>
            <Link
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-700 transition-all duration-200"
            >
              {/* <Linkedin size={18} /> */}
            </Link>
            <Link
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-700 transition-all duration-200"
            >
              {/* <Facebook size={18} /> */}
            </Link>
            <Link
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-700 transition-all duration-200"
            >
              {/* <Github size={18} /> */}
            </Link>
          </div>
        </div>

        {/* Links Columns */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">
            For Talent
          </h4>
          <ul className="flex flex-col gap-3 text-sm font-medium">
            <li>
              <Link
                href="/jobs"
                className="hover:text-white hover:underline decoration-blue-500/30 underline-offset-4 transition-colors"
              >
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-white hover:underline decoration-blue-500/30 underline-offset-4 transition-colors"
              >
                Salaries
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-white hover:underline decoration-blue-500/30 underline-offset-4 transition-colors"
              >
                Career Advice
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-white hover:underline decoration-blue-500/30 underline-offset-4 transition-colors"
              >
                Talent Profile
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">
            For Recruiters
          </h4>
          <ul className="flex flex-col gap-3 text-sm font-medium">
            <li>
              <Link
                href="#"
                className="hover:text-white hover:underline decoration-blue-500/30 underline-offset-4 transition-colors"
              >
                Post a Job
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-white hover:underline decoration-blue-500/30 underline-offset-4 transition-colors"
              >
                Browse Candidates
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-white hover:underline decoration-blue-500/30 underline-offset-4 transition-colors"
              >
                Recruitment Plans
              </Link>
            </li>

          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">
            Contact Info
          </h4>
          <ul className="flex flex-col gap-3 text-sm font-medium">
            <li className="flex items-center gap-2.5">
              {/* <Mail size={16} className="text-blue-500 shrink-0" /> */}
              <span>mail@hirelink.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              {/* <Phone size={16} className="text-blue-500 shrink-0" /> */}
              <span>+2348012345678</span>
            </li>
            <li className="flex items-center gap-2.5">
              {/* <MapPin size={16} className="text-blue-500 shrink-0" /> */}
              <span>
                Km 52, Lekki–Epe Expressway, Ibeju-Lekki, Lagos State,
                Nigeria{" "}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-900/80 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p>© {new Date().getFullYear()} HireLink Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
