"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, BookOpen, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/home/feature-card";
import { GrainyBackground } from "@/components/ui/grainy-background";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.8]), {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    // Hero section animations on mount
    gsap.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    });

    gsap.from(".hero-description", {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "power4.out",
    });

    gsap.from(".hero-button", {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: "back.out(1.7)",
    });

    // Scroll-triggered animations
    gsap.to(".parallax-bg", {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <>
      <GrainyBackground />
      <motion.div
        ref={containerRef}
        className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300"
      >
        {/* Hero Section */}
        <div className="relative parallax-section">
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0 bg-gradient-to-b from-[#F6F7C4]/30 via-white/50 to-[#A1EEBD]/30 dark:opacity-0 transition-opacity duration-300 parallax-bg"
          />
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0 bg-gradient-to-b from-[#F6F7C4]/10 via-transparent to-[#A1EEBD]/10 opacity-0 dark:opacity-100 transition-opacity duration-300 parallax-bg"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <div className="text-center relative z-10">
              <motion.h1
                className="hero-title text-6xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-8"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Welcome to{" "}
                <motion.span
                  className="bg-gradient-to-r from-[#7BD3EA] via-[#A1EEBD] to-[#F6F7C4] bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Youthopia
                </motion.span>
              </motion.h1>
              <motion.p
                className="hero-description mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                A magical world where young minds explore, create, and grow
                together. Join our community of curious adventurers!
              </motion.p>
              <motion.div
                className="mt-10 flex items-center justify-center gap-x-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/activity">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="hero-button bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black dark:text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                      Start Your Adventure
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                ref={statsRef}
                className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl mx-auto"
                style={{
                  opacity: isStatsInView ? 1 : 0,
                  transform: isStatsInView ? "none" : "translateY(50px)",
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
                }}
              >
                {[
                  { label: "Active Learners", value: "10,000+" },
                  { label: "Fun Courses", value: "200+" },
                  { label: "Daily Challenges", value: "50+" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      delay: index * 0.1,
                    }}
                  >
                    <motion.p
                      className="text-4xl font-bold text-[#7BD3EA]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {stat.value}
                    </motion.p>
                    <motion.p
                      className="mt-2 text-gray-600 dark:text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {stat.label}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          ref={featuresRef}
          className="py-24 bg-gradient-to-b from-[#A1EEBD]/30 dark:from-[#A1EEBD]/5 to-transparent"
          style={{
            opacity: isFeaturesInView ? 1 : 0,
            transform: isFeaturesInView ? "none" : "translateY(100px)",
            transition: "all 1s cubic-bezier(0.17, 0.55, 0.55, 1)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                className="text-4xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Why Choose Youthopia?
              </motion.h2>
              <motion.p
                className="mt-4 text-lg text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Discover a world of endless possibilities and learning
                adventures
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Creative Expression",
                  description:
                    "Unleash your creativity through art, music, and storytelling",
                  icon: Palette,
                  color: "bg-[#7BD3EA] dark:bg-[#7BD3EA]/20",
                },
                {
                  title: "Interactive Learning",
                  description:
                    "Engage with fun, interactive courses designed for young minds",
                  icon: BookOpen,
                  color: "bg-[#A1EEBD] dark:bg-[#A1EEBD]/20",
                },
                {
                  title: "Daily Challenges",
                  description:
                    "Take part in exciting challenges and win cool rewards",
                  icon: Trophy,
                  color: "bg-[#F6F7C4] dark:bg-[#F6F7C4]/20",
                },
                {
                  title: "Safe Community",
                  description:
                    "Connect with friends in a safe, moderated environment",
                  icon: Users,
                  color: "bg-[#7BD3EA] dark:bg-[#7BD3EA]/20",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    color={feature.color}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          ref={ctaRef}
          className="relative py-24"
          style={{
            opacity: isCtaInView ? 1 : 0,
            transform: isCtaInView ? "none" : "translateY(50px)",
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-[#7BD3EA]/10 dark:bg-[#7BD3EA]/5 px-6 py-16 sm:px-16 sm:py-24 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="text-center">
                  <motion.h2
                    className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    Ready to Start Your Journey?
                  </motion.h2>
                  <motion.p
                    className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    Join thousands of young explorers already discovering,
                    creating, and learning on Youthopia.
                  </motion.p>
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/activity">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="bg-[#A1EEBD] hover:bg-[#7BD3EA] text-black dark:text-white rounded-full px-8 py-6">
                          Get Started Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
