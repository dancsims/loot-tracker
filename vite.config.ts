import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

// Vitest configuration (if using Vitest)
export const test = {
  environment: 'jsdom',
  setupFiles: ['./tests/setup.ts'],
  globals: true,
}
