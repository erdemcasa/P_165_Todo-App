import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173', // your frontend
    env: {
      BACKEND_URL: 'http://localhost:3000', // your API
      USER_EMAIL: "john@example.com",
      USER_PASSWORD: "GRY0xa7jRRPfLy9XxC3v",
    },
  },
});

