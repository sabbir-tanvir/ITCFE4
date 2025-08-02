import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { ShimmerButton, ShimmerText, ShimmerThumbnail } from "react-shimmer-effects";

const TrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonColor, setButtonColor] = useState('#FC5D43');

  // Fetch site settings for button color
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.button_color) {
          setButtonColor(data.button_color);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const fetchTrainer = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${Api_Base_Url}/instructors/${id}/`, {
          headers: { "Site-Id": Site_Id },
        });
        if (!response.ok) {
          throw new Error("Trainer not found");
        }
        const data = await response.json();
        setTrainer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, [id]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          {/* Trainer image shimmer */}
          <div className="w-64 h-48 rounded-lg mb-6 overflow-hidden">
            <ShimmerThumbnail height={192} width={256} rounded />
          </div>

          {/* Trainer name shimmer */}
          <div className="w-48 h-8 mb-2">
            <ShimmerText line={1} gap={10} />
          </div>

          {/* Designation shimmer */}
          <div className="w-32 h-6 mb-4">
            <ShimmerText line={1} gap={5} />
          </div>

          {/* Description shimmer */}
          <div className="w-full mb-4">
            <ShimmerText line={4} gap={5} />
          </div>

          {/* Back button shimmer */}
          <div className="mt-4">
            <ShimmerButton size="md" />
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">{error}</h2>
        <button
          onClick={() => navigate("/training")}
          className="px-4 py-2 text-white rounded transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
          style={{ backgroundColor: buttonColor }}
        >
          Back to Trainers
        </button>
      </div>
    );
  }
  if (!trainer) {
    return <div className="flex justify-center items-center min-h-screen">No details available</div>;
  }
  return (
    <section className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <img
          src={trainer.image || "/pfp.jpg"}
          alt={trainer.name}
          className="w-64 h-68 rounded-lg object-fill mb-6"
        />
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{trainer.name}</h1>
        <p className="text-gray-600 text-lg mb-4">{trainer.designation}</p>
        <div className="text-black text-base mb-4 text-justify">
          {trainer.description || <span className="text-gray-500 italic">বর্ণনা পাওয়া যায়নি।</span>}
        </div>
        <button
          onClick={() => navigate("/training")}
          className="mt-4 px-4 py-2 text-white rounded transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
          style={{ backgroundColor: buttonColor }}
        >
          Back to Trainers
        </button>
      </div>
    </section>
  );
};

export default TrainerDetails; 