import React, { useEffect, useState } from 'react'
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material'
import { listVideos } from '../api/stream'

export default function Videos() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    listVideos().then((r) => setVideos(r.videos || [])).catch(() => setVideos([]))
  }, [])

  return (
    <Box>
      <Typography variant="h6">Cloudflare Stream Videos</Typography>
      <List>
        {videos.map((v) => (
          <ListItem key={v.uid}>
            <ListItemText primary={v.uid} secondary={JSON.stringify(v.meta || {})} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
