"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Palette,
  BookOpen,
  Trophy,
  Users,
  Code,
  Brush,
  Music,
  Camera,
  Bot,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/home/feature-card";
import { GrainyBackground } from "@/components/ui/grainy-background";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: "Coding & Robotics",
    icon: Code,
    color: "bg-blue-500",
    items: [
      "Scratch Programming",
      "Python Basics",
      "Robot Building",
      "Game Design",
    ],
  },
  {
    title: "Arts & Crafts",
    icon: Brush,
    color: "bg-pink-500",
    items: ["Drawing", "Painting", "Origami", "Sculpture"],
  },
  {
    title: "Music & Sound",
    icon: Music,
    color: "bg-purple-500",
    items: ["Basic Notes", "Rhythm Games", "Song Creation", "Digital Music"],
  },
  {
    title: "Digital Media",
    icon: Camera,
    color: "bg-green-500",
    items: ["Photography", "Video Editing", "Animation", "Graphic Design"],
  },
  {
    title: "Science & Tech",
    icon: Bot,
    color: "bg-yellow-500",
    items: ["Experiments", "3D Printing", "Electronics", "Nature Study"],
  },
];

const steps = [
  {
    title: "Create Your Profile",
    description: "Sign up and personalize your learning journey",
    image: "/images/step1.png",
  },
  {
    title: "Choose Your Skills",
    description: "Pick from our wide range of exciting activities",
    image: "/images/step2.png",
  },
  {
    title: "Start Learning",
    description: "Jump into interactive lessons and have fun!",
    image: "/images/step3.png",
  },
];

const testimonials = [
  {
    quote: "My kids love the creative projects and coding challenges!",
    author: "Parent of 2",
    rating: 5,
  },
  {
    quote: "The interactive lessons make learning so much fun",
    author: "Young Learner",
    rating: 5,
  },
  {
    quote: "Best platform for developing STEAM skills",
    author: "Education Expert",
    rating: 5,
  },
];

const faqs = [
  {
    question: "What age group is Youthopia for?",
    answer:
      "Youthopia is designed for children aged 6-14 years old, with content tailored to different age groups and skill levels.",
  },
  {
    question: "How does the learning process work?",
    answer:
      "Children learn through interactive projects, guided tutorials, and hands-on activities. Each lesson is gamified and includes rewards for completion.",
  },
  {
    question: "Is parental supervision required?",
    answer:
      "While our platform is safe and child-friendly, we recommend parental supervision for younger children, especially during hands-on projects.",
  },
  {
    question: "What equipment do we need?",
    answer:
      "Most activities only require a computer or tablet with internet access. Some projects might need basic art supplies or components that are easily available.",
  },
];

// Add TypeWriter component
const TypeWriter = () => {
  const texts = [
    "Welcome to Youthopia",
    "Discover New Skills",
    "Learn & Grow",
    "Have Fun",
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) return;

    const typeSpeed = isDeleting ? 30 : 80;
    const currentFullText = texts[currentTextIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting && !isWaiting) {
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        } else {
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            setIsDeleting(true);
          }, 2000);
        }
      } else if (isDeleting && !isWaiting) {
        if (currentText.length > 0) {
          setCurrentText(currentFullText.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }, 500);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, isWaiting, texts]);

  return (
    <motion.h1
      className="text-4xl md:text-6xl font-bold text-center hero-title"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        key={currentTextIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentText}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="ml-1"
      >
        |
      </motion.span>
    </motion.h1>
  );
};

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

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
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
              <TypeWriter />
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

        {/* Skills Explorer Section */}
        <motion.section className="py-24 bg-gradient-to-b from-[#F6F7C4]/30 to-white dark:from-[#F6F7C4]/10 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                151 Skills To Explore
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover exciting new abilities and unleash your creativity
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  <div className={`p-6 ${category.color}/10`}>
                    <category.icon className="w-8 h-8 text-gray-900 dark:text-white mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {category.items.map((item) => (
                        <li
                          key={item}
                          className="text-gray-600 dark:text-gray-300 flex items-center"
                        >
                          <ArrowRight className="w-4 h-4 mr-2 text-[#7BD3EA]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Getting Started Steps */}
        <motion.section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Begin your learning adventure with these easy steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section className="py-24 bg-[#A1EEBD]/10 dark:bg-[#A1EEBD]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Community Says
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {testimonial.author}
                  </p>
                  <div className="flex justify-center mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-yellow-400"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <motion.button
                    className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                  >
                    <span className="text-left font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 py-4 bg-white dark:bg-gray-900"
                      >
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

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
