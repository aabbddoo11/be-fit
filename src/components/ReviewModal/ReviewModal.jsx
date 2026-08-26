import { useState } from "react";

import {
  FaStar,
  FaTimes,
} from "react-icons/fa";

import { toast } from "react-toastify";

import {
  createReview,
} from "../../services/api";

import "./ReviewModal.css";


function ReviewModal({
  token,
  orderId,
  product,
  onSubmitted,
  onClose,
}) {

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (
      comment.trim().length < 3
    ) {

      toast.error(
        "Please write at least 3 characters."
      );

      return;
    }


    try {

      setSubmitting(true);


      const data =
        await createReview(
          token,
          {
            orderId,
            productId:
              product._id,

            rating,

            comment:
              comment.trim(),
          }
        );


      toast.success(
        "Thank you! Your review has been added."
      );


      onSubmitted(
        data.review
      );


    } catch (error) {

      toast.error(
        error.message ||
        "Failed to add review."
      );

    } finally {

      setSubmitting(false);

    }
  };


  return (

    <div
      className="review-modal-overlay"
      role="dialog"
      aria-modal="true"
    >

      <div className="review-modal">


        <button
          type="button"
          className="review-modal-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>


        <div className="review-modal-image">

          {product.image && (

            <img
              src={product.image}
              alt={product.name}
            />

          )}

        </div>


        <span className="review-modal-eyebrow">
          ORDER DELIVERED
        </span>


        <h2>
          How was your product?
        </h2>


        <p className="review-modal-product">
          {product.name}
        </p>


        <form
          onSubmit={handleSubmit}
        >


          <div
            className="review-stars-input"
          >

            {[1, 2, 3, 4, 5].map(
              (star) => (

                <button
                  key={star}
                  type="button"
                  className={
                    star <= rating
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setRating(star)
                  }
                >
                  <FaStar />
                </button>

              )
            )}

          </div>


          <textarea
            value={comment}
            onChange={(event) =>
              setComment(
                event.target.value
              )
            }
            placeholder="Tell us what you think about this product..."
            maxLength={1000}
            rows={5}
            required
          />


          <div
            className="review-modal-actions"
          >

            <button
              type="button"
              className="review-skip-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Skip
            </button>


            <button
              type="submit"
              className="review-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Review"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}


export default ReviewModal;