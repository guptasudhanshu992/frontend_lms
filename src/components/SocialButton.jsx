import React from 'react'
import { Button } from '@mui/material'

const ICONS = {
  google: (
    <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.3H272v95.1h146.9c-6.3 34.2-25 63.2-53.4 82.6v68.5h86.2c50.4-46.4 81.8-115 81.8-196z"/>
      <path fill="#34A853" d="M272 544.3c72.2 0 132.8-23.9 177.1-65.1l-86.2-68.5c-24 16.1-54.8 25.6-90.9 25.6-69.8 0-129-47.1-150.1-110.2H34.4v69.3C78.2 486.1 168.5 544.3 272 544.3z"/>
      <path fill="#FBBC05" d="M121.9 327.9c-10.6-31.8-10.6-66 0-97.8V160.8H34.4c-39.6 78.7-39.6 171.5 0 250.2l87.5-69.1z"/>
      <path fill="#EA4335" d="M272 107.1c39.2-.6 76.8 14.1 105.5 40.6l79.1-79.1C408.9 24.6 343.9 0 272 0 168.5 0 78.2 58.2 34.4 160.8l87.5 69.3C143 154.2 202.2 107.1 272 107.1z"/>
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5z" fill="#0A66C2"/>
      <path d="M0 8h5v16H0z" fill="#0A66C2"/>
      <path d="M7 8h4.8v2.2h.1c.7-1.3 2.3-2.6 4.8-2.6C22 7.6 24 10.1 24 14.4V24h-5v-8.5c0-2-1-3.4-3.1-3.4-1.7 0-2.6 1.1-3 2.2-.2.4-.2 1-.2 1.6V24H7V8z" fill="#0A66C2"/>
    </svg>
  )
}

export default function SocialButton({ provider = 'google', label, href }){
  const click = (e) => {
    e.preventDefault()
    window.location.href = href
  }

  return (
    <Button
      variant="outlined"
      startIcon={ICONS[provider]}
      onClick={click}
      fullWidth
      sx={{ textTransform: 'none', mb: 1 }}
    >
      {label}
    </Button>
  )
}
