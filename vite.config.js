import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base должен совпадать с именем репозитория на GitHub Pages:
// https://danielyaruta.github.io/Timer/  ->  base: '/Timer/'
// Если переименуешь репозиторий — поменяй и здесь.
export default defineConfig({
  plugins: [react()],
  base: '/Timer/',
});
