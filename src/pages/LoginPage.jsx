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
  IconButton
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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      alert('Login failed')
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
                <LockOutlined sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue your learning journey
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
                  Sign In
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
  )
}
