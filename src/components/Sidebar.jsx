import { useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building as Store, 
  Search as PackageSearch, 
  Key, 
  User as UserCircle, 
  LogOut,
  ChevronRight,
  TrendingUp,
  FileText,
  ChevronsLeft,
  ChevronsRight,
  Package,
  Receipt,
  Users,
  Truck,
  ArrowRightLeft,
  ArrowUpRight,
  Download,
  Briefcase
} from 'lucide-react';
import { 
  Box, 
  VStack, 
  Text, 
  Icon, 
  Flex, 
  Collapse, 
  useDisclosure, 
  Image, 
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';

const SidebarItem = ({ icon, label, to, children, isCollapsed, onClick }) => {
  const location = useLocation();
  const hasChildren = children && children.length > 0;
  const isChildActive = hasChildren ? children.some(c => location.pathname === c.to) : false;
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: isChildActive });
  
  const activeColor = '#298AC6';
  const activeBg = '#E9F3F9';
  const inactiveColor = '#637381';

  if (hasChildren) {
    return (
      <Box w="full" px="3">
        <Flex
          align="center"
          px="3"
          py="2.5"
          cursor="pointer"
          onClick={onToggle}
          borderRadius="lg"
          bg={isChildActive ? activeBg : 'transparent'}
          color={isChildActive ? activeColor : inactiveColor}
          _hover={{ color: activeColor }}
          justify={isCollapsed ? 'center' : 'flex-start'}
          mb="1"
          transition="all 0.2s"
        >
          <Icon as={icon} fontSize="20" />
          {!isCollapsed && (
            <>
              <Text ml="3" fontWeight="500" flex="1" fontSize="15px">{label}</Text>
              <Box 
                bg={isChildActive ? 'transparent' : 'gray.100'} 
                borderRadius="full" 
                w="20px" 
                h="20px" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <Icon 
                  as={ChevronRight} 
                  fontSize="14px"
                  transition="transform 0.2s" 
                  transform={isOpen ? 'rotate(90deg)' : ''} 
                  color={isChildActive ? activeColor : 'gray.500'}
                />
              </Box>
            </>
          )}
        </Flex>
        {!isCollapsed && (
          <Collapse in={isOpen}>
            <VStack align="stretch" pl="8" mt="1" mb="2" spacing="1">
              {children.map((child, index) => {
                const isActive = location.pathname === child.to;
                return (
                  <NavLink
                    key={index}
                    to={child.to}
                    style={{ textDecoration: 'none' }}
                  >
                    <Flex
                      align="center"
                      py="2"
                      px="2"
                      color={isActive ? activeColor : inactiveColor}
                      _hover={{ color: activeColor }}
                      transition="all 0.2s"
                    >
                      <Box mr="3" display="flex" alignItems="center" justifyContent="center" w="10px">
                        {isActive ? (
                          <Box w="8px" h="8px" borderRadius="full" border="2px solid #298AC6" bg="#298AC6" />
                        ) : (
                          <Box w="6px" h="6px" borderRadius="full" bg="#A0AAB4" />
                        )}
                      </Box>
                      <Text fontSize="14px" fontWeight={isActive ? "500" : "400"}>{child.label}</Text>
                    </Flex>
                  </NavLink>
                );
              })}
            </VStack>
          </Collapse>
        )}
      </Box>
    );
  }

  const isItemActive = location.pathname === to;

  if (onClick) {
    return (
      <Box px="3" mb="1">
        <Flex
          align="center"
          px="3"
          py="2.5"
          borderRadius="lg"
          cursor="pointer"
          bg="transparent"
          color={inactiveColor}
          _hover={{ color: activeColor, bg: activeBg }}
          justify={isCollapsed ? 'center' : 'flex-start'}
          transition="all 0.2s"
          onClick={onClick}
        >
          <Icon as={icon} fontSize="20" />
          {!isCollapsed && <Text ml="3" fontWeight="500" fontSize="15px">{label}</Text>}
        </Flex>
      </Box>
    );
  }

  return (
    <Box px="3" mb="1">
      <NavLink
        to={to}
        style={{ textDecoration: 'none' }}
      >
        <Flex
          align="center"
          px="3"
          py="2.5"
          borderRadius="lg"
          bg={isItemActive ? activeBg : 'transparent'}
          color={isItemActive ? activeColor : inactiveColor}
          _hover={{ color: activeColor }}
          justify={isCollapsed ? 'center' : 'flex-start'}
          transition="all 0.2s"
        >
          <Icon as={icon} fontSize="20" />
          {!isCollapsed && <Text ml="3" fontWeight="500" fontSize="15px">{label}</Text>}
        </Flex>
      </NavLink>
    </Box>
  );
};

const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }) => {
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'admin';

  const handleLogout = () => {
    onLogoutClose();
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <>
      <Box 
        display={{ base: isMobileOpen ? 'block' : 'none', lg: 'none' }}
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bg="blackAlpha.500"
        zIndex="999"
        onClick={onMobileClose}
      />
      <Flex
        direction="column"
        w={{ base: '260px', lg: isCollapsed ? '80px' : '260px' }}
        bg="white"
        h="100vh"
        position="fixed"
        left="0"
        top="0"
        borderRight="1px solid"
        borderColor="gray.100"
        zIndex="1000"
        transform={{ base: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)', lg: 'translateX(0)' }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
      <Flex p="5" pt="6" align="center" justify="space-between" mb="4" position="relative" flexShrink={0}>
        <Flex align="center" justify="center" w="full" display={{ base: 'flex', lg: isCollapsed ? 'none' : 'flex' }}>
          <Box 
            bg="#222021" 
            p="0" 
            borderRadius="xl" 
            w="full" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Image 
              src="/main.png" 
              alt="DreamsPOS Logo" 
              w="140px"
              h="auto"
            />
          </Box>
        </Flex>
        <IconButton
          display={{ base: 'none', lg: 'flex' }}
          icon={isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          onClick={onToggleCollapse}
          variant="solid"
          size="sm"
          color="white"
          bg="#298AC6"
          _hover={{ bg: '#216E9E' }}
          borderRadius="full"
          position="absolute"
          right="-15px"
          top="30px"
          zIndex="1100"
          shadow="md"
          w="30px"
          h="30px"
          minW="30px"
        />
      </Flex>

      <Box flex="1" overflowY="auto" className="scrollbar-hide" pb="6">
        <VStack align="stretch" py="2" spacing="1">
          {!isCollapsed && (
            <Text px="6" py="2" fontSize="15px" fontWeight="700" color="#222021" mt="2">
              Main Panel
            </Text>
          )}
          
          {/* ADMIN SIDEBAR */}
          {userRole === 'admin' && (
            <>
               <SidebarItem icon={LayoutDashboard} label="Admin Overview" to="/" isCollapsed={isCollapsed} />
              
              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
                  Team Management
                </Text>
              )}
              <SidebarItem icon={Store} label="Depot (Branches)" isCollapsed={isCollapsed}>
                {[
                  { label: 'Depot List', to: '/manage-branches' },
                  { label: 'Create New Depot', to: '/create-branch' },
                ]}
              </SidebarItem>

              <SidebarItem icon={Users} label="Super Stocklist" isCollapsed={isCollapsed}>
                {[
                  { label: 'Super Stocklist Members', to: '/manage-sales' },
                  { label: 'Add Super Stocklist', to: '/create-sales' },
                ]}
              </SidebarItem>

              <SidebarItem icon={Briefcase} label="Partners (Dist)" isCollapsed={isCollapsed}>
                {[
                  { label: 'Distributor List', to: '/manage-distributors' },
                  { label: 'Add New Partner', to: '/create-distributor' },
                ]}
              </SidebarItem>

              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
                  Inventory & Billing
                </Text>
              )}
              <SidebarItem icon={Package} label="Warehouse Stock" isCollapsed={isCollapsed}>
                {[
                  { label: 'All Network Inventory', to: '/admin/inventory' },
                  { label: 'Product Catalog', to: '/admin/products' },
                  { label: 'Stock History', to: '/admin/inventory-logs' },
                ]}
              </SidebarItem>

              <SidebarItem icon={Receipt} label="Consignment Logic" isCollapsed={isCollapsed}>
                {[
                  { label: 'Stock Transfer', to: '/admin/transfer-stock' },
                  { label: 'All Transfer History', to: '/total-dispatch-stock' },
                  { label: 'All Sales Records', to: '/admin/all-sales' },
                ]}
              </SidebarItem>

              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
                  System Reports
                </Text>
              )}
              <SidebarItem icon={FileText} label="Reports Hub" isCollapsed={isCollapsed}>
                {[
                  { label: 'Daily Summary', to: '/reports/daily' },
                  { label: 'Monthly Summary', to: '/reports/monthly' },
                  { label: 'Yearly Summary', to: '/reports/yearly' },
                ]}
              </SidebarItem>
            </>
          )}

          {/* BRANCH SIDEBAR */}
          {userRole === 'branch' && (
            <>
              <SidebarItem icon={LayoutDashboard} label="Branch Dashboard" to="/branch/dashboard" isCollapsed={isCollapsed} />
              
              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
                  Stock Management
                </Text>
              )}
              <SidebarItem icon={Package} label="Branch Inventory" isCollapsed={isCollapsed}>
                {[
                  { label: 'Manage Stock', to: '/branch/manage-products' },
                  { label: 'Incoming Shipments', to: '/branch/received-stock' },
                  { label: 'Low Stock Alerts', to: '/branch/low-stock' },
                ]}
              </SidebarItem>

              <SidebarItem icon={ArrowUpRight} label="Dispatch to Sales" isCollapsed={isCollapsed}>
                {[
                  { label: 'Dispatch with GST', to: '/branch/dispatch-to-sales-gst' },
                  { label: 'Dispatch (Non-GST)', to: '/branch/dispatch-to-sales' },
                  { label: 'Dispatch History', to: '/total-dispatch-stock' },
                ]}
              </SidebarItem>

              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
                  Sales & Billing
                </Text>
              )}
              <SidebarItem icon={TrendingUp} label="Sales Analytics" to="/branch/product-sales" isCollapsed={isCollapsed} />
              <SidebarItem icon={FileText} label="Branch Reports" to="/branch/reports" isCollapsed={isCollapsed} />
            </>
          )}

          {/* SALES REP SIDEBAR */}
          {userRole === 'sales' && (
            <>
              <SidebarItem icon={LayoutDashboard} label="Super Stocklist Dashboard" to="/sales/dashboard" isCollapsed={isCollapsed} />
              
              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
                  Inventory & Stock
                </Text>
              )}
              <SidebarItem icon={Package} label="My Inventory" isCollapsed={isCollapsed}>
                {[
                  { label: 'My Shelf', to: '/sales/manage-products' },
                  { label: 'Stock In (Incoming)', to: '/sales/received-stock' },
                  { label: 'Stock History', to: '/sales/inventory-log' },
                ]}
              </SidebarItem>
              
              <SidebarItem icon={ArrowUpRight} label="Dispatch Distributor" isCollapsed={isCollapsed}>
                {[
                  { label: 'Dispatch with GST', to: '/sales/dispatch-to-distributor-gst' },
                  { label: 'Dispatch (Non-GST)', to: '/sales/dispatch-to-distributor' },
                  { label: 'Dispatch History', to: '/total-dispatch-stock' },
                ]}
              </SidebarItem>
              <SidebarItem icon={FileText} label="My Reports" to="/sales/reports" isCollapsed={isCollapsed} />
            </>
          )}

          {/* DISTRIBUTOR SIDEBAR */}
          {userRole === 'distributor' && (
            <>
              <SidebarItem icon={LayoutDashboard} label="Partner Dashboard" to="/distributor/dashboard" isCollapsed={isCollapsed} />
              
              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
                  Inventory & Stock
                </Text>
              )}
              <SidebarItem icon={Package} label="My Warehouse" isCollapsed={isCollapsed}>
                {[
                  { label: 'Stock Summary', to: '/distributor/manage-products' },
                  { label: 'Incoming Shipments', to: '/distributor/received-stock' },
                  { label: 'Stock History', to: '/distributor/inventory-log' },
                ]}
              </SidebarItem>
              
              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
                  Sales & Records
                </Text>
              )}
              <SidebarItem icon={Receipt} label="Partner Sales" isCollapsed={isCollapsed}>
                {[
                  { label: 'New Sale (GST)', to: '/distributor/new-invoice-gst' },
                  { label: 'New Sale (Non-GST)', to: '/distributor/new-invoice' },
                  { label: 'Sales History', to: '/distributor/history' },
                ]}
              </SidebarItem>
              <SidebarItem icon={FileText} label="Partner Reports" to="/distributor/reports" isCollapsed={isCollapsed} />
            </>
          )}

          {!isCollapsed && (
            <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#222021">
              My Account
            </Text>
          )}
          <SidebarItem icon={UserCircle} label="Profile" to="/profile" isCollapsed={isCollapsed} />
          <SidebarItem icon={Key} label="Security" to="/change-password" isCollapsed={isCollapsed} />
        </VStack>
      </Box>
      <Box mt="auto" borderTop="1px solid" borderColor="gray.100" py="4" px="0">
         <SidebarItem 
            icon={LogOut} 
            label="Logout" 
            isCollapsed={isCollapsed} 
            onClick={onLogoutOpen}
          />
      </Box>
      </Flex>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutOpen}
        leastDestructiveRef={cancelRef}
        onClose={onLogoutClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2xl" mx="4">
            <AlertDialogHeader fontSize="lg" fontWeight="800" color="secondary">
              Logout Confirmation
            </AlertDialogHeader>

            <AlertDialogBody color="gray.600">
              Are you sure you want to logout? You will need to sign in again to access the panel.
            </AlertDialogBody>

            <AlertDialogFooter gap="3">
              <Button ref={cancelRef} onClick={onLogoutClose} borderRadius="xl" variant="ghost">
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleLogout} borderRadius="xl" px="6" boxShadow="0 4px 14px 0 rgba(41, 138, 198, 0.39)">
                Yes, Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
