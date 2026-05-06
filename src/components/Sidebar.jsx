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
  Receipt,
  ArrowRightLeft} from 'lucide-react';
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
import logo from '../assets/logo.png';

const SidebarItem = ({ icon, label, to, children, isCollapsed, onClick }) => {
  const location = useLocation();
  const hasChildren = children && children.length > 0;
  const isChildActive = hasChildren ? children.some(c => location.pathname === c.to) : false;
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: isChildActive });
  
  const activeColor = '#FF9F43';
  const activeBg = '#FFF4E8';
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
                          <Box w="8px" h="8px" borderRadius="full" border="2px solid #FF9F43" bg="#FF9F43" />
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
        <Flex align="center" justify="flex-start" w="full" pl="2" display={{ base: 'flex', lg: isCollapsed ? 'none' : 'flex' }}>
          <Image 
            src={logo} 
            alt="DreamsPOS Logo" 
            w="160px"
            h="auto"
            style={{ mixBlendMode: 'multiply' }}
          />
        </Flex>
        <IconButton
          display={{ base: 'none', lg: 'flex' }}
          icon={isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          onClick={onToggleCollapse}
          variant="solid"
          size="sm"
          color="white"
          bg="#FF9F43"
          _hover={{ bg: '#FF8A1D' }}
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
            <Text px="6" py="2" fontSize="15px" fontWeight="700" color="#1B2850" mt="2">
              Main
            </Text>
          )}
          
          {userRole === 'admin' ? (
            <>
              <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" isCollapsed={isCollapsed} />
              
              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#1B2850">
                  Inventory
                </Text>
              )}
              <SidebarItem icon={Store} label="Branches" isCollapsed={isCollapsed}>
                {[
                  { label: 'Manage Branches', to: '/manage-branches' },
                  { label: 'Create Branch', to: '/create-branch' },
                ]}
              </SidebarItem>

              <SidebarItem icon={PackageSearch} label="Stock Dispatch" isCollapsed={isCollapsed}>
                {[
                  { label: 'Total Dispatch', to: '/total-dispatch-stock' },
                  { label: 'Record Dispatch', to: '/record-dispatch' },
                  { label: 'Dispatch Summary', to: '/dispatch-summary' },
                ]}
              </SidebarItem>

              <SidebarItem icon={TrendingUp} label="Product Tracking" isCollapsed={isCollapsed}>
                {[
                  { label: 'Product Allocation', to: '/product-allocation' },
                  { label: 'Product Movement', to: '/product-movement' },
                ]}
              </SidebarItem>

              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#1B2850">
                  Reports
                </Text>
              )}
              <SidebarItem icon={FileText} label="Reports" isCollapsed={isCollapsed}>
                {[
                  { label: 'Daily Report', to: '/reports/daily' },
                  { label: 'Monthly Report', to: '/reports/monthly' },
                  { label: 'Yearly Report', to: '/reports/yearly' },
                ]}
              </SidebarItem>
            </>
          ) : (
            <>
              <SidebarItem icon={LayoutDashboard} label="Branch Dashboard" to="/branch/dashboard" isCollapsed={isCollapsed} />
              
              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#1B2850">
                  Branch Inventory
                </Text>
              )}
              <SidebarItem icon={Store} label="Products" isCollapsed={isCollapsed}>
                {[
                  { label: 'Manage Products', to: '/branch/manage-products' },
                  { label: 'Add Product', to: '/branch/add-product' },
                  { label: 'Low Stock Alerts', to: '/branch/low-stock' },
                ]}
              </SidebarItem>

              <SidebarItem icon={ArrowRightLeft} label="Records" isCollapsed={isCollapsed}>
                {[
                  { label: 'Received Stock', to: '/branch/received-stock' },
                  { label: 'Inventory Records', to: '/branch/inventory-log' },
                  { label: 'Sales Records', to: '/branch/sales-history' },
                ]}
              </SidebarItem>

              {!isCollapsed && (
                <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#1B2850">
                  Sales & Reports
                </Text>
              )}
              <SidebarItem icon={Receipt} label="New Invoice" isCollapsed={isCollapsed} to="/branch/new-invoice" />
              <SidebarItem icon={TrendingUp} label="Product Sales Tracking" isCollapsed={isCollapsed} to="/branch/product-sales" />
              <SidebarItem icon={FileText} label="Reports" isCollapsed={isCollapsed} to="/branch/reports" />
            </>
          )}

          {!isCollapsed && (
            <Text px="6" pt="4" pb="2" fontSize="15px" fontWeight="700" color="#1B2850">
              Settings
            </Text>
          )}
          <SidebarItem icon={UserCircle} label="Profile" to="/profile" isCollapsed={isCollapsed} />
          <SidebarItem icon={Key} label="Change Password" to="/change-password" isCollapsed={isCollapsed} />
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
              Bhai, are you sure you want to logout? You will need to sign in again to access the panel.
            </AlertDialogBody>

            <AlertDialogFooter gap="3">
              <Button ref={cancelRef} onClick={onLogoutClose} borderRadius="xl" variant="ghost">
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleLogout} borderRadius="xl" px="6" boxShadow="0 4px 14px 0 rgba(255, 159, 67, 0.39)">
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
