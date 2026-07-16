import { useClerk, useUser } from "@clerk/clerk-react";
import { features, plans, testimonials } from "../assets/data";
import CTASection from "../components/landing/CTASection";
import FeaturesSection from "../components/landing/FeaturesSection";
import FooterSection from "../components/landing/FooterSection";
import HeroSection from "../components/landing/HeroSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
    const {openSignIn , openSignUp } = useClerk();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if(isSignedIn){
            navigate('/dashboard');
        }
    }, [isSignedIn , navigate]);
    
    return(
        <div className="Landing-page bg-linear-to-b from-gray-50 to-gray-100">
            {/*Hero section*/}
            <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />
            {/*Features section*/}
            <FeaturesSection features={features}/>
            {/*Pricing section*/}
            <PricingSection pricingPlans={plans} openSignUp={openSignUp} />
            {/*Testimonials section*/}
            <TestimonialsSection testimonials={testimonials} />
            {/*CTA section*/}
            <CTASection openSignUp={openSignUp} />
            {/*Footer section*/}
            <FooterSection />
        </div>
    )
}
export default Landing;
