// ================================================
// File: src/components/calendar/CalendarHead.tsx
// ================================================
import React from "react";

function CalendarHead() {
  return (
    <header className="calendar_head w-full bg-[#DAE2FF] py-10 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <h3 className="text-3xl font-bold text-accent md:text-4xl">Academic Calendar</h3>
        <p className="mt-7 max-w-2xl text-base text-gray-700 md:text-lg">
          Stay updated with our training schedule. Explore upcoming cohorts, start dates,
          and end dates to plan your learning journey.
        </p>
      </div>
    </header>
  );
}

export default CalendarHead;
