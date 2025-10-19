"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ArrowRight, ArrowLeft, Phone, MessageCircle, Heart, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
  category: string;
  options: string[];
  crisis?: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    category: "Sleep Health",
    question: "How many hours of sleep do you typically get per night?",
    options: ["Less than 4 hours", "4-6 hours", "6-8 hours", "More than 8 hours"]
  },
  {
    id: 2,
    category: "Mental Health",
    question: "How often do you feel anxious or stressed?",
    options: ["Rarely or never", "Occasionally", "Frequently", "Almost constantly"],
    crisis: true
  },
  {
    id: 3,
    category: "Physical Activity",
    question: "How many days per week do you engage in physical exercise?",
    options: ["0 days", "1-2 days", "3-4 days", "5+ days"]
  },
  {
    id: 4,
    category: "Nutrition",
    question: "How would you describe your eating habits?",
    options: ["Very poor", "Below average", "Good", "Excellent"]
  },
  {
    id: 5,
    category: "Screen Time",
    question: "How many hours per day do you spend on screens (work excluded)?",
    options: ["Less than 2 hours", "2-4 hours", "4-6 hours", "More than 6 hours"]
  },
  {
    id: 6,
    category: "Social Connections",
    question: "How satisfied are you with your social relationships?",
    options: ["Very dissatisfied", "Somewhat dissatisfied", "Satisfied", "Very satisfied"]
  },
  {
    id: 7,
    category: "Mental Health",
    question: "Have you experienced feelings of sadness or depression recently?",
    options: ["Not at all", "Occasionally", "Frequently", "Severely"],
    crisis: true
  },
  {
    id: 8,
    category: "Work-Life Balance",
    question: "How well do you balance work and personal life?",
    options: ["Very poorly", "Below average", "Well", "Excellently"]
  },
  {
    id: 9,
    category: "Hydration",
    question: "How many glasses of water do you drink daily?",
    options: ["Less than 4", "4-6 glasses", "6-8 glasses", "More than 8"]
  },
  {
    id: 10,
    category: "Mindfulness",
    question: "Do you practice meditation or mindfulness?",
    options: ["Never", "Rarely", "Sometimes", "Regularly"]
  },
  {
    id: 11,
    category: "Energy Levels",
    question: "How would you rate your daily energy levels?",
    options: ["Very low", "Below average", "Good", "Excellent"]
  },
  {
    id: 12,
    category: "Mental Health",
    question: "Do you have thoughts of self-harm or suicide?",
    options: ["Never", "Rarely", "Sometimes", "Frequently"],
    crisis: true
  },
  {
    id: 13,
    category: "Health Goals",
    question: "What is your primary wellness goal?",
    options: ["Weight management", "Mental health", "Better sleep", "Overall fitness"]
  },
  {
    id: 14,
    category: "Substance Use",
    question: "How often do you consume alcohol?",
    options: ["Never", "Occasionally", "Weekly", "Daily"]
  },
  {
    id: 15,
    category: "Support System",
    question: "Do you have someone to talk to when you're struggling?",
    options: ["No one", "One person", "A few people", "Strong support system"]
  },
  {
    id: 16,
    category: "Self-Care",
    question: "How often do you engage in self-care activities?",
    options: ["Never", "Rarely", "Sometimes", "Regularly"]
  },
  {
    id: 17,
    category: "Overall Wellness",
    question: "How would you rate your overall wellbeing?",
    options: ["Very poor", "Below average", "Good", "Excellent"]
  }
];

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [direction, setDirection] = useState(1);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [question.id]: optionIndex });

    // Check for crisis responses (last two options on crisis questions)
    if (question.crisis && optionIndex >= 2) {
      setShowCrisisSupport(true);
    } else {
      if (currentQuestion < questions.length - 1) {
        setDirection(1);
        setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
      } else {
        // Quiz completed
        router.push("/wellness-plan");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleCrisisNext = () => {
    setShowCrisisSupport(false);
    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      router.push("/wellness-plan");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--orchid-neon)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-[var(--orchid-neon)] animate-pulse-glow" />
              <span className="text-xl font-bold neon-text">BalanceAI</span>
            </Link>
            <div className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-bold text-[var(--orchid-neon)]">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-900 rounded-full overflow-hidden neon-border">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] neon-glow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Crisis Support Modal */}
          <AnimatePresence>
            {showCrisisSupport && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="glass rounded-3xl p-8 max-w-lg w-full neon-border"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-10 h-10 text-[var(--pink-orchid)]" />
                    <h2 className="text-2xl font-bold">We're Here to Help</h2>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    We noticed you might be struggling. Please know that you're not alone, and help is available. 
                    Consider reaching out to a mental health professional or crisis support service.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="glass-light rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-[var(--orchid-neon)]" />
                        <span className="font-bold">Crisis Hotline</span>
                      </div>
                      <p className="text-sm text-gray-300">24/7 Support: 988 (US) or 1-800-273-8255</p>
                    </div>

                    <div className="glass-light rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="w-5 h-5 text-[var(--orchid-neon)]" />
                        <span className="font-bold">Text Support</span>
                      </div>
                      <p className="text-sm text-gray-300">Text HOME to 741741 (Crisis Text Line)</p>
                    </div>

                    <div className="glass-light rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-5 h-5 text-[var(--orchid-neon)]" />
                        <span className="font-bold">International Support</span>
                      </div>
                      <p className="text-sm text-gray-300">Visit findahelpline.com for your region</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleCrisisNext}
                      className="flex-1 bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90"
                    >
                      Continue Assessment
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/")}
                      className="border-[var(--orchid-neon)]/50 hover:bg-[var(--orchid-neon)]/20"
                    >
                      Exit
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 * direction }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass rounded-3xl p-8 neon-border">
                <div className="mb-6">
                  <div className="text-sm text-[var(--orchid-neon)] font-bold mb-2 uppercase tracking-wider">
                    {question.category}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                    {question.question}
                  </h2>
                </div>

                <div className="space-y-4">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                        answers[question.id] === index
                          ? "glass neon-glow bg-[var(--orchid-neon)]/20 border-2 border-[var(--orchid-neon)]"
                          : "glass hover:neon-glow-sm hover:bg-[var(--orchid-neon)]/10"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{option}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[question.id] === index
                            ? "border-[var(--orchid-neon)] bg-[var(--orchid-neon)]"
                            : "border-gray-600"
                        }`}>
                          {answers[question.id] === index && (
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-[var(--orchid-neon)]/50 hover:bg-[var(--orchid-neon)]/20 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {answers[question.id] !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setDirection(1);
                      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
                    } else {
                      router.push("/wellness-plan");
                    }
                  }}
                  className="bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90 neon-glow-sm"
                >
                  {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Your responses are private and encrypted. We use this information to create your personalized wellness plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}