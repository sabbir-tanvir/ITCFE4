import React, { useEffect, useState, useCallback } from "react";
import { fetchSiteSettings } from "../config/siteSettingsApi";

const Games = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentAlphabet, setCurrentAlphabet] = useState("");
  const [life, setLife] = useState(5);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonColor, setButtonColor] = useState('#FC5D43');

  const randomAlphabets = () => {
    const alphabetsString =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabets = alphabetsString.split("");
    const randomNum = Math.random() * 51;
    const index = Math.round(randomNum);
    return alphabets[index];
  };

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
    setIsGameStarted(false);
    setFinalScore(score);
  }, [score]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === "Escape") {
      handleGameOver();
      return;
    }

    if (event.key === "Shift") {
      return;
    }

    if (event.key === currentAlphabet) {
      setScore((prev) => prev + 1);
      setCurrentAlphabet(randomAlphabets());
      setErrorMessage("");
    } else if (event.key.toLowerCase() === currentAlphabet.toLowerCase()) {
      setErrorMessage("Wrong case! Press the exact case shown.");
      setLife((prev) => {
        const newLife = prev - 1;
        if (newLife === 0) {
          handleGameOver();
        }
        return newLife;
      });
    } else {
      setErrorMessage("Wrong key! Try again.");
      setLife((prev) => {
        const newLife = prev - 1;
        if (newLife === 0) {
          handleGameOver();
        }
        return newLife;
      });
    }
  }, [currentAlphabet, handleGameOver]);

  const startGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    setLife(5);
    setScore(0);
    setErrorMessage("");
    setCurrentAlphabet(randomAlphabets());
  };

  // Fetch button color from site settings
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
    if (isGameStarted) {
      window.addEventListener("keyup", handleKeyPress);
      return () => {
        window.removeEventListener("keyup", handleKeyPress);
      };
    }
  }, [isGameStarted, currentAlphabet, handleKeyPress]);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* <div className="block md:hidden min-h-[60vh] flex items-center justify-center text-center">
          <div className="bg-yellow-100 text-yellow-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Switch to Desktop</h2>
            <p className="text-lg">
              To play the game, please use a desktop or laptop device. Mobile
              view is not supported.
            </p>
          </div>
        </div> */}

        <div>
          {!isGameStarted && !isGameOver && (
            <div className="flex justify-center items-center min-h-[60vh]">
              <button
                onClick={startGame}
                className="relative group px-6 sm:px-12 py-4 sm:py-6 rounded-lg text-lg sm:text-2xl font-bold text-white transform transition-all duration-300 hover:scale-105 hover:opacity-90"
                style={{ backgroundColor: buttonColor }}
              >
                <span className="relative z-10">Click To Start Game</span>
              </button>
            </div>
          )}

          {isGameStarted && (
            <div className="space-y-8">
              <div className="border-2 border-purple-500 p-8 mx-auto max-w-2xl rounded-xl bg-white shadow-[0_0_30px_rgba(147,51,234,0.2)] flex justify-center items-center transform transition-all duration-300 hover:scale-105">
                <div className="text-9xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  {currentAlphabet}
                </div>
              </div>

              {errorMessage && (
                <div className="text-center text-red-500 font-bold text-xl mt-4 animate-bounce">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-center gap-2 my-2 w-full">
                {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map(
                  (key) => (
                    <kbd
                      key={key}
                      className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-200 ${currentAlphabet.toLowerCase() === key
                        ? "text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      style={currentAlphabet.toLowerCase() === key ? { backgroundColor: buttonColor } : {}}
                    >
                      {currentAlphabet.toLowerCase() === key
                        ? currentAlphabet
                        : currentAlphabet === currentAlphabet.toUpperCase()
                          ? key.toUpperCase()
                          : key}
                    </kbd>
                  )
                )}
              </div>
              <div className="flex justify-center gap-2 my-2 w-full">
                {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((key) => (
                  <kbd
                    key={key}
                    className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-200 ${currentAlphabet.toLowerCase() === key
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    style={currentAlphabet.toLowerCase() === key ? { backgroundColor: buttonColor } : {}}
                  >
                    {currentAlphabet.toLowerCase() === key
                      ? currentAlphabet
                      : currentAlphabet === currentAlphabet.toUpperCase()
                        ? key.toUpperCase()
                        : key}
                  </kbd>
                ))}
              </div>
              <div className="flex justify-center gap-2 my-2 w-full">
                {["z", "x", "c", "v", "b", "n", "/"].map((key) => (
                  <kbd
                    key={key}
                    className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-200 ${currentAlphabet.toLowerCase() === key
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    style={currentAlphabet.toLowerCase() === key ? { backgroundColor: buttonColor } : {}}
                  >
                    {currentAlphabet.toLowerCase() === key
                      ? currentAlphabet
                      : currentAlphabet === currentAlphabet.toUpperCase()
                        ? key.toUpperCase()
                        : key}
                  </kbd>
                ))}
              </div>

              <div className="flex flex-col items-center">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 w-full max-w-md">
                  <div className="flex-1 bg-gradient-to-r from-red-500 to-red-400 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)] p-4">
                    <div className="text-center font-bold text-lg sm:text-xl text-white">
                      Life: {life}
                    </div>
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-green-500 to-green-400 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.2)] p-4">
                    <div className="text-center font-bold text-lg sm:text-xl text-white">
                      Point: {score}
                    </div>
                  </div>
                </div>
                <button
                  onClick={startGame}
                  className="mt-4 px-6 py-2 text-white rounded-lg font-bold text-lg transform transition-all duration-300 hover:scale-105 hover:opacity-90"
                  style={{ backgroundColor: buttonColor }}
                >
                  Reset Game
                </button>
              </div>
            </div>
          )}

          {isGameOver && (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="stats shadow bg-gradient-to-r from-red-500 to-red-400 rounded-xl p-8">
                <div className="stat text-center">
                  <div className="stat-value text-center text-4xl font-bold mb-4 text-white">
                    Game Over
                  </div>
                  <div className="stat-value text-center text-3xl mb-4 text-white">
                    Score: {finalScore}
                  </div>
                  <div className="stat-desc text-center text-xl mb-6 text-white">
                    Better Luck Next Time Buddy
                  </div>
                  <button
                    onClick={startGame}
                    className="px-8 py-3 text-white rounded-lg font-bold text-lg transform transition-all duration-300 hover:scale-105 hover:opacity-90"
                    style={{ backgroundColor: buttonColor }}
                  >
                    Play Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;
