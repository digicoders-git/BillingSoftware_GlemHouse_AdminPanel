import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
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
  Calendar,
  Printer
} from 'lucide-react';
import Layout from '../components/Layout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import API from '../utils/api';

const MonthlyReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: {}, chartData: [], monthName: '' });
  const toast = useToast();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const { data } = await API.get('/reports/monthly');
      setData(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching monthly report",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data.chartData.length === 0) return;
    
    const headers = ['Week', 'Dispatches'];
    const csvData = data.chartData.map(row => [
      row.week,
      row.dispatches
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Monthly_Performance_Report_${data.monthName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Monthly performance data has been downloaded as CSV.",
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
    { label: 'Monthly Dispatches', value: data.stats.monthlyDispatches, trend: 'increase', percentage: '15%', color: 'brand' },
    { label: 'Monthly Revenue', value: `₹${(data.stats.monthlyRevenue || 0).toLocaleString()}`, trend: 'increase', percentage: '22%', color: 'green' },
    { label: 'Avg per Day', value: data.stats.avgPerDay, trend: 'increase', percentage: '4%', color: 'blue' },
    { label: 'Fulfillment Rate', value: data.stats.fulfillmentRate, trend: 'increase', percentage: '0.5%', color: 'purple' },
  ];

  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Monthly Performance Report</Heading>
            <Text fontSize="sm" color="gray.500">Analytics for {data.monthName}</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }} className="no-print">
            <Button size="sm" variant="outline" leftIcon={<Printer size={16} />} flex={1} onClick={() => window.print()}>Print</Button>
            <Button size="sm" colorScheme="brand" leftIcon={<Download size={16} />} flex={1} onClick={handleExport}>Export</Button>
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
                  {stat.percentage} vs last month
                </StatHelpText>
              </Stat>
            </Box>
          ))}
        </Grid>

        <Box className="premium-card" p="6" mb="8">
          <Heading size="sm" mb="6" color="secondary">Weekly Dispatch Volume (Units)</Heading>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(41, 138, 198, 0.05)'}} />
                <Bar dataKey="dispatches" fill="#298AC6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default MonthlyReport;
