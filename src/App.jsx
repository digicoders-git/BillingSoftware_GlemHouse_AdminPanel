import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageBranches from './pages/ManageBranches';
import CreateBranch from './pages/CreateBranch';
import DispatchStock from './pages/DispatchStock';
import Profile from './pages/Profile';

import RecordDispatch from './pages/RecordDispatch';
import DispatchSummary from './pages/DispatchSummary';
import ProductAllocation from './pages/ProductAllocation';
import ProductMovement from './pages/ProductMovement';
import DailyReport from './pages/DailyReport';
import MonthlyReport from './pages/MonthlyReport';
import YearlyReport from './pages/YearlyReport';
import ChangePassword from './pages/ChangePassword';

// Branch Panel Pages
import BranchDashboard from './pages/branch/BranchDashboard';
import BranchManageProducts from './pages/branch/BranchManageProducts';
import BranchNewInvoice from './pages/branch/BranchNewInvoice';
import BranchReceivedStock from './pages/branch/BranchReceivedStock';
import BranchInventoryLog from './pages/branch/BranchInventoryLog';
import BranchSalesHistory from './pages/branch/BranchSalesHistory';
import BranchPerformance from './pages/branch/BranchPerformance';
import BranchReports from './pages/branch/BranchReports';
import BranchAddProduct from './pages/branch/BranchAddProduct';
import BranchProductWiseSales from './pages/branch/BranchProductWiseSales';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-branch" element={<CreateBranch />} />
        <Route path="/manage-branches" element={<ManageBranches />} />
        <Route path="/total-dispatch-stock" element={<DispatchStock />} />
        <Route path="/record-dispatch" element={<RecordDispatch />} />
        <Route path="/dispatch-summary" element={<DispatchSummary />} />
        <Route path="/product-allocation" element={<ProductAllocation />} />
        <Route path="/product-movement" element={<ProductMovement />} />
        <Route path="/reports/daily" element={<DailyReport />} />
        <Route path="/reports/monthly" element={<MonthlyReport />} />
        <Route path="/reports/yearly" element={<YearlyReport />} />
        
        {/* Branch Routes */}
        <Route path="/branch/dashboard" element={<BranchDashboard />} />
        <Route path="/branch/manage-products" element={<BranchManageProducts />} />
        <Route path="/branch/add-product" element={<BranchAddProduct />} />
        <Route path="/branch/low-stock" element={<BranchManageProducts />} />
        <Route path="/branch/received-stock" element={<BranchReceivedStock />} />
        <Route path="/branch/inventory-log" element={<BranchInventoryLog />} />
        <Route path="/branch/new-invoice" element={<BranchNewInvoice />} />
        <Route path="/branch/sales-history" element={<BranchSalesHistory />} />
        <Route path="/branch/performance" element={<BranchPerformance />} />
        <Route path="/branch/product-sales" element={<BranchProductWiseSales />} />

        <Route path="/branch/reports" element={<BranchReports />} />
        
        {/* Profile & Settings */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
