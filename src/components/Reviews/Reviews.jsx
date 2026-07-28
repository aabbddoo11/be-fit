import "./Reviews.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ReviewCard from "../ReviewCard/ReviewCard";
import { reviews } from "../../data/reviews";

function Reviews() {
  return (
    <section className="reviews">
        <div className="section-header">

          <span className="subtitle">
            CUSTOMER REVIEWS
          </span>

          <h2>
            Loved By Athletes Worldwide
          </h2>

          <p>
            Discover what our customers say about our supplements,
            service and overall shopping experience.
          </p>

        </div>

      <div className="containerr">

        

        <Swiper

          modules={[Navigation, Pagination, Autoplay]}

          spaceBetween={30}

          navigation

          pagination={{ clickable: true }}

          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}

          loop={true}

          breakpoints={{
            0: {
              slidesPerView: 1,
            },

            768: {
              slidesPerView: 2,
            },

            1200: {
              slidesPerView: 3,
            },
          }}

        >

          {reviews.map((review) => (

            <SwiperSlide key={review.id}>

              <ReviewCard review={review} />

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

    </section>
  );
}

export default Reviews;