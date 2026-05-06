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
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Grid
} from '@chakra-ui/react';
import { 
  Search, 
  Download, 
  Calendar, 
  Receipt,
  User,
  ShoppingBag,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import Layout from '../../components/Layout';

const BranchSalesHistory = () => {
  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Daily Sales Records</Heading>
            <Text fontSize="sm" color="gray.500">Track your sold stock and customer transactions</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button leftIcon={<Calendar size={18} />} variant="outline" borderRadius="xl" flex={1}>Filter by Date</Button>
            <Button leftIcon={<Download size={18} />} colorScheme="brand" borderRadius="xl" flex={1}>Export Sales</Button>
          </HStack>
        </Flex>

        {/* Quick Sales Stats */}
        <Grid templateColumns={{ base: "1fr", sm: "repeat(4, 1fr)" }} gap="6" mb="8">
           <Box className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
              <Flex align="center" gap="4">
                <Box p="3" bg="blue.50" color="blue.500" borderRadius="xl">
                  <ShoppingBag size={20} />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">Total Sold</Text>
                  <Text fontSize="xl" fontWeight="800" color="secondary">156 Units</Text>
                </Box>
              </Flex>
           </Box>
           <Box className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
              <Flex align="center" gap="4">
                <Box p="3" bg="green.50" color="green.500" borderRadius="xl">
                  <TrendingUp size={20} />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">Revenue</Text>
                  <Text fontSize="xl" fontWeight="800" color="secondary">$4,250</Text>
                </Box>
              </Flex>
           </Box>
           <Box className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
              <Flex align="center" gap="4">
                <Box p="3" bg="orange.50" color="orange.500" borderRadius="xl">
                  <Receipt size={20} />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">Invoices</Text>
                  <Text fontSize="xl" fontWeight="800" color="secondary">24 Bills</Text>
                 </Box>
              </Flex>
           </Box>
           <Box className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }} bg="brand.500" color="white">
              <Flex align="center" gap="4">
                <Box p="3" bg="whiteAlpha.200" borderRadius="xl">
                  <TrendingUp size={20} color="white" />
                </Box>
                <Box>
                  <Text fontSize="xs" color="whiteAlpha.800" fontWeight="700" textTransform="uppercase">Avg Value</Text>
                  <Text fontSize="xl" fontWeight="800">$177.08</Text>
                </Box>
              </Flex>
           </Box>
        </Grid>

        {/* Sales Table */}
        <Box className="premium-card">
          <Box p="4" borderBottom="1px solid" borderColor="gray.50">
            <Flex direction={{ base: 'column', sm: 'row' }} gap="4" justify="space-between">
              <Heading size="sm" color="secondary">Product-wise Sales Log</Heading>
              <InputGroup maxW={{ base: 'full', sm: '300px' }}>
                <InputLeftElement pointerEvents="none">
                  <Search size={18} color="#637381" />
                </InputLeftElement>
                <Input placeholder="Search invoice or product..." bg="gray.50" borderRadius="xl" border="none" _focus={{ bg: 'white', shadow: 'md' }} />
              </InputGroup>
            </Flex>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple" minW="800px">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.500" border="none">Invoice ID</Th>
                  <Th color="gray.500" border="none">Product Details</Th>
                  <Th color="gray.500" border="none">Customer</Th>
                  <Th color="gray.500" border="none">Qty Sold</Th>
                  <Th color="gray.500" border="none">Total Amount</Th>
                  <Th color="gray.500" border="none">Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  { id: 'INV-101', product: 'iPhone 15 Pro', customer: 'John Doe', qty: 1, amount: '$999', time: '10:30 AM' },
                  { id: 'INV-102', product: 'AirPods Pro 2', customer: 'Sarah Connor', qty: 2, amount: '$498', time: '11:15 AM' },
                  { id: 'INV-103', product: 'MacBook Air M2', customer: 'Mike Ross', qty: 1, amount: '$1,299', time: '12:45 PM' },
                  { id: 'INV-104', product: 'USB-C Cable', customer: 'Rachel Zane', qty: 3, amount: '$57', time: '02:00 PM' },
                  { id: 'INV-105', product: 'iPhone 15 Pro', customer: 'Harvey Specter', qty: 1, amount: '$999', time: '03:30 PM' },
                ].map((row, idx) => (
                  <Tr key={idx} _hover={{ bg: 'gray.50/50' }}>
                    <Td borderColor="gray.100">
                      <Text fontWeight="700" color="brand.500" fontSize="sm">{row.id}</Text>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Box p="1" bg="gray.50" borderRadius="md">
                           <BarChart2 size={14} color="#FF9F43" />
                        </Box>
                        <Text fontWeight="600" fontSize="sm">{row.product}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Icon as={User} size={14} color="gray.400" />
                        <Text fontSize="sm">{row.customer}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontWeight="700">{row.qty} Units</Text></Td>
                    <Td borderColor="gray.100"><Text fontWeight="800" color="secondary">{row.amount}</Text></Td>
                    <Td borderColor="gray.100"><Text fontSize="xs" color="gray.500">{row.time}</Text></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Flex p="4" justify="space-between" align="center" bg="gray.50/30" borderTop="1px solid" borderColor="gray.100">
            <Text fontSize="xs" color="gray.500">Showing 5 of 24 entries</Text>
            <HStack spacing="2">
              <Button size="xs" variant="outline">Prev</Button>
              <Button size="xs" colorScheme="brand">1</Button>
              <Button size="xs" variant="outline">2</Button>
              <Button size="xs" variant="outline">Next</Button>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default BranchSalesHistory;
