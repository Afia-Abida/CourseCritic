import React from 'react';

const StarRating = ({ rating, maxStars = 5, size = 16, color = '#fbbf24' }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={`full-${i}`}
          style={{ color, fontSize: size, marginRight: '2px' }}
        >
          ★
        </span>
      );
    }

    // Half star
    if (hasHalfStar && fullStars < maxStars) {
      stars.push(
        <span
          key="half"
          style={{ 
            color: '#d1d5db', 
            fontSize: size, 
            marginRight: '2px',
            position: 'relative',
            display: 'inline-block'
          }}
        >
          ★
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              overflow: 'hidden',
              color
            }}
          >
            ★
          </span>
        </span>
      );
    }

    // Empty stars
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span
          key={`empty-${i}`}
          style={{ color: '#d1d5db', fontSize: size, marginRight: '2px' }}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {renderStars()}
      <span style={{ marginLeft: '4px', fontSize: size - 2, color: '#6b7280' }}>
        {rating ? rating.toFixed(1) : '0.0'}
      </span>
    </span>
  );
};

export default StarRating;
