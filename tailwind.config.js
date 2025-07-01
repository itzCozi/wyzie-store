module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        type: {
          primary: "#484848",
          emphasized: "#303030",
          dimmed: "#5c5c5c",
          dark: "#0a0a0a",
        },
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1545b9",
        },
        border: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
        },
        success: {
          400: "#34d399",
          500: "#10b981",
        },
        error: {
          500: "#ef4444",
        },
      },
    },
  },
};
