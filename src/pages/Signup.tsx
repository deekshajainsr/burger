import React, { useState } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  CircularProgress
} from "@mui/material";
import { 
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.username, formData.password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create account. Please try again.");
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
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Create Account</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Join the Burger Shop family today
            </Typography>
          </Box>

          <form onSubmit={handleSignup}>
            {error && (
              <Typography variant="body2" sx={{ color: 'error.main', mb: 2, fontWeight: 600 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                required
              />
              <TextField
                fullWidth
                label="Username (User ID)"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              Create Account
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'none' }}>
              Log In
            </Link>
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
}
