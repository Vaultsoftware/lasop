import React, { useState, ChangeEvent, FormEvent, } from 'react';
import { MdClose } from "react-icons/md";
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { postSyllabus } from '@/store/syllabus/syllabusSlice';
import { toast } from 'react-toastify';
import { handleCert } from '@/store/dashMenu/dashStore';

interface Syllabus {
    sylTitle: string;
    sylFile: any;
}

function CreateSyllabus() {
    const course = useSelector((state: RootState) => state.courses.courses);
    const dispatch = useDispatch<AppDispatch>();

    const [sylData, setSylData] = useState<Syllabus>({
        sylTitle: '',
        sylFile: ''
    })
    const [error, setError] = useState<string | null>(null);

    const validateForm = () => {
        if (!sylData.sylTitle) {
            setError('Syllabus title is required');
            return false;
        }
        if (!sylData.sylFile) {
            setError('Syllabus file is required');
            return false;
        }
        setError(null); // Clear any previous errors
        return true;
    };

    const handleChange = (e: ChangeEvent<any>) => {
        const { name, value, files } = e.target;
        setSylData({
            ...sylData,
            [name]: files ? files[0] : value
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = new FormData();
            formData.append('sylTitle', sylData.sylTitle as string);
            formData.append('sylFile', sylData.sylFile as File);

            const syllabusData: Syllabus = {
                sylTitle: formData.get('sylTitle') as string,
                sylFile: formData.get('sylFile') as File
            }

            try {
                const response = await dispatch(postSyllabus(syllabusData))
                if (postSyllabus.fulfilled.match(response)) {
                    const payload = response.payload;
                    toast.success(payload.message || 'Syllabus uploaded successfully');
                    dispatch(handleCert())
                }
                else {
                    toast.error(response.error?.message);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className='applicant flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 z-30 '>
            <form onSubmit={handleSubmit} className='p-3 rounded-md bg-white w-[330px] md:w-fit'>
                <div onClick={() => dispatch(handleCert())} className='w-[30px] h-[30px] border border-slate-800 rounded-md flex items-center justify-center text-[14px] ml-auto'>
                    <MdClose />
                </div>
                <h3 className='text-[14px] font-semibold mb-3 mt-2'>Upload Syllabus</h3>
                <div className="frm_inp grid gap-3">
                    <div className="grid gap-2">
                        <label htmlFor="course" className='text-[12px]'>Course</label>
                        <select
                            name='sylTitle'
                            value={sylData.sylTitle}
                            onChange={handleChange}
                            className='w-[300px] md:w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                        >
                            <option value="">Select a course</option>
                            {
                                course.map((cou: any) => (
                                    <option value={cou.title}>{cou.title}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <label className='text-[12px]' htmlFor="sylFile">Syllabus</label>
                        <input
                            type='file'
                            id="sylFile"
                            name="sylFile"
                            onChange={handleChange} />
                    </div>
                </div>
                <div className="cert_btn mt-3">
                    <button className='w-full h-[40px] bg-accent rounded-md text-white text-[14px]' type="submit">Upload Certificate</button>
                </div>
            </form>
        </div>
    )
}

export default CreateSyllabus;