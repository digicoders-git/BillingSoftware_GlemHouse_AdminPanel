import React from 'react';
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
  HStack, 
  Button,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar,
  Filter
} from 'lucide-react';
import Layout from '../components/Layout';

const DailyReport = () => {
  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Daily Dispatch Report</Heading>
            <Text fontSize="sm" color="gray.500">Summary of all dispatches for today: {new Date().toLocaleDateString()}</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button size="sm" variant="outline" leftIcon={<Printer size={16} />} flex={1}>Print</Button>
            <Button size="sm" colorScheme="brand" leftIcon={<Download size={16} />} flex={1}>Download PDF</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap="6" mb="8">
          {[
            { label: 'Today\'s Dispatches', value: '142', trend: 'increase', percentage: '12%', color: 'brand' },
            { label: 'Today\'s Revenue', value: '$12,450', trend: 'increase', percentage: '8%', color: 'green' },
            { label: 'Pending Deliveries', value: '24', trend: 'decrease', percentage: '5%', color: 'orange' },
            { label: 'Cancelled Today', value: '2', trend: 'decrease', percentage: '1%', color: 'red' },
          ].map((stat, idx) => (
            <Box key={idx} className="premium-card" p="5">
              <Stat>
                <StatLabel color="gray.500" fontSize="xs" fontWeight="700">{stat.label}</StatLabel>
                <StatNumber fontSize="2xl" color="secondary">{stat.value}</StatNumber>
                <StatHelpText>
                  <StatArrow type={stat.trend} />
                  {stat.percentage} from yesterday
                </StatHelpText>
              </Stat>
            </Box>
          ))}
        </Grid>

        <Box className="premium-card">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50">
             <Heading size="sm" color="secondary">Dispatch Log</Heading>
          </Box>
          <Box overflowX="auto">
            <Table variant="simple" minW="600px">
              <Thead bg="gray.50">
              <Tr>
                <Th border="none">Time</Th>
                <Th border="none">Branch</Th>
                <Th border="none">Products</Th>
                <Th border="none">Qty</Th>
                <Th border="none">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[
                { time: '09:30 AM', branch: 'Downtown', products: 'iPhone 15 x 10', qty: 10, status: 'Delivered' },
                { time: '11:15 AM', branch: 'Westside', products: 'MacBook x 5', qty: 5, status: 'In Transit' },
                { time: '02:45 PM', branch: 'Central', products: 'Headphones x 50', qty: 50, status: 'Pending' },
              ].map((row, idx) => (
                <Tr key={idx}>
                  <Td borderColor="gray.100"><Text fontSize="sm" fontWeight="600">{row.time}</Text></Td>
                  <Td borderColor="gray.100"><Text fontSize="sm">{row.branch}</Text></Td>
                  <Td borderColor="gray.100"><Text fontSize="sm">{row.products}</Text></Td>
                  <Td borderColor="gray.100"><Text fontSize="sm" fontWeight="700">{row.qty}</Text></Td>
                  <Td borderColor="gray.100">
                    <Badge colorScheme={row.status === 'Delivered' ? 'green' : 'blue'} borderRadius="full" px="2">
                      {row.status}
                    </Badge>
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

import { Grid } from '@chakra-ui/react';
export default DailyReport;
