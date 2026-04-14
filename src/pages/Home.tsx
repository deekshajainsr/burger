import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Box, 
  CircularProgress,
  IconButton,
  Chip,
  Grid2 as Grid
} from "@mui/material";
import { Plus, Info } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../CartContext";
import { Burger } from "../types";

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          py: { xs: 10, md: 15 }, 
          px: 2, 
          overflow: 'hidden',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '3.5rem', md: '6rem' }, 
                fontWeight: 700, 
                mb: 2, 
                letterSpacing: '-0.04em',
                lineHeight: 1
              }}
            >
              The Ultimate <br />
              <Typography 
                component="span" 
                variant="inherit" 
                sx={{ color: '#EF4444', fontStyle: 'italic' }}
              >
                Burger Experience
              </Typography>
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Typography 
              variant="h6" 
              sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', mb: 5, fontWeight: 400 }}
            >
              Crafted with passion, served with love. Discover our menu of gourmet burgers made with
              the freshest ingredients.
            </Typography>
          </motion.div>
        </Container>
        
        {/* Decorative elements */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.1, pointerEvents: 'none' }}>
          <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: 256, height: 256, bgcolor: '#FBBF24', borderRadius: '50%', filter: 'blur(64px)' }} />
          <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 384, height: 384, bgcolor: '#EF4444', borderRadius: '50%', filter: 'blur(64px)' }} />
        </Box>
      </Box>

      {/* Menu Grid */}
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>Our Menu</Typography>
          <Box sx={{ height: 4, flexGrow: 1, mx: 4, bgcolor: 'rgba(251, 191, 36, 0.2)', borderRadius: 2 }} />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress sx={{ color: '#F59E0B' }} />
            <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Preparing the menu...</Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 10, border: '1px solid rgba(251, 191, 36, 0.1)' }}>
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 1 }}>The menu is currently empty.</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>Check back later or visit the admin panel to add products.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {products.map((burger, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={burger.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      borderRadius: 6, 
                      overflow: 'hidden', 
                      border: '1px solid rgba(251, 191, 36, 0.1)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(251, 191, 36, 0.1)',
                        borderColor: 'rgba(251, 191, 36, 0.4)'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 256, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={burger.image}
                        alt={burger.name}
                        sx={{ height: '100%', objectFit: 'cover', transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.1)' } }}
                      />
                      <Chip 
                        label={`$${burger.price}`} 
                        sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          right: 16, 
                          bgcolor: 'rgba(255, 255, 255, 0.9)', 
                          backdropFilter: 'blur(4px)',
                          fontWeight: 700,
                          color: '#EF4444'
                        }} 
                      />
                    </Box>
                    
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{burger.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, height: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {burger.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <Info size={20} />
                        </IconButton>
                        <Button
                          variant="contained"
                          startIcon={<Plus size={20} />}
                          onClick={() => addToCart(burger)}
                          sx={{ 
                            bgcolor: '#FBBF24', 
                            color: '#1F2937', 
                            fontWeight: 700, 
                            px: 3, 
                            py: 1.5, 
                            borderRadius: 4,
                            textTransform: 'none',
                            boxShadow: '0 8px 16px rgba(251, 191, 36, 0.2)',
                            '&:hover': { bgcolor: '#F59E0B' }
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
