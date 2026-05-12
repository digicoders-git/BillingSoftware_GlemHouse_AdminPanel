import { useEffect, useState } from 'react';
import { 
  Box, 
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
  HStack, 
  Flex, 
  useToast,
  Spinner,
  Icon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  VStack,
  Tag,
  Grid
} from '@chakra-ui/react';
import { Package, Truck, Calendar, CheckCircle, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';

const DistributorReceivedStock = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dispatches, setDispatches] = useState([]);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchDispatches();
  }, []);

  const fetchDispatches = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/dispatches');
      // Filter for dispatches where I am the receiver and status is Pending/Shipped
      // (Backend should already filter based on role, but we filter for relevant ones)
      setDispatches(data.dispatches || []);
    } catch (error) {
      toast({
        title: "Error fetching dispatches",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveStock = async (id) => {
    try {
      await API.patch(`/dispatches/${id}/status`, { status: 'Received' });
      toast({
        title: "Stock Received Successfully",
        description: "Inventory has been updated in your warehouse.",
        status: "success",
      });
      fetchDispatches();
      onClose();
    } catch (error) {
      toast({
        title: "Failed to receive stock",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
      });
    }
  };

  const viewDetails = (dispatch) => {
    setSelectedDispatch(dispatch);
    onOpen();
  };

  return (
    <Layout>
      <Box pb="10">
        <Box mb="8">
          <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">Incoming Shipments</Heading>
          <Text color="gray.500" fontWeight="500">Track and receive stock sent by Sales Representatives</Text>
        </Box>

        <Box className="premium-card" overflow="hidden">
          {loading ? (
            <Flex justify="center" align="center" py="20">
              <Spinner size="xl" color="brand.500" />
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th py="5">Reference #</Th>
                    <Th py="5">From (Sender)</Th>
                    <Th py="5">Items</Th>
                    <Th py="5">Dispatch Date</Th>
                    <Th py="5">Status</Th>
                    <Th py="5" textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dispatches.map((dsp) => (
                    <Tr key={dsp._id} _hover={{ bg: 'gray.50/50' }}>
                      <Td>
                        <VStack align="start" spacing="0">
                          <Text fontWeight="800" color="secondary">{dsp.invoiceNo}</Text>
                          <Text fontSize="xs" color="gray.400">{dsp.trackingCode}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Icon as={Truck} size={14} color="brand.500" />
                          <Text fontWeight="700" fontSize="sm">{dsp.senderSalesRep?.name || 'Sales Rep'}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge borderRadius="full" px="3" colorScheme="blue" variant="subtle">
                           {dsp.items.length} Products
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm" fontWeight="600">{moment(dsp.createdAt).format('DD MMM YYYY')}</Text>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={dsp.status === 'Received' ? 'green' : (dsp.status === 'Shipped' ? 'blue' : 'orange')}
                          variant="solid"
                          borderRadius="lg"
                          fontSize="10px"
                        >
                          {dsp.status}
                        </Badge>
                      </Td>
                      <Td textAlign="right">
                        <HStack spacing="2" justify="flex-end">
                          <Button 
                            size="xs" 
                            leftIcon={<Eye size={12} />}
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => navigate(`/distributor/dispatch-summary/${dsp._id}`)}
                          >
                            Invoice
                          </Button>
                          <IconButton 
                            icon={<Eye size={18} />} 
                            variant="ghost" 
                            colorScheme="brand" 
                            size="sm" 
                            onClick={() => viewDetails(dsp)}
                          />
                          {dsp.status !== 'Received' && (
                            <Button 
                              size="sm" 
                              colorScheme="brand" 
                              leftIcon={<CheckCircle size={16} />}
                              onClick={() => handleReceiveStock(dsp._id)}
                              borderRadius="lg"
                            >
                              Receive
                            </Button>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {dispatches.length === 0 && (
                <Flex direction="column" align="center" py="20">
                  <Icon as={Package} size={40} color="gray.200" mb="4" />
                  <Text color="gray.400" fontWeight="600">No incoming shipments found</Text>
                </Flex>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Dispatch Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="3xl" p="4">
          <ModalHeader>
            <VStack align="start" spacing="0">
              <Heading size="md" color="secondary">Shipment Details</Heading>
              <Text fontSize="sm" color="gray.400" fontWeight="500">Ref: {selectedDispatch?.invoiceNo}</Text>
            </VStack>
          </ModalHeader>
          <ModalBody>
            {selectedDispatch && (
              <VStack spacing="6" align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap="4">
                   <Box>
                      <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">Sender Info</Text>
                      <Text fontWeight="800" color="secondary">{selectedDispatch.senderSalesRep?.name}</Text>
                      <Text fontSize="xs" color="gray.500">Sales ID: {selectedDispatch.senderSalesRep?.salesId}</Text>
                   </Box>
                   <Box>
                      <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase">Dispatch Time</Text>
                      <Text fontWeight="800" color="secondary">{moment(selectedDispatch.createdAt).format('LL')}</Text>
                      <Text fontSize="xs" color="gray.500">{moment(selectedDispatch.createdAt).format('hh:mm A')}</Text>
                   </Box>
                </Grid>

                <Divider />

                <Box>
                   <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" mb="4">Product List</Text>
                   <VStack spacing="3" align="stretch">
                      {selectedDispatch.items.map((item, i) => (
                        <Flex key={i} justify="space-between" align="center" p="3" bg="gray.50" borderRadius="xl">
                           <HStack>
                              <Box w="8px" h="8px" borderRadius="full" bg="brand.500" />
                              <Text fontWeight="700" fontSize="sm">{item.product?.name || 'Product'}</Text>
                           </HStack>
                           <HStack spacing="6">
                              <Text fontSize="xs" color="gray.500">Qty: <Text as="span" fontWeight="900" color="secondary">{item.qty}</Text></Text>
                              <Text fontSize="xs" fontWeight="900" color="brand.500">₹{(item.qty * (item.price || 0)).toLocaleString()}</Text>
                           </HStack>
                        </Flex>
                      ))}
                   </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter gap="3">
            <Button variant="ghost" onClick={onClose} borderRadius="xl">Close</Button>
            {selectedDispatch?.status !== 'Received' && (
              <Button colorScheme="brand" onClick={() => handleReceiveStock(selectedDispatch?._id)} borderRadius="xl">
                Accept & Add to Inventory
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default DistributorReceivedStock;
