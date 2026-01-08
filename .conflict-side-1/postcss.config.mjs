import tailwindPostCSS from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindPostCSS(), autoprefixer()],
};
