import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Paper,
  Avatar,
  Tabs,
  Tab,
  Chip,
  Divider,
  Grid2 as Grid
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Plus, Edit2, Trash2, Database, Save, X, CheckCircle2, MessageSquare, Package } from "lucide-react";
import { Burger, Order } from "../types";

export default function Admin() {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState<Burger[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Product Dialog State
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Burger> | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  // Order Dialog State
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminMessage, setAdminMessage] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

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
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders/all");
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  };

  const productColumns: GridColDef[] = [
    { 
      field: 'product', 
      headerName: 'Product', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
          <Avatar src={params.row.image} variant="rounded" sx={{ width: 40, height: 40 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{params.row.name}</Typography>
        </Box>
      )
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 700, mt: 1.5 }}>
          ${params.row.price}
        </Typography>
      )
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1.5, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.row.description}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <IconButton size="small" onClick={() => handleOpenProductDialog(params.row)} sx={{ color: 'primary.main' }}>
            <Edit2 size={18} />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteProduct(params.row.id)} sx={{ color: 'error.main' }}>
            <Trash2 size={18} />
          </IconButton>
        </Box>
      )
    }
  ];

  const orderColumns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'Order ID', 
      width: 150,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontWeight: 700, mt: 2 }}>
          #{params.row.id.substring(0, 8).toUpperCase()}
        </Typography>
      )
    },
    { 
      field: 'userEmail', 
      headerName: 'Customer', 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ mt: 1.5 }}>{params.row.userEmail}</Typography>
      )
    },
    { 
      field: 'totalPrice', 
      headerName: 'Amount', 
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, mt: 1.5 }}>${params.row.totalPrice.toFixed(2)}</Typography>
      )
    },
    { 
      field: 'items', 
      headerName: 'Items', 
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ mt: 1.5, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.row.items.map((item: any) => `${item.quantity}x ${item.name}`).join(', ')}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.row.status} 
          size="small"
          sx={{ 
            mt: 1.5,
            fontWeight: 700,
            textTransform: 'capitalize',
            bgcolor: params.row.status === 'ready' ? '#DCFCE7' : '#FEF3C7',
            color: params.row.status === 'ready' ? '#166534' : '#92400E'
          }} 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<CheckCircle2 size={14} />}
            onClick={() => handleOpenOrderDialog(params.row)}
            disabled={params.row.status === 'ready'}
            sx={{ 
              textTransform: 'none', 
              borderRadius: 2, 
              bgcolor: '#10B981',
              '&:hover': { bgcolor: '#059669' }
            }}
          >
            Ready
          </Button>
        </Box>
      )
    }
  ];

  const handleOpenProductDialog = (product?: Burger) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        description: product.description,
      });
    } else {
      setEditingProduct(null);
      setProductFormData({ name: "", price: "", image: "", description: "" });
    }
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      const data = {
        ...productFormData,
        price: parseFloat(productFormData.price),
      };

      if (editingProduct?.id) {
        await axios.put(`/api/products/${editingProduct.id}`, data);
      } else {
        await axios.post("/api/products", data);
      }
      
      fetchProducts();
      setIsProductDialogOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleSeed = async () => {
    try {
      await axios.post("/api/seed");
      fetchProducts();
    } catch (error) {
      console.error("Failed to seed data:", error);
    }
  };

  const handleOpenOrderDialog = (order: Order) => {
    setSelectedOrder(order);
    setAdminMessage("Your order is ready for pickup! Enjoy your burger.");
    setIsOrderDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    try {
      await axios.put(`/api/orders/${selectedOrder.id}`, {
        status: 'ready',
        adminMessage: adminMessage
      });
      fetchOrders();
      setIsOrderDialogOpen(false);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>Admin Dashboard</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Manage your burger menu and customer orders</Typography>
        </Box>
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Database size={20} />}
              onClick={handleSeed}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
            >
              Seed Data
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => handleOpenProductDialog()}
              sx={{ bgcolor: '#1F2937', borderRadius: 3, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#EF4444' } }}
            >
              Add Product
            </Button>
          </Box>
        )}
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={(_, v) => setActiveTab(v)} 
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<Package size={18} />} iconPosition="start" label="Products" sx={{ textTransform: 'none', fontWeight: 600 }} />
        <Tab icon={<MessageSquare size={18} />} iconPosition="start" label="Orders" sx={{ textTransform: 'none', fontWeight: 600 }} />
      </Tabs>

      {activeTab === 0 ? (
        <Paper sx={{ height: 600, width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
          <DataGrid
            rows={products}
            columns={productColumns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'rgba(0,0,0,0.02)',
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'rgba(0,0,0,0.05)',
              },
            }}
          />
        </Paper>
      ) : (
        <Paper sx={{ height: 600, width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
          <DataGrid
            rows={orders}
            columns={orderColumns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'rgba(0,0,0,0.02)',
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'rgba(0,0,0,0.05)',
              },
            }}
          />
        </Paper>
      )}

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onClose={() => setIsProductDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Product Name"
                value={productFormData.name}
                onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={productFormData.price}
                onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Image URL"
                value={productFormData.image}
                onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={productFormData.description}
                onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsProductDialogOpen(false)} startIcon={<X size={18} />} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveProduct} variant="contained" startIcon={<Save size={18} />} sx={{ bgcolor: '#EF4444', borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#DC2626' } }}>
            Save Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Update Dialog */}
      <Dialog open={isOrderDialogOpen} onClose={() => setIsOrderDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Order Details & Notification</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Items Ordered:</Typography>
            {selectedOrder?.items.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  <span style={{ fontWeight: 700, color: '#EF4444' }}>{item.quantity}x</span> {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total Amount:</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#EF4444' }}>
                ${selectedOrder?.totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
            Send message to customer:
          </Typography>
          <TextField
            fullWidth
            label="Message to Customer"
            multiline
            rows={3}
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            variant="outlined"
            placeholder="e.g. Your order is ready for pickup!"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsOrderDialogOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateOrder} 
            variant="contained" 
            startIcon={<CheckCircle2 size={18} />} 
            sx={{ bgcolor: '#10B981', borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#059669' } }}
          >
            Mark Ready & Notify
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
