import React, { useState } from 'react'
import { 
  Avatar, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  FormControlLabel, 
  Checkbox, 
  Divider,
  Container,
  Stack,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material'
import { 
  PersonAdd, 
  Email, 
  LockOutlined, 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import api from '../api'
import SocialButton from '../components/SocialButton'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [consent, setConsent] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/auth/register', { email, password, consent })
      alert('Registered successfully! Check your email for verification.')
      navigate('/login')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        py: 8
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'visible',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: 6
            }
          }}
        >
          <CardContent sx={{ p: 5 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mx: 'auto', 
                  mb: 2, 
                  bgcolor: 'primary.main',
                  boxShadow: 3
                }}
              >
                <PersonAdd sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join thousands of learners advancing their careers
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover': {
                        '& > fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }
                  }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="Must be at least 8 characters"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover': {
                        '& > fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={consent} 
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I agree to the{' '}
                      <Link href="/terms" target="_blank" underline="hover">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" target="_blank" underline="hover">
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!consent}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  Create Account
                </Button>
              </Stack>

              {/* Social Registration */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or register with
                </Typography>
              </Divider>

              <Stack spacing={2}>
                <SocialButton 
                  provider="google" 
                  label="Register with Google" 
                  href={`${import.meta.env.VITE_API_BASE || 'https://lmsbackend.fly.dev'}/api/auth/oauth/google`} 
                />
                <SocialButton 
                  provider="linkedin" 
                  label="Register with LinkedIn" 
                  href={`${import.meta.env.VITE_API_BASE || 'https://lmsbackend.fly.dev'}/api/auth/oauth/linkedin`} 
                />
              </Stack>

              {/* Sign In Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login"
                    sx={{ 
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
