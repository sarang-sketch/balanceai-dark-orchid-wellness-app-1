"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Heart, MessageCircle, Share2, TrendingUp, Users, Plus, Filter, Award, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
  isAnonymous: boolean;
  badge?: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Anonymous Warrior",
      avatar: "https://i.pravatar.cc/150?img=33",
      content: "Just completed my 30-day meditation streak! 🎉 Started with just 5 minutes a day and now I can't imagine my mornings without it. To anyone struggling to start: just begin with 2 minutes. You got this! 💪",
      likes: 47,
      comments: 12,
      timestamp: "2 hours ago",
      category: "Mental Wellness",
      isAnonymous: true,
      badge: "30-Day Streak"
    },
    {
      id: "2",
      author: "Fitness Enthusiast",
      avatar: "https://i.pravatar.cc/150?img=15",
      content: "Sharing my favorite healthy breakfast recipe! 🥗 Greek yogurt bowl with berries, granola, chia seeds, and a drizzle of honey. Keeps me energized all morning. What's your go-to breakfast?",
      likes: 89,
      comments: 24,
      timestamp: "5 hours ago",
      category: "Nutrition",
      isAnonymous: false
    },
    {
      id: "3",
      author: "Anonymous Supporter",
      avatar: "https://i.pravatar.cc/150?img=22",
      content: "Having a rough day with anxiety. Just wanted to remind everyone (and myself) that it's okay to not be okay. Taking it one breath at a time. 🌸",
      likes: 156,
      comments: 45,
      timestamp: "8 hours ago",
      category: "Mental Health",
      isAnonymous: true
    },
    {
      id: "4",
      author: "Sleep Champion",
      avatar: "https://i.pravatar.cc/150?img=8",
      content: "Finally figured out my sleep routine! 😴 No screens 1 hour before bed, cool room, and a 10-minute wind-down meditation. Went from 5 hours to 7.5 hours average. Game changer!",
      likes: 92,
      comments: 18,
      timestamp: "1 day ago",
      category: "Sleep",
      isAnonymous: false,
      badge: "Sleep Expert"
    },
    {
      id: "5",
      author: "Wellness Newbie",
      avatar: "https://i.pravatar.cc/150?img=29",
      content: "Just started my wellness journey with BalanceAI! Any tips for a complete beginner? Feeling a bit overwhelmed but excited! 🌟",
      likes: 34,
      comments: 28,
      timestamp: "1 day ago",
      category: "General",
      isAnonymous: false
    }
  ]);

  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Mental Wellness", "Nutrition", "Fitness", "Sleep", "Mental Health", "General"];

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleNewPost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: isAnonymous ? "Anonymous" : "You",
      avatar: "https://i.pravatar.cc/150?img=3",
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      category: "General",
      isAnonymous: isAnonymous
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowNewPost(false);
    setIsAnonymous(false);
  };

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

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
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4 neon-border">
              <Users className="w-5 h-5 text-[var(--orchid-neon)]" />
              <span className="text-sm font-bold text-[var(--orchid-neon)]">Community Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 neon-text">Wellness Community</h1>
            <p className="text-gray-400">Share your journey, inspire others, and grow together</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="glass rounded-2xl p-4 text-center">
              <Users className="w-8 h-8 text-[var(--orchid-neon)] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[var(--orchid-neon)]">50K+</div>
              <div className="text-sm text-gray-400">Members</div>
            </Card>
            <Card className="glass rounded-2xl p-4 text-center">
              <MessageCircle className="w-8 h-8 text-[var(--orchid-neon)] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[var(--orchid-neon)]">12K</div>
              <div className="text-sm text-gray-400">Posts Today</div>
            </Card>
            <Card className="glass rounded-2xl p-4 text-center">
              <Heart className="w-8 h-8 text-[var(--orchid-neon)] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[var(--orchid-neon)]">95%</div>
              <div className="text-sm text-gray-400">Positivity</div>
            </Card>
          </div>

          {/* Create Post Button */}
          <div className="mb-6">
            <Button
              onClick={() => setShowNewPost(!showNewPost)}
              className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90 neon-glow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Your Story
            </Button>
          </div>

          {/* New Post Form */}
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="glass rounded-3xl p-6 neon-border">
                <Textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your wellness journey, tips, or ask for support..."
                  className="bg-transparent border-[var(--orchid-neon)]/30 min-h-[120px] mb-4"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--orchid-neon)]"
                    />
                    <span className="text-sm">Post anonymously</span>
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewPost(false)}
                      className="border-[var(--orchid-neon)]/50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNewPost}
                      className="bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Category Filter */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90"
                    : "border-[var(--orchid-neon)]/50 hover:bg-[var(--orchid-neon)]/20"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass rounded-3xl p-6 hover:neon-glow-sm transition-all duration-300">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-[var(--orchid-neon)]">
                        <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{post.author}</span>
                          {post.isAnonymous && (
                            <span className="text-xs bg-[var(--orchid-neon)]/20 text-[var(--orchid-neon)] px-2 py-0.5 rounded-full">
                              Anonymous
                            </span>
                          )}
                          {post.badge && (
                            <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {post.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{post.timestamp}</span>
                          <span>•</span>
                          <span className="text-[var(--orchid-neon)]">{post.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-[var(--orchid-neon)]/20">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-[var(--orchid-neon)] transition-colors group"
                    >
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-[var(--orchid-neon)] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-semibold">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-[var(--orchid-neon)] transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="font-semibold">Share</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Community Guidelines */}
          <Card className="glass rounded-3xl p-6 mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[var(--orchid-neon)]" />
              Community Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[var(--orchid-neon)] mt-1">✓</span>
                <span>Be respectful and supportive of all members</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--orchid-neon)] mt-1">✓</span>
                <span>Share genuine experiences and helpful advice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--orchid-neon)] mt-1">✓</span>
                <span>Protect privacy - use anonymous posting when sharing sensitive information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--orchid-neon)] mt-1">✓</span>
                <span>Report inappropriate content to maintain a positive environment</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}