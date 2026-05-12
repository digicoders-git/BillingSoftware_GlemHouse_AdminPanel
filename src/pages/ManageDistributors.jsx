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
  Tag,
  TagLabel,
  SimpleGrid,
  Divider,
  Tooltip
} from '@chakra-ui/react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  Copy,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../utils/api';

const ManageDistributors = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [deleteId, setDeleteId] = useState(null);
  const [viewDist, setViewDist] = useState(null);
  
  const { isOpen: isDelOpen, onOpen: onDelOpen, onClose: onDelClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchDistributors();
  }, [page, search]);

  const fetchDistributors = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/distributors?keyword=${search}&pageNumber=${page}`);
      setDistributors(data.distributors);
      setTotalPages(data.pages);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch distributors',
        status: 'error',
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/distributors/${deleteId}`);
      toast({
        title: 'Success',
        description: 'Distributor removed successfully',
        status: 'success',
        duration: 3000,
      });
      onDelClose();
      fetchDistributors();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove distributor',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
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
            <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1.5px">Distributor Network</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="500">Manage your verified distribution partners and their portal access</Text>
          </Box>
          <Button 
            leftIcon={<Plus size={18} />} 
            colorScheme="brand" 
            h="48px"
            px="8"
            borderRadius="2xl"
            shadow="xl"
            fontWeight="900"
            onClick={() => navigate('/create-distributor')}
            _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}
          >
            Add New Partner
          </Button>
        </Flex>

        <Box className="premium-card" overflow="hidden" border="1px solid" borderColor="gray.100">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
               <HStack spacing="4">
                  <Badge colorScheme="brand" variant="subtle" px="3" py="1" borderRadius="lg" fontSize="10px" fontWeight="800">
                     TOTAL: {total} PARTNERS
                  </Badge>
                  <Divider orientation="vertical" h="20px" />
                  <Text fontSize="xs" fontWeight="700" color="gray.400">ACTIVE NETWORK</Text>
               </HStack>
               
               <InputGroup size="md" maxW={{ base: "full", md: "350px" }}>
                <InputLeftElement h="45px"><Search color="#919EAB" size={18} /></InputLeftElement>
                <Input 
                  placeholder="Search by name, ID or region..." 
                  h="45px"
                  borderRadius="xl"
                  bg="white"
                  fontWeight="600"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  _focus={{ borderColor: 'brand.500', shadow: 'sm' }}
                />
              </InputGroup>
            </Flex>
          </Box>

          <Box overflowX="auto">
            {loading ? (
              <Flex justify="center" align="center" py="40">
                <VStack spacing="4">
                    <Spinner size="xl" thickness="4px" color="brand.500" />
                    <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">Loading Network...</Text>
                </VStack>
              </Flex>
            ) : (
              <Table variant="simple">
                <Thead bg="gray.50/50">
                  <Tr>
                    <Th py="5" px="8" fontSize="10px" color="gray.400" letterSpacing="1px">PARTNER ID</Th>
                    <Th py="5" fontSize="10px" color="gray.400" letterSpacing="1px">DISTRIBUTOR NAME</Th>
                    <Th py="5" fontSize="10px" color="gray.400" letterSpacing="1px">PRIMARY REGION</Th>
                    <Th py="5" fontSize="10px" color="gray.400" letterSpacing="1px">CONTACT INFO</Th>
                    <Th py="5" fontSize="10px" color="gray.400" letterSpacing="1px">PORTAL ACCESS</Th>
                    <Th py="5" px="8" textAlign="right"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {distributors.length > 0 ? distributors.map((dist) => (
                    <Tr key={dist._id} _hover={{ bg: 'gray.50/30' }} transition="0.2s">
                      <Td py="5" px="8">
                        <Text fontWeight="900" fontSize="sm" color="brand.500" letterSpacing="0.5px">{dist.distributorId}</Text>
                      </Td>
                      <Td py="5">
                         <HStack spacing="3">
                            <Avatar size="sm" name={dist.name} bg="brand.50" color="brand.500" fontWeight="800" borderRadius="xl" />
                            <VStack align="start" spacing="0">
                                <Text fontWeight="800" fontSize="sm" color="secondary">{dist.name}</Text>
                                <Text fontSize="10px" fontWeight="600" color="gray.400">Verified Partner</Text>
                            </VStack>
                         </HStack>
                      </Td>
                      <Td py="5">
                        <HStack spacing="2">
                           <Box p="1" bg="blue.50" color="blue.500" borderRadius="md"><Eye size={10}/></Box>
                           <Text fontWeight="700" fontSize="xs" color="gray.600">{dist.location}</Text>
                        </HStack>
                      </Td>
                      <Td py="5">
                        <VStack align="start" spacing="0">
                            <Text fontWeight="800" fontSize="xs">{dist.contact}</Text>
                            <Text fontSize="10px" color="gray.400">Direct Contact</Text>
                        </VStack>
                      </Td>
                      <Td py="5">
                        <Tooltip label="Click to copy email" borderRadius="lg">
                            <Tag 
                                size="md" 
                                colorScheme="purple" 
                                variant="subtle" 
                                px="3" 
                                py="1" 
                                borderRadius="lg" 
                                cursor="pointer" 
                                onClick={() => copyToClipboard(dist.email)}
                                _hover={{ transform: 'translateY(-1px)', shadow: 'sm' }}
                            >
                            <TagLabel fontSize="10px" fontWeight="800">{dist.email}</TagLabel>
                            </Tag>
                        </Tooltip>
                      </Td>
                      <Td py="5" px="8" textAlign="right">
                        <HStack spacing="2" justify="end">
                          <IconButton 
                            aria-label="View Profile" 
                            icon={<Eye size={18} />} 
                            size="sm" 
                            variant="ghost" 
                            borderRadius="xl"
                            _hover={{ bg: 'blue.50', color: 'blue.500' }}
                            onClick={() => { setViewDist(dist); onViewOpen(); }}
                          />
                          <IconButton 
                            aria-label="Delete Partner" 
                            icon={<Trash2 size={18} />} 
                            size="sm" 
                            variant="ghost" 
                            color="red.400" 
                            borderRadius="xl"
                            _hover={{ bg: 'red.50', color: 'red.500' }}
                            onClick={() => { setDeleteId(dist._id); onDelOpen(); }}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  )) : (
                    <Tr>
                      <Td colSpan="6" textAlign="center" py="20">
                         <VStack spacing="3">
                            <Box p="4" bg="gray.50" borderRadius="full" color="gray.300"><Search size={40}/></Box>
                            <Text fontWeight="800" color="gray.400">No distributors found in the network</Text>
                         </VStack>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>
          
          <Box p="6" bg="gray.50/20" borderTop="1px solid" borderColor="gray.50">
             <Flex justify="space-between" align="center">
                <Text fontSize="xs" fontWeight="700" color="gray.400">Showing page {page} of {totalPages}</Text>
                <HStack spacing="3">
                   <Button 
                    size="sm" 
                    variant="ghost" 
                    fontWeight="800"
                    onClick={() => setPage(p => Math.max(1, p-1))} 
                    disabled={page === 1}
                    leftIcon={<ChevronRight size={14} style={{ transform: 'rotate(180deg)' }}/>}
                   >
                    Previous
                   </Button>
                   <Divider orientation="vertical" h="20px" />
                   <Button 
                    size="sm" 
                    variant="ghost" 
                    fontWeight="800"
                    color="brand.500"
                    onClick={() => setPage(p => Math.min(totalPages, p+1))} 
                    disabled={page === totalPages}
                    rightIcon={<ChevronRight size={14} />}
                   >
                    Next Page
                   </Button>
                </HStack>
             </Flex>
          </Box>
        </Box>
      </Box>

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
        <ModalContent borderRadius="3xl" overflow="hidden" border="none" shadow="2xl">
          <ModalHeader bg="secondary" color="white" py="8">
             <HStack spacing="4">
                <Avatar size="md" name={viewDist?.name} borderRadius="2xl" border="2px solid" borderColor="whiteAlpha.400" />
                <VStack align="start" spacing="0">
                    <Heading size="md" fontWeight="900" letterSpacing="-0.5px">{viewDist?.name}</Heading>
                    <Text fontSize="xs" color="whiteAlpha.700" fontWeight="700">DISTRIBUTOR PROFILE</Text>
                </VStack>
             </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" top="4" right="4" />
          <ModalBody p="8">
            {viewDist && (
              <VStack align="stretch" spacing="6">
                <SimpleGrid columns={2} spacing="6">
                   <Box>
                      <Text fontSize="10px" fontWeight="900" color="gray.400" mb="2" textTransform="uppercase">Unique ID</Text>
                      <Text fontWeight="800" color="secondary" fontSize="md">{viewDist.distributorId}</Text>
                   </Box>
                   <Box>
                      <Text fontSize="10px" fontWeight="900" color="gray.400" mb="2" textTransform="uppercase">Contact Number</Text>
                      <Text fontWeight="800" color="secondary" fontSize="md">{viewDist.contact}</Text>
                   </Box>
                </SimpleGrid>
                
                <Divider />
                
                <Box>
                  <Text fontSize="10px" fontWeight="900" color="gray.400" mb="2" textTransform="uppercase">Portal Credentials</Text>
                  <VStack align="stretch" spacing="3">
                     <Flex bg="gray.50" p="4" borderRadius="2xl" justify="space-between" align="center">
                        <VStack align="start" spacing="0">
                           <Text fontSize="9px" fontWeight="800" color="gray.400">LOGIN EMAIL</Text>
                           <Text fontWeight="700" fontSize="sm">{viewDist.email}</Text>
                        </VStack>
                        <IconButton size="sm" variant="ghost" icon={<Copy size={16} />} color="brand.500" onClick={() => copyToClipboard(viewDist.email)} />
                     </Flex>
                     <Flex bg="brand.50" p="4" borderRadius="2xl" justify="space-between" align="center">
                        <VStack align="start" spacing="0">
                           <Text fontSize="9px" fontWeight="800" color="brand.400">CURRENT PASSWORD</Text>
                           <Text fontWeight="900" fontSize="md" color="brand.600">{viewDist.password}</Text>
                        </VStack>
                        <IconButton size="sm" variant="ghost" icon={<Copy size={16} />} color="brand.500" onClick={() => copyToClipboard(viewDist.password)} />
                     </Flex>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="10px" fontWeight="900" color="gray.400" mb="2" textTransform="uppercase">Assigned Region</Text>
                  <Flex align="center" gap="3">
                     <Box p="2" bg="blue.50" color="blue.500" borderRadius="xl"><Eye size={18}/></Box>
                     <Text fontWeight="800" fontSize="md">{viewDist.location}</Text>
                  </Flex>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter bg="gray.50" py="6">
             <Button w="full" colorScheme="secondary" h="50px" borderRadius="2xl" fontWeight="900" onClick={onViewClose}>
                Close Profile
             </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Alert */}
      <AlertDialog isOpen={isDelOpen} leastDestructiveRef={cancelRef} onClose={onDelClose} isCentered>
        <AlertDialogOverlay backdropFilter="blur(4px)" />
        <AlertDialogContent borderRadius="3xl" p="4">
          <AlertDialogHeader fontSize="xl" fontWeight="900" color="secondary">Delete Partner?</AlertDialogHeader>
          <AlertDialogBody fontWeight="600" color="gray.500">
             Are you absolutely sure? This will permanently remove the distributor and terminate their access to the portal. This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter gap="3">
            <Button ref={cancelRef} onClick={onDelClose} variant="ghost" fontWeight="800">Cancel</Button>
            <Button colorScheme="red" onClick={handleDelete} borderRadius="2xl" px="8" fontWeight="900" shadow="lg">Delete Permanently</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default ManageDistributors;
