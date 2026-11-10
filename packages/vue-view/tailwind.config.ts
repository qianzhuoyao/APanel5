import preset from "../tailwind/src/preset";

export default {
  presets: [preset],
  content: [
    "./src/**/*.{vue,ts,tsx}",
    "../vue-blueprint/src/**/*.{vue,ts,tsx}",
  ],
};
