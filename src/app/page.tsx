"use client";

import { Brain, Sparkles, Activity, Heart, Moon, TrendingUp, Users, Shield } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orchid-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-xl border border-purple-500/30 flex items-center justify-center">
            <Brain className="w-6 h-6 text-orchid-400" strokeWidth={1.5} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            BalanceAI
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          ) : session?.user ? (
            <>
              <span className="text-gray-400">Welcome, {session.user.name}</span>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated Brain Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-xl border border-purple-500/30 mb-8 animate-float">
            <Brain className="w-12 h-12 text-orchid-400" strokeWidth={1.5} />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Balance Your Mind,
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orchid-400 bg-clip-text text-transparent">
              Body & Digital Life
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Track, analyze, and optimize your mental, physical, and emotional health with 
            cutting-edge AI technology. Your journey to wellness starts here. 🖤
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href={session?.user ? "/quiz" : "/sign-up"}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {session?.user ? "Start Assessment" : "Start Your Journey"}
            </Link>
            <Link
              href="/community"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Explore Community
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">10k+</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-1">95%</div>
              <div className="text-sm text-gray-500">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orchid-400 mb-1">24/7</div>
              <div className="text-sm text-gray-500">AI Support</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {[
            {
              icon: Activity,
              title: "Progress Tracking",
              description: "Monitor your wellness metrics in real-time",
              color: "purple"
            },
            {
              icon: Heart,
              title: "Personalized Plans",
              description: "AI-generated wellness routines just for you",
              color: "pink"
            },
            {
              icon: Moon,
              title: "Sleep Analysis",
              description: "Track and improve your sleep patterns",
              color: "orchid"
            },
            {
              icon: TrendingUp,
              title: "Gamification",
              description: "Earn badges and maintain streaks",
              color: "purple"
            },
            {
              icon: Users,
              title: "Family Sharing",
              description: "Support each other's wellness journey",
              color: "pink"
            },
            {
              icon: Brain,
              title: "Mental Health",
              description: "Track mood and cognitive wellness",
              color: "orchid"
            },
            {
              icon: Sparkles,
              title: "AI Chatbot",
              description: "24/7 personalized wellness assistant",
              color: "purple"
            },
            {
              icon: Shield,
              title: "Privacy First",
              description: "End-to-end encrypted, GDPR compliant",
              color: "pink"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-600/20 border border-${feature.color}-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Privacy Badge */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">
              🔒 Encrypted. No ads. User-owned data.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}