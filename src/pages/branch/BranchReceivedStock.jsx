import React from 'react';
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
  Icon
} from '@chakra-ui/react';
import { 
  DownloadCloud, 
  CheckCircle, 
  Clock, 
  ArrowDownLeft,
  Package
} from 'lucide-react';
import Layout from '../../components/Layout';

const BranchReceivedStock = () => {
  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Received Products</Heading>
            <Text fontSize="sm" color="gray.500">Track shipments received from the main warehouse</Text>
          </Box>
          <Button leftIcon={<DownloadCloud size={18} />} variant="outline" borderRadius="xl">
            Export History
          </Button>
        </Flex>

        <Box className="premium-card">
          <Box overflowX="auto">
            <Table variant="simple" minW="800px">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.500" border="none">Shipment ID</Th>
                  <Th color="gray.500" border="none">Product Details</Th>
                  <Th color="gray.500" border="none">Quantity</Th>
                  <Th color="gray.500" border="none">Received Date</Th>
                  <Th color="gray.500" border="none">Status</Th>
                  <Th color="gray.500" border="none">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  { id: 'SHP-9821', product: 'iPhone 15 Pro', qty: 20, date: '2023-10-22 02:30 PM', status: 'Verified' },
                  { id: 'SHP-9822', product: 'MacBook Air M2', qty: 5, date: '2023-10-23 10:15 AM', status: 'Pending Verification' },
                  { id: 'SHP-9823', product: 'AirPods Pro', qty: 50, date: '2023-10-24 11:45 AM', status: 'Verified' },
                ].map((row, idx) => (
                  <Tr key={idx} _hover={{ bg: 'gray.50/50' }}>
                    <Td borderColor="gray.100">
                      <Text fontWeight="700" color="brand.500" fontSize="sm">{row.id}</Text>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Icon as={Package} size={16} color="gray.400" />
                        <Text fontWeight="600" fontSize="sm">{row.product}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack>
                        <Badge variant="subtle" colorScheme="blue" p="1" borderRadius="md">
                           <ArrowDownLeft size={12} />
                        </Badge>
                        <Text fontWeight="700">{row.qty} Units</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontSize="xs" color="gray.500">{row.date}</Text></Td>
                    <Td borderColor="gray.100">
                      <Badge 
                        colorScheme={row.status === 'Verified' ? 'green' : 'orange'} 
                        variant="subtle"
                        borderRadius="full" 
                        px="3"
                        fontSize="10px"
                      >
                        <HStack spacing="1">
                           <Icon as={row.status === 'Verified' ? CheckCircle : Clock} size={10} />
                           <Text>{row.status}</Text>
                        </HStack>
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100">
                      <Button size="xs" colorScheme="brand" isDisabled={row.status === 'Verified'}>
                        Verify Stock
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default BranchReceivedStock;
