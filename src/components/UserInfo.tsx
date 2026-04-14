import React, { useEffect } from "react";
import { 
  Box, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Divider
} from "@mui/material";
import { 
  LogOut, 
  History, 
  Settings, 
  User,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";

export default function UserInfo() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  useEffect(() => {
    // Sync logic removed as we are using pure MERN now
  }, [user]);

  if (!user) return null;

  return (
    <Box className="userInfo" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box 
        onClick={handleClick}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          cursor: 'pointer',
          p: 0.5,
          pr: 1.5,
          borderRadius: 8,
          transition: 'all 0.2s',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
        }}
      >
        <Avatar 
          sx={{ 
            width: 36, 
            height: 36, 
            border: '2px solid', 
            borderColor: '#FBBF24',
            bgcolor: '#EF4444',
            color: 'white',
            fontWeight: 700
          }}
        >
          {user.name?.charAt(0) || user.email?.charAt(0)}
        </Avatar>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1 }}>
            {user.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>
            {user.email}
          </Typography>
        </Box>
        <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              borderRadius: 3,
              minWidth: 200,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate("/orders")}>
          <ListItemIcon>
            <History size={18} />
          </ListItemIcon>
          My Orders
        </MenuItem>
        
        {isAdmin && (
          <MenuItem onClick={() => navigate("/admin")}>
            <ListItemIcon>
              <Settings size={18} />
            </ListItemIcon>
            Admin Panel
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogOut size={18} style={{ color: '#EF4444' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
