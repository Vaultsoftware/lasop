'use client';

import Image from 'next/image';
import React from 'react';
import { LuSearch } from "react-icons/lu";
import Link from 'next/link';
import msg from '../../asset/images/message.png';
import notify from '../../asset/images/notifications.png';
import profile from '../../asset/images/profile.png';
import { FaChevronDown, FaRegUser } from 'react-icons/fa6';
import { CiLogout } from 'react-icons/ci';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { handleProfile, handleMenu, handleNotification } from '@/store/dashMenu/dashStore';
import { logOut } from '@/store/studentStore/studentStore';
import NavBackArrow from '../backArrow/NavBackArrow';

interface PropsData {
    username: string;
    link: string;
    acct: string;
    img: string;
}

interface Props {
    props: PropsData;
}

function DashHead({ props }: Props) {
    const dispatch: AppDispatch = useDispatch();
    const openProfile = useSelector((state: RootState) => state.dashMenu.profileDis);

    const handleDashMenu = () => {
        dispatch(handleMenu());
    }

    return (
        <nav className='h-[70px] w-full flex items-center justify-between px-[30px]'>
            <div className="search hidden lmd:block">
                <form action="">
                    <div className="dash_inp">
                        <div className="dash_ctrl flex items-center p-2 bg-secondary rounded-md">
                            <LuSearch className='text-[20px] text-accent' />
                            <input type="search" placeholder='Search...' className='w-full h-[25px] outline-none bg-transparent p-1' id="" />
                        </div>
                    </div>
                </form>
            </div>

            <div className='flex gap-2 items-center lmd:hidden'>
                <div onClick={handleDashMenu} className="burger flex items-center text-[25px] text-accent">
                    <GiHamburgerMenu />
                </div>
                <div>
                    <NavBackArrow />
                </div>
            </div>

            <div className='flex items-center gap-3'>
                <div className="dash_icon">
                    <Image className='w-[30px] h-[30px]' src={msg} alt='' />
                </div>
                <div onClick={() => dispatch(handleNotification())} className="dash_icon">
                    <Image className='w-[30px] h-[30px]' src={notify} alt='' />
                </div>
                <div className="user_profile relative">
                    <div onClick={() => dispatch(handleProfile())} className="user_det flex items-center gap-2 cursor-pointer">
                        <Image  width={30} height={30} className='w-[30px] h-[30px] rounded-full object-cover' src={props.img?.length > 0 ? props.img : msg} alt='' />
                        <span className='text-[12px] font-semibold'>{props.username}</span>
                        <FaChevronDown className='text-accent' />
                    </div>
                    {
                        openProfile && (
                            <div className="drop_user w-fit h-fit rounded-md p-3 shadow-md absolute gap-2 bg-white">
                                <Link onClick={() => dispatch(handleProfile())} href={`/dashboard/${props.acct}/${props.link}`} className="profile flex items-center gap-2 text-[12px] cursor-pointer">
                                    <div className="pro_icon">
                                        <FaRegUser />
                                    </div>
                                    <span>Profile</span>
                                </Link>
                                <div onClick={() => dispatch(logOut())} className="log flex items-center gap-2 text-[12px] cursor-pointer">
                                    <div className="pro_icon">
                                        <CiLogout />
                                    </div>
                                    <span>Log out</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default DashHead