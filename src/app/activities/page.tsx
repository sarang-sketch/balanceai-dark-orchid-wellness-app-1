"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain, TrendingUp, Award, Flame, Trophy, Heart, Moon, Activity,
  Smartphone, MessageSquare, Users, Plus, Settings, Bell, Home,
  Calendar, Target, CheckCircle2, Star, Zap, Menu, X, Search,
  Filter, Sun, Wind, Droplets
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityItem {
  id: string;
  title: string;
  category: "Mindfulness" | "Fitness" | "Nutrition" | "Sleep";
  duration: number;
  icon: any;
  color: string;
  description: string;
}

export default function ActivitiesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activities: ActivityItem[] = [
    { id: "1", title: "Morning Yoga", category: "Fitness", duration: 15, icon: Sun, color: "from-yellow-400 to-orange-500", description: "Start your day with energizing yoga poses." },
    { id: "2", title: "Guided Meditation", category: "Mindfulness", duration: 10, icon: Brain, color: "from-purple-400 to-indigo-500", description: "Clear your mind and find inner peace." },
    { id: "3", title: "HIIT Workout", category: "Fitness", duration: 20, icon: Zap, color: "from-red-500 to-pink-500", description: "High-intensity interval training for a quick burn." },
    { id: "4", title: "Mindful Breathing", category: "Mindfulness", duration: 5, icon: Wind, color: "from-cyan-400 to-blue-500", description: "A short exercise to calm your nervous system." },
    { id: "5", title: "Healthy Meal Prep", category: "Nutrition", duration: 45, icon: Award, color: "from-green-400 to-emerald-500", description: "Plan and prepare nutritious meals for the week." },
    { id: "6", title: "Hydration Challenge", category: "Nutrition", duration: 1, icon: Droplets, color: "from-blue-300 to-sky-400", description: "Drink 8 glasses of water today." },
    { id: "7", title: "Digital Detox", category: "Mindfulness", duration: 60, icon: Smartphone, color: "from-gray-400 to-gray-600", description: "Disconnect from your devices for an hour." },
    { id: "8", title: "Evening Stretching", category: "Sleep", duration: 10, icon: Moon, color: "from-indigo-300 to-purple-400", description: "Relax your muscles for a restful night's sleep." },
  ];

  const currentStreak = 12;

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-screen w-72 glass border-r border-[var(--orchid-neon)]/20 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Brain className="w-10 h-10 text-[var(--orchid-neon)] animate-pulse-glow" />
              <span className="text-2xl font-bold neon-text">BalanceAI</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="glass-light rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 border-2 border-[var(--orchid-neon)] rounded-full">
                <img src="https://i.pravatar.cc/150?img=3" alt="User" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h3 className="font-bold">Alex Morgan</h3>
                <p className="text-sm text-gray-400">Premium Member</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-[var(--orchid-neon)]">{currentStreak} Day Streak</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <Link href="/dashboard">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--orchid-neon)]/10 transition-colors">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link href="/wellness-plan">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--orchid-neon)]/10 transition-colors">
                <Target className="w-5 h-5" />
                <span>Wellness Plan</span>
              </div>
            </Link>
            <Link href="/activities">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--orchid-neon)]/20 text-[var(--orchid-neon)] font-semibold">
                <Activity className="w-5 h-5" />
                <span>Activities</span>
              </div>
            </Link>
            <Link href="/community">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--orchid-neon)]/10 transition-colors">
                <Users className="w-5 h-5" />
                <span>Community</span>
              </div>
            </Link>
            <Link href="/chatbot">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--orchid-neon)]/10 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span>AI Assistant</span>
              </div>
            </Link>
            <Link href="/settings">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--orchid-neon)]/10 transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </Link>
          </nav>

          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Log Activity
            </Button>
          </div>
        </div>
      </motion.aside>

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 glass border-b border-[var(--orchid-neon)]/20">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search activities..."
                className="glass-light w-full pl-10 pr-4 py-2 rounded-xl border border-transparent focus:border-[var(--orchid-neon)]/50 focus:outline-none"
              />
            </div>
            <Button variant="outline" className="border-[var(--orchid-neon)]/50 hover:bg-[var(--orchid-neon)]/20">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Activities</h1>
            <p className="text-gray-400">Find the perfect activity to boost your well-being.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="glass rounded-3xl p-6 hover:neon-glow-sm transition-all duration-300 h-full flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${activity.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-bold text-[var(--orchid-neon)] bg-gray-900 px-2 py-1 rounded-full">
                          {activity.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{activity.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm text-gray-300">{activity.duration} min</span>
                      <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                        Start
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
