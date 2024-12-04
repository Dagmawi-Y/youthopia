import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#A1EEBD]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-[#7BD3EA]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#7BD3EA] via-[#A1EEBD] to-[#F6F7C4] bg-clip-text text-transparent">
                Youthopia
              </span>
            </div>
            <p className="text-gray-600">
              A magical world where young minds explore, create, and grow together.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/activity" className="text-gray-600 hover:text-[#7BD3EA]">
                  Activity Feed
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-gray-600 hover:text-[#7BD3EA]">
                  Learning Library
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="text-gray-600 hover:text-[#7BD3EA]">
                  Challenges
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guidelines" className="text-gray-600 hover:text-[#7BD3EA]">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-600 hover:text-[#7BD3EA]">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-[#7BD3EA]">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#7BD3EA]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#7BD3EA]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-[#7BD3EA]">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Youthopia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}