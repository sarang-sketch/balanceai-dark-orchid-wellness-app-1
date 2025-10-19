"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, TrendingUp, Award, Flame, Trophy, Heart, Moon, Activity, 
  Smartphone, MessageSquare, Users, Plus, Settings, Bell, Home,
  Calendar, Target, CheckCircle2, Star, Zap, Menu, X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
  color: string;
}

interface Badge {
  id: string;
  name: string;
  icon: any;
  earned: boolean;
  description: string;
}

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  completionRate: number;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const metrics: Metric[] = [
    {
      label: "Screen Time",
      value: "4.5h",
      change: "-15%",
      trend: "down",
      icon: Smartphone,
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Sleep Quality",
      value: "85%",
      change: "+12%",
      trend: "up",
      icon: Moon,
      color: "from-indigo-500 to-purple-500"
    },
    {
      label: "Activity Minutes",
      value: "127",
      change: "+23%",
      trend: "up",
      icon: Activity,
      color: "from-green-500 to-emerald-500"
    },
    {
      label: "Mood Score",
      value: "8.2/10",
      change: "+0.8",
      trend: "up",
      icon: Heart,
      color: "from-pink-500 to-rose-500"
    }
  ];

  const badges: Badge[] = [
    { id: "1", name: "7-Day Streak", icon: Flame, earned: true, description: "Maintained wellness routine for 7 days" },
    { id: "2", name: "Early Bird", icon: Moon, earned: true, description: "Completed 5 morning routines" },
    { id: "3", name: "Zen Master", icon: Brain, earned: false, description: "Complete 30 meditation sessions" },
    { id: "4", name: "Fitness Pro", icon: Trophy, earned: true, description: "Exercised 20 times this month" },
    { id: "5", name: "Wellness Warrior", icon: Award, earned: false, description: "Reach 90% completion rate" },
    { id: "6", name: "Hydration Hero", icon: Star, earned: true, description: "Met water goals for 14 days" }
  ];

  const familyMembers: FamilyMember[] = [
    { id: "1", name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1", streak: 12, completionRate: 87 },
    { id: "2", name: "Mike Chen", avatar: "https://i.pravatar.cc/150?img=12", streak: 8, completionRate: 76 },
    { id: "3", name: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=5", streak: 15, completionRate: 92 }
  ];

  const weeklyData = [
    { day: "Mon", value: 75 },
    { day: "Tue", value: 82 },
    { day: "Wed", value: 68 },
    { day: "Thu", value: 91 },
    { day: "Fri", value: 85 },
    { day: "Sat", value: 78 },
    { day: "Sun", value: 88 }
  ];

  const currentStreak = 12;
  const longestStreak = 28;
  const completionRate = 87;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Sidebar Backdrop */}
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

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-screen w-72 glass border-r border-[var(--orchid-neon)]/20 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Brain className="w-10 h-10 text-[var(--orchid-neon)] animate-pulse-glow" />
              <span className="text-2xl font-bold neon-text">BalanceAI</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile */}
          <div className="glass-light rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 border-2 border-[var(--orchid-neon)]">
                <img src="https://i.pravatar.cc/150?img=3" alt="User" className="w-full h-full object-cover" />
              </Avatar>
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

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <Link href="/dashboard">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--orchid-neon)]/20 text-[var(--orchid-neon)] font-semibold">
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
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--orchid-neon)]/10 transition-colors">
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

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Log Activity
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-[var(--orchid-neon)]/20">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-[var(--orchid-neon)]" />
              <span className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            <Button variant="outline" className="border-[var(--orchid-neon)]/50 hover:bg-[var(--orchid-neon)]/20">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Welcome Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Alex! 👋</h1>
            <p className="text-gray-400">Here's your wellness summary for today</p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass rounded-3xl p-6 hover:neon-glow-sm transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${metric.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-bold ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--orchid-neon)] mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="glass border border-[var(--orchid-neon)]/20 p-1 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Progress
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Achievements
              </TabsTrigger>
              <TabsTrigger value="family" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Family
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Activity Chart */}
                <Card className="glass rounded-3xl p-6 neon-border">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-[var(--orchid-neon)]" />
                    Weekly Activity
                  </h3>
                  <div className="flex items-end justify-between h-48 gap-2">
                    {weeklyData.map((day, index) => (
                      <motion.div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <motion.div
                          className="w-full bg-gradient-to-t from-[var(--dark-orchid)] to-[var(--orchid-neon)] rounded-t-xl neon-glow-sm"
                          style={{ height: `${day.value}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${day.value}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                        <span className="text-xs text-gray-400 mt-2">{day.day}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Streak & Goals */}
                <Card className="glass rounded-3xl p-6 neon-border">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                    Streaks & Goals
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Current Streak</span>
                        <span className="text-2xl font-bold text-[var(--orchid-neon)]">{currentStreak} days</span>
                      </div>
                      <Progress value={(currentStreak / longestStreak) * 100} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">Longest streak: {longestStreak} days</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Completion Rate</span>
                        <span className="text-2xl font-bold text-[var(--orchid-neon)]">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">Keep it up! You're doing great!</p>
                    </div>

                    <div className="glass-light rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <span className="font-bold">Daily Challenge</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">Complete 30 minutes of mindful activity</p>
                      <Progress value={65} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">19 / 30 minutes completed</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Today's Tasks */}
              <Card className="glass rounded-3xl p-6 neon-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-[var(--orchid-neon)]" />
                  Today's Tasks
                </h3>
                <div className="space-y-4">
                  {[
                    { task: "Morning Yoga Session", completed: true, time: "7:00 AM" },
                    { task: "Log Breakfast", completed: true, time: "8:30 AM" },
                    { task: "30-Minute Walk", completed: false, time: "12:00 PM" },
                    { task: "Meditation Practice", completed: false, time: "6:00 PM" },
                    { task: "Sleep by 10 PM", completed: false, time: "10:00 PM" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className={`glass-light rounded-2xl p-4 flex items-center justify-between ${
                        item.completed ? "opacity-60" : ""
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          item.completed 
                            ? "border-[var(--orchid-neon)] bg-[var(--orchid-neon)]" 
                            : "border-gray-600"
                        }`}>
                          {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <p className={`font-semibold ${item.completed ? "line-through" : ""}`}>
                            {item.task}
                          </p>
                          <p className="text-xs text-gray-400">{item.time}</p>
                        </div>
                      </div>
                      {!item.completed && (
                        <Button size="sm" variant="outline" className="border-[var(--orchid-neon)]/50">
                          Complete
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="glass rounded-3xl p-6">
                  <Smartphone className="w-8 h-8 text-blue-500 mb-4" />
                  <h4 className="font-bold mb-2">Screen Time</h4>
                  <div className="text-3xl font-bold text-[var(--orchid-neon)] mb-2">4.5h</div>
                  <Progress value={45} className="mb-2" />
                  <p className="text-sm text-gray-400">Target: 10h or less</p>
                </Card>

                <Card className="glass rounded-3xl p-6">
                  <Moon className="w-8 h-8 text-indigo-500 mb-4" />
                  <h4 className="font-bold mb-2">Sleep Quality</h4>
                  <div className="text-3xl font-bold text-[var(--orchid-neon)] mb-2">7.8h</div>
                  <Progress value={97} className="mb-2" />
                  <p className="text-sm text-gray-400">Target: 7-8h</p>
                </Card>

                <Card className="glass rounded-3xl p-6">
                  <Activity className="w-8 h-8 text-green-500 mb-4" />
                  <h4 className="font-bold mb-2">Active Minutes</h4>
                  <div className="text-3xl font-bold text-[var(--orchid-neon)] mb-2">127</div>
                  <Progress value={84} className="mb-2" />
                  <p className="text-sm text-gray-400">Target: 150 minutes</p>
                </Card>
              </div>

              <Card className="glass rounded-3xl p-6 neon-border">
                <h3 className="text-xl font-bold mb-6">Monthly Progress</h3>
                <div className="space-y-4">
                  {[
                    { label: "Exercise Sessions", current: 18, target: 20, color: "from-green-500 to-emerald-500" },
                    { label: "Meditation Minutes", current: 340, target: 400, color: "from-purple-500 to-pink-500" },
                    { label: "Water Intake (glasses)", current: 168, target: 200, color: "from-blue-500 to-cyan-500" },
                    { label: "Healthy Meals", current: 65, target: 75, color: "from-orange-500 to-red-500" }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{item.label}</span>
                        <span className="text-sm text-[var(--orchid-neon)]">{item.current} / {item.target}</span>
                      </div>
                      <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.current / item.target) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card className="glass rounded-3xl p-6 neon-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-[var(--orchid-neon)]" />
                  Your Badges
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <motion.div
                        key={badge.id}
                        className={`glass-light rounded-2xl p-6 text-center ${
                          badge.earned ? "neon-border" : "opacity-50"
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: badge.earned ? 1 : 0.5, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                          badge.earned 
                            ? "bg-gradient-to-br from-[var(--dark-orchid)] to-[var(--orchid-neon)] animate-pulse-glow" 
                            : "bg-gray-800"
                        }`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold mb-1">{badge.name}</h4>
                        <p className="text-xs text-gray-400">{badge.description}</p>
                        {badge.earned && (
                          <div className="mt-3 text-xs text-[var(--orchid-neon)] font-bold">✓ EARNED</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              <Card className="glass rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6">Leaderboard</h3>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Sarah Kim", score: 9850, avatar: "https://i.pravatar.cc/150?img=9" },
                    { rank: 2, name: "You", score: 8920, avatar: "https://i.pravatar.cc/150?img=3", isCurrentUser: true },
                    { rank: 3, name: "David Lee", score: 8450, avatar: "https://i.pravatar.cc/150?img=15" },
                    { rank: 4, name: "Jessica Wu", score: 7980, avatar: "https://i.pravatar.cc/150?img=20" },
                    { rank: 5, name: "Tom Rivera", score: 7320, avatar: "https://i.pravatar.cc/150?img=11" }
                  ].map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-2xl ${
                        user.isCurrentUser ? "glass-light neon-border" : "glass-light"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        user.rank === 1 ? "bg-yellow-500 text-black" :
                        user.rank === 2 ? "bg-gray-400 text-black" :
                        user.rank === 3 ? "bg-orange-600 text-white" :
                        "bg-gray-700"
                      }`}>
                        {user.rank}
                      </div>
                      <Avatar className="w-10 h-10">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.score} points</p>
                      </div>
                      {user.isCurrentUser && (
                        <Star className="w-5 h-5 text-[var(--orchid-neon)]" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Family Tab */}
            <TabsContent value="family" className="space-y-6">
              <Card className="glass rounded-3xl p-6 neon-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6 text-[var(--orchid-neon)]" />
                    Family Dashboard
                  </h3>
                  <Button className="bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {familyMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      className="glass-light rounded-2xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-[var(--orchid-neon)]">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      </Avatar>
                      <h4 className="font-bold text-center mb-2">{member.name}</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Streak</span>
                          <span className="flex items-center gap-1 font-bold text-[var(--orchid-neon)]">
                            <Flame className="w-4 h-4 text-orange-500" />
                            {member.streak} days
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Completion</span>
                            <span className="font-bold text-[var(--orchid-neon)]">{member.completionRate}%</span>
                          </div>
                          <Progress value={member.completionRate} className="h-2" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="glass rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6">Family Activity Feed</h3>
                <div className="space-y-4">
                  {[
                    { user: "Sarah Johnson", action: "completed Morning Yoga", time: "2 hours ago", avatar: "https://i.pravatar.cc/150?img=1" },
                    { user: "Mike Chen", action: "earned the Early Bird badge", time: "5 hours ago", avatar: "https://i.pravatar.cc/150?img=12" },
                    { user: "Emma Davis", action: "reached a 15-day streak!", time: "1 day ago", avatar: "https://i.pravatar.cc/150?img=5" },
                    { user: "Sarah Johnson", action: "logged a healthy meal", time: "1 day ago", avatar: "https://i.pravatar.cc/150?img=1" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 glass-light rounded-2xl p-4">
                      <Avatar className="w-12 h-12">
                        <img src={activity.avatar} alt={activity.user} className="w-full h-full object-cover" />
                      </Avatar>
                      <div className="flex-1">
                        <p><span className="font-semibold">{activity.user}</span> {activity.action}</p>
                        <p className="text-sm text-gray-400">{activity.time}</p>
                      </div>
                      <Heart className="w-5 h-5 text-[var(--orchid-neon)] cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}