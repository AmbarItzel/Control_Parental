/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx,html}",
    ],
    theme: {
        extend: {
            colors: {
                mikrotik: {
                    blue: '#1e40af',
                    green: '#059669',
                    red: '#dc2626'
                }
            }
        },
    },
    plugins: [],
}