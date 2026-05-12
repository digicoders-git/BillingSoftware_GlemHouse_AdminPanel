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
  Switch,
  FormControl
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

const ManageBranches = () => {
  const [Branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [deleteId, setDeleteId] = useState(null);
  const [statusId, setStatusId] = useState(null);
  const [viewBranch, setViewBranch] = useState(null);
  const [branchInventory, setBranchInventory] = useState([]);
  const [branchDispatches, setBranchDispatches] = useState([]);
  const [fetchingBranchData, setFetchingBranchData] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  
  const { isOpen: isDelOpen, onOpen: onDelOpen, onClose: onDelClose } = useDisclosure();
  const { isOpen: isStatusOpen, onOpen: onStatusOpen, onClose: onStatusClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const cancelRef = React.useRef();
  const statusRef = React.useRef();
  
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchBranches();
  }, [page, search, statusFilter]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/Branches?keyword=${search}&pageNumber=${page}&status=${statusFilter}`);
      setBranches(data.Branches);
      setTotalPages(data.pages);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch Branches',
        status: 'error',
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const fetchBranchData = async (branchId) => {
    setFetchingBranchData(true);
    try {
      const [invRes, dispRes] = await Promise.all([
        API.get(`/branch-inventory?branchId=${branchId}`),
        API.get(`/dispatches?branchId=${branchId}`)
      ]);
      setBranchInventory(invRes.data.inventory || []);
      setBranchDispatches(dispRes.data.dispatches || []);
    } catch (error) {
      toast({ title: "Bhai, error loading branch data", status: "error" });
    } finally {
      setFetchingBranchData(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/Branches/${deleteId}`);
      toast({
        title: 'Success',
        description: 'Branch deleted successfully',
        status: 'success',
        duration: 3000,
      });
      onDelClose();
      fetchBranches();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete branch',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleStatusToggle = async () => {
    try {
      await API.patch(`/Branches/${statusId}/status`);
      toast({
        title: 'Success',
        description: 'Branch status updated',
        status: 'success',
        duration: 2000,
      });
      onStatusClose();
      fetchBranches();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Password copied to clipboard',
      status: 'info',
      duration: 2000,
      position: 'top-right'
    });
  };

  const handleExport = () => {
    if (Branches.length === 0) return;
    
    const headers = ['Branch ID', 'Name', 'Location', 'Manager', 'Contact', 'Email', 'Status'];
    const csvData = Branches.map(b => [
      b.branchId,
      b.name,
      `"${b.location}"`,
      b.manager,
      b.contact,
      b.email,
      b.status
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Branch_Directory_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Bhai, branch directory has been downloaded as CSV.",
      status: "success",
    });
  };

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Manage Deepo</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="400">View and manage all deepo locations within your network</Text>
          </Box>
          <Button 
            leftIcon={<Plus size={16} />} 
            colorScheme="brand" 
            borderRadius="xl" 
            size="sm" 
            shadow="sm"
            onClick={() => navigate('/create-branch')}
          >
            Add New Deepo
          </Button>
        </Flex>

        <Box className="premium-card" overflow="hidden">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
              <HStack spacing="3">
                 <Heading size="xs" color="secondary" fontWeight="700">Deepo Directory</Heading>
              </HStack>
              <HStack spacing="3">
                <InputGroup size="sm" maxW={{ base: 'full', md: '250px' }}>
                  <InputLeftElement pointerEvents="none">
                    <Search color="gray" size={16} />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search Deepo..." 
                    borderRadius="lg" 
                    bg="white" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
                <Menu>
                  <MenuButton 
                    as={Button} 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<Filter size={16} />} 
                    rightIcon={<ChevronDown size={14} />}
                    borderRadius="lg" 
                    fontWeight="600"
                  >
                    Filter: {statusFilter}
                  </MenuButton>
                  <MenuList borderRadius="xl" shadow="xl" border="none" p="1">
                    <MenuItem fontSize="sm" fontWeight="600" onClick={() => setStatusFilter('All')}>All Deepo</MenuItem>
                    <MenuDivider />
                    <MenuItem fontSize="sm" fontWeight="600" color="green.500" onClick={() => setStatusFilter('Active')}>Active Only</MenuItem>
                    <MenuItem fontSize="sm" fontWeight="600" color="red.500" onClick={() => setStatusFilter('Inactive')}>Inactive Only</MenuItem>
                  </MenuList>
                </Menu>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  leftIcon={<Download size={16} />} 
                  borderRadius="lg" 
                  fontWeight="600"
                  onClick={handleExport}
                >
                  Export
                </Button>
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
                    <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Deepo ID</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Deepo Name</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Manager</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Contact</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Password</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                    <Th color="gray.400" border="none" py="4" px="8" textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Branches.length > 0 ? Branches.map((branch) => (
                    <Tr key={branch._id} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                      <Td borderColor="gray.100" py="4" px="8">
                        <Text fontWeight="700" color="brand.500" fontSize="xs">{branch.branchId}</Text>
                      </Td>
                      <Td borderColor="gray.100" py="4">
                         <HStack spacing="3">
                            <Avatar size="xs" name={branch.name} bg="secondary" color="white" />
                            <VStack align="start" spacing="0">
                               <Text fontWeight="700" color="secondary" fontSize="xs">{branch.name}</Text>
                               <Text fontSize="10px" color="gray.400">{branch.location}</Text>
                            </VStack>
                         </HStack>
                      </Td>
                      <Td borderColor="gray.100" py="4">
                        <Text color="gray.600" fontSize="xs" fontWeight="600">{branch.manager}</Text>
                      </Td>
                      <Td borderColor="gray.100" py="4">
                        <Text color="gray.600" fontSize="xs" fontWeight="600">{branch.contact}</Text>
                      </Td>
                      <Td borderColor="gray.100" py="4">
                        <Tag size="sm" variant="subtle" colorScheme="blue" borderRadius="full" cursor="pointer" onClick={() => copyToClipboard(branch.password)}>
                          <TagLabel fontSize="10px" fontWeight="700">{branch.password}</TagLabel>
                        </Tag>
                      </Td>
                      <Td borderColor="gray.100" py="4">
                        <HStack spacing="3">
                          <Switch 
                            colorScheme="green" 
                            isChecked={branch.status === 'Active'} 
                            onChange={() => { setStatusId(branch._id); onStatusOpen(); }}
                            size="sm"
                          />
                          <Badge 
                            colorScheme={branch.status === 'Active' ? 'green' : 'red'} 
                            borderRadius="full" 
                            px="2"
                            fontSize="9px"
                            variant="subtle"
                          >
                            {branch.status}
                          </Badge>
                        </HStack>
                      </Td>
                      <Td borderColor="gray.100" py="4" px="8" textAlign="right">
                        <HStack spacing="1" justify="end">
                          <IconButton 
                            aria-label="View" 
                            icon={<Eye size={14} />} 
                            size="xs" 
                            variant="ghost" 
                            color="gray.400" 
                            borderRadius="full"
                            onClick={() => { 
                              setViewBranch(branch); 
                              fetchBranchData(branch._id);
                              setActiveTab('info');
                              onViewOpen(); 
                            }}
                          />
                          <IconButton 
                            aria-label="Edit" 
                            icon={<Edit size={14} />} 
                            size="xs" 
                            variant="ghost" 
                            color="gray.400" 
                            borderRadius="full"
                            onClick={() => navigate(`/edit-branch/${branch._id}`)}
                          />
                          <IconButton 
                            aria-label="Delete" 
                            icon={<Trash2 size={14} />} 
                            size="xs" 
                            variant="ghost" 
                            color="red.400" 
                            borderRadius="full"
                            onClick={() => { setDeleteId(branch._id); onDelOpen(); }}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  )) : (
                    <Tr>
                      <Td colSpan="7" textAlign="center" py="10" color="gray.500">No Deepo found</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>
          <Box p="4" bg="gray.50/20" borderTop="1px solid" borderColor="gray.100">
             <Flex justify="space-between" align="center">
                <Text fontSize="10px" color="gray.400" fontWeight="600">Showing {Branches.length} of {total} Deepo</Text>
                <HStack spacing="2">
                   <Button size="xs" variant="outline" fontSize="10px" h="24px" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Previous</Button>
                   <Text fontSize="xs" fontWeight="700">{page}</Text>
                   <Button size="xs" variant="outline" fontSize="10px" h="24px" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Next</Button>
                </HStack>
             </Flex>
          </Box>
        </Box>
      </Box>

      {/* View Branch Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader color="secondary" fontWeight="800">Deepo Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            {viewBranch && (
              <VStack align="stretch" spacing="4">
                <Flex align="center" gap="4" bg="gray.50" p="4" borderRadius="xl">
                  <Avatar size="lg" name={viewBranch.name} bg="brand.500" />
                  <Box>
                    <Heading size="md" color="secondary">{viewBranch.name}</Heading>
                    <Text fontSize="sm" color="brand.500" fontWeight="700">{viewBranch.branchId}</Text>
                  </Box>
                </Flex>

                <HStack spacing="2" borderBottom="1px solid" borderColor="gray.100" pb="2">
                   <Button size="xs" variant={activeTab === 'info' ? 'solid' : 'ghost'} colorScheme="brand" onClick={() => setActiveTab('info')}>General Info</Button>
                   <Button size="xs" variant={activeTab === 'inventory' ? 'solid' : 'ghost'} colorScheme="brand" onClick={() => setActiveTab('inventory')}>Current Stock</Button>
                   <Button size="xs" variant={activeTab === 'dispatches' ? 'solid' : 'ghost'} colorScheme="brand" onClick={() => setActiveTab('dispatches')}>Dispatch History</Button>
                </HStack>
                
                {fetchingBranchData ? (
                   <Flex py="10" justify="center"><Spinner size="sm" /></Flex>
                ) : (
                   <>
                      {activeTab === 'info' && (
                         <Grid templateColumns="repeat(2, 1fr)" gap="4">
                           <GridItem>
                             <HStack color="gray.500" mb="1">
                               <User size={14} />
                               <Text fontSize="xs" fontWeight="700">Manager</Text>
                             </HStack>
                             <Text fontSize="sm" fontWeight="600">{viewBranch.manager}</Text>
                           </GridItem>
                           <GridItem>
                             <HStack color="gray.500" mb="1">
                               <Phone size={14} />
                               <Text fontSize="xs" fontWeight="700">Contact</Text>
                             </HStack>
                             <Text fontSize="sm" fontWeight="600">{viewBranch.contact}</Text>
                           </GridItem>
                           <GridItem colSpan={2}>
                             <HStack color="gray.500" mb="1">
                               <Mail size={14} />
                               <Text fontSize="xs" fontWeight="700">Email Address</Text>
                             </HStack>
                             <Text fontSize="sm" fontWeight="600">{viewBranch.email}</Text>
                           </GridItem>
                           <GridItem colSpan={2}>
                             <HStack color="gray.500" mb="1">
                               <Lock size={14} />
                               <Text fontSize="xs" fontWeight="700">Account Password</Text>
                             </HStack>
                             <HStack>
                               <Text fontSize="sm" fontWeight="800" color="brand.600">{viewBranch.password}</Text>
                               <IconButton size="xs" variant="ghost" icon={<Copy size={12} />} onClick={() => copyToClipboard(viewBranch.password)} />
                             </HStack>
                           </GridItem>
                           <GridItem colSpan={2}>
                             <HStack color="gray.500" mb="1">
                               <MapPin size={14} />
                               <Text fontSize="xs" fontWeight="700">Location / Address</Text>
                             </HStack>
                             <Text fontSize="sm" fontWeight="600">{viewBranch.location}</Text>
                           </GridItem>
                         </Grid>
                      )}

                      {activeTab === 'inventory' && (
                         <Box maxH="300px" overflowY="auto">
                            <Table size="sm" variant="simple">
                               <Thead bg="gray.50">
                                  <Tr>
                                     <Th fontSize="10px">Product</Th>
                                     <Th fontSize="10px">Stock</Th>
                                     <Th fontSize="10px">Status</Th>
                                  </Tr>
                               </Thead>
                               <Tbody>
                                  {branchInventory.length > 0 ? branchInventory.map((item, idx) => (
                                     <Tr key={idx}>
                                        <Td><Text fontWeight="700" fontSize="xs">{item.name}</Text></Td>
                                        <Td><Text fontWeight="800" color="brand.500" fontSize="xs">{item.stock} Units</Text></Td>
                                        <Td><Badge colorScheme={item.stock > 10 ? 'green' : 'orange'} fontSize="9px">{item.status}</Badge></Td>
                                     </Tr>
                                  )) : <Tr><Td colSpan="3" textAlign="center" py="4">No stock in this deepo</Td></Tr>}
                               </Tbody>
                            </Table>
                         </Box>
                      )}

                      {activeTab === 'dispatches' && (
                         <Box maxH="300px" overflowY="auto">
                            <Table size="sm" variant="simple">
                               <Thead bg="gray.50">
                                  <Tr>
                                     <Th fontSize="10px">Invoice</Th>
                                     <Th fontSize="10px">Date</Th>
                                     <Th fontSize="10px">Items</Th>
                                     <Th fontSize="10px">Status</Th>
                                  </Tr>
                               </Thead>
                               <Tbody>
                                  {branchDispatches.length > 0 ? branchDispatches.map((disp, idx) => (
                                     <Tr key={idx}>
                                        <Td><Text fontWeight="700" fontSize="xs">{disp.invoiceNo}</Text></Td>
                                        <Td><Text fontSize="xs">{new Date(disp.date).toLocaleDateString()}</Text></Td>
                                        <Td><Text fontWeight="700" fontSize="xs">{disp.totalItems}</Text></Td>
                                        <Td><Badge size="sm" colorScheme={disp.status === 'Received' ? 'green' : 'orange'} fontSize="9px">{disp.status}</Badge></Td>
                                     </Tr>
                                  )) : <Tr><Td colSpan="4" textAlign="center" py="4">No dispatch history</Td></Tr>}
                               </Tbody>
                            </Table>
                         </Box>
                      )}
                   </>
                )}
                
                <Divider />
                
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Badge colorScheme={viewBranch.status === 'Active' ? 'green' : 'red'} px="3" py="1" borderRadius="full">
                      {viewBranch.status}
                    </Badge>
                  </HStack>
                  <Text fontSize="xs" color="gray.400">Created: {new Date(viewBranch.createdAt).toLocaleDateString()}</Text>
                </Flex>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor="gray.50">
            <Button variant="ghost" mr={3} onClick={onViewClose}>Close</Button>
            <Button colorScheme="brand" onClick={() => { onViewClose(); navigate(`/edit-branch/${viewBranch?._id}`); }}>Edit Details</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isDelOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDelClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Deepo
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards. This will also delete the deepo manager's login account.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDelClose} variant="ghost">
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} borderRadius="lg">
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Status Toggle Confirmation */}
      <AlertDialog
        isOpen={isStatusOpen}
        leastDestructiveRef={statusRef}
        onClose={onStatusClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change Status
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to change the status of this deepo? 
              Inactive Deepos will not be able to login to their panel.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={statusRef} onClick={onStatusClose} variant="ghost">
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleStatusToggle} ml={3} borderRadius="lg">
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
};

export default ManageBranches;
