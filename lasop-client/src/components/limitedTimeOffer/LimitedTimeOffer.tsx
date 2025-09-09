"use client"
import React, { useEffect, useState } from "react"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const LimitedTimeOffer = () => {
  // Set the end time once when component mounts
  const [endTime] = useState(() => new Date().getTime() + (48 * 60 * 60 * 1000))
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = endTime - new Date().getTime()
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

    if (difference > 0) {
      timeLeft = {
        days: 0, // Always 0 since we don't want days
        hours: Math.floor(difference / (1000 * 60 * 60)), // Total hours remaining
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative bg-gradient-to-br from-[#E6EDFF] via-[#E6EDFF] to-[#d4e2ff] py-12 px-6 md:px-16 rounded-3xl shadow-2xl my-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#3360FF]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#3360FF]/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/20 rounded-full blur-lg animate-float"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Enhanced Text Section */}
        <div className="text-left lg:w-1/2 space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-[#3360FF]/20">
              <div className="w-2 h-2 bg-[#3360FF] rounded-full animate-pulse"></div>
              <span className="text-[#3360FF] font-semibold text-sm">LIMITED TIME</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#3360FF] leading-tight">
              <span className="inline-block animate-bounce">⏳</span> 
              <span className="bg-gradient-to-r from-[#3360FF] to-[#4a6bff] bg-clip-text text-transparent">
                Exclusive
              </span>
              <br />
              <span className="text-[#3360FF]">Offer is available to you</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-base text-[#3360FF]/80">
              Don't miss this opportunity to transform your tech future forever! ✨
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button className="group relative bg-[#3360FF] text-white py-3 px-6 rounded-2xl text-base font-bold hover:bg-[#2850ff] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center gap-2">
                🎯 Enroll Now
              </span>
            </button>
            
            <div className="text-left">
              <p className="text-[#3360FF] text-base font-bold">
                🔥 Join <span className="font-black text-lg">2,847+ students</span> who've already enrolled!
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Countdown Section */}
        <div className="lg:w-1/2 w-full">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-[#3360FF] mb-2">⏰ Hurry Up!</h3>
            <p className="text-[#3360FF]/70 font-medium text-sm">Offer expires in:</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            {[
              { label: "Hours", value: timeLeft.hours, icon: "Hours" },
              { label: "Minutes", value: timeLeft.minutes, icon: "Minutes" },
              { label: "Seconds", value: timeLeft.seconds, icon: "Seconds" },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white/40 backdrop-blur-xl border-2 border-[#3360FF]/20 text-[#3360FF] rounded-2xl p-4 flex flex-col items-center justify-center hover:border-[#3360FF]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3360FF]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-lg mb-2 font-bold text-[#3360FF] bg-white/20 w-7 h-7 rounded-full flex items-center justify-center mx-auto ">
                    {item.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl font-black mb-2 tabular-nums">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs lg:text-sm font-semibold uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-white/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-[#3360FF] to-[#4a6bff] rounded-full transition-all duration-1000 animate-pulse"
              style={{ width: `${Math.max(10, (timeLeft.seconds / 60) * 100)}%` }}
            ></div>
          </div>
          
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default LimitedTimeOffer