import { createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layouts/PublicLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';
import PrivateRoute from '../components/PrivateRoute';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard';
import Users from '../pages/users/Users';
import Profile from '../pages/users/Profile';
import Settings from '../pages/settings/Settings';
import Inventory from '../pages/inventory/Inventory';
import Products from '../pages/products/Products';
import Orders from '../pages/orders/Orders';
import Customers from '../pages/customers/Customers';
import Notifications from '../pages/notifications/Notifications';
import Help from '../pages/help/Help';

export const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
    </Route>

    <Route path="/dashboard" element={<PrivateRoute />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
  </>
); 