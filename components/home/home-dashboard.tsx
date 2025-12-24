"use client"

import React from "react"
import Link from "next/link"

export function HomeDashboard() {
  return (
    <div className="relative min-h-screen w-full mx-auto overflow-hidden bg-gray-50 dark:bg-background-dark shadow-2xl font-body selection:bg-teal-500 selection:text-white">
      <div className="absolute inset-0 bg-custom-gradient z-0 pointer-events-none transition-colors duration-500"></div>
      <div className="relative z-10 h-full overflow-y-auto pb-28 no-scrollbar">
        <div className="px-6 pt-14 pb-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-[28px] font-display text-gray-900 dark:text-white tracking-tight leading-tight">
                Good morning,<br /><span className="font-bold">Alfred.</span>
              </h1>
            </div>
            <div className="mt-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 shadow-md">
                <span className="material-symbols-outlined text-yellow-400 text-[14px] mr-1">workspace_premium</span>
                <span className="text-[10px] font-semibold text-white tracking-wide uppercase">Elite Member</span>
              </div>
            </div>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
            </div>
            <input 
              className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-input-dark rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-0 border-none shadow-card" 
              placeholder="Find me a yacht for Saturday..." 
              type="text" 
            />
          </div>
        </div>
        <div className="mb-8">
          <div className="px-6 mb-4 flex justify-between items-end">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">Deals for You</h2>
            <Link className="text-xs font-semibold text-gray-500 hover:text-teal-600 transition-colors" href="#">View All</Link>
          </div>
          <div className="flex overflow-x-auto px-6 space-x-4 pb-4 no-scrollbar snap-x snap-mandatory">
            <div className="snap-center flex-shrink-0 relative w-[260px] h-[360px] rounded-[2rem] overflow-hidden shadow-soft group cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]">
              <img alt="Sailboat on the ocean at sunset" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF9OUdAnlkPsFOiRtwOO80asu6TM23LT4F12VGE006wug7b10OkgVzv1DjrAlJpToD2emJmX_-pajEiq4qeVEctTfa7xceggHes8F7bMVFLAQ01jSj2-ne_CX4t_QPty0idD63aTcxWfz3N-4Z5ngDALLo3_DT7aMfpeacSyUwNgmt_J6yLeLrK2B8viP2CqcexbLwzFBVvddJ6h6c54mbwtpoALG_plKUPWRhOUHdrTYZz0b2xvX-6TaRmPmW9K5JkoUEIt6qE2mI" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                <span className="text-xs font-bold text-white">PROMO</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
                  <span className="text-xs font-semibold text-white">4.9 (120 reviews)</span>
                </div>
                <h3 className="text-xl font-bold mb-1 font-display leading-tight text-shadow-sm">Sunset Yacht Cruise</h3>
                <p className="text-xs text-gray-200 mb-3 line-clamp-1">Experience the golden hour on the bay.</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-gray-300 block uppercase tracking-wider">Starting at</span>
                    <span className="text-lg font-bold text-white">₱8,500</span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="snap-start flex-shrink-0 flex flex-col justify-between w-[260px] h-[360px] space-y-4">
              <div className="relative w-full h-[172px] rounded-[1.5rem] overflow-hidden shadow-card group cursor-pointer bg-white dark:bg-card-dark flex flex-row">
                <div className="w-[110px] h-full relative flex-shrink-0">
                  <img alt="Gourmet dish presentation" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrd2-H1o4J6xP1ieaCWXYuqXx0t_cYoFziDUMrbiS5CtQ5lpVZnoANV06ktwGpYL-1f2XhInhX1JnEE5G4_tnsurjzBt3c6M9n5A4Dlo_SbbbrpBl8ZSqxypOK1iTK5nGPx_3Rjdhh6okx3GcHo6QPU69frTvhvO8ufORuznvizumCmAM89eZM6ZpWLm_HpQJhny436pQrqZDDEquQq4M33aAWkgsbxRCH2xr-quGdpdaA8ggezoK6j0Y8hB25EiqrlneslylX9r2J" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-yellow-500 text-[10px] fill-1">star</span>
                    <span className="text-[10px] text-gray-500">4.8</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-2 font-display">Chef's Table Experience</h3>
                  <div className="mt-auto">
                    <span className="text-[10px] text-gray-400 block uppercase">Per Person</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">₱3,500</span>
                  </div>
                </div>
              </div>
              <div className="relative w-full h-[172px] rounded-[1.5rem] overflow-hidden shadow-card group cursor-pointer bg-white dark:bg-card-dark flex flex-row">
                <div className="w-[110px] h-full relative flex-shrink-0">
                  <img alt="Woman receiving spa treatment" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA3XQ23ychQ2a6yAKmyJLGezK8fleNlahEKJz_mLIX5rdD2ibf1g1DVXzpfP5ZkyYyTRNmOcAIFi1IzfRqN_JB5wbOSsH86qG_0CMWpywlkEIHtk3-YvuncR-hd-Nccdz_INUZYoeSO5-3zidOsUvE4zfo3DfZ7bsWXd1QN1YdWq9pe__4t4Q_pfyw_4kR9bnCVZX4a4uM5c1r91BR0bgKTzdX-yhnA-VyHB6DXn01I2Lc0XsszQRaGBfpVtMzcm9j1vfAHYW331s0" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-yellow-500 text-[10px] fill-1">star</span>
                    <span className="text-[10px] text-gray-500">4.9</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-2 font-display">Wellness Retreat</h3>
                  <div className="mt-auto">
                    <span className="text-[10px] text-gray-400 block uppercase">Package</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">₱4,200</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="snap-center flex-shrink-0 relative w-[260px] h-[360px] rounded-[2rem] overflow-hidden shadow-soft group cursor-pointer">
              <img alt="Helicopter view" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4X_4nFbh7KJ-Li_7bzL2B3LRiQYc6qjyblyW93TqbNICVLt_XtvWJU1uJGXT08CrSPiZyCJU7IjSeRvU-MFy3KQrtelxFzP4rMJjxGL6JUQAINTW696zKda6EHD3hWesaS12OCFoX6lE1x2Ev4olZkUzayxCATORghil7vHyoe6MJYN8QcmVTCOpa4ts1I8gZ0GiADO6-yETZCyNkU1eVphgkk9ucgZkrnIhfysVA2LmcVYfndGxNWm3FPXr4pNa_mLrfNEIyqMAD" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
                  <span className="text-xs font-semibold text-white">5.0 (45 reviews)</span>
                </div>
                <h3 className="text-xl font-bold mb-1 font-display leading-tight text-shadow-sm">Sky Tour</h3>
                <p className="text-xs text-gray-200 mb-3 line-clamp-1">See Subic from the clouds.</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-gray-300 block uppercase tracking-wider">Starting at</span>
                    <span className="text-lg font-bold text-white">₱12,500</span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6">
          <div className="mb-4 flex justify-between items-end">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">Available Offers</h2>
            <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-lg">tune</span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-card-dark rounded-[1.5rem] p-3 shadow-card flex gap-4 h-32 items-center">
              <div className="w-28 h-full flex-shrink-0 rounded-[1rem] overflow-hidden relative">
                <img alt="Fairfield Inn pool area" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqstMOsp25c9F8BWncEfz0LyW-C1y4kAj-WDSBC_lSKI7mTrezf9fbm17Syc38RL_DFJHA_d6prFl5UGWUhThK-3tX1F5puDJuEsDe7gtBHlfsJywEMr-lxnZCx-4HojdBulUvzQgVqQEDVpGjh6ygVx7CvKNjBdWX2hLdhwTVbsR7eXu37JMTd0kRR1BPqNKk-Fd7G5umODd_kg1A8cas9ZL2Now_S7C67hL5HsUx0qOrsy-AIaAXy3mYNzjfPyCDXVznUStlyWBU" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-800">
                  HOTEL
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between h-full py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug font-display line-clamp-1">Fairfield Inn & Suites</h3>
                    <span className="material-symbols-outlined text-gray-300 text-lg cursor-pointer hover:text-red-500">favorite</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="material-symbols-outlined text-[14px] mr-1 text-teal-500">location_on</span>
                    <span className="truncate">Subic Bay Freeport Zone</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-1">
                  <div>
                    <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-none">₱5,500</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">/ Night</p>
                  </div>
                  <button className="bg-black dark:bg-white dark:text-black text-white text-[11px] font-semibold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95">
                    Book
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-card-dark rounded-[1.5rem] p-3 shadow-card flex gap-4 h-32 items-center">
              <div className="w-28 h-full flex-shrink-0 rounded-[1rem] overflow-hidden relative">
                <img alt="Elegant restaurant interior" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNbXbmJVXs2evhGBe8TWiqZ0idOskgCJ9K1JxXK1Z7c8c3LV_-1Bbq0Z-Tzxu9ozihwJ9CxPkz9uFBrqQgtUSGUWnTZOjyNVuwOQiPVdGDICVEBrqF1VqwWCcWfIW0Qwhc4UsFPGG4ytShBfECMu9ph_nBurZSP8Ov6JNNikaWrgr6DViK7uHVFdO3JyT8pIGBQInF6zB5HKY9dzDuYClx9O9gndN-di3Mbgt1DLaoItDMBWLAu8y96RP2XsszAd2NRJRLCB1XJ9kQ" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-800">
                  DINING
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between h-full py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug font-display line-clamp-1">Lighthouse Marina</h3>
                    <span className="material-symbols-outlined text-gray-300 text-lg cursor-pointer hover:text-red-500">favorite</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="material-symbols-outlined text-[14px] mr-1 text-teal-500">location_on</span>
                    <span className="truncate">Waterfront Road</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-1">
                  <div>
                    <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-none">₱3,200</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">/ Prix Fixe</p>
                  </div>
                  <button className="bg-black dark:bg-white dark:text-black text-white text-[11px] font-semibold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95">
                    Reserve
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-card-dark rounded-[1.5rem] p-3 shadow-card flex gap-4 h-32 items-center">
              <div className="w-28 h-full flex-shrink-0 rounded-[1rem] overflow-hidden relative">
                <img alt="Jet ski on water" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBas64d4J2Hl-U3n3g9TppED2_9JrBRZ74WBAmNfSLHoUPoFnOw6oXzdraaHoWQhTcfiQfJZcE6XszEm8UMlcS-BZzxyYZTJ-bVDXs8c7bxa5ANDYLPAJiV0kONm-Hgicqpo-eeeSSk86sPVxMpvUBzBU3uC2dBEwHOXFJYJvkm0nM0lG_68mk-JUokKqYXeAUsNtUcUN6ttUtt2OEHfdZNvlRMYdgLak5BJsvq8IWRceqli1U49JiGWiI-Cee4NL01Y2reeDioslyV" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-800">
                  ACTIVITY
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between h-full py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug font-display line-clamp-1">Subic Watersports</h3>
                    <span className="material-symbols-outlined text-gray-300 text-lg cursor-pointer hover:text-red-500">favorite</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="material-symbols-outlined text-[14px] mr-1 text-teal-500">location_on</span>
                    <span className="truncate">Moonbay Marina</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-1">
                  <div>
                    <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-none">₱2,500</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">/ Hour</p>
                  </div>
                  <button className="bg-black dark:bg-white dark:text-black text-white text-[11px] font-semibold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95">
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
