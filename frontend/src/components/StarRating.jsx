import React, { useState } from "react";

const StarRating = ({ rating, setRating, disabled = false, size = "large" }) => {
  const [hover, setHover] = useState(0);

  const starSize = {
    small: "1.5rem",
    medium: "2rem", 
    large: "2.5rem"
  }[size];

  return (
    <div className="star-rating">
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={star <= (hover || rating) ? "star on" : "star off"}
            onClick={() => !disabled && setRating(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => !disabled && setHover(0)}
            disabled={disabled}
            style={{ fontSize: starSize }}
          >
            ★
          </button>
        ))}
      </div>
      <div className="rating-text">
        {rating ? `${rating} star${rating > 1 ? 's' : ''}` : "Select your rating"}
      </div>
    </div>
  );
};

export default StarRating;