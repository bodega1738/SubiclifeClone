"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Settings, 
  User as UserIcon, 
  CreditCard, 
  Calendar, 
  Heart, 
  Bell, 
  Globe, 
  DollarSign, 
  Moon, 
  HelpCircle, 
  Mail, 
  ShieldCheck, 
  Star, 
  ChevronRight,
  LogOut,
  Crown,
  Shield,
  LayoutGrid
} from "lucide-react";
import { useUser, discountPercentages } from "@/lib/user-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditPersonalInfoDialog } from "@/components/profile/edit-personal-info-dialog";
import { PaymentMethodsDialog } from "@/components/profile/payment-methods-dialog";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useUser();
  
  // Dialog States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState(false);

  // Preference States
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("PHP");
  const [darkMode, setDarkMode] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem("user-preferences");
    if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      setNotificationsEnabled(parsed.notifications ?? true);
      setLanguage(parsed.language ?? "en");
      setCurrency(parsed.currency ?? "PHP");
      setDarkMode(parsed.darkMode ?? false);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("user-preferences", JSON.stringify({
      notifications: notificationsEnabled,
      language,
      currency,
      darkMode
    }));
  }, [notificationsEnabled, language, currency, darkMode]);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "elite": return <Crown className="h-5 w-5" />;
      case "premium": return <ShieldCheck className="h-5 w-5" />;
      case "basic": return <Shield className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const discount = discountPercentages[user.tier || "starter"];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-50 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold">Profile</h1>
        <Button variant="ghost" size="icon" className="p-2 hover:bg-gray-50 rounded-full">
          <Settings className="h-6 w-6" />
        </Button>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-6">
        {/* User Info Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-600 mb-2">{user.email}</p>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 font-bold uppercase text-xs mb-2">
            {user.tier} Member
          </Badge>
          <p className="text-xs text-gray-500 mb-4">Member since {formattedDate}</p>
          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={() => setIsEditProfileOpen(true)}
          >
            Edit Profile
          </Button>
        </section>

        {/* Tier Benefits Card */}
        <section className="bg-gradient-to-br from-[#135bec] to-[#0e45b5] rounded-2xl p-6 text-white shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getTierIcon(user.tier || "starter")}
              <span className="font-bold uppercase tracking-wider">{user.tier} Benefits</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">🛡️</div>
              <p className="text-sm font-medium">₱{user.insuranceAmount?.toLocaleString()} Coverage</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">💰</div>
              <p className="text-sm font-medium">{discount}% Off All Bookings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">⭐</div>
              <p className="text-sm font-medium">{user.points?.toLocaleString()} Reward Points</p>
            </div>
          </div>

          <Button 
            className="w-full h-12 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 border-none mt-2"
            onClick={() => router.push('/membership')}
          >
            Upgrade Membership
          </Button>
        </section>

        {/* Account Section */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide px-1">Account</h3>
          <div className="space-y-2">
            <div 
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Personal Info</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div 
              onClick={() => setIsPaymentMethodsOpen(true)}
              className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Payment Methods</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div 
              onClick={() => router.push('/pass?tab=history')}
              className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Booking History</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div 
              onClick={() => router.push('/partners?filter=favorites')}
              className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Favorites</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide px-1">Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Notifications</span>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Language</span>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[100px] h-8 border-none focus:ring-0">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fil">Filipino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Currency</span>
              </div>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[80px] h-8 border-none focus:ring-0">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHP">PHP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Dark Mode</span>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
              />
            </div>

            <div 
              onClick={() => router.push('/onboarding')}
              className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Update Travel Preferences</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide px-1">Support</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Help Center</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div 
              onClick={() => window.location.href = 'mailto:support@subic.life'}
              className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Contact Us</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Terms of Service</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Privacy Policy</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Rate App</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Logout Button */}
        <Button 
          variant="outline"
          className="w-full h-12 border-2 border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 hover:text-red-700 transition-colors mt-8 mb-4"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>

        <p className="text-center text-xs text-gray-400 pb-4">
          Subiclife App v1.0.0
        </p>
      </main>

      {/* Dialogs */}
      <EditPersonalInfoDialog 
        open={isEditProfileOpen} 
        onOpenChange={setIsEditProfileOpen} 
      />
      <PaymentMethodsDialog 
        open={isPaymentMethodsOpen} 
        onOpenChange={setIsPaymentMethodsOpen} 
      />
    </div>
  );
}
