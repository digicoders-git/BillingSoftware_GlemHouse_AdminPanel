import React, { useState, useEffect } from 'react';
import { 
  Box, Flex, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, 
  Tag, Spinner, useToast, Button, useDisclosure
} from '@chakra-ui/react';
import { Eye } from 'lucide-react';
import API from '../../utils/api';
import Layout from '../../components/Layout';
import moment from 'moment';
import ReturnInvoiceModal from '../../components/ReturnInvoiceModal';

const ReturnHistory = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const { data } = await API.get('/returns?type=outgoing');
      setReturns(data);
    } catch (error) {
      toast({ title: "Failed to load returns", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getReceiverName = (ret) => {
    if (ret.receiverType === 'Admin') return 'Admin (Factory)';
    if (ret.receiverType === 'Branch') return ret.receiverBranch?.name || 'Branch';
    if (ret.receiverType === 'SalesRep') return ret.receiverSalesRep?.name || 'Superstockist';
    return 'Unknown';
  };

  return (
    <Layout>
      <Box pb="10">
        <Heading size="lg" color="secondary" fontWeight="900" mb="2">My Returns</Heading>
        <Text fontSize="sm" color="gray.500" mb="8">History of stock you have returned</Text>

        <Box bg="white" borderRadius="2xl" shadow="sm" overflowX="auto" p="4">
          {loading ? (
            <Flex justify="center" p="10"><Spinner /></Flex>
          ) : (
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Return Code</Th>
                  <Th>Date</Th>
                  <Th>Sent To</Th>
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
                      <Text fontWeight="600">{getReceiverName(ret)}</Text>
                      <Text fontSize="xs" color="gray.400">{ret.receiverType}</Text>
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
                      <Button size="xs" colorScheme="blue" variant="solid" leftIcon={<Eye size={14} />} onClick={() => { setSelectedReturn(ret); onOpen(); }}>
                        View Slip
                      </Button>
                    </Td>
                  </Tr>
                )) : (
                  <Tr><Td colSpan={6} textAlign="center" py="10" color="gray.500">No returns found</Td></Tr>
                )}
              </Tbody>
            </Table>
          )}
        </Box>
        
        <ReturnInvoiceModal
          isOpen={isOpen}
          onClose={onClose}
          returnData={selectedReturn}
          getReceiverName={getReceiverName}
        />
      </Box>
    </Layout>
  );
};

export default ReturnHistory;
