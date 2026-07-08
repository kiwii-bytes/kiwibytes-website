import { defineConfig } from 'vite';

// Served at https://<user>.github.io/kiwibytes-website/, so asset paths
// need this base prefix rather than the default root '/'.
export default defineConfig({
  base: '/kiwibytes-website/',
});
