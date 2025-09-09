import React from 'react';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { handleCode } from '@/store/dashMenu/dashStore';

function CohCode() {
    const dispatch = useDispatch<AppDispatch>();
    return (
        <div className='flex items-center justify-center fixed top-0 left-0 applicant w-full h-[100vh] z-50'>
            <div className='p-4 rounded-md bg-white w-[300px] h-[300px] overflow-y-scroll'>
                <div onClick={() => dispatch(handleCode())} className='w-[25px] h-[25px] rounded-md items-center flex justify-center bg-accent text-cyan-50 ml-auto mb-4'>
                    <FaXmark />
                </div>
                <div>
                    <h1 className='font-bold text-[16px] text-shadow'>Understanding our COHORT code names</h1>
                </div>
                <div className='mb-2 text-[12px]'>
                    <p>Each COHORT code name is a unique identifier for our course and mode. We use them to help
                        you remember which course is being taught and mode availble for each cohort. Some examples
                        are:</p>
                    <br />
                    <ul className='grid gap-1 text-[12px]'>
                        <li><b className='font-bold'>JAN25FEON</b>: The cohort code for 'Front-end Development (FE)
                            ' and mode of studying is online (ON) and (JAN25) stands for the month and year</li>
                        <li><b className='font-bold'>JAN25CSWE</b>: The cohort code for 'Cyber Security (CS)' and
                            mode of studying is Weekend (WE) and (JAN25) stands for the month and year</li>
                        <li><b className='font-bold'>JAN25FEONCSWE</b>: The cohort code for 'Front-end Development
                            (FE)' and mode of studying is online (ON), Cyber Security (CS) and Weekend (WE) and (JAN25)
                            stands for the month and year</li>
                    </ul>
                </div>
                <p className='text-[12px]'>Below is a table descirbing our code names and their definition</p>
                <table className='w-full border-b-2 border-shadow text-[12px]'>
                    <thead>
                        <tr>
                            <th className='text-start py-3'>CODE NAME</th>
                            <th className='text-start py-3'>CODE DESCRIPTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>FE</td>
                            <td className='text-start py-3'>Front-end Development</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>FS</td>
                            <td className='text-start py-3'>Fullstack Development</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>CS</td>
                            <td className='text-start py-3'>Cyber Security</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>DS</td>
                            <td className='text-start py-3'>Data Science</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>DA</td>
                            <td className='text-start py-3'>Data Analysis</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>PD</td>
                            <td className='text-start py-3'>Product Design</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>MA</td>
                            <td className='text-start py-3'>Mobile App</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>WE</td>
                            <td className='text-start py-3'>Weekends</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>WD</td>
                            <td className='text-start py-3'>Weekdays</td>
                        </tr>
                        <tr className='border-t border-shadow'>
                            <td className='text-start py-3'>ON</td>
                            <td className='text-start py-3'>Online</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CohCode