import sql from '../config/db.js';

export const addReview = async (req, res) => {
  const reviewerId = req.user.id;
  const { ride_id, reviewee_id, rating, comment } = req.body;

  try {
    const [review] = await sql`
      INSERT INTO reviews (ride_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (${ride_id}, ${reviewerId}, ${reviewee_id}, ${rating}, ${comment})
      RETURNING *
    `;

    // Update average rating
    const [avgResult] = await sql`
      SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewee_id = ${reviewee_id}
    `;
    
    if (avgResult && avgResult.avg_rating) {
        await sql`UPDATE users SET average_rating = ${avgResult.avg_rating} WHERE id = ${reviewee_id}`;
    }

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
