'use client'
import React, { useState } from "react"
import { ChevronDown, Users, Clock, Award, Code, DollarSign, BookOpen, Zap, MessageCircle } from "lucide-react"

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqData = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      question: "What programming languages and technologies will I learn at LASOP?",
      answer: "At LASOP, you'll master modern web development technologies including HTML5, CSS3, JavaScript (ES6+), React, Node.js, Python, databases (MongoDB, PostgreSQL), Git version control, and cloud deployment. Our curriculum is constantly updated to match industry demands and includes hands-on projects with real-world applications."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      question: "How long does the LASOP program take to complete?",
      answer: "Our comprehensive program is designed to be completed in 6-12 months, depending on your chosen track and schedule. We offer full-time intensive courses (3-4 months), part-time evening classes (6-8 months), and flexible weekend programs (8-12 months) to accommodate working professionals and students."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      question: "What are the tuition fees and payment options?",
      answer: "LASOP offers competitive pricing with multiple payment plans. Full program tuition ranges from ₦150,000 - ₦500,000 depending on the track. We provide flexible payment options including monthly installments, early bird discounts, and scholarship opportunities for exceptional candidates. Financial aid and payment plans are available."
    },
    {
      icon: <Users className="w-6 h-6" />,
      question: "Do I need prior programming experience to join LASOP?",
      answer: "No prior programming experience is required! LASOP welcomes complete beginners. Our curriculum starts with fundamentals and progressively builds advanced skills. We have beginner-friendly tracks designed specifically for career switchers and newcomers to tech. Our instructors provide personalized support to ensure everyone succeeds."
    },
    {
      icon: <Award className="w-6 h-6" />,
      question: "What kind of job support and career services do you provide?",
      answer: "LASOP provides comprehensive career support including resume building, portfolio development, interview preparation, soft skills training, and direct connections with our hiring partners. We maintain relationships with 100+ tech companies and have a 85% job placement rate within 6 months of graduation. Lifetime career support is included."
    },
    {
      icon: <Code className="w-6 h-6" />,
      question: "Are the classes online, in-person, or hybrid?",
      answer: "We offer all three formats! Choose from fully online live classes, in-person sessions at our Lagos campus, or hybrid learning that combines both. All formats include the same curriculum, instructor interaction, and project-based learning. Online students get recorded sessions and 24/7 access to learning materials."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      question: "What makes LASOP different from other programming schools?",
      answer: "LASOP focuses on practical, project-based learning with real industry mentors. We emphasize soft skills alongside technical skills, provide personalized mentorship, maintain small class sizes (max 15 students), and offer lifetime access to course materials and community. Our graduates work at top tech companies across Nigeria and globally."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      question: "What support is available during and after the program?",
      answer: "Students receive 24/7 access to instructors via Slack, weekly one-on-one mentorship sessions, peer study groups, career counseling, and technical support. After graduation, you join our alumni network with continued access to job opportunities, advanced workshops, and community events. We're committed to your long-term success."
    }
  ]

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#3360FF]/10 px-4 py-2 rounded-full mb-6">
            <MessageCircle className="w-5 h-5 text-[#3360FF]" />
            <span className="text-[#3360FF] font-semibold text-sm">FREQUENTLY ASKED</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Got Questions About 
            <span className="bg-gradient-to-r from-[#3360FF] to-[#4a6bff] bg-clip-text text-transparent block md:inline">
              {" "}LASOP?
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We've compiled answers to the most common questions about our programming bootcamp. 
            Can't find what you're looking for? <span className="text-[#3360FF] font-semibold">Reach out to us!</span>
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#3360FF]/20"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    openItems.includes(index) 
                      ? 'bg-[#3360FF] text-white shadow-lg' 
                      : 'bg-[#3360FF]/10 text-[#3360FF] group-hover:bg-[#3360FF]/20'
                  }`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 min-w-0 break-words">
                    {item.question}
                  </h3>
                </div>
                
                <ChevronDown 
                  className={`w-6 h-6 text-[#3360FF] transition-transform duration-300 flex-shrink-0 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {/* Answer Content */}
              <div className={`overflow-hidden transition-all duration-300 ${
                openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <div className="pl-16">
                    <div className="bg-gradient-to-r from-[#3360FF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#3360FF] max-h-48 sm:max-h-none overflow-y-auto">
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg break-words">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-gradient-to-r from-[#3360FF] to-[#4a6bff] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-white shadow-2xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Still have questions? 🤔
            </h3>
            <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Our admissions team is here to help! Get personalized answers and learn more about how LASOP can accelerate your tech career.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-white text-[#3360FF] px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                📞 Book a Call
              </button>
              <button className="border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                💬 Live Chat
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { number: "2,500+", label: "Graduates", icon: "🎓" },
            { number: "85%", label: "Job Placement", icon: "💼" },
            { number: "100+", label: "Hiring Partners", icon: "🤝" },
            { number: "24/7", label: "Support", icon: "🛟" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#3360FF] mb-1">{stat.number}</div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection