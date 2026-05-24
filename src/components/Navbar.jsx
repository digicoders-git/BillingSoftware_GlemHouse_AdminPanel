import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  LogOut,
  RefreshCw,
  Menu as MenuIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Settings
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
import API from '../utils/api';

const Navbar = ({ isCollapsed, onMobileOpen }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
    
    // Listen for profile updates from Profile page
    const handleProfileUpdate = () => fetchProfile();
    window.addEventListener('profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('profile_updated', handleProfileUpdate);
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch navbar profile", error);
    }
  };

  const handleLogout = () => {
    onLogoutClose();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
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

  const getProfilePic = (pic) => {
    if (!pic) return 'https://bit.ly/dan-abramov';
    if (pic.startsWith('http')) return pic;
    const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5555';
    // Handle both old paths (with uploads/) and new paths (just filename)
    const cleanPath = pic.startsWith('uploads/') ? pic : `uploads/${pic}`;
    return `${API_URL}/${cleanPath}`;
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
            bg="background" 
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
          <IconButton
            aria-label="Refresh Data"
            icon={<RefreshCw size={20} className={isRefreshing ? 'spin-animation' : ''} />}
            variant="ghost"
            color={isRefreshing ? "#298AC6" : "#637381"}
            onClick={handleRefresh}
          />

          <Menu>
            <MenuButton>
              <HStack spacing="2" ml="2" cursor="pointer" p="1" borderRadius="lg" _hover={{ bg: 'gray.50' }}>
                <Avatar 
                  size="sm" 
                  name={profile?.name || 'User'} 
                  src={getProfilePic(profile?.profilePic)} 
                  border="2px solid" 
                  borderColor="green.400" 
                />
                <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                  <Text fontSize="13px" fontWeight="700" color="secondary" lineHeight="shorter">
                    {profile?.name || (localStorage.getItem('userRole') === 'branch' ? 'Branch Manager' : 'Admin User')}
                  </Text>
                  <Text fontSize="11px" color="gray.500">
                    {profile?.role === 'admin' ? 'Super Admin' : 
                     profile?.role === 'sales' ? 'Super Stocklist Partner' : 
                     profile?.role === 'branch' ? 'Depot Manager' :
                     profile?.role === 'distributor' ? 'Distribution Partner' :
                     'Super Stocklist Partner'}
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
    </Box>
  );
};

export default Navbar;
