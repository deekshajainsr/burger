import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Button,
  CircularProgress,
  Chip,
  Grid2 as Grid
} from "@mui/material";
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle2, 
  MapPin,
  CreditCard,
  MessageSquare
} from "lucide-react";
import { Order } from "../types";
import { motion } from "motion/react";

export default function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In this app, we fetch all orders and find the one we need
        // but in a real MERN app, you'd have GET /api/orders/:id
        const response = await axios.get("/api/orders");
        const foundOrder = response.data.find((o: Order) => o.id === id);
        setOrder(foundOrder || null);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 20, gap: 2 }}>
        <CircularProgress sx={{ color: '#F59E0B' }} />
        <Typography sx={{ color: 'text.secondary' }}>Loading order details...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Order Not Found</Typography>
        <Button onClick={() => navigate("/orders")} startIcon={<ArrowLeft />}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Button 
        onClick={() => navigate("/orders")} 
        startIcon={<ArrowLeft size={18} />}
        sx={{ mb: 4, color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
      >
        Back to Orders
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
              Order Details
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Order ID: <span style={{ fontWeight: 700, color: '#1F2937' }}>#{order.id.toUpperCase()}</span>
            </Typography>
          </Box>
          <Chip 
            label={order.status || 'Pending'} 
            icon={order.status === 'ready' ? <CheckCircle2 size={16} /> : <Package size={16} />}
            sx={{ 
              bgcolor: order.status === 'ready' ? '#DCFCE7' : '#FEF3C7',
              color: order.status === 'ready' ? '#166534' : '#92400E',
              fontWeight: 700,
              px: 1,
              py: 2.5,
              borderRadius: 3
            }} 
          />
        </Box>

        {order.adminMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 4, 
                bgcolor: '#EFF6FF', 
                border: '1px solid', 
                borderColor: '#BFDBFE',
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start'
              }}
            >
              <MessageSquare size={24} style={{ color: '#2563EB', marginTop: 4 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E40AF', mb: 0.5 }}>
                  Message from Chef
                </Typography>
                <Typography variant="body2" sx={{ color: '#1E3A8A', lineHeight: 1.6 }}>
                  "{order.adminMessage}"
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper className="orderDetailsBox" sx={{ p: 4, borderRadius: 6, border: '1px solid', borderColor: 'divider', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Items Ordered</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {order.items.map((item) => (
                  <Box key={item.id} className="orderDetailsRow" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src={item.image} 
                        sx={{ width: 64, height: 64, borderRadius: 3, objectFit: 'cover' }} 
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Quantity: <strong>{item.quantity}</strong>
                        </Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: 'text.secondary' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 600 }}>${order.totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ color: 'text.secondary' }}>Delivery Fee</Typography>
                <Typography sx={{ fontWeight: 600, color: '#10B981' }}>Free</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Total</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>${order.totalPrice.toFixed(2)}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Clock size={20} style={{ color: '#F59E0B' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Order Timeline</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Placed on</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MapPin size={20} style={{ color: '#EF4444' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Delivery Address</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  123 Burger Lane, Foodie City, FC 45678
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <CreditCard size={20} style={{ color: '#10B981' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Payment Method</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Visa ending in **** 4242
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
}
