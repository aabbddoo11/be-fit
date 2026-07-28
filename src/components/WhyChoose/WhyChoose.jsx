import "./WhyChoose.css";
 

import {
    FaShippingFast,
    FaShieldAlt,
    FaMedal,
    FaHeadset
} from "react-icons/fa";

import FeatureCard from "../FeatureCard/FeatureCard";

function WhyChoose() {

    const features = [
        {
            icon: <FaMedal />,
            title: "Premium Quality",
            description: "Top-quality supplements from trusted brands for the best performance."
        },
        {
            icon: <FaShippingFast />,
            title: "Fast Delivery",
            description: "Quick nationwide shipping to get your products when you need them."
        },
        {
            icon: <FaShieldAlt />,
            title: "Secure Payment",
            description: "Shop confidently with safe and encrypted payment methods."
        },
        {
            icon: <FaHeadset />,
            title: "Expert Support",
            description: "Our team is here to help you choose the right supplements."
        }
    ];

    return (

       <section className="why-choose">

    <div className="container">

    <div className="why-header">

        <span className="subtitle">
            WHY CHOOSE US
        </span>

        <h2>
            Built For Athletes.<br />
            Trusted By Everyone.
        </h2>

        <p>
            We provide premium supplements, fast delivery,
            secure shopping and expert guidance to help
            you achieve your fitness goals.
        </p>

    </div>

    <div className="why-container">

            <div className="why-image">

                <img
                    src="/why-choose.png"
                    alt="Why Choose B-FIT"
                />

            </div>

            <div className="features-grid">

                {features.map((feature,index)=>(

                    <FeatureCard
                        key={index}
                        {...feature}
                    />

                ))}

            </div>

        </div>

    </div>

</section>

    );
}

export default WhyChoose;