import axios from 'axios'

// Default to the Fly app domain. You can override this by creating `frontend/.env`
// with `VITE_API_BASE=https://lmsbackend.fly.dev/` or by setting the variable
// in Cloudflare Pages environment variables when deploying the frontend.
const DEFAULT_BASE = 'https://lmsbackend.fly.dev/'
const BASE = (import.meta.env.VITE_API_BASE || DEFAULT_BASE).replace(/\/+$/,'')

export const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
})

export default api
