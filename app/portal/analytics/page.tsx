"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Bell, 
  LogOut, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Download, 
  Settings, 
  User, 
  Smartphone as WhatsApp, 
  Upload,
  ChevronDown,
  Check,
  Plus,
  Trash2,
  Lock,
  Mail,
  Phone,
  Clock,
  Briefcase
} from "lucide-react"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Partner } from "@/lib/types"
import { partners as partnersData } from "@/lib/partners-data"

// --- Mock Data ---

const mockRevenueData = Array.from({ length: 30 }, (_, i) => ({
  day: (i + 1).toString(),
  revenue: Math.floor(Math.random() * 5000) + 3000
}))

const mockBookingStatusData = [
  { name: 'Confirmed', value: 75, fill: '#10b981' },
  { name: 'Pending', value: 8, fill: '#f59e0b' },
  { name: 'Declined', value: 6, fill: '#ef4444' }
]

const mockTopServices = [
  { name: 'Aqua Veranda Suite', bookings: 42, max: 50 },
  { name: 'Ocean View Deluxe', bookings: 35, max: 50 },
  { name: 'Weekend Package', bookings: 28, max: 50 },
  { name: 'Sunset Dinner', bookings: 22, max: 50 },
  { name: 'Private Yacht', bookings: 15, max: 50 }
]

const mockStaff = [
  { id: '1', name: 'Admin User', email: 'admin@lighthouse.com', role: 'Administrator' },
  { id: '2', name: 'Front Desk', email: 'reception@lighthouse.com', role: 'Staff' },
  { id: '3', name: 'Manager', email: 'manager@lighthouse.com', role: 'Manager' }
]

export default function AnalyticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // State for partner management (matching dashboard pattern)
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [showPartnerMenu, setShowPartnerMenu] = useState(false)
  
  // Settings Form State
  const [businessName, setBusinessName] = useState("")
  const [category, setCategory] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [description, setDescription] = useState("")
  const [autoAccept, setAutoAccept] = useState(false)
  const [standardDiscount, setStandardDiscount] = useState("10")
  const [eliteDiscount, setEliteDiscount] = useState("20")
  const [bookingWindow, setBookingWindow] = useState("30")
  
  // Profile Form State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    // Initialize partner data
    const extendedPartners = partnersData.map(p => ({ ...p, commission_rate: 0.1 }))
    setPartners(extendedPartners)
    const initialPartner = extendedPartners[0]
    setCurrentPartner(initialPartner)
    
    // Set initial form values
    if (initialPartner) {
      setBusinessName(initialPartner.name)
      setCategory(initialPartner.type)
      setContactEmail("info@lighthouse.com") // Mock
      setPhone("+63 47 252 5000") // Mock
      setWhatsapp("+63 917 123 4567") // Mock
      setDescription("The Lighthouse Marina Resort is a magnificent three-story hotel with 43 smoke-free guestrooms...")
    }
  }, [])

  const switchPartner = (partner: Partner) => {
    setCurrentPartner(partner)
    setShowPartnerMenu(false)
    setBusinessName(partner.name)
    setCategory(partner.type)
  }

  const handleExport = () => {
    toast({
      title: "Export Report",
      description: "Export feature coming soon (PDF/CSV)",
    })
  }

  const handleSaveSettings = () => {
    console.log("Saving settings:", {
      businessName, category, contactEmail, phone, whatsapp, description,
      autoAccept, standardDiscount, eliteDiscount, bookingWindow
    })
    toast({
      title: "Settings updated",
      description: "Merchant profile and preferences have been saved.",
    })
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      })
      return
    }
    toast({
      title: "Success",
      description: "Your password has been updated.",
    })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleLogout = () => {
    localStorage.removeItem("merchant_session")
    router.push("/portal")
  }

  return (
    <div className="merchant-layout min-h-screen">
      {/* Merchant Header */}
      <header className="merchant-header">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="relative">
            <button 
              onClick={() => setShowPartnerMenu(!showPartnerMenu)}
              className="flex items-center gap-3 text-left hover:bg-slate-50 p-1 rounded-lg transition-colors"
            >
              <img
                src={currentPartner?.logo || "/images/7c5eba-268dcc5019d54475ae66c5bc17a5c336-mv2.png"}
                alt={currentPartner?.name}
                className="w-10 h-10 rounded-lg object-contain bg-slate-100 border border-slate-200"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <h1 className="text-sm font-bold text-slate-900">{currentPartner?.name || "Lighthouse Marina Resort"}</h1>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Merchant Portal</p>
              </div>
            </button>

            {showPartnerMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowPartnerMenu(false)} />
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 z-40 overflow-hidden py-2">
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => switchPartner(partner)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <img src={partner.logo} alt={partner.name} className="w-8 h-8 rounded object-contain bg-slate-100" />
                      <span className={cn("text-sm flex-1 text-left truncate", currentPartner?.id === partner.id ? "font-bold text-blue-600" : "text-slate-700")}>
                        {partner.name}
                      </span>
                      {currentPartner?.id === partner.id && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 relative group">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="bg-white border p-1 h-12 rounded-xl grid grid-cols-3 w-full max-w-md mx-auto sm:mx-0">
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold text-sm">
              Settings
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold text-sm">
              Profile
            </TabsTrigger>
          </TabsList>

          {/* --- ANALYTICS TAB --- */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Performance Overview</h2>
              <Button onClick={handleExport} variant="outline" size="sm" className="gap-2 font-bold text-xs uppercase tracking-wider">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="merchant-metric-card">
                <div className="merchant-metric-icon merchant-metric-icon-purple mb-3">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-slate-900">₱245k</p>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+12%</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              </div>

              <div className="merchant-metric-card">
                <div className="merchant-metric-icon merchant-metric-icon-blue mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-slate-900">89</p>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+5</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              </div>

              <div className="merchant-metric-card">
                <div className="merchant-metric-icon merchant-metric-icon-orange mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-slate-900">₱2,753</p>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+8%</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Booking</p>
              </div>

              <div className="merchant-metric-card">
                <div className="merchant-metric-icon merchant-metric-icon-green mb-3">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900">94%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acceptance Rate</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 shadow-sm border-0">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-800">Revenue Trends</CardTitle>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[140px] h-8 text-xs font-bold uppercase tracking-wider border-none shadow-none focus:ring-0">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 Days</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockRevenueData}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} 
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                          tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          cursor={{ fill: '#f8fafc' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl border-none text-xs font-bold">
                                  ₱{payload[0].value?.toLocaleString()}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="revenue" fill="#135bec" radius={[4, 4, 0, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-slate-800">Booking Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockBookingStatusData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mockBookingStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Services */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800">Top Performing Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopServices.map((service, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{service.name}</span>
                        <span className="font-bold text-slate-900">{service.bookings} bookings</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${(service.bookings / service.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- SETTINGS TAB --- */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Merchant Settings</h2>
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 font-bold px-6">
                Save Changes
              </Button>
            </div>

            <Card className="shadow-sm border-0 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Business Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden">
                      {currentPartner?.logo ? (
                        <img src={currentPartner.logo} className="w-full h-full object-contain p-2" alt="Logo" />
                      ) : (
                        <Upload className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-white shadow-md border rounded-full p-1.5 text-blue-600 hover:bg-slate-50">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Business Name</label>
                      <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hotel">Hotels</SelectItem>
                          <SelectItem value="restaurant">Restaurants</SelectItem>
                          <SelectItem value="activity">Activities</SelectItem>
                          <SelectItem value="water-sports">Water Sports</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Contact Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input type="email" className="pl-9" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input className="pl-9" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp Number</label>
                  <div className="relative">
                    <WhatsApp className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input className="pl-9" placeholder="+63 900 000 0000" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Business Description</label>
                  <Textarea className="h-24 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="pt-4 border-t space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Business Hours
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Monday - Friday', 'Saturday - Sunday'].map((days) => (
                      <div key={days} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                        <span className="text-sm font-semibold text-slate-600">{days}</span>
                        <div className="flex items-center gap-2">
                          <Input className="w-20 h-8 text-center text-xs" defaultValue="08:00" />
                          <span className="text-slate-400">-</span>
                          <Input className="w-20 h-8 text-center text-xs" defaultValue="18:00" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-0">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Member Discounts</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Standard Discount (%)</label>
                    <div className="relative">
                      <Input type="number" value={standardDiscount} onChange={(e) => setStandardDiscount(e.target.value)} />
                      <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-bold">%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Elite Discount (%)</label>
                    <div className="relative">
                      <Input type="number" value={eliteDiscount} onChange={(e) => setEliteDiscount(e.target.value)} />
                      <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-bold">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic">These discounts apply automatically to member bookings.</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Booking Rules</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-semibold text-slate-700">Auto-accept bookings</label>
                      <p className="text-xs text-slate-500">Instantly confirm based on criteria</p>
                    </div>
                    <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
                  </div>
                  
                  {autoAccept && (
                    <div className="space-y-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="c1" />
                        <label htmlFor="c1" className="text-xs font-medium text-slate-600">Within next 7 days</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="c2" />
                        <label htmlFor="c2" className="text-xs font-medium text-slate-600">Payment confirmed</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="c3" />
                        <label htmlFor="c3" className="text-xs font-medium text-slate-600">Standard tier or higher</label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Advance Booking Window (Days)</label>
                    <Input type="number" value={bookingWindow} onChange={(e) => setBookingWindow(e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-0">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Notifications & Integration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-semibold text-slate-700">Email Notifications</label>
                        <p className="text-xs text-slate-500">New booking alerts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-semibold text-slate-700">WhatsApp Alerts</label>
                        <p className="text-xs text-slate-500">Direct mobile notifications</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <WhatsApp className="w-8 h-8 text-green-500 mb-2" />
                    <p className="text-xs font-bold text-slate-500 mb-3">WhatsApp Connection</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-bold text-xs"
                      onClick={() => toast({ title: "Test Connection", description: "WhatsApp test message sent!" })}
                    >
                      Test Connection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- PROFILE TAB --- */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Account Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <Card className="shadow-sm border-0 overflow-hidden">
                  <CardHeader className="bg-slate-900 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-xl">A</div>
                      <div>
                        <CardTitle className="text-sm font-bold">Admin User</CardTitle>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Administrator</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                      <p className="text-sm font-medium text-slate-700">admin@lighthouse.com</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Linked Merchant</p>
                      <p className="text-sm font-medium text-slate-700">{currentPartner?.name}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full font-bold text-xs">Edit Profile</Button>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 border-l-4 border-red-500">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button 
                      onClick={handleLogout}
                      variant="outline" 
                      className="w-full border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-500 gap-2 font-black uppercase tracking-wider text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-6">
                <Card className="shadow-sm border-0">
                  <CardHeader className="border-b">
                    <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                        <Input 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                          <Input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase">Confirm New Password</label>
                          <Input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="bg-slate-900 hover:bg-slate-800 font-bold">Update Password</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0">
                  <CardHeader className="border-b flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Team Management
                    </CardTitle>
                    <Button variant="outline" size="sm" className="gap-2 font-bold text-xs" onClick={() => toast({ title: "Add Team Member", description: "Team management modal coming soon" })}>
                      <Plus className="w-4 h-4" />
                      Add Member
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {mockStaff.map((member) => (
                        <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                              {member.role}
                            </span>
                            <button className="text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
