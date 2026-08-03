/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1830',
          900: '#0B1D33',
          800: '#122A47',
          700: '#1B3A5C',
          600: '#2F5D8A',
        },
        amber: {
          500: '#E8A33D',
          400: '#F0B759',
          300: '#F5CC85',
        },
        paper: '#F7F6F2',
        ink: '#1C2733',
        slate: {
          450: '#5B6B7C',
        },
        ok: '#1E8E5A',
        danger: '#C1443C',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'perf-dash': 'repeating-linear-gradient(to right, transparent 0 8px, #cfd6de 8px 16px)',
      },
      boxShadow: {
        ticket: '0 8px 24px -8px rgba(11,29,51,0.25)',
      },
      borderRadius: {
        stub: '18px',
      },
    },
  },
  plugins: [],
}
