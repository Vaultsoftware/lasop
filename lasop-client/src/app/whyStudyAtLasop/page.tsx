import FAQ from '@/components/faq/FAQ'
import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/herosection/HeroSection'
import Testimonial from '@/components/testimonial/Testimonial';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import StudentSuccessStories from '@/components/successstories/Success';
import LimitedTimeOffer from '@/components/limitedTimeOffer/LimitedTimeOffer';
import Successfulgraduates from '@/components/successfulgraduates/Successfulgraduates';
import FaceOfCurrentStudents from '@/components/faceOfstudents/faceOfStudents';

const SalesFunnel = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <StudentSuccessStories />
            <Testimonial />
            {/* <HowItWorks /> */}
            <Successfulgraduates/>
            <LimitedTimeOffer />
            <FAQ />
            <FaceOfCurrentStudents />
        </div>
    );
};

export default SalesFunnel;
