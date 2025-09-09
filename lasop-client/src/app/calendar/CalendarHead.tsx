import React from 'react'

function CalendarHead() {
    return (
        <header className='calendar_head grid md:flex md:items-center md:gap-9 md:px-[3rem] w-full md:h-[100vh] head_bg gap-8 p-[30px] h-auto'>
            <div className="calendar_info w-full md:w-[60%] grid gap-4">
                <h3 className='font-[700] text-[45px] text-accent'>
                    Academic Calendar
                </h3>
                <p>
                    This calendar is updated every month to keep you well informed and ahead.
                    <br /> Last updated: July 8th, 2022.
                </p>
                <div className="center_codes">
                    <h4 className='font-semibold'>Center Codes:</h4>
                    <div className="code_list flex items-center gap-3 mt-2">
                        <div className="code border-2 border-shadow text-shadow px-3 py-2 rounded-md">
                            <p>OGBA: OG</p>
                        </div>
                        <div className="code border-2 border-shadow text-shadow px-3 py-2 rounded-md">
                            <p>OLOWOIRA: OL</p>
                        </div>
                        <div className="code border-2 border-shadow text-shadow px-3 py-2 rounded-md">
                            <p>AJAH: AJ</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default CalendarHead