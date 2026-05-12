import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge,
  Icon,
  Spinner,
  useToast,
  VStack
} from '@chakra-ui/react';
import { 
  ArrowDownLeft,
  Package,
  Download,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const BranchReceivedStock = () => {
  const [loading, setLoading] = useState(true);
  const [dispatches, setDispatches] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDispatches();
  }, []);

  const fetchDispatches = async () => {
    try {
      const { data } = await API.get('/dispatches');
      // Set to dispatches array from pagination response
      setDispatches(data.dispatches || []);
    } catch (error) {
      toast({
        title: "Error fetching received stock",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStock = async (id) => {
    setUpdatingId(id);
    try {
      await API.patch(`/dispatches/${id}/status`, { status: 'Received' });
      toast({
        title: "Stock Verified",
        description: "The shipment has been successfully verified.",
        status: "success",
      });
      fetchDispatches();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = () => {
    if (dispatches.length === 0) return;
    
    const headers = ['Shipment ID', 'Items', 'Quantity', 'Dispatched Date', 'Status'];
    const csvData = dispatches.map(d => [
      d.reference || `SHP-${d._id.slice(-4).toUpperCase()}`,
      `"${d.items.map(i => `${i.name} (x${i.qty})`).join(', ')}"`,
      d.totalItems,
      moment(d.createdAt).format('YYYY-MM-DD hh:mm A'),
      d.status
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Received_Stock_History_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Bhai, received stock history has been downloaded as CSV.",
      status: "success",
    });
  };

  if (loading) {
    return (
      <Layout>
        <Flex justify="center" align="center" h="70vh">
          <Spinner size="xl" color="brand.500" />
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Received Products</Heading>
            <Text fontSize="sm" color="gray.500">Track shipments received from the main warehouse</Text>
          </Box>
          <HStack spacing="3">
            <Button variant="ghost" colorScheme="brand" onClick={() => navigate('/branch/manage-products')}>
              View Inventory
            </Button>
            <Button leftIcon={<Download size={18} />} variant="outline" borderRadius="xl" onClick={handleExport}>
              Export History
            </Button>
          </HStack>
        </Flex>

        <Box className="premium-card">
          <Box overflowX="auto">
            <Table variant="simple" minW="800px">
              <Thead bg="background">
                <Tr>
                  <Th color="gray.500" border="none">Shipment ID</Th>
                  <Th color="gray.500" border="none">Product Details</Th>
                  <Th color="gray.500" border="none">Quantity</Th>
                  <Th color="gray.500" border="none">Dispatched Date</Th>
                  <Th color="gray.500" border="none">Status</Th>
                  <Th color="gray.500" border="none" textAlign="right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dispatches.length > 0 ? (
                  dispatches.map((row, idx) => (
                    <Tr key={row._id} _hover={{ bg: 'gray.50/50' }}>
                      <Td borderColor="gray.100">
                        <Text fontWeight="700" color="brand.500" fontSize="sm">{row.reference || `SHP-${row._id.slice(-4).toUpperCase()}`}</Text>
                      </Td>
                      <Td borderColor="gray.100">
                        <VStack align="start" spacing="2">
                          {row.items.map((item, index) => (
                            <HStack key={index} spacing="2">
                              <Icon as={Package} size={16} color="gray.400" />
                              <Text fontWeight="600" fontSize="sm">
                                {item.name} <Text as="span" color="gray.500" fontSize="xs">x {item.qty}</Text>
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Td>
                      <Td borderColor="gray.100">
                        <HStack>
                          <Badge variant="subtle" colorScheme="blue" p="1" borderRadius="md">
                             <ArrowDownLeft size={12} />
                          </Badge>
                          <Text fontWeight="700">{row.totalItems} Units</Text>
                        </HStack>
                      </Td>
                      <Td borderColor="gray.100"><Text fontSize="xs" color="gray.500">{moment(row.createdAt).format('YYYY-MM-DD hh:mm A')}</Text></Td>
                      <Td borderColor="gray.100">
                        <Badge 
                          colorScheme={row.status === 'Received' ? 'green' : 'orange'} 
                          variant="subtle"
                          borderRadius="full" 
                          px="3"
                          fontSize="10px"
                        >
                          <HStack spacing="1">
                             <Icon as={row.status === 'Received' ? CheckCircle : Clock} size={10} />
                             <Text>{row.status === 'Received' ? 'Verified' : 'Pending Verification'}</Text>
                          </HStack>
                        </Badge>
                      </Td>
                      <Td borderColor="gray.100">
                        <HStack justify="end" spacing="2">
                          <Button 
                            size="xs" 
                            leftIcon={<Eye size={12} />}
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => navigate(`/branch/dispatch-summary/${row._id}`)}
                          >
                            Invoice
                          </Button>
                          <Button 
                            size="xs" 
                            colorScheme="brand" 
                            isDisabled={row.status === 'Received'}
                            isLoading={updatingId === row._id}
                            onClick={() => handleVerifyStock(row._id)}
                            leftIcon={row.status === 'Received' ? <CheckCircle size={12} /> : undefined}
                          >
                            {row.status === 'Received' ? 'Verified' : 'Verify Stock'}
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="6" textAlign="center" py="10" color="gray.500">
                      No shipments found.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default BranchReceivedStock;
