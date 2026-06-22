import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import CartDrawer from './components/CartDrawer/CartDrawer'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Cart from './pages/Cart/Cart'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Wishlist from './pages/Wishlist/Wishlist'
import Profile from './pages/Profile/Profile'
import Orders from './pages/Orders/Orders'
import OrderSuccess from './pages/OrderSuccess/OrderSuccess'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard/Dashboard'
import ProductsManagement from './pages/admin/ProductsManagement/ProductsManagement'
import OrdersManagement from './pages/admin/OrdersManagement/OrdersManagement'
import UsersManagement from './pages/admin/UsersManagement/UsersManagement'
import Transactions from './pages/admin/Transactions/Transactions'
import './App.css'

function AppContent() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/wishlist" element={
          <ProtectedRoute><Wishlist /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
