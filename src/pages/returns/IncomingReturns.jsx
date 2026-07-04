import { useState, useEffect } from 'react';
import { 
  Box, Flex, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, 
  Tag, Spinner, useToast, Button, HStack, useDisclosure} from '@chakra-ui/react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import API from '../../utils/api';
import Layout from '../../components/Layout';
import moment from 'moment';
import ReturnInvoiceModal from '../../components/ReturnInvoiceModal';

const IncomingReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const { data } = await API.get('/returns?type=incoming');
      setReturns(data);
    } catch (error) {
      toast({ title: "Failed to load returns", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getSenderName = (ret) => {
    if (ret.senderType === 'Branch') return ret.senderBranch?.name || 'Branch';
    if (ret.senderType === 'SalesRep') return ret.senderSalesRep?.name || 'Superstockist';
    if (ret.senderType === 'Distributor') return ret.senderDistributor?.name || 'Distributor';
    return 'Unknown';
  };

  const processReturn = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this return?`)) return;
    setProcessing(true);
    try {
      await API.patch(`/returns/${id}/status`, { status });
      toast({ title: `Return ${status}`, status: "success" });
      fetchReturns();
      if (isOpen) onClose();
    } catch (error) {
      toast({ title: error.response?.data?.message || `Failed to ${status}`, status: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const openDetails = (ret) => {
    setSelectedReturn(ret);
    onOpen();
  };

  return (
    <Layout>
      <Box pb="10">
        <Heading size="lg" color="secondary" fontWeight="900" mb="2">Incoming Returns</Heading>
        <Text fontSize="sm" color="gray.500" mb="8">Process stock returned from your downstream network</Text>

        <Box bg="white" borderRadius="2xl" shadow="sm" overflowX="auto" p="4">
          {loading ? (
            <Flex justify="center" p="10"><Spinner /></Flex>
          ) : (
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Return Code</Th>
                  <Th>Date</Th>
                  <Th>Returned By</Th>
                  <Th>Items</Th>
                  <Th>Status</Th>
                  <Th textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {returns.length > 0 ? returns.map(ret => (
                  <Tr key={ret._id}>
                    <Td><Text fontWeight="700" color="brand.500">{ret.returnCode}</Text></Td>
                    <Td><Text fontSize="sm">{moment(ret.createdAt).format('DD MMM, YYYY')}</Text></Td>
                    <Td>
                      <Text fontWeight="600">{getSenderName(ret)}</Text>
                      <Text fontSize="xs" color="gray.400">{ret.senderType}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm" fontWeight="600">{ret.items.length} Product(s)</Text>
                      <Text fontSize="xs" color="gray.500">{ret.items.reduce((a, b) => a + b.qty, 0)} Total Qty</Text>
                    </Td>
                    <Td>
                      <Tag 
                        colorScheme={ret.status === 'Received' ? 'green' : ret.status === 'Rejected' ? 'red' : 'orange'}
                        size="sm" fontWeight="700"
                      >
                        {ret.status}
                      </Tag>
                    </Td>
                    <Td textAlign="right">
                      <Button size="xs" colorScheme="blue" variant="solid" leftIcon={<Eye size={14} />} onClick={() => openDetails(ret)}>
                        View
                      </Button>
                    </Td>
                  </Tr>
                )) : (
                  <Tr><Td colSpan={6} textAlign="center" py="10" color="gray.500">No incoming returns</Td></Tr>
                )}
              </Tbody>
            </Table>
          )}
        </Box>

        <ReturnInvoiceModal
          isOpen={isOpen}
          onClose={onClose}
          returnData={selectedReturn}
          getSenderName={getSenderName}
          actionButtons={
            selectedReturn ? (
              <>
                {selectedReturn.status === 'Pending' && (
                  <HStack spacing="4" justify="end">
                    <Button colorScheme="red" variant="outline" onClick={() => processReturn(selectedReturn._id, 'Rejected')} isLoading={processing} leftIcon={<XCircle size={16} />}>
                      Reject Return
                    </Button>
                    <Button colorScheme="green" onClick={() => processReturn(selectedReturn._id, 'Received')} isLoading={processing} leftIcon={<CheckCircle size={16} />}>
                      Accept & Receive Stock
                    </Button>
                  </HStack>
                )}
                {selectedReturn.status !== 'Pending' && (
                  <Box textAlign="center">
                    <Tag colorScheme={selectedReturn.status === 'Received' ? 'green' : 'red'} size="lg">
                      This return was {selectedReturn.status}
                    </Tag>
                  </Box>
                )}
              </>
            ) : null
          }
        />
      </Box>
    </Layout>
  );
};

export default IncomingReturns;
