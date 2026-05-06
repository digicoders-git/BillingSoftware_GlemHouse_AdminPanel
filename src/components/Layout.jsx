import { useState, useEffect } from 'react';
import { Box, useDisclosure, Spinner, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { isOpen: isCollapsed, onToggle: onToggleCollapse } = useDisclosure({ defaultIsOpen: false });
  const { isOpen: isMobileOpen, onOpen: onMobileOpen, onClose: onMobileClose } = useDisclosure();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleManualRefresh = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    };
    window.addEventListener('refresh_page_data', handleManualRefresh);
    return () => window.removeEventListener('refresh_page_data', handleManualRefresh);
  }, []);

  return (
    <Box minH="100vh" bg="background">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggleCollapse={onToggleCollapse} 
        isMobileOpen={isMobileOpen}
        onMobileClose={onMobileClose}
      />
      <Box 
        ml={{ base: 0, lg: isCollapsed ? '80px' : '260px' }} 
        transition="margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <Navbar 
          isCollapsed={isCollapsed} 
          onMobileOpen={onMobileOpen} 
        />
        <Box pt="90px" pb="40px" px={{ base: 4, md: 6 }}>
          {isLoading ? (
            <Flex w="full" h="calc(100vh - 130px)" align="center" justify="center">
              <Spinner 
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#FF9F43"
                size="xl"
              />
            </Flex>
          ) : (
            children
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
