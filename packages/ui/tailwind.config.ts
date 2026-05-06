/** @type {import('tailwindcss').Config} */
import preset from "../tailwind/src/preset";

export default {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
};

