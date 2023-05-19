/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				sidebar_color: "#1d2026",
				light_brown: "#2B2D34",
				light_white: "#8888",
				blue: "#0F80D7",
				green: "#26FF8E",
				light_brown2: "#2E323E",
			},
		},
	},
	plugins: [],
};
