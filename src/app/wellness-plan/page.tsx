"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Dumbbell, Heart, Moon, Apple, Sparkles, Play, Pause, RotateCcw, ArrowRight, CheckCircle2, TrendingUp, Target, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Goal {
  id: string;
  title: string;
  icon: any;
  description: string;
  color: string;
}

interface Exercise {
  id: string;
  name: string;
  duration: string;
  difficulty: string;
  image: string;
  steps: string[];
}

interface Meditation {
  id: string;
  title: string;
  duration: string;
  type: string;
  image: string;
}

const goals: Goal[] = [
  {
    id: "mental-health",
    title: "Mental Wellness",
    icon: Brain,
    description: "Reduce stress and improve mental clarity",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "fitness",
    title: "Physical Fitness",
    icon: Dumbbell,
    description: "Build strength and endurance",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "sleep",
    title: "Better Sleep",
    icon: Moon,
    description: "Improve sleep quality and duration",
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: "nutrition",
    title: "Healthy Eating",
    icon: Apple,
    description: "Optimize nutrition and diet",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "mindfulness",
    title: "Mindfulness",
    icon: Heart,
    description: "Practice meditation and self-awareness",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "energy",
    title: "Energy Boost",
    icon: Zap,
    description: "Increase daily energy and vitality",
    color: "from-yellow-500 to-orange-500"
  }
];

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Morning Yoga Flow",
    duration: "15 min",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    steps: [
      "Start in Mountain Pose (Tadasana)",
      "Flow into Downward Dog",
      "Move through Cat-Cow stretches",
      "Hold Warrior I pose for 30 seconds each side",
      "End with Child's Pose for relaxation"
    ]
  },
  {
    id: "2",
    name: "Breathing Exercise",
    duration: "10 min",
    difficulty: "All Levels",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    steps: [
      "Sit comfortably with spine straight",
      "Close your eyes and relax shoulders",
      "Inhale deeply through nose for 4 counts",
      "Hold breath for 4 counts",
      "Exhale slowly through mouth for 6 counts",
      "Repeat for 10 cycles"
    ]
  },
  {
    id: "3",
    name: "Core Strength",
    duration: "20 min",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    steps: [
      "Plank hold for 30 seconds",
      "Mountain climbers - 20 reps",
      "Russian twists - 15 reps each side",
      "Bicycle crunches - 20 reps",
      "Rest 1 minute and repeat 3 times"
    ]
  }
];

const meditations: Meditation[] = [
  {
    id: "1",
    title: "Morning Mindfulness",
    duration: "10 min",
    type: "Guided",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80"
  },
  {
    id: "2",
    title: "Stress Relief",
    duration: "15 min",
    type: "Breathing",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
  },
  {
    id: "3",
    title: "Sleep Preparation",
    duration: "20 min",
    type: "Body Scan",
    image: "https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=800&q=80"
  },
  {
    id: "4",
    title: "Focus & Clarity",
    duration: "12 min",
    type: "Concentration",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80"
  }
];

export default function WellnessPlanPage() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentMeditation, setCurrentMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const generatePlan = () => {
    setShowPlan(true);
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
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 neon-border">
              <Sparkles className="w-5 h-5 text-[var(--orchid-neon)]" />
              <span className="text-sm font-bold text-[var(--orchid-neon)]">AI-Generated Plan</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-text">
              Your Personalized Wellness Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Based on your assessment, we've crafted a customized plan to help you achieve optimal wellness
            </p>
          </motion.div>

          {/* Goal Selection */}
          {!showPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Select Your Wellness Goals</h2>
                <p className="text-gray-400">Choose up to 3 primary goals you want to focus on</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {goals.map((goal, index) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        className={`glass rounded-3xl p-6 cursor-pointer transition-all duration-300 ${
                          isSelected ? "neon-glow border-2 border-[var(--orchid-neon)]" : "hover:neon-glow-sm"
                        }`}
                        onClick={() => toggleGoal(goal.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${goal.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-6 h-6 text-[var(--orchid-neon)]" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{goal.title}</h3>
                        <p className="text-gray-400 text-sm">{goal.description}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center">
                <Button
                  onClick={generatePlan}
                  disabled={selectedGoals.length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90 neon-glow disabled:opacity-50"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Generate My Plan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-400 mt-4">
                  {selectedGoals.length === 0 ? "Select at least one goal to continue" : `${selectedGoals.length} goal${selectedGoals.length > 1 ? 's' : ''} selected`}
                </p>
              </div>
            </motion.div>
          )}

          {/* Generated Plan */}
          {showPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Weekly Overview */}
              <div className="glass rounded-3xl p-8 neon-border">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-[var(--orchid-neon)]" />
                  Your Weekly Plan
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { label: "Daily Exercises", value: "3 sessions", icon: Dumbbell },
                    { label: "Meditation", value: "15 min/day", icon: Brain },
                    { label: "Sleep Goal", value: "7-8 hours", icon: Moon },
                    { label: "Water Intake", value: "8 glasses", icon: Heart }
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        className="glass-light rounded-2xl p-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Icon className="w-8 h-8 text-[var(--orchid-neon)] mx-auto mb-3" />
                        <div className="text-2xl font-bold text-[var(--orchid-neon)] mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Exercise Demonstrations */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Dumbbell className="w-8 h-8 text-[var(--orchid-neon)]" />
                  Recommended Exercises
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="glass rounded-3xl overflow-hidden hover:neon-glow-sm transition-all duration-300 cursor-pointer group">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={exercise.image}
                            alt={exercise.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                          <div className="absolute top-4 right-4 flex gap-2">
                            <span className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-bold text-[var(--orchid-neon)]">
                              {exercise.duration}
                            </span>
                            <span className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-bold">
                              {exercise.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4">{exercise.name}</h3>
                          <Button
                            onClick={() => setCurrentExercise(exercise)}
                            className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            View Instructions
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Meditation Sessions */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Brain className="w-8 h-8 text-[var(--orchid-neon)]" />
                  Guided Meditation Sessions
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {meditations.map((meditation, index) => (
                    <motion.div
                      key={meditation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="glass rounded-3xl overflow-hidden hover:neon-glow-sm transition-all duration-300 cursor-pointer group">
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={meditation.image}
                            alt={meditation.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <div className="w-16 h-16 rounded-full bg-[var(--orchid-neon)]/30 backdrop-blur-sm flex items-center justify-center border-2 border-white">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </motion.div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-1">{meditation.title}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{meditation.type}</span>
                            <span>{meditation.duration}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90 neon-glow">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Start My Wellness Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Exercise Modal */}
          {currentExercise && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setCurrentExercise(null)}
            >
              <motion.div
                className="glass rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto neon-border"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img
                    src={currentExercise.image}
                    alt={currentExercise.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <button
                    onClick={() => setCurrentExercise(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center hover:bg-black/90 transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold flex-1">{currentExercise.name}</h2>
                    <span className="px-4 py-2 glass-light rounded-full text-sm font-bold text-[var(--orchid-neon)]">
                      {currentExercise.duration}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-[var(--orchid-neon)]">Step-by-Step Instructions</h3>
                    <div className="space-y-4">
                      {currentExercise.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          className="flex gap-4 items-start glass-light rounded-2xl p-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--dark-orchid)] to-[var(--orchid-neon)] flex items-center justify-center font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-300 pt-1">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90"
                    onClick={() => setCurrentExercise(null)}
                  >
                    Got It!
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}