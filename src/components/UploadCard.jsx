import React, { useState } from 'react'
import { Button, Typography, Box } from '@mui/material'
import { uploadFile } from '../api/r2'

export default function UploadCard() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(null)

  const onSelect = (e) => setFile(e.target.files[0])

  const onUpload = async () => {
    if (!file) return
    setStatus('Uploading...')
    try {
      const res = await uploadFile(file)
      setStatus(`Uploaded: ${res.url}`)
    } catch (err) {
      setStatus('Upload error')
    }
  }

  return (
    <Box>
      <Typography variant="h6">Upload file to R2</Typography>
      <input type="file" onChange={onSelect} />
      <Box sx={{ mt: 1 }}>
        <Button variant="contained" onClick={onUpload}>Upload</Button>
      </Box>
      {status && <Typography sx={{ mt: 1 }}>{status}</Typography>}
    </Box>
  )
}
