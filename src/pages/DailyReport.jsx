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
  HStack, 
  Button,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { 
  Download, 
  Printer
} from 'lucide-react';
import Layout from '../components/Layout';
import API from '../utils/api';

const DailyReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: {}, log: [] });
  const toast = useToast();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const { data } = await API.get('/reports/daily');
      setData(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching report",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data.log.length === 0) return;
    
    const headers = ['Time', 'Branch', 'Products', 'Qty', 'Status'];
    const csvData = data.log.map(row => [
      row.time,
      row.branch,
      `"${row.products}"`,
      row.qty,
      row.status
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Daily_Dispatch_Report_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Bhai, daily report has been downloaded as CSV.",
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

  const statConfig = [
    { label: 'Today\'s Dispatches', value: data.stats.todayDispatches, trend: 'increase', percentage: '12%', color: 'brand' },
    { label: 'Today\'s Revenue', value: `₹${(data.stats.todayRevenue || 0).toLocaleString()}`, trend: 'increase', percentage: '8%', color: 'green' },
    { label: 'Pending Deliveries', value: data.stats.pendingDeliveries, trend: 'decrease', percentage: '5%', color: 'orange' },
    { label: 'Received Today', value: data.stats.receivedToday, trend: 'increase', percentage: '15%', color: 'blue' },
  ];

  return (
    <Layout>
      <Box sx={{
        '@media print': {
          '.no-print': { display: 'none' },
          'nav': { display: 'none' },
          'header': { display: 'none' },
          '.premium-card': { boxShadow: 'none', border: 'none', p: 0 },
          'body': { bg: 'white' }
        }
      }}>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Daily Dispatch Report</Heading>
            <Text fontSize="sm" color="gray.500">Summary of all dispatches for today: {new Date().toLocaleDateString()}</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }} className="no-print">
            <Button size="sm" variant="outline" leftIcon={<Printer size={16} />} flex={1} onClick={() => window.print()}>Print</Button>
            <Button size="sm" colorScheme="brand" leftIcon={<Download size={16} />} flex={1} onClick={handleExport}>Export CSV</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap="6" mb="8" className="no-print">
          {statConfig.map((stat, idx) => (
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
             <Heading size="sm" color="secondary">Daily Dispatch Log</Heading>
          </Box>
          <Box overflowX="auto">
            <Table variant="simple" minW="600px">
              <Thead bg="gray.50/50">
              <Tr>
                <Th border="none">Time</Th>
                <Th border="none">Branch</Th>
                <Th border="none">Products</Th>
                <Th border="none">Qty</Th>
                <Th border="none">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.log.length > 0 ? data.log.map((row, idx) => (
                <Tr key={idx}>
                  <Td borderColor="gray.100"><Text fontSize="sm" fontWeight="600">{row.time}</Text></Td>
                  <Td borderColor="gray.100"><Text fontSize="sm" color="gray.600">{row.branch}</Text></Td>
                  <Td borderColor="gray.100"><Text fontSize="xs" color="brand.500" fontWeight="700">{row.products}</Text></Td>
                  <Td borderColor="gray.100"><Text fontSize="sm" fontWeight="700">{row.qty}</Text></Td>
                  <Td borderColor="gray.100">
                    <Badge colorScheme={row.status === 'Received' ? 'green' : row.status === 'Dispatched' ? 'blue' : 'orange'} borderRadius="full" px="2" variant="subtle" fontSize="9px">
                      {row.status}
                    </Badge>
                  </Td>
                </Tr>
              )) : (
                <Tr><Td colSpan="5" textAlign="center" py="10" color="gray.400">No dispatches recorded today</Td></Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
    </Layout>
  );
};

export default DailyReport;
