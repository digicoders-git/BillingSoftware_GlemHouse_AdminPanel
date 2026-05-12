import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  HStack, 
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  VStack,
  useToast,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
  Divider,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { 
  Plus, 
  Search, 
  Pencil as Edit, 
  Trash2, 
  Filter,
  Download,
  Eye,
  MapPin,
  User,
  Phone,
  Mail,
  Lock,
  Copy,
  ChevronDown
} from 'lucide-react';
import { 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../utils/api';

const ManageSales = () => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [deleteId, setDeleteId] = useState(null);
  const [viewSales, setViewSales] = useState(null);
  
  const { isOpen: isDelOpen, onOpen: onDelOpen, onClose: onDelClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchSales();
  }, [page, search, statusFilter]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/sales?keyword=${search}&pageNumber=${page}&status=${statusFilter}`);
      setSalesList(data.sales);
      setTotalPages(data.pages);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch sales records',
        status: 'error',
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/sales/${deleteId}`);
      toast({
        title: 'Success',
        description: 'Sales record removed successfully',
        status: 'success',
        duration: 3000,
      });
      onDelClose();
      fetchSales();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove sales record',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Credentials copied to clipboard',
      status: 'info',
      duration: 2000,
      position: 'top-right'
    });
  };

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Manage Sales</Heading>
            <Text fontSize="sm" color="gray.500">View and manage all sales representatives</Text>
          </Box>
          <Button 
            leftIcon={<Plus size={16} />} 
            colorScheme="brand" 
            borderRadius="xl" 
            size="sm" 
            onClick={() => navigate('/create-sales')}
          >
            Add New Sales
          </Button>
        </Flex>

        <Box className="premium-card" overflow="hidden">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50">
            <Flex justify="space-between" align="center">
              <Heading size="xs" color="secondary" fontWeight="700">Sales Directory</Heading>
              <HStack spacing="3">
                <InputGroup size="sm" maxW="250px">
                  <InputLeftElement pointerEvents="none">
                    <Search color="gray" size={16} />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search sales..." 
                    borderRadius="lg" 
                    bg="white" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </HStack>
            </Flex>
          </Box>

          <Box overflowX="auto">
            {loading ? (
              <Flex justify="center" align="center" py="20">
                <Spinner color="brand.500" />
              </Flex>
            ) : (
              <Table variant="simple">
                <Thead bg="gray.50/50">
                  <Tr>
                    <Th fontSize="10px">Sales ID</Th>
                    <Th fontSize="10px">Name</Th>
                    <Th fontSize="10px">Location</Th>
                    <Th fontSize="10px">Contact</Th>
                    <Th fontSize="10px">Credentials</Th>
                    <Th fontSize="10px" textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {salesList.length > 0 ? salesList.map((sales) => (
                    <Tr key={sales._id} _hover={{ bg: 'gray.50/30' }}>
                      <Td>
                        <Text fontWeight="700" color="brand.500" fontSize="xs">{sales.salesId}</Text>
                      </Td>
                      <Td>
                         <HStack spacing="3">
                            <Avatar size="xs" name={sales.name} bg="secondary" />
                            <Text fontWeight="700" color="secondary" fontSize="xs">{sales.name}</Text>
                         </HStack>
                      </Td>
                      <Td fontSize="xs" color="gray.600">{sales.location}</Td>
                      <Td fontSize="xs" color="gray.600">{sales.contact}</Td>
                      <Td>
                        <Tag size="sm" variant="subtle" colorScheme="blue" cursor="pointer" onClick={() => copyToClipboard(sales.password)}>
                          <TagLabel fontSize="10px" fontWeight="700">{sales.email}</TagLabel>
                        </Tag>
                      </Td>
                      <Td textAlign="right">
                        <HStack spacing="1" justify="end">
                          <IconButton 
                            aria-label="View" 
                            icon={<Eye size={14} />} 
                            size="xs" 
                            variant="ghost" 
                            onClick={() => { setViewSales(sales); onViewOpen(); }}
                          />
                          <IconButton 
                            aria-label="Delete" 
                            icon={<Trash2 size={14} />} 
                            size="xs" 
                            variant="ghost" 
                            color="red.400" 
                            onClick={() => { setDeleteId(sales._id); onDelOpen(); }}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  )) : (
                    <Tr>
                      <Td colSpan="6" textAlign="center" py="10" color="gray.500">No sales records found</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>
          <Box p="4" bg="gray.50/20">
             <Flex justify="space-between" align="center">
                <Text fontSize="10px" color="gray.400">Showing {salesList.length} of {total} records</Text>
                <HStack spacing="2">
                   <Button size="xs" variant="outline" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Prev</Button>
                   <Text fontSize="xs" fontWeight="700">{page}</Text>
                   <Button size="xs" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Next</Button>
                </HStack>
             </Flex>
          </Box>
        </Box>
      </Box>

      {/* View Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Sales Representative Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            {viewSales && (
              <VStack align="stretch" spacing="4">
                <Box bg="gray.50" p="4" borderRadius="xl">
                  <Text fontSize="xs" color="gray.500" fontWeight="700">NAME</Text>
                  <Text fontWeight="600">{viewSales.name}</Text>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" gap="4">
                  <GridItem>
                    <Text fontSize="xs" color="gray.500" fontWeight="700">SALES ID</Text>
                    <Text fontWeight="600">{viewSales.salesId}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="xs" color="gray.500" fontWeight="700">CONTACT</Text>
                    <Text fontWeight="600">{viewSales.contact}</Text>
                  </GridItem>
                </Grid>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700">EMAIL / USERNAME</Text>
                  <HStack>
                    <Text fontWeight="600">{viewSales.email}</Text>
                    <IconButton size="xs" variant="ghost" icon={<Copy size={12} />} onClick={() => copyToClipboard(viewSales.email)} />
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700">PASSWORD</Text>
                  <HStack>
                    <Text fontWeight="800" color="brand.600">{viewSales.password}</Text>
                    <IconButton size="xs" variant="ghost" icon={<Copy size={12} />} onClick={() => copyToClipboard(viewSales.password)} />
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700">LOCATION</Text>
                  <Text fontWeight="600">{viewSales.location}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog isOpen={isDelOpen} leastDestructiveRef={cancelRef} onClose={onDelClose}>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader>Delete Sales Record</AlertDialogHeader>
            <AlertDialogBody>Are you sure? This will also delete their login account.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDelClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
};

export default ManageSales;
