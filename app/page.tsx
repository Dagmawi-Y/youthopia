import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, BookOpen, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { FeatureCard } from "@/components/home/feature-card";

export default function Home() {
  return (
    <>
      <NoiseTexture />
      <div className="relative min-h-screen overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-[#F6F7C4] via-white to-[#A1EEBD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <div className="text-center relative z-10">
              <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-8">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[#7BD3EA] via-[#A1EEBD] to-[#F6F7C4] bg-clip-text text-transparent">
                  Youthopia
                </span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
                A magical world where young minds explore, create, and grow together.
                Join our community of curious adventurers!
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/activity">
                  <Button className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                    Start Your Adventure
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
                {[
                  { label: "Active Learners", value: "10,000+" },
                  { label: "Fun Courses", value: "200+" },
                  { label: "Daily Challenges", value: "50+" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
                    <p className="text-4xl font-bold text-[#7BD3EA]">{stat.value}</p>
                    <p className="mt-2 text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gradient-to-b from-[#A1EEBD] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Why Choose Youthopia?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Discover a world of endless possibilities and learning adventures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                title="Creative Expression"
                description="Unleash your creativity through art, music, and storytelling"
                icon={Palette}
                color="bg-[#7BD3EA]"
              />
              <FeatureCard
                title="Interactive Learning"
                description="Engage with fun, interactive courses designed for young minds"
                icon={BookOpen}
                color="bg-[#A1EEBD]"
              />
              <FeatureCard
                title="Daily Challenges"
                description="Take part in exciting challenges and win cool rewards"
                icon={Trophy}
                color="bg-[#F6F7C4]"
              />
              <FeatureCard
                title="Safe Community"
                description="Connect with friends in a safe, moderated environment"
                icon={Users}
                color="bg-[#7BD3EA]"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-[#7BD3EA]/10 px-6 py-16 sm:px-16 sm:py-24">
              <div className="relative">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Join thousands of young explorers already discovering, creating,
                    and learning on Youthopia.
                  </p>
                  <div className="mt-8">
                    <Link href="/activity">
                      <Button className="bg-[#A1EEBD] hover:bg-[#7BD3EA] text-black rounded-full px-8 py-6">
                        Get Started Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}