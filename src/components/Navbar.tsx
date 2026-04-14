import { Link } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Box, 
  Container
} from "@mui/material";
import { 
  ShoppingCart, 
  Restaurant as UtensilsIcon, 
  Login 
} from "@mui/icons-material";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import UserInfo from "./UserInfo";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'brand-dark', boxShadow: 'none', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              textDecoration: 'none', 
              color: 'inherit' 
            }}
          >
            <Box 
              sx={{ 
                bgcolor: '#FBBF24', 
                p: 1, 
                borderRadius: 1, 
                display: 'flex',
                '&:hover': { transform: 'rotate(12deg)' },
                transition: 'transform 0.2s'
              }}
            >
              <UtensilsIcon sx={{ color: '#1F2937' }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Playfair Display", serif', 
                fontWeight: 700, 
                letterSpacing: '-0.02em' 
              }}
            >
              Burger <span style={{ color: '#EF4444' }}>Shop</span>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
            <Button 
              component={Link} 
              to="/" 
              sx={{ color: 'text.secondary', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
            >
              Menu
            </Button>
            
            <Button 
              component={Link} 
              to="/special-request" 
              sx={{ color: 'text.secondary', fontWeight: 600, display: { xs: 'none', md: 'block' } }}
            >
              Special Request
            </Button>
            
            <IconButton 
              component={Link} 
              to="/cart" 
              sx={{ color: 'text.primary' }}
            >
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <Box sx={{ height: 24, width: '1px', bgcolor: 'divider', mx: 1 }} />

            {user ? (
              <UserInfo />
            ) : (
              <Button 
                variant="contained" 
                startIcon={<Login />}
                component={Link}
                to="/login"
                sx={{ 
                  bgcolor: '#1F2937', 
                  borderRadius: 2, 
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#EF4444' } 
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
