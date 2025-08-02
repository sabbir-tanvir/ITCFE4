/**
 * Utility functions for handling review submissions
 */

/**
 * Creates a review object with the provided data
 * @param {Object} user - The user object from Firebase auth
 * @param {number} rating - The rating (1-5)
 * @param {string} comment - The review comment
 * @returns {Object} The formatted review object
 */
export const createReviewObject = (user, rating, comment) => {
  return {
    id: Date.now(),
    user: {
      name: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
    },
    rating,
    comment,
    timestamp: new Date().toISOString(),
    status: "pending", // pending, approved, rejected
  };
};

/**
 * Posts a review to the database
 * @param {Object} review - The review object to post
 * @param {string} apiEndpoint - The API endpoint to post to
 * @returns {Promise} The API response
 */
export const postReview = async (review, apiEndpoint) => {
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error("Failed to post review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting review:", error);
    throw error;
  }
};

/**
 * Gets all reviews from the database
 * @param {string} apiEndpoint - The API endpoint to fetch from
 * @returns {Promise} The API response with reviews
 */
export const getReviews = async (apiEndpoint) => {
  try {
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

/**
 * Updates a review's status in the database
 * @param {string} reviewId - The ID of the review to update
 * @param {string} status - The new status (approved/rejected)
 * @param {string} apiEndpoint - The API endpoint to update
 * @returns {Promise} The API response
 */
export const updateReviewStatus = async (reviewId, status, apiEndpoint) => {
  try {
    const response = await fetch(`${apiEndpoint}/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update review status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating review status:", error);
    throw error;
  }
};
