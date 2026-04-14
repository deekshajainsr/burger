import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  IconButton, 
  Divider, 
  Avatar,
  Paper,
  CircularProgress,
  Grid2 as Grid
} from "@mui/material";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user) {
      navigate("/login");
      return;
    }
    
    setIsCheckingOut(true);
    try {
      await axios.post("/api/orders", {
        items: cart,
        totalPrice,
        userEmail: user.email,
        status: 'pending'
      });
      clearCart();
      navigate("/orders");
    } catch (error: any) {
      console.error("Checkout failed:", error);
      const message = error.response?.data?.error || "Something went wrong. Please try again.";
      alert(`Checkout failed:\n${message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 20, textAlign: 'center' }}>
        <Box sx={{ bgcolor: 'rgba(251, 191, 36, 0.1)', p: 4, borderRadius: '50%', width: 128, height: 128, mx: 'auto', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag size={64} style={{ color: '#F59E0B' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Your cart is empty</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>Looks like you haven't added any burgers yet. Let's fix that!</Typography>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          sx={{ 
            bgcolor: '#1F2937', 
            px: 6, 
            py: 2, 
            borderRadius: 4, 
            textTransform: 'none', 
            fontWeight: 700,
            '&:hover': { bgcolor: '#EF4444' }
          }}
        >
          Browse Menu
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 6 }}>Your Cart</Typography>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar src={item.image} variant="rounded" sx={{ width: 96, height: 96 }} />
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 700 }}>${item.price}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 3, p: 0.5 }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={16} />
                        </IconButton>
                        <Typography sx={{ px: 2, fontWeight: 700 }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={16} />
                        </IconButton>
                      </Box>

                      <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={20} />
                      </IconButton>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'sticky', top: 100 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Order Summary</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ color: 'text.secondary' }}>Subtotal</Typography>
              <Typography sx={{ fontWeight: 600 }}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography sx={{ color: 'text.secondary' }}>Delivery</Typography>
              <Typography sx={{ fontWeight: 600, color: '#10B981' }}>Free</Typography>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>${totalPrice.toFixed(2)}</Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              endIcon={isCheckingOut ? <CircularProgress size={20} color="inherit" /> : <ArrowRight />}
              sx={{ 
                bgcolor: '#1F2937', 
                py: 2, 
                borderRadius: 4, 
                textTransform: 'none', 
                fontWeight: 700,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#EF4444' }
              }}
            >
              {isCheckingOut ? "Processing..." : "Place Order"}
            </Button>
            
            {!user && (
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'error.main' }}>
                Please login to complete your order
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
