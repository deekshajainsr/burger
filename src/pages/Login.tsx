import React, { useState } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(userId, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 8, 
            border: '1px solid', 
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Welcome Back</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Log in to your account to continue ordering
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            {error && (
              <Typography variant="body2" sx={{ color: 'error.main', mb: 2, fontWeight: 600 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <TextField
                fullWidth
                label="User ID (Email or Username)"
                type="text"
                placeholder="you@example.com or username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} style={{ color: '#9CA3AF' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} style={{ color: '#9CA3AF' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                required
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={18} />}
              sx={{ 
                py: 1.5, 
                borderRadius: 3, 
                textTransform: 'none', 
                fontWeight: 700,
                bgcolor: '#1F2937',
                '&:hover': { bgcolor: '#EF4444' }
              }}
            >
              Log In
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
}
