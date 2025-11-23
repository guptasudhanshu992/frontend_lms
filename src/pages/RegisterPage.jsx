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
  Link,
  Alert,
  CircularProgress
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
import SEO from '../components/SEO'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await api.post('/api/auth/register', { email, password, consent })
      
      if (response.data && response.data.ok) {
        setSuccess(response.data.message || 'Registration successful! Check your email for verification.')
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err) {
      console.error('Registration error:', err)
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO 
        title="Create Account - Start Your Learning Journey"
        description="Join our learning management system to access 300+ professional development courses, earn certifications, and advance your career. Free registration with instant access to finance and business courses."
        keywords="register account, sign up LMS, create student account, enroll courses, free registration, online learning signup"
        url="https://lms-platform.com/register"
      />
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#f5f5f5',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 }
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
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
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
                {/* Error Alert */}
                {error && (
                  <Alert severity="error" onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert severity="success">
                    {success}
                  </Alert>
                )}

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
                  disabled={!consent || loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: loading ? 'none' : 'translateY(-2px)',
                      boxShadow: loading ? 2 : 4
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
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
    </>
  )
}
