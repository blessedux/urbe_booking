"use client"

import { Header } from '@/components/header'
export default function ProfilePage() {
  return (
    <div 
      className="relative min-h-screen animate-in fade-in duration-500"
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/background1.png)' }}
      />
      
      <Header />
      
      {/* Centered Profile Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm">
          {/* Simple Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col items-center">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full border-2 border-white/20 bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
            </div>
          </div>
                 </div>
       </div>
     </div>
   )
 } 