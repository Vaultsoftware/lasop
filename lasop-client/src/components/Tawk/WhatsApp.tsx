"use client";

import { usePathname } from 'next/navigation';

const WHATSAPP_NUMBER = "2347025713326";
const WHATSAPP_MESSAGE = "Hi Lasop! 👋 I'm interested in your tech programs. Can you tell me more about the courses available and how to enroll?";

const HIDDEN_ON = [
  '/getstarted',
  '/register',
  '/enrol',
  '/enroll',
  '/apply',
  '/payment',
];

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  const isHidden = HIDDEN_ON.some((route) =>
    pathname.toLowerCase().startsWith(route)
  );

  if (isHidden) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Lasop on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-green-400/40 hover:scale-105 transition-all duration-300 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-6 h-6 fill-white flex-shrink-0"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.476 2.027 7.785L0 32l8.43-2.01A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.073 22.73c-.335.942-1.958 1.797-2.7 1.91-.692.105-1.566.15-2.527-.158-.583-.188-1.33-.438-2.285-.859-4.02-1.74-6.646-5.795-6.846-6.063-.2-.268-1.633-2.172-1.633-4.143s1.033-2.94 1.4-3.342c.367-.4.8-.5 1.067-.5.267 0 .533.003.767.013.246.012.576-.093.9.689.335.805 1.137 2.776 1.237 2.976.1.2.167.433.033.7-.133.267-.2.433-.4.667-.2.233-.42.52-.6.7-.2.2-.408.415-.175.815.233.4 1.033 1.703 2.217 2.757 1.52 1.356 2.803 1.775 3.203 1.975.4.2.633.167.867-.1.233-.267 1-.1167 1.367-1.533.367-.417.7-.35 1.167-.217.467.133 2.967 1.4 3.467 1.654.5.253.833.38.95.587.12.207.12 1.167-.217 2.11z" />
      </svg>

      <span className="text-sm font-semibold whitespace-nowrap hidden sm:block">
        Chat with us
      </span>
    </a>
  );
}