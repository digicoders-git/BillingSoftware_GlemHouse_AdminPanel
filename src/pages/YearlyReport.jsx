import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  Button,
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
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import API from '../utils/api';

const YearlyReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: {}, chartData: [], year: '' });
  const toast = useToast();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const { data } = await API.get('/reports/yearly');
      setData(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching yearly report",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data.chartData.length === 0) return;
    
    const headers = ['Month', 'Revenue'];
    const csvData = data.chartData.map(row => [
      row.name,
      row.value
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Yearly_Growth_Report_${data.year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Yearly growth data has been downloaded as CSV.",
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
    { label: 'Total Yearly Dispatches', value: data.stats.yearlyDispatches, trend: 'increase', percentage: '28%', color: 'brand' },
    { label: 'Annual Revenue', value: `₹${((data.stats.yearlyRevenue || 0) / 1000).toFixed(1)}k`, trend: 'increase', percentage: '35%', color: 'green' },
    { label: 'Growth Rate', value: data.stats.growthRate, trend: 'increase', percentage: '12%', color: 'blue' },
  ];

  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Annual Growth Report</Heading>
            <Text fontSize="sm" color="gray.500">Yearly overview for {data.year}</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }} className="no-print">
            <Button size="sm" variant="outline" leftIcon={<Printer size={16} />} flex={1} onClick={() => window.print()}>Print</Button>
            <Button size="sm" colorScheme="brand" leftIcon={<Download size={16} />} flex={1} onClick={handleExport}>Export</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap="6" mb="8" className="no-print">
          {statConfig.map((stat, idx) => (
            <Box key={idx} className="premium-card" p="6">
              <Stat>
                <StatLabel color="gray.500" fontSize="xs" fontWeight="700">{stat.label}</StatLabel>
                <StatNumber fontSize="3xl" color="secondary" mt="1">{stat.value}</StatNumber>
                <StatHelpText mt="1">
                  <StatArrow type={stat.trend} />
                  {stat.percentage} vs previous year
                </StatHelpText>
              </Stat>
            </Box>
          ))}
        </Grid>

        <Box className="premium-card" p="6">
          <Heading size="sm" mb="6" color="secondary">Monthly Revenue Trend (₹)</Heading>
          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#298AC6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#298AC6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#298AC6" strokeWidth={4} fillOpacity={1} fill="url(#colorYear)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default YearlyReport;
