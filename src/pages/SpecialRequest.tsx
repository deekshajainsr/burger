import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid2 as Grid
} from "@mui/material";
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  FileUp, 
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

export default function SpecialRequest() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+1",
    requestType: "catering",
    details: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real MERN app, this would call /api/requests
      // but we'll just simulate it for now
      console.log("Submitting request:", formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ py: 20, textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Box sx={{ bgcolor: '#DCFCE7', p: 4, borderRadius: '50%', width: 128, height: 128, mx: 'auto', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={64} style={{ color: '#166534' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Request Received!</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
            Thank you for reaching out. Our team will review your special request and get back to you within 24 hours.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setSubmitted(false)}
            sx={{ bgcolor: '#1F2937', px: 6, py: 2, borderRadius: 4, fontWeight: 700 }}
          >
            Send Another Request
          </Button>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 12 }}>
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
          Special <span style={{ color: '#EF4444' }}>Requests</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Planning a party? Need custom catering? Or just have a specific dietary requirement? 
          Fill out the form below and we'll make it happen.
        </Typography>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          borderRadius: 8, 
          border: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'white'
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} style={{ color: '#9CA3AF' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              />
            </Grid>
            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Code</InputLabel>
                  <Select
                    value={formData.countryCode}
                    label="Code"
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="+1">+1 (US)</MenuItem>
                    <MenuItem value="+44">+44 (UK)</MenuItem>
                    <MenuItem value="+91">+91 (IN)</MenuItem>
                    <MenuItem value="+61">+61 (AU)</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone size={18} style={{ color: '#9CA3AF' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Box>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                <InputLabel>Request Type</InputLabel>
                <Select
                  value={formData.requestType}
                  label="Request Type"
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                >
                  <MenuItem value="catering">Event Catering</MenuItem>
                  <MenuItem value="dietary">Dietary Requirements</MenuItem>
                  <MenuItem value="bulk">Bulk Order</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Request Details"
                multiline
                rows={4}
                required
                placeholder="Tell us more about your request..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <MessageSquare size={18} style={{ color: '#9CA3AF' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Grid>
            <Grid size={12}>
              <Box 
                sx={{ 
                  p: 3, 
                  border: '2px dashed', 
                  borderColor: 'divider', 
                  borderRadius: 4, 
                  textAlign: 'center',
                  bgcolor: 'rgba(0,0,0,0.01)',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)', borderColor: 'brand-yellow' }
                }}
              >
                <FileUp size={32} style={{ color: '#9CA3AF', marginBottom: 8 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Upload supporting documents</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>PDF, JPG, or PNG (Max 5MB)</Typography>
                <input type="file" hidden />
              </Box>
            </Grid>
            <Grid size={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                startIcon={<Send size={18} />}
                sx={{ 
                  py: 2, 
                  borderRadius: 4, 
                  textTransform: 'none', 
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  bgcolor: '#1F2937',
                  '&:hover': { bgcolor: '#EF4444' }
                }}
              >
                Submit Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
