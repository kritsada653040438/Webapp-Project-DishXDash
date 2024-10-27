/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'min-733': '733px', // กำหนด breakpoint สำหรับหน้าจอ 650px ขึ้นไป
        'max-834': { 'max': '834px' }, // 3 คอลัมน์สำหรับ 833px ลงมา (เฉพาะ Dash List)
        'max-640': { 'max': '640px' }, // 2 คอลัมน์สำหรับ 640px ลงมา (เฉพาะ Dash List)
        'max-431': { 'max': '431px' }, // 1 คอลัมน์สำหรับ 430px ลงมา (Add Food, Dash List และปุ่ม)
      },
    },
  },
  variants: {},
  plugins: [],
};
