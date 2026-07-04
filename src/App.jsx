import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageBranches from './pages/ManageBranches';
import CreateBranch from './pages/CreateBranch';
import EditBranch from './pages/EditBranch';
import DispatchStock from './pages/DispatchStock';
import Profile from './pages/Profile';

import RecordDispatch from './pages/RecordDispatch';
import BranchDispatchToSales from './pages/branch/BranchDispatchToSales';
import SalesRepDashboard from './pages/sales/SalesRepDashboard';
import SalesRepReceivedStock from './pages/sales/SalesRepReceivedStock';
import SalesRepManageProducts from './pages/sales/SalesRepManageProducts';
import SalesRepDispatch from './pages/sales/SalesRepDispatch';
import SalesRepSalesHistory from './pages/sales/SalesRepSalesHistory';
import SalesRepInventoryLog from './pages/sales/SalesRepInventoryLog';
import ProductAllocation from './pages/ProductAllocation';
import ProductMovement from './pages/ProductMovement';
import DailyReport from './pages/DailyReport';
import MonthlyReport from './pages/MonthlyReport';
import YearlyReport from './pages/YearlyReport';
import ChangePassword from './pages/ChangePassword';
import AdminInventory from './pages/AdminInventory';
import AdminProducts from './pages/AdminProducts';
import AdminInventoryLogs from './pages/AdminInventoryLogs';
import ManageSales from './pages/ManageSales';
import CreateSales from './pages/CreateSales';
import ManageDistributors from './pages/ManageDistributors';
import CreateDistributor from './pages/CreateDistributor';
import LowStockAlert from './pages/LowStockAlert';
import DeepoBilling from './pages/DeepoBilling';
import DepotTransfer from './pages/DepotTransfer';
import AdminNewInvoice from './pages/AdminNewInvoice';

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
import BranchEditProduct from './pages/branch/BranchEditProduct';
import BranchViewProduct from './pages/branch/BranchViewProduct';
import BranchProductWiseSales from './pages/branch/BranchProductWiseSales';
import DispatchSummary from './pages/DispatchSummary';

// Distributor Panel Pages
import DistributorDashboard from './pages/distributor/DistributorDashboard';
import DistributorManageProducts from './pages/distributor/DistributorManageProducts';
import DistributorReceivedStock from './pages/distributor/DistributorReceivedStock';
import DistributorSalesHistory from './pages/distributor/DistributorSalesHistory';
import DistributorInventoryLog from './pages/distributor/DistributorInventoryLog';
import DistributorNewInvoice from './pages/distributor/DistributorNewInvoice';

// Returns
import InitiateReturn from './pages/returns/InitiateReturn';
import ReturnHistory from './pages/returns/ReturnHistory';
import IncomingReturns from './pages/returns/IncomingReturns';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-branch" element={<CreateBranch />} />
        <Route path="/edit-branch/:id" element={<EditBranch />} />
        <Route path="/manage-Branches" element={<ManageBranches />} />
        <Route path="/total-dispatch-stock" element={<DispatchStock />} />
        <Route path="/record-dispatch" element={<RecordDispatch />} />
        <Route path="/dispatch-summary/:id" element={<DispatchSummary />} />
        <Route path="/product-allocation" element={<ProductAllocation />} />
        <Route path="/product-movement" element={<ProductMovement />} />
        <Route path="/reports/daily" element={<DailyReport />} />
        <Route path="/reports/monthly" element={<MonthlyReport />} />
        <Route path="/reports/yearly" element={<YearlyReport />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/inventory-logs" element={<AdminInventoryLogs />} />
        <Route path="/admin/low-stock" element={<LowStockAlert />} />
        <Route path="/admin/transfer-stock" element={<DepotTransfer />} />
        
        {/* Billing Routes */}
        <Route path="/billing/gst" element={<DeepoBilling isGst={true} />} />
        <Route path="/billing/non-gst" element={<DeepoBilling isGst={false} />} />
        <Route path="/admin/billing/gst" element={<AdminNewInvoice isGst={true} />} />
        <Route path="/admin/billing/non-gst" element={<AdminNewInvoice isGst={false} />} />
        <Route path="/admin/all-sales" element={<BranchSalesHistory />} />
        
        {/* Sales & Distributors */}
        <Route path="/manage-sales" element={<ManageSales />} />
        <Route path="/create-sales" element={<CreateSales />} />
        <Route path="/manage-distributors" element={<ManageDistributors />} />
        <Route path="/create-distributor" element={<CreateDistributor />} />
        
        {/* Branch Routes */}
        <Route path="/branch/dashboard" element={<BranchDashboard />} />
        <Route path="/branch/manage-products" element={<BranchManageProducts />} />
        <Route path="/branch/add-product" element={<BranchAddProduct />} />
        <Route path="/branch/edit-product/:id" element={<BranchEditProduct />} />
        <Route path="/branch/view-product/:id" element={<BranchViewProduct />} />
        <Route path="/branch/low-stock" element={<BranchManageProducts />} />
        <Route path="/branch/received-stock" element={<BranchReceivedStock />} />
        <Route path="/branch/inventory-log" element={<BranchInventoryLog />} />
        <Route path="/branch/performance" element={<BranchPerformance />} />
        <Route path="/branch/product-sales" element={<BranchProductWiseSales />} />

        <Route path="/branch/reports" element={<BranchReports />} />
        <Route path="/branch/dispatch-to-sales-gst" element={<BranchDispatchToSales isGst={true} />} />
        <Route path="/branch/dispatch-to-sales" element={<BranchDispatchToSales isGst={false} />} />
        <Route path="/branch/dispatch-summary/:id" element={<DispatchSummary />} />
        
        {/* Sales Panel */}
        <Route path="/sales/dashboard" element={<SalesRepDashboard />} />
        <Route path="/sales/manage-products" element={<SalesRepManageProducts />} />
        <Route path="/sales/received-stock" element={<SalesRepReceivedStock />} />
        <Route path="/sales/dispatch-to-distributor-gst" element={<SalesRepDispatch isGst={true} />} />
        <Route path="/sales/dispatch-to-distributor" element={<SalesRepDispatch isGst={false} />} />
        <Route path="/sales/new-invoice" element={<BranchNewInvoice />} />
        <Route path="/sales/new-invoice-gst" element={<BranchNewInvoice />} />
        <Route path="/sales/history" element={<SalesRepSalesHistory />} />
        <Route path="/sales/reports" element={<BranchReports />} />
        <Route path="/sales/inventory-log" element={<SalesRepInventoryLog />} />
        <Route path="/sales/dispatch-summary/:id" element={<DispatchSummary />} />

        {/* Distributor Panel */}
        <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
        <Route path="/distributor/manage-products" element={<DistributorManageProducts />} />
        <Route path="/distributor/received-stock" element={<DistributorReceivedStock />} />
        <Route path="/distributor/new-invoice" element={<DistributorNewInvoice />} />
        <Route path="/distributor/new-invoice-gst" element={<DistributorNewInvoice />} />
        <Route path="/distributor/history" element={<DistributorSalesHistory />} />
        <Route path="/distributor/reports" element={<BranchReports />} />
        <Route path="/distributor/inventory-log" element={<DistributorInventoryLog />} />
        <Route path="/distributor/dispatch-summary/:id" element={<DispatchSummary />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Returns */}
        <Route path="/returns/initiate" element={<InitiateReturn />} />
        <Route path="/returns/history" element={<ReturnHistory />} />
        <Route path="/returns/incoming" element={<IncomingReturns />} />
        
        {/* Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
