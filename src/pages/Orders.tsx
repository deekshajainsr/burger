import { useEffect, useState } from "react";
import { Order } from "../types";
import axios from "axios";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  Grid, 
  Divider,
  CircularProgress,
  Paper
} from "@mui/material";
import { Clock, Package, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";

import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await axios.get("/api/orders/myorders");
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 20, gap: 2 }}>
        <CircularProgress sx={{ color: '#F59E0B' }} />
        <Typography sx={{ color: 'text.secondary' }}>Fetching your orders...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>Your Orders</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Track your burger deliveries and history</Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 10, borderRadius: 6, border: '1px dashed', borderColor: 'divider' }}>
          <Package size={48} style={{ color: '#D1D5DB', marginBottom: 16 }} />
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 1 }}>No orders yet</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>Your delicious burgers will appear here once you order.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/orders/${order.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Card sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', transition: 'all 0.3s', '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ bgcolor: 'white', p: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Clock size={20} style={{ color: '#F59E0B' }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Order ID: #{order.id.slice(-6).toUpperCase()}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={order.status || 'Pending'} 
                      size="small"
                      icon={order.status === 'delivered' ? <CheckCircle2 size={14} /> : <Package size={14} />}
                      sx={{ 
                        bgcolor: order.status === 'delivered' ? '#DCFCE7' : '#FEF3C7',
                        color: order.status === 'delivered' ? '#166534' : '#92400E',
                        fontWeight: 700,
                        textTransform: 'capitalize'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                      {order.items.map((item) => (
                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontWeight: 700, color: '#F59E0B' }}>{item.quantity}x</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                          </Box>
                          <Typography sx={{ color: 'text.secondary' }}>${(item.price * item.quantity).toFixed(2)}</Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Amount</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#EF4444' }}>${order.totalPrice.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}
    </Container>
  );
}
