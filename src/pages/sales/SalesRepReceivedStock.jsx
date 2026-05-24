import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useToast,
  Spinner,
  HStack,
  VStack,
  IconButton,
  Tag,
  TagLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider
} from '@chakra-ui/react';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  Eye,
  RefreshCcw,
  ArrowDownLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';

const SalesRepReceivedStock = () => {
  const navigate = useNavigate();
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchDispatches = async () => {
    try {
      setLoading(true);
      // Fetches dispatches where receiversalesRep is the current user
      const { data } = await API.get('/dispatches');
      setDispatches(data.dispatches || []);
    } catch (error) {
      toast({ title: "Failed to load dispatches", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDispatches();
    setRefreshing(false);
  };

  const handleReceiveStock = async (id) => {
    try {
      await API.patch(`/dispatches/${id}/status`, { status: 'Received' });
      toast({
        title: "Stock Received",
        description: "The product has been successfully added to your shelf inventory.",
        status: "success",
      });
      fetchDispatches();
      onClose();
    } catch (error) {
      toast({ title: "Failed to update stock", status: "error" });
    }
  };

  const openDetails = (dispatch) => {
    setSelectedDispatch(dispatch);
    onOpen();
  };

  if (loading && !refreshing) {
    return (
      <Layout>
        <Flex justify="center" align="center" h="70vh">
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={6}>
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <HStack spacing="3" mb="2">
               <Box p="2" bg="brand.50" color="brand.500" borderRadius="lg"><ArrowDownLeft size={20} /></Box>
               <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Incoming Shipments</Heading>
            </HStack>
            <Text color="gray.500" fontWeight="500">Accept products sent by the branch to update your stock</Text>
          </Box>
          <Button leftIcon={<RefreshCcw size={18} />} onClick={handleRefresh} isLoading={refreshing} variant="outline" borderRadius="xl">Sync</Button>
        </Flex>

        <Box bg="white" borderRadius="3xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="gray.100">
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50/50">
                <Tr>
                  <Th py="5">Dispatch Code</Th>
                  <Th py="5">Sender Branch</Th>
                  <Th py="5">Items</Th>
                  <Th py="5">Date</Th>
                  <Th py="5">Status</Th>
                  <Th py="5" textAlign="right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dispatches.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={20}>
                      <VStack spacing="3">
                        <Box p="4" bg="gray.50" borderRadius="full"><Truck size={40} color="#CBD5E0" /></Box>
                        <Text color="gray.400" fontWeight="700">No shipments found for you.</Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                  dispatches.map((dispatch) => (
                    <Tr key={dispatch._id} _hover={{ bg: 'gray.50/30' }}>
                      <Td>
                        <Text fontWeight="800" color="brand.500" fontSize="sm">{dispatch.trackingCode}</Text>
                        <Text fontSize="10px" color="gray.400" fontWeight="600">{dispatch.invoiceNo}</Text>
                      </Td>
                      <Td>
                        <HStack>
                          <Box w="8px" h="8px" borderRadius="full" bg="blue.400" />
                          <Text fontWeight="700" fontSize="xs">{dispatch.senderBranch?.name || 'Branch'}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Tag size="sm" variant="subtle" colorScheme="gray">
                          <TagLabel fontWeight="700">{dispatch.items?.length} Product Types</TagLabel>
                        </Tag>
                      </Td>
                      <Td>
                        <Text fontSize="xs" fontWeight="700">{moment(dispatch.createdAt).format('DD MMM, YYYY')}</Text>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={dispatch.status === 'Received' ? 'green' : 'orange'} 
                          variant="subtle" 
                          borderRadius="full" 
                          px="3"
                        >
                          {dispatch.status}
                        </Badge>
                      </Td>
                      <Td textAlign="right">
                        <HStack spacing="2" justify="flex-end">
                          <Button 
                            size="xs" 
                            leftIcon={<Eye size={12} />}
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => navigate(`/sales/dispatch-summary/${dispatch._id}`)}
                          >
                            Invoice
                          </Button>
                          <IconButton 
                            icon={<RefreshCcw size={16} />} 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => openDetails(dispatch)}
                          />
                          {dispatch.status !== 'Received' && (
                            <Button 
                              size="sm" 
                              colorScheme="brand" 
                              borderRadius="lg" 
                              leftIcon={<CheckCircle size={14} />}
                              onClick={() => handleReceiveStock(dispatch._id)}
                            >
                              Confirm Receipt
                            </Button>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* Dispatch Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="2xl">
            <ModalHeader fontWeight="900" color="secondary">Shipment Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedDispatch && (
                <VStack spacing="6" align="stretch">
                  <Flex justify="space-between" bg="gray.50" p="4" borderRadius="xl">
                     <VStack align="start" spacing="0">
                        <Text fontSize="10px" fontWeight="800" color="gray.400">TRACKING ID</Text>
                        <Text fontWeight="900" color="brand.500">{selectedDispatch.trackingCode}</Text>
                     </VStack>
                     <VStack align="end" spacing="0">
                        <Text fontSize="10px" fontWeight="800" color="gray.400">SENDER</Text>
                        <Text fontWeight="900">{selectedDispatch.senderBranch?.name}</Text>
                     </VStack>
                  </Flex>

                  <Box>
                    <Text fontSize="xs" fontWeight="800" color="gray.500" mb="3">ITEMS IN THIS SHIPMENT</Text>
                    <VStack spacing="2" align="stretch">
                      {selectedDispatch.items.map((item, idx) => (
                        <Flex key={idx} justify="space-between" align="center" p="3" border="1px solid" borderColor="gray.100" borderRadius="xl">
                           <HStack>
                              <Box p="2" bg="brand.50" color="brand.500" borderRadius="lg"><Package size={14} /></Box>
                              <Box>
                                 <Text fontWeight="700" fontSize="xs">{item.name}</Text>
                                 <Text fontSize="10px" color="gray.400">{item.sku}</Text>
                              </Box>
                           </HStack>
                           <Text fontWeight="900" fontSize="sm">{item.qty} Units</Text>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>

                  <Divider />
                  
                  <Flex justify="space-between" align="center">
                     <VStack align="start" spacing="0">
                        <Text fontSize="10px" fontWeight="800" color="gray.400">DISPATCH DATE</Text>
                        <Text fontSize="sm" fontWeight="700">{moment(selectedDispatch.createdAt).format('DD MMMM YYYY, hh:mm A')}</Text>
                     </VStack>
                     <Badge colorScheme="green" p="2" borderRadius="lg">
                        Total Units: {selectedDispatch.totalItems}
                     </Badge>
                  </Flex>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter gap="3">
              <Button onClick={onClose} variant="ghost" borderRadius="xl">Close</Button>
              {selectedDispatch?.status !== 'Received' && (
                <Button 
                  colorScheme="brand" 
                  borderRadius="xl" 
                  onClick={() => handleReceiveStock(selectedDispatch._id)}
                >
                  Receive All Stock
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

export default SalesRepReceivedStock;

