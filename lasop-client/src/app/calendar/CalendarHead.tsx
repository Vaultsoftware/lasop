import React from 'react'

function CalendarHead() {
    return (
        <header className="calendar_head w-full bg-[#DAE2FF] py-10 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <h3 className="font-bold text-4xl text-accent">
                    Academic Calendar
                </h3>
                <p className="mt-7 text-gray-700 text-base md:text-lg max-w-2xl">
                    Stay updated with our training schedule. Explore upcoming cohorts, start dates,
                    and end dates to plan your learning journey.
                </p>
            </div>
        </header>

    )
}

export default CalendarHead