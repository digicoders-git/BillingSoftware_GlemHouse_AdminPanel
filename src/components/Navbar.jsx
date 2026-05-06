import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Settings, 
  ChevronDown, 
  LogOut,
  RefreshCw,
  Menu as MenuIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  Box, 
  Flex, 
  IconButton, 
  Avatar, 
  Text, 
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';

const Navbar = ({ isCollapsed, onMobileOpen }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogoutClose();
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.dispatchEvent(new Event('refresh_page_data'));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <Box
      h="70px"
      bg="white"
      position="fixed"
      top="0"
      right="0"
      left={{ base: 0, lg: isCollapsed ? '80px' : '260px' }}
      zIndex="900"
      px={{ base: 4, md: 6 }}
      borderBottom="1px solid"
      borderColor="gray.100"
      transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Flex h="full" align="center" justify="space-between">
        <HStack spacing={{ base: 2, md: 4 }} flex="1">
          <IconButton
            display={{ base: 'flex', lg: 'none' }}
            icon={<MenuIcon size={20} />}
            variant="ghost"
            onClick={onMobileOpen}
            aria-label="Open Menu"
            color="secondary"
          />
          <HStack 
            spacing="3" 
            bg="gray.50" 
            px="4" 
            py="2" 
            borderRadius="xl" 
            display={{ base: 'none', md: 'flex' }}
            border="1px solid"
            borderColor="gray.100"
          >
            <HStack color="brand.500" spacing="2">
               <CalendarIcon size={16} />
               <Text fontSize="13px" fontWeight="700">{formatDate(currentTime)}</Text>
            </HStack>
            <Box w="1px" h="15px" bg="gray.300" />
            <HStack color="secondary" spacing="2">
               <ClockIcon size={16} />
               <Text fontSize="13px" fontWeight="800" minW="90px">{formatTime(currentTime)}</Text>
            </HStack>
          </HStack>
        </HStack>

        <HStack spacing="3">

          <HStack spacing="1">
            <IconButton
              aria-label="Refresh Data"
              icon={<RefreshCw size={20} className={isRefreshing ? 'spin-animation' : ''} />}
              variant="ghost"
              color={isRefreshing ? "#FF9F43" : "#637381"}
              onClick={handleRefresh}
            />

            <Box position="relative">
              <IconButton
                aria-label="Notifications"
                icon={<Bell size={20} />}
                variant="ghost"
                color="#637381"
              />
            </Box>

            <IconButton
              aria-label="Settings"
              icon={<Settings size={20} />}
              variant="ghost"
              color="#637381"
            />
          </HStack>

          <Menu>
            <MenuButton>
              <HStack spacing="2" ml="2" cursor="pointer" p="1" borderRadius="lg" _hover={{ bg: 'gray.50' }}>
                <Avatar size="sm" name="Admin User" src="https://bit.ly/dan-abramov" border="2px solid" borderColor="green.400" />
                <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                  <Text fontSize="13px" fontWeight="700" color="secondary" lineHeight="shorter">
                    {localStorage.getItem('userRole') === 'branch' ? 'Branch Manager' : 'Admin User'}
                  </Text>
                  <Text fontSize="11px" color="gray.500">
                    {localStorage.getItem('userRole') === 'branch' ? 'Westside Branch' : 'Super Admin'}
                  </Text>
                </Box>
                <ChevronDown size={14} color="gray" />
              </HStack>
            </MenuButton>
            <MenuList fontSize="sm">
              <MenuItem icon={<Settings size={16} />} onClick={() => navigate('/profile')}>Settings</MenuItem>
              <MenuItem icon={<LogOut size={16} />} onClick={onLogoutOpen}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
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
    </Box>
  );
};

export default Navbar;
