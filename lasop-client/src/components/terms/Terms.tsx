import { termsAndConditions } from '@/data/data'
import React from 'react'
import { FaXmark } from 'react-icons/fa6'

interface Props {
    handleClick: React.MouseEventHandler<HTMLButtonElement>;
    handleTerm: React.MouseEventHandler<HTMLDivElement>;
}

function Terms({handleClick, handleTerm}: Props) {
    return (
        <main style={{background: 'rgba(0, 0, 0, 0.6)'}} className='absolute top-0 left-0 p-4 w-full h-fit z-10'>
            <div className='bg-white p-3 w-full h-full rounded-lg'>
                <div onClick={handleTerm} className='w-[30px] h-[30px] rounded-md items-center flex justify-center bg-accent text-cyan-50 ml-auto mb-4'>
                    <FaXmark />
                </div>
                {
                    termsAndConditions.map((term, ind) => (
                        <div key={ind}>
                            <div>
                                <h1 className='font-bold text-[25px]'>{term.title}</h1>
                            </div>
                            <div className='grid gap-3'>
                                {
                                    term.sections.map((sect, id) => (
                                        <div key={id}>
                                            <div>
                                                <h3 className='font-semibold'>{sect.title}</h3>
                                            </div>
                                            <div>
                                                <p className='text-[12px]'>{sect.content}</p>
                                                <ul className='grid gap-1 pl-6'>
                                                    {
                                                        sect.items?.map((item, id) => (
                                                            <li key={id} className='text-[12px] list-disc'>{item}</li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
                <div className='flex justify-center mt-10'>
                    <button className='w-fit h-[35px] rounded-md px-3 bg-accent text-cyan-50 text-[12px]' onClick={handleClick}>Accept Terms & Condition</button>
                </div>
            </div>
        </main>
    )
}

export default Terms