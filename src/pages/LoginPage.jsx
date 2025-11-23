import React, { useState, useContext } from 'react'
import { 
  Avatar, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Divider, 
  Link, 
  Container,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material'
import { 
  LockOutlined, 
  Email, 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import SocialButton from '../components/SocialButton'
import SEO from '../components/SEO'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO 
        title="Sign In - Access Your Learning Dashboard"
        description="Sign in to your learning management system account to access courses, track progress, and continue your professional development journey."
        keywords="LMS login, student portal, course access, online learning login"
        url="https://lms-platform.com/login"
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
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Avatar 
                sx={{ 
                  width: { xs: 56, sm: 64 }, 
                  height: { xs: 56, sm: 64 }, 
                  mx: 'auto', 
                  mb: 2, 
                  bgcolor: 'primary.main',
                  boxShadow: 3
                }}
              >
                <LockOutlined sx={{ fontSize: { xs: 28, sm: 32 } }} />
              </Avatar>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                gutterBottom
                sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
              >
                Sign in to continue your learning journey
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={{ xs: 2.5, sm: 3 }}>
                {/* Error Alert */}
                {error && (
                  <Alert severity="error" onClose={() => setError('')}>
                    {error}
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link 
                    component={RouterLink} 
                    to="/forgot-password" 
                    variant="body2"
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: { xs: 1.5, sm: 1.75 },
                    minHeight: 48,
                    fontSize: { xs: '0.95rem', sm: '1rem' },
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
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Stack>

              {/* Social Login */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or continue with
                </Typography>
              </Divider>

              <Stack spacing={2}>
                <SocialButton 
                  provider="google" 
                  label="Sign in with Google" 
                  href={`${import.meta.env.VITE_API_BASE || 'https://lmsbackend.fly.dev'}/api/auth/oauth/google`} 
                />
                <SocialButton 
                  provider="linkedin" 
                  label="Sign in with LinkedIn" 
                  href={`${import.meta.env.VITE_API_BASE || 'https://lmsbackend.fly.dev'}/api/auth/oauth/linkedin`} 
                />
              </Stack>

              {/* Sign Up Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register"
                    sx={{ 
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign up
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
