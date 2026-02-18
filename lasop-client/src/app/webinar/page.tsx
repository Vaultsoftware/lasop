'use client';
import { Calendar, Clock, Users, Video, CheckCircle, ArrowRight, Bell, Award, BookOpen, Sparkles, MessageCircle, X } from 'lucide-react';
import Navbar from './../../components/navbar/Navbar';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// 👇 YOUR WHATSAPP GROUP LINK
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/KyW1KwzDbOaH6XhzrQzioN?mode=gi_t';

export default function LasopWebinar() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [registered, setRegistered] = useState(false);
  const [sending, setSending] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappJoined, setWhatsappJoined] = useState(false);
  const [hasClickedWhatsApp, setHasClickedWhatsApp] = useState(false); // NEW - tracks if they clicked join

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-02-22T12:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('jmMjHWm08bK1xNwwI');
  }, []);

  // STEP 1: User submits form → show WhatsApp modal first
  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && name && phone) {
      setHasClickedWhatsApp(false); 
      setShowWhatsAppModal(true);
    }
  };

  // STEP 2: User clicks "I've Joined WhatsApp" → send email and show success
  const handleWhatsAppJoined = async () => {
    if (!hasClickedWhatsApp) return; // extra safety - shouldn't reach here anyway

    setWhatsappJoined(true);
    setSending(true);

    try {
      const templateParams = {
        name: name,
        email: email,
        phone: phone,
      };

      const response = await emailjs.send(
        'service_90bids9',
        'template_70vkndx',
        templateParams
      );

      console.log('Email sent successfully:', response);
      setShowWhatsAppModal(false);
      setRegistered(true);

    } catch (error: any) {
      console.error('Error sending email:', error);
      alert(`Registration error: ${error.text || error.message || 'Please check your internet connection and try again.'}`);
      setWhatsappJoined(false);
    } finally {
      setSending(false);
    }
  };

  // Opens WhatsApp AND unlocks the "I've Joined" button
  const handleOpenWhatsApp = () => {
    window.open(WHATSAPP_GROUP_LINK, '_blank');
    setHasClickedWhatsApp(true);
  };

  // CTA Button Component
  const CTAButton = () => (
    <a href="#register" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-bold text-base transition-all shadow-lg hover:shadow-xl group">
      Register Free Now
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </a>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ===================== WHATSAPP MODAL ===================== */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8 relative">

            <button
              onClick={() => {
                setShowWhatsAppModal(false);
                setHasClickedWhatsApp(false); // reset on close
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-9 h-9 text-green-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              One Last Step! 🎉
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Join our <span className="font-semibold text-green-600">WhatsApp Group</span> to complete your registration. You'll get updates, reminders, and exclusive content there.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">How it works:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  Click <strong>"Join WhatsApp Group To Complete Registration"</strong> 
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  Join the group on WhatsApp
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  Come back here and click <strong>"I've Joined"</strong>
                </li>
              </ul>
            </div>

            {/* Green Join Button */}
            <button
              onClick={handleOpenWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 mb-3 transition-all shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              {hasClickedWhatsApp ? 'Open WhatsApp Group Again ↗' : 'Join WhatsApp Group'}
            </button>

            {/* Blue Confirm Button - LOCKED until they click green button */}
            <button
              onClick={handleWhatsAppJoined}
              disabled={sending || !hasClickedWhatsApp}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Completing Registration...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  I've Joined — Complete Registration
                </>
              )}
            </button>

            {/* Helper message - changes based on state */}
            <p className="text-xs text-center mt-3 font-medium">
              {hasClickedWhatsApp
                ? <span className="text-green-600">✅ Great! Now click "I've Joined" above to finish</span>
                : <span className="text-red-500">⚠️ Please click "Join WhatsApp Group" first before continuing</span>
              }
            </p>

          </div>
        </div>
      )}
      {/* ===================== END WHATSAPP MODAL ===================== */}

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden border-b border-gray-200">
        <div className="relative md:px-12 px-[30px] pb-16 lg:pb-20 pt-10 lg:pt-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                </span>
                <span className="text-green-700 font-semibold">LIVE WEBINAR • 100% FREE</span>
              </div>

              <h1 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight text-gray-900">
                Transform Your Career with <span className="text-blue-600">LASOP</span>
              </h1>

              <p className="text-sm lg:text-base text-gray-600 mb-6 leading-relaxed">
                Join 500+ professionals for an exclusive 90-minute training that will accelerate your career growth
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Saturday, February 22, 2026</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">12:00PM WAT (90 Minutes)</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Online via Zoom</span>
                  </div>
                </div>
              </div>

              <CTAButton />
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGBjLKMUfCjvweCeKHMa7SeKFvaJGVKz_Etw&s"
                    alt="Students learning"
                    className="w-full h-[280px] lg:h-[350px] object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Countdown Timer Section */}
      <div className="bg-white py-10 border-b border-gray-200">
        <div className="md:px-12 px-[30px]">
          <div className="text-center mb-5">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Webinar Starts In</p>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Don't Miss Out!</h3>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item) => (
              <div key={item.label} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 text-center shadow-sm border border-blue-100">
                <div className="text-2xl lg:text-4xl font-bold text-blue-600 mb-1">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs font-semibold text-gray-600 uppercase">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <CTAButton />
          </div>
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="py-12 lg:py-16 bg-gray-50">
        <div className="md:px-12 px-[30px]">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                  alt="Professional training"
                  className="w-full h-[280px] lg:h-[320px] object-cover"
                />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Sparkles className="w-3 h-3" />
                What You'll Learn
              </div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-3">Master Skills That Matter</h2>
              <p className="text-sm lg:text-base text-gray-600 mb-5 leading-relaxed">
                Walk away with practical, career-changing insights you can apply immediately
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  'Essential professional skills employers look for',
                  'Proven strategies from industry experts',
                  'Exclusive resources and materials',
                  'Network with ambitious professionals',
                  'Certificate of participation'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              <CTAButton />
            </div>
          </div>
        </div>
      </div>

      {/* Who Should Attend Section */}
      <div className="py-12 lg:py-16 bg-white">
        <div className="md:px-12 px-[30px]">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Users className="w-3 h-3" />
                Who Should Attend
              </div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-3">Is This Webinar For You?</h2>
              <p className="text-sm lg:text-base text-gray-600 mb-5 leading-relaxed">
                Perfect for anyone ready to take their career to the next level
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Young professionals', 'Career starters', 'Job seekers', 'Students', 'Career switchers', 'Skill upgraders'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg border border-blue-100 text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <p className="text-xs text-gray-600">Registered</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg border border-blue-100 text-center">
                  <div className="text-2xl font-bold text-blue-600">90</div>
                  <p className="text-xs text-gray-600">Minutes</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg border border-blue-100 text-center">
                  <div className="text-2xl font-bold text-blue-600">FREE</div>
                  <p className="text-xs text-gray-600">No Cost</p>
                </div>
              </div>
              <CTAButton />
            </div>
            <div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop"
                  alt="Students in class"
                  className="w-full h-[280px] lg:h-[320px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Attend Section */}
      <div className="py-12 lg:py-16 bg-gray-50">
        <div className="md:px-12 px-[30px] text-center">
          <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-4">Why You Should Attend This Webinar</h2>
          <p className="text-sm lg:text-base text-gray-600 mb-8">
            Join hundreds of professionals who have transformed their careers through our training programs
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Expert Training</h3>
              <p className="text-sm text-gray-600">Learn from industry professionals with years of experience</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Certificate</h3>
              <p className="text-sm text-gray-600">Receive a certificate of participation to boost your CV</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Network</h3>
              <p className="text-sm text-gray-600">Connect with like-minded professionals from various fields</p>
            </div>
          </div>
          <CTAButton />
        </div>
      </div>

      {/* Meet Our Speakers Section */}
      <div className="py-12 lg:py-16 bg-white">
        <div className="md:px-12 px-[30px]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
              <Users className="w-3 h-3" />
              Our Expert Speakers
            </div>
            <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-3">Meet Our Speakers</h2>
            <p className="text-sm lg:text-base text-gray-600">
              Learn from industry experts who are passionate about helping you succeed
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Mr. David', role: 'Industry Expert', bio: 'Expert in professional development with over 10 years of experience helping professionals achieve their career goals' },
              { name: 'Mr. Godswill', role: 'Lead Speaker', bio: 'Specializes in career strategy and skill development, guiding thousands to success in their professional journeys' },
              { name: 'Mr. Kevin', role: 'Training Specialist', bio: 'Passionate about empowering individuals with practical skills and actionable insights for career advancement' },
            ].map((speaker) => (
              <div key={speaker.name} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img
                    src={`https://ui-avatars.com/api/?name=${speaker.name.split(' ')[1]}&size=200&background=3b82f6&color=fff&bold=true`}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{speaker.name}</h3>
                <p className="text-xs text-blue-600 text-center font-semibold mb-3">{speaker.role}</p>
                <p className="text-sm text-gray-600 text-center">{speaker.bio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <CTAButton />
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-10 bg-blue-600">
        <div className="md:px-12 px-[30px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div><div className="text-2xl lg:text-3xl font-bold mb-1">500+</div><p className="text-xs lg:text-sm text-blue-200">Registered</p></div>
            <div><div className="text-2xl lg:text-3xl font-bold mb-1">4.9★</div><p className="text-xs lg:text-sm text-blue-200">Rating</p></div>
            <div><div className="text-2xl lg:text-3xl font-bold mb-1">15+</div><p className="text-xs lg:text-sm text-blue-200">Days Left</p></div>
            <div><div className="text-2xl lg:text-3xl font-bold mb-1">100%</div><p className="text-xs lg:text-sm text-blue-200">Free</p></div>
          </div>
        </div>
      </div>

      {/* Registration Section */}
      <div id="register" className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            {!registered ? (
              <div className="p-6 lg:p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
                    <Bell className="w-3 h-3" />
                    Limited Spots Available
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Secure Your Free Seat Now</h2>
                  <p className="text-sm text-gray-600">Join 500+ professionals already registered</p>
                </div>

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group mt-5"
                  >
                    Register Now - 100% FREE
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-5 text-xs text-gray-500 pt-2">
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />No payment</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />Instant confirmation</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />Cancel anytime</span>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6 lg:p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h3>
                <p className="text-base text-gray-600 mb-6">
                  Check your inbox at <span className="text-blue-600 font-semibold">{email}</span>
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5 text-left">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900 mb-2 text-sm">What Happens Next?</p>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full"></div>You've joined the WhatsApp group ✅</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full"></div>Confirmation email sent to your inbox</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full"></div>Zoom link will be sent 24 hours before</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full"></div>Calendar invite included</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full"></div>Access to exclusive resources</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-5">See you on February 22nd at 12:00 PM WAT! 👋</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-6">
        <div className="md:px-12 px-[30px] text-center">
          <p className="text-gray-400 text-xs">© 2026 LASOP. All rights reserved.</p>
        </div>
      </div>

    </div>
  );
}