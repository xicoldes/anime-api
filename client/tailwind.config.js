/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NEW "AnimeWiki" THEME: Deep Slate & Electric Blue
        'hianime-dark': '#0f172a',    // Rich Slate 900 (Background)
        'hianime-sidebar': '#1e293b', // Slate 800 (Cards/Sidebar)
        'hianime-accent': '#38bdf8',  // Sky Blue 400 (The new "Wiki" accent)
        'hianime-text': '#94a3b8',    // Slate 400 (Muted text)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Clean, professional font
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}