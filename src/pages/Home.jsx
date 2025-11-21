import React, { useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material'
import { getHello } from '../api/hello'
import UploadCard from '../components/UploadCard'

export default function Home() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getHello().then((r) => setMsg(r.message)).catch(() => setMsg('Error'))
  }, [])

  return (
    <Box>
      <Typography variant="h6">Hello API</Typography>
      <Typography>{msg}</Typography>
      <UploadCard />
    </Box>
  )
}
