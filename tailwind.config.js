/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        HindSiliguri: ['"Hind Siliguri"', "sans-serif"],
      },
      keyframes: {
        rise: {
          "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: "0" },
          "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.3s ease-out forwards",
        'bounce-slow': 'bounce 2s infinite',
      },
    
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // include the themes you want
    darkTheme: "dark", // optional: define which one is used for dark
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "",
  },
};
