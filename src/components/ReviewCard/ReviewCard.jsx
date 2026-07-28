import "./ReviewCard.css";
import { FaStar, FaCheckCircle } from "react-icons/fa";

function ReviewCard({ review }) {

  return (

    <div className="review-card">

      <div className="review-rating">

        {[...Array(review.rating)].map((_, index) => (
          <FaStar key={index} />
        ))}

      </div>

      <p className="review-text">
        "{review.review}"
      </p>

      <div className="review-product">

        <img
          src={review.productImage}
          alt={review.productName}
        />

        <div>

          <h4>{review.productName}</h4>

          <button>
            View Product
          </button>

        </div>

      </div>

      <div className="review-user">

        

        <div>

          <h5>{review.user}</h5>

          <span>

            <FaCheckCircle />

            Verified Buyer

          </span>

        </div>

      </div>

    </div>

  );

}

export default ReviewCard;