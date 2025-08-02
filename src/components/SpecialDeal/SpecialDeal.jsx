// components/SpecialDeal.js
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Api_Base_Url, Site_Id } from "../../config/api";

const SPECIAL_DEAL_KEY = "lastSpecialDealTime";
const COOLDOWN_MINUTES = 1;

const SpecialDeal = () => {
  const [show, setShow] = useState(false);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch offer data from API
    setLoading(true);
    setError(null);
    fetch(`${Api_Base_Url}/offers`, {
      headers: {
        "Site-Id": Site_Id,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Offer data:", data);

        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          const firstOffer = data.results[0];
          // Only set offer if it has an image
          if (firstOffer.image) {
            setOffer(firstOffer);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load offer data.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Only check for showing the modal if we have an offer with an image
    if (!offer || loading) return;

    const now = Date.now();
    const lastShown = parseInt(localStorage.getItem(SPECIAL_DEAL_KEY), 10);

    const shouldShow =
      !lastShown || now - lastShown > COOLDOWN_MINUTES * 60 * 1000;

    if (shouldShow) {
      setShow(true);
    }
  }, [offer, loading]);

  const handleClose = (e) => {
    e?.stopPropagation();
    setShow(false);
    localStorage.setItem(SPECIAL_DEAL_KEY, Date.now().toString());
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      handleClose(e);
    }
  };

  // Don't show anything if loading, error, or no offer with image
  if (loading || error || !offer || !show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl relative w-full max-w-sm sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-6 p-1 bg-red-600 hover:bg-red-900 hover:scale-110 rounded-full inline-flex justify-center items-center z-10 transition-all duration-200 cursor-pointer">
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center rounded-full"
            type="button"
            aria-label="Close modal"
          >
            <RxCross2 className="text-white w-4 h-4" />
          </button>
        </div>
        <img
          className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-cover rounded-xl mx-auto"
          src={offer.image}
          alt={offer.title || "Special Deal"}
        />
        <h2 className="text-center mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">
          {offer.title}
        </h2>
        {offer.description && (
          <p className="text-center mt-2 text-sm text-gray-600">
            {offer.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SpecialDeal;
