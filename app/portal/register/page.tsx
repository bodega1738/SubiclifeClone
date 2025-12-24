"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  Plus, 
  X, 
  Zap, 
  Loader2,
  Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MerchantRegistrationData, MerchantSession } from "@/lib/types"

const STEPS = [
  "Business Info",
  "Contact Info",
  "Business Details",
  "Packages",
  "Photos",
  "Banking",
  "Agreement"
]

const INITIAL_DATA: MerchantRegistrationData = {
  businessName: "",
  businessType: "hotel",
  businessAddress: "",
  yearsInOperation: 0,
  registrationNumber: "",
  ownerName: "",
  email: "",
  phone: "",
  whatsapp: "",
  website: "",
  description: "",
  operatingHours: {
    weekday: { start: "09:00", end: "17:00" },
    weekend: { start: "10:00", end: "18:00" },
    is24_7: false
  },
  capacity: 0,
  packages: [{ name: "", description: "", basePrice: 0 }],
  logo: "",
  coverPhoto: "",
  galleryPhotos: [],
  bankName: "",
  accountName: "",
  accountNumber: "",
  accountType: "savings",
  tinNumber: "",
  agreedToCommission: false,
  agreedToDiscounts: false,
  agreedToTerms: false,
  agreedToPrivacy: false
}

export default function MerchantRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<MerchantRegistrationData>(INITIAL_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState("")

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.push("/portal/dashboard")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess, router])

  const updateData = (updates: Partial<MerchantRegistrationData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const refNum = `PARTNER-2025-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    setReferenceNumber(refNum)
    
    const registrationData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      referenceNumber: refNum
    }
    
    // Store in localStorage
    localStorage.setItem('merchantRegistration', JSON.stringify(registrationData))
    
    // Create merchant session for dashboard access
    const session = {
      email: formData.email,
      partner_ids: [formData.businessName.toLowerCase().replace(/\s+/g, '-')],
      name: formData.businessName
    }
    localStorage.setItem('merchant_session', JSON.stringify(session))
    
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  const handleDemoMode = () => {
    const demoSession: MerchantSession = {
      email: 'demo@subic.life',
      partner_ids: ['all'],
      name: 'Demo Account'
    }
    localStorage.setItem('merchant_session', JSON.stringify(demoSession))
    router.push('/portal/dashboard')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverPhoto' | 'galleryPhotos') => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (field === 'galleryPhotos') {
      const newPhotos: string[] = []
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPhotos.push(reader.result as string)
          if (newPhotos.length === files.length) {
            updateData({ galleryPhotos: [...formData.galleryPhotos, ...newPhotos] })
          }
        }
        reader.readAsDataURL(file)
      })
    } else {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        updateData({ [field]: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  // Step Components
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600 mb-1">Business Name <span className="text-red-500">*</span></Label>
          <Input 
            value={formData.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
            className="monarch-input"
            placeholder="e.g. Lighthouse Marina Resort"
          />
        </div>
        
        <div>
          <Label className="text-sm text-gray-600 mb-1">Business Type <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.businessType} 
            onValueChange={(val: any) => updateData({ businessType: val })}
          >
            <SelectTrigger className="monarch-input border-0 border-b-2 rounded-none px-0 shadow-none focus:ring-0">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hotel">Hotel / Resort</SelectItem>
              <SelectItem value="restaurant">Restaurant / Dining</SelectItem>
              <SelectItem value="water-sports">Water Sports / Marine</SelectItem>
              <SelectItem value="activities">Activities / Tours</SelectItem>
              <SelectItem value="services">Services / Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">Business Address <span className="text-red-500">*</span></Label>
          <Textarea 
            value={formData.businessAddress}
            onChange={(e) => updateData({ businessAddress: e.target.value })}
            className="monarch-input resize-none"
            rows={3}
            placeholder="Complete address including street, barangay, and zone"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600 mb-1">Years in Operation</Label>
            <Input 
              type="number"
              min={0}
              value={formData.yearsInOperation}
              onChange={(e) => updateData({ yearsInOperation: parseInt(e.target.value) || 0 })}
              className="monarch-input"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600 mb-1">Registration No.</Label>
            <Input 
              value={formData.registrationNumber}
              onChange={(e) => updateData({ registrationNumber: e.target.value })}
              className="monarch-input"
              placeholder="SEC / DTI Number"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600 mb-1">Owner / Manager Name <span className="text-red-500">*</span></Label>
          <Input 
            value={formData.ownerName}
            onChange={(e) => updateData({ ownerName: e.target.value })}
            className="monarch-input"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">Email Address <span className="text-red-500">*</span></Label>
          <Input 
            type="email"
            value={formData.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="monarch-input"
            placeholder="contact@business.com"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">Phone Number <span className="text-red-500">*</span></Label>
          <div className="flex items-center gap-2 border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors">
            <span className="text-gray-500">+63</span>
            <input 
              type="tel"
              value={formData.phone}
              onChange={(e) => updateData({ phone: e.target.value })}
              className="flex-1 bg-transparent border-none focus:outline-none py-3"
              placeholder="912 345 6789"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">WhatsApp (Optional)</Label>
          <div className="flex items-center gap-2 border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors">
            <span className="text-gray-500">+63</span>
            <input 
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => updateData({ whatsapp: e.target.value })}
              className="flex-1 bg-transparent border-none focus:outline-none py-3"
              placeholder="912 345 6789"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">Website (Optional)</Label>
          <Input 
            type="url"
            value={formData.website}
            onChange={(e) => updateData({ website: e.target.value })}
            className="monarch-input"
            placeholder="https://www.example.com"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600 mb-1">Brief Description <span className="text-red-500">*</span></Label>
          <Textarea 
            value={formData.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="monarch-input resize-none"
            rows={5}
            placeholder="Describe your business, unique offerings, and what makes you special..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-600">Operating Hours <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="24-7"
                checked={formData.operatingHours.is24_7}
                onCheckedChange={(checked) => updateData({ 
                  operatingHours: { ...formData.operatingHours, is24_7: checked as boolean } 
                })}
              />
              <Label htmlFor="24-7" className="text-sm cursor-pointer">Open 24/7</Label>
            </div>
          </div>
          
          {!formData.operatingHours.is24_7 && (
            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Weekdays (Mon-Fri)</span>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    type="time" 
                    value={formData.operatingHours.weekday.start}
                    onChange={(e) => updateData({ 
                      operatingHours: { 
                        ...formData.operatingHours, 
                        weekday: { ...formData.operatingHours.weekday, start: e.target.value } 
                      } 
                    })}
                    className="bg-white"
                  />
                  <span>to</span>
                  <Input 
                    type="time" 
                    value={formData.operatingHours.weekday.end}
                    onChange={(e) => updateData({ 
                      operatingHours: { 
                        ...formData.operatingHours, 
                        weekday: { ...formData.operatingHours.weekday, end: e.target.value } 
                      } 
                    })}
                    className="bg-white"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Weekends (Sat-Sun)</span>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    type="time" 
                    value={formData.operatingHours.weekend.start}
                    onChange={(e) => updateData({ 
                      operatingHours: { 
                        ...formData.operatingHours, 
                        weekend: { ...formData.operatingHours.weekend, start: e.target.value } 
                      } 
                    })}
                    className="bg-white"
                  />
                  <span>to</span>
                  <Input 
                    type="time" 
                    value={formData.operatingHours.weekend.end}
                    onChange={(e) => updateData({ 
                      operatingHours: { 
                        ...formData.operatingHours, 
                        weekend: { ...formData.operatingHours.weekend, end: e.target.value } 
                      } 
                    })}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">
            {formData.businessType === 'hotel' ? 'Number of Rooms' :
             formData.businessType === 'restaurant' ? 'Seating Capacity' :
             formData.businessType === 'activities' ? 'Max Participants' :
             formData.businessType === 'water-sports' ? 'Passenger Capacity' :
             'Capacity'}
          </Label>
          <Input 
            type="number"
            min={1}
            value={formData.capacity}
            onChange={(e) => updateData({ capacity: parseInt(e.target.value) || 0 })}
            className="monarch-input"
          />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Add at least one package or offering.</p>
        
        {formData.packages.map((pkg, index) => (
          <div key={index} className="relative bg-gray-50 p-4 rounded-xl border border-gray-100">
            {index > 0 && (
              <button 
                onClick={() => {
                  const newPackages = [...formData.packages]
                  newPackages.splice(index, 1)
                  updateData({ packages: newPackages })
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-500">Package Name</Label>
                <Input 
                  value={pkg.name}
                  onChange={(e) => {
                    const newPackages = [...formData.packages]
                    newPackages[index].name = e.target.value
                    updateData({ packages: newPackages })
                  }}
                  className="bg-white border-gray-200"
                  placeholder="e.g. Sunset Cruise"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Description</Label>
                <Textarea 
                  value={pkg.description}
                  onChange={(e) => {
                    const newPackages = [...formData.packages]
                    newPackages[index].description = e.target.value
                    updateData({ packages: newPackages })
                  }}
                  className="bg-white border-gray-200 resize-none"
                  rows={2}
                  placeholder="What's included?"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Base Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₱</span>
                  <Input 
                    type="number"
                    value={pkg.basePrice}
                    onChange={(e) => {
                      const newPackages = [...formData.packages]
                      newPackages[index].basePrice = parseInt(e.target.value) || 0
                      updateData({ packages: newPackages })
                    }}
                    className="bg-white border-gray-200 pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {formData.packages.length < 10 && (
          <Button 
            variant="outline" 
            onClick={() => updateData({ packages: [...formData.packages, { name: "", description: "", basePrice: 0 }] })}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Package
          </Button>
        )}
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-6">
        
        {/* Logo Upload */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 shrink-0">
            {formData.logo ? (
              <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <Label className="text-sm font-semibold text-gray-900">Business Logo <span className="text-red-500">*</span></Label>
            <p className="text-xs text-gray-500 mb-2">Recommended: 400x400px, PNG or JPG</p>
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logo')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm">Choose File</Button>
            </div>
          </div>
        </div>

        {/* Cover Photo */}
        <div>
          <Label className="text-sm font-semibold text-gray-900">Cover Photo <span className="text-red-500">*</span></Label>
          <p className="text-xs text-gray-500 mb-2">This will be the header image on your profile</p>
          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center group">
            {formData.coverPhoto ? (
              <img src={formData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                <span className="text-xs">Click to upload cover photo</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'coverPhoto')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Gallery */}
        <div>
          <Label className="text-sm font-semibold text-gray-900">Gallery Photos (Min 3)</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {formData.galleryPhotos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                <img src={photo} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const newPhotos = [...formData.galleryPhotos]
                    newPhotos.splice(i, 1)
                    updateData({ galleryPhotos: newPhotos })
                  }}
                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {formData.galleryPhotos.length < 10 && (
              <div className="relative aspect-square rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-gray-300 transition-colors">
                <Plus className="w-6 h-6" />
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'galleryPhotos')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600 mb-1">Bank Name <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.bankName} 
            onValueChange={(val: any) => updateData({ bankName: val })}
          >
            <SelectTrigger className="monarch-input border-0 border-b-2 rounded-none px-0 shadow-none focus:ring-0">
              <SelectValue placeholder="Select bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BDO">BDO Unibank</SelectItem>
              <SelectItem value="BPI">Bank of the Philippine Islands (BPI)</SelectItem>
              <SelectItem value="METROBANK">Metrobank</SelectItem>
              <SelectItem value="SECURITY">Security Bank</SelectItem>
              <SelectItem value="UNIONBANK">UnionBank</SelectItem>
              <SelectItem value="PNB">Philippine National Bank (PNB)</SelectItem>
              <SelectItem value="CHINABANK">Chinabank</SelectItem>
              <SelectItem value="LANDBANK">Landbank</SelectItem>
              <SelectItem value="GCASH">GCash</SelectItem>
              <SelectItem value="MAYA">Maya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">Account Name <span className="text-red-500">*</span></Label>
          <Input 
            value={formData.accountName}
            onChange={(e) => updateData({ accountName: e.target.value })}
            className="monarch-input"
            placeholder="Name as it appears on bank records"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">Account Number <span className="text-red-500">*</span></Label>
          <Input 
            value={formData.accountNumber}
            onChange={(e) => updateData({ accountNumber: e.target.value })}
            className="monarch-input"
            type="number"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">Account Type</Label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="accountType" 
                checked={formData.accountType === 'savings'} 
                onChange={() => updateData({ accountType: 'savings' })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Savings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="accountType" 
                checked={formData.accountType === 'current'} 
                onChange={() => updateData({ accountType: 'current' })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Current / Checking</span>
            </label>
          </div>
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-1">BIR TIN Number <span className="text-red-500">*</span></Label>
          <Input 
            value={formData.tinNumber}
            onChange={(e) => updateData({ tinNumber: e.target.value })}
            className="monarch-input"
            placeholder="XXX-XXX-XXX-XXX"
          />
        </div>
      </div>
    </div>
  )

  const renderStep7 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-gray-50 p-6 rounded-xl space-y-4">
        <h3 className="font-bold text-gray-900">Partner Agreement</h3>
        <p className="text-sm text-gray-600">Please review and agree to the following terms to proceed with your application.</p>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="commission"
              checked={formData.agreedToCommission}
              onCheckedChange={(c) => updateData({ agreedToCommission: c as boolean })}
            />
            <Label htmlFor="commission" className="text-sm leading-none pt-0.5 font-normal">
              I agree to the <span className="font-semibold text-gray-900">10% commission</span> on all bookings generated through the platform.
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="discounts"
              checked={formData.agreedToDiscounts}
              onCheckedChange={(c) => updateData({ agreedToDiscounts: c as boolean })}
            />
            <Label htmlFor="discounts" className="text-sm leading-none pt-0.5 font-normal">
              I agree to honor member discounts (5-25% based on tier) as outlined in the partner guidelines.
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="terms"
              checked={formData.agreedToTerms}
              onCheckedChange={(c) => updateData({ agreedToTerms: c as boolean })}
            />
            <Label htmlFor="terms" className="text-sm leading-none pt-0.5 font-normal">
              I have read and agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>.
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="privacy"
              checked={formData.agreedToPrivacy}
              onCheckedChange={(c) => updateData({ agreedToPrivacy: c as boolean })}
            />
            <Label htmlFor="privacy" className="text-sm leading-none pt-0.5 font-normal">
              I have read and agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </Label>
          </div>
        </div>
      </div>
    </div>
  )

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Application Submitted!</h1>
            <p className="text-gray-500">
              Thank you for your interest in joining Subic.Life! Our team will review your application within 2-3 business days.
            </p>
          </div>

          <div className="bg-gray-50 py-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reference Number</p>
            <p className="font-mono text-lg font-bold text-gray-900">{referenceNumber}</p>
          </div>

          <Button 
            onClick={() => router.push('/portal/dashboard')}
            className="w-full h-12 text-lg"
          >
            Go to Dashboard
          </Button>
          
          <p className="text-xs text-gray-400">
            Redirecting in 5 seconds...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-4 relative">
      
      {/* Progress Bar */}
      <div className="w-full max-w-[600px] mb-8">
        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs font-semibold text-blue-600">Step {currentStep} of 7</p>
          <p className="text-xs text-gray-400">{STEPS[currentStep - 1]}</p>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="w-full max-w-[600px] flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="w-[120px] h-[120px] bg-gray-50 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-lg">
            {formData.logo ? (
              <img src={formData.logo} alt="Business" className="w-full h-full rounded-full object-cover" />
            ) : (
              <Building2 className="w-12 h-12 text-gray-300" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{STEPS[currentStep - 1]}</h1>
          <p className="text-gray-500">
            {currentStep === 1 && "Tell us about your business"}
            {currentStep === 2 && "How can we contact you?"}
            {currentStep === 3 && "Operating hours and capacity"}
            {currentStep === 4 && "What do you offer?"}
            {currentStep === 5 && "Showcase your venue"}
            {currentStep === 6 && "Where should we send payments?"}
            {currentStep === 7 && "Finalize your application"}
          </p>
        </div>

        <div className="flex-1 mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
          {currentStep === 7 && renderStep7()}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex-1 h-12 text-gray-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep === 7 ? (
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.agreedToCommission || 
                !formData.agreedToDiscounts || 
                !formData.agreedToTerms || 
                !formData.agreedToPrivacy ||
                isSubmitting
              }
              className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .monarch-input {
          border: none;
          border-bottom: 2px solid #e2e8f0;
          background: transparent;
          padding: 12px 0;
          font-size: 16px;
          border-radius: 0;
          box-shadow: none;
          transition: border-color 150ms;
        }
        .monarch-input:focus {
          outline: none;
          border-bottom-color: #2563eb;
          box-shadow: none;
        }
      `}</style>

      {/* Demo Mode Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDemoMode}
        className="fixed bottom-4 right-4 z-50 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 gap-1"
      >
        <Zap className="w-3 h-3" />
        Demo Mode
      </Button>
    </div>
  )
}
