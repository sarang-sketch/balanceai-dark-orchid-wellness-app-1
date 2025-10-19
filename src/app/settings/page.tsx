"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Bell, Phone, MessageSquare, Shield, User, Moon, Sun, 
  Smartphone, Mail, Lock, Eye, EyeOff, Save, LogOut, Trash2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [showPassword, setShowPassword] = useState(false);
  
  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [callReminders, setCallReminders] = useState(false);
  
  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);

  // Real-time Tracking
  const [screenTimeTracking, setScreenTimeTracking] = useState(true);
  const [whatsappTracking, setWhatsappTracking] = useState(false);
  const [familySharing, setFamilySharing] = useState(true);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      setTheme("dark");
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
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 neon-text">Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="glass border border-[var(--orchid-neon)]/20 p-1 grid grid-cols-2 md:grid-cols-5 gap-1">
              <TabsTrigger value="account" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Privacy
              </TabsTrigger>
              <TabsTrigger value="tracking" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Tracking
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-[var(--orchid-neon)]/20 data-[state=active]:text-[var(--orchid-neon)]">
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card className="glass rounded-3xl p-6 neon-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-[var(--orchid-neon)]" />
                  Profile Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Alex Morgan" className="bg-transparent border-[var(--orchid-neon)]/30 mt-2" />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="alex.morgan@email.com" className="bg-transparent border-[var(--orchid-neon)]/30 mt-2" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" className="bg-transparent border-[var(--orchid-neon)]/30 mt-2" />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>

              <Card className="glass rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[var(--orchid-neon)]" />
                  Change Password
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative mt-2">
                      <Input 
                        id="current-password" 
                        type={showPassword ? "text" : "password"}
                        className="bg-transparent border-[var(--orchid-neon)]/30 pr-10" 
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type={showPassword ? "text" : "password"}
                      className="bg-transparent border-[var(--orchid-neon)]/30 mt-2" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type={showPassword ? "text" : "password"}
                      className="bg-transparent border-[var(--orchid-neon)]/30 mt-2" 
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
                    Update Password
                  </Button>
                </div>
              </Card>

              <Card className="glass rounded-3xl p-6 border-red-500/50">
                <h3 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-red-500/50 text-red-500 hover:bg-red-500/20">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                  <Button variant="outline" className="w-full border-red-500/50 text-red-500 hover:bg-red-500/20">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass rounded-3xl p-6 neon-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-[var(--orchid-neon)]" />
                  Notification Preferences
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-[var(--orchid-neon)]" />
                      <div>
                        <p className="font-semibold">Push Notifications</p>
                        <p className="text-sm text-gray-400">Receive app notifications</p>
                      </div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-[var(--orchid-neon)]" />
                      <div>
                        <p className="font-semibold">SMS Notifications</p>
                        <p className="text-sm text-gray-400">Get text message reminders</p>
                      </div>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[var(--orchid-neon)]" />
                      <div>
                        <p className="font-semibold">Email Notifications</p>
                        <p className="text-sm text-gray-400">Weekly progress summaries</p>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[var(--orchid-neon)]" />
                      <div>
                        <p className="font-semibold">Phone Call Reminders</p>
                        <p className="text-sm text-gray-400">Wake-up calls and check-ins</p>
                      </div>
                    </div>
                    <Switch checked={callReminders} onCheckedChange={setCallReminders} />
                  </div>
                </div>
              </Card>

              {callReminders && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <Card className="glass rounded-3xl p-6">
                    <h3 className="text-lg font-bold mb-4">Call Reminder Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="wake-up-time">Morning Wake-up Call</Label>
                        <Input 
                          id="wake-up-time" 
                          type="time" 
                          defaultValue="07:00"
                          className="bg-transparent border-[var(--orchid-neon)]/30 mt-2" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="check-in-time">Evening Check-in Call</Label>
                        <Input 
                          id="check-in-time" 
                          type="time" 
                          defaultValue="20:00"
                          className="bg-transparent border-[var(--orchid-neon)]/30 mt-2" 
                        />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
                        Save Call Schedule
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="glass rounded-3xl p-6 neon-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[var(--orchid-neon)]" />
                  Privacy & Security
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Profile Visibility</p>
                      <p className="text-sm text-gray-400">Show your profile to other users</p>
                    </div>
                    <Switch checked={profileVisibility} onCheckedChange={setProfileVisibility} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Data Sharing</p>
                      <p className="text-sm text-gray-400">Share anonymized data for research</p>
                    </div>
                    <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Activity Tracking</p>
                      <p className="text-sm text-gray-400">Allow wellness activity monitoring</p>
                    </div>
                    <Switch checked={activityTracking} onCheckedChange={setActivityTracking} />
                  </div>
                </div>
              </Card>

              <Card className="glass rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-4">GDPR Compliance</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Your data is encrypted and stored securely. You have full control over your information.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full border-[var(--orchid-neon)]/50">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full border-[var(--orchid-neon)]/50">
                    Request Data Deletion
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking" className="space-y-6">
              <Card className="glass rounded-3xl p-6 neon-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-[var(--orchid-neon)]" />
                  Real-Time Tracking
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Screen Time Monitoring</p>
                      <p className="text-sm text-gray-400">Track daily screen usage</p>
                    </div>
                    <Switch checked={screenTimeTracking} onCheckedChange={setScreenTimeTracking} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">WhatsApp Activity</p>
                      <p className="text-sm text-gray-400">Monitor messaging app usage (requires permissions)</p>
                    </div>
                    <Switch checked={whatsappTracking} onCheckedChange={setWhatsappTracking} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Family Sharing</p>
                      <p className="text-sm text-gray-400">Share progress with family members</p>
                    </div>
                    <Switch checked={familySharing} onCheckedChange={setFamilySharing} />
                  </div>
                </div>
              </Card>

              {whatsappTracking && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <Card className="glass rounded-3xl p-6 border-yellow-500/50">
                    <h3 className="text-lg font-bold mb-2 text-yellow-500">⚠️ Permissions Required</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      To track WhatsApp activity, you'll need to grant accessibility permissions on your device.
                    </p>
                    <Button className="w-full bg-gradient-to-r from-[var(--dark-orchid)] to-[var(--orchid-neon)] hover:opacity-90">
                      Grant Permissions
                    </Button>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="glass rounded-3xl p-6 neon-border">
                <h3 className="text-xl font-bold mb-6">Theme</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      document.documentElement.classList.add("dark");
                      setTheme("dark");
                    }}
                    className={`glass-light rounded-2xl p-6 text-left transition-all ${
                      theme === "dark" ? "neon-border" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Moon className="w-8 h-8 text-[var(--orchid-neon)]" />
                      {theme === "dark" && (
                        <div className="w-6 h-6 rounded-full bg-[var(--orchid-neon)] flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold mb-2">Dark Mode</h4>
                    <p className="text-sm text-gray-400">
                      Perfect for low-light environments and battery saving
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      document.documentElement.classList.remove("dark");
                      setTheme("light");
                    }}
                    className={`glass-light rounded-2xl p-6 text-left transition-all ${
                      theme === "light" ? "neon-border" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Sun className="w-8 h-8 text-[var(--orchid-neon)]" />
                      {theme === "light" && (
                        <div className="w-6 h-6 rounded-full bg-[var(--orchid-neon)] flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold mb-2">Light Mode</h4>
                    <p className="text-sm text-gray-400">
                      Bright and clear for daytime use
                    </p>
                  </button>
                </div>
              </Card>

              <Card className="glass rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6">Accessibility</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Large Text</p>
                      <p className="text-sm text-gray-400">Increase font size</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">High Contrast</p>
                      <p className="text-sm text-gray-400">Enhanced visibility</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Screen Reader</p>
                      <p className="text-sm text-gray-400">Compatible with assistive technology</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}