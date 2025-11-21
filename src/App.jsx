import React from 'react'
import { Container, Typography, Card, CardContent, Box } from '@mui/material'
import Home from './pages/Home'
import Videos from './pages/Videos'

export default function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        LMS Demo
      </Typography>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Card>
          <CardContent>
            <Home />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Videos />
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
