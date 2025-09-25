import React from 'react';
import Link from 'next/link';
import { GrMapLocation } from "react-icons/gr";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Image from 'next/image';
import lasopLogo from '../../asset/form/logo.png';

function Footer() {
    return (
        <footer className='md:main py-[3rem] px-[30px] bg-footer text-cyan-50'>
            <div className="foot_main grid xsm:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                <div className="foot_logo grid gap-3">
                    <Link href='/' className="nav_logo font-bold text-2xl text-accent">
                        <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='' />
                    </Link>
                    <Link href='/getStarted' className='flex w-[130px] h-[40px] bg-shadow text-cyan-50 items-center justify-center rounded-md'>Get Started</Link>
                </div>
                <div className="foot_contact">
                    <div className="contact_head mb-3">
                        <h3 className='head3'>Contact</h3>
                    </div>
                    <div className="contact_links grid gap-2">
                        <div className="contact_list flex items-center gap-3">
                            <div className="icon">
                                <GrMapLocation />
                            </div>
                            <div className="contact_num text-[12px]">
                                <p>No. 86, Olowoira Road, Solomon Avenue Junction, Olowoira, off Ojodu-Berger, Lagos Nigeria</p>
                            </div>
                        </div>
                        <div className="contact_list flex items-center gap-3">
                            <div className="icon">
                                <FaPhoneVolume />
                            </div>
                            <div className="contact_num text-[12px]">
                                <p>+234-702-571-3326</p>
                            </div>
                        </div>
                        <div className="contact_list flex items-center gap-3">
                            <div className="icon">
                                <MdOutlineMail />
                            </div>
                            <div className="contact_num text-[12px]">
                                <p>info@lasop.net</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="foot_pages">
                    <div className="pages_head mb-3">
                        <h3 className='head3'>Pages</h3>
                    </div>
                    <div className="pages_list grid gap-2 text-[14px]">
                        <Link href='/'>Home</Link>
                        <Link href='/calendar'>Calendar</Link>
                        <Link href='/about'>About</Link>
                        <Link href='https://g.co/kgs/MCvF7Tq' target='blank'>Testimonial</Link>
                        <Link href='/faq'>FAQs</Link>
                        <Link href='/blog'>Blog</Link>
                    </div>
                </div>
                <div className="foot_company">
                    <div className="company_head mb-3">
                        <h3 className='head3'>Company</h3>
                    </div>
                    <div className="company_list grid gap-2 text-[14px]">
                        <Link href='/contact'>Contact us</Link>
                        <Link href=''>Terms & Condition</Link>
                        <Link href='/calendar'>Academic Calendar</Link>
                    </div>
                </div>
                <div className="foot_social">
                    <div className="social_head mb-3">
                        <h3 className='head3'>Socials</h3>
                    </div>
                    <div className="social_links text-[14px] grid gap-3">
                        <div className="social_list">
                            <div className="social_icon">
                                <FaLinkedin />
                            </div>
                            <div className="social_link">
                                <Link href='https://linkedin.com/company/lasopdotnet'>LinkedIn</Link>
                            </div>
                        </div>
                        <div className="social_list">
                            <div className="social_icon">
                                <FaWhatsapp />
                            </div>
                            <div className="social_link">
                                <Link href='https://wa.me/+2347025713326'>WhatsApp</Link>
                            </div>
                        </div>
                        <div className="social_list">
                            <div className="social_icon">
                                <FaTwitter />
                            </div>
                            <div className="social_link">
                                <Link href='https://twitter.com/Lasopdotnet'>Twitter</Link>
                            </div>
                        </div>
                        <div className="social_list">
                            <div className="social_icon">
                                <FaFacebookF />
                            </div>
                            <div className="social_link">
                                <Link href='https://www.facebook.com/lasopdotnet'>Facebook</Link>
                            </div>
                        </div>
                        <div className="social_list">
                            <div className="social_icon">
                                <FaInstagram />
                            </div>
                            <div className="social_link">
                                <Link href='https://www.instagram.com/lasopdotnet'>Instagram</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer