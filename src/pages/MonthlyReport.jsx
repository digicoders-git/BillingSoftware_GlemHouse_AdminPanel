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
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter
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

const data = [
  { week: 'Week 1', dispatches: 450 },
  { week: 'Week 2', dispatches: 520 },
  { week: 'Week 3', dispatches: 380 },
  { week: 'Week 4', dispatches: 610 },
];

const MonthlyReport = () => {
  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Monthly Performance Report</Heading>
            <Text fontSize="sm" color="gray.500">Analytics for October 2023</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button size="sm" variant="outline" leftIcon={<Calendar size={16} />} flex={1}>Select Month</Button>
            <Button size="sm" colorScheme="brand" leftIcon={<Download size={16} />} flex={1}>Export</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap="6" mb="8">
          {[
            { label: 'Monthly Dispatches', value: '1,960', trend: 'increase', percentage: '15%', color: 'brand' },
            { label: 'Monthly Revenue', value: '$185,400', trend: 'increase', percentage: '22%', color: 'green' },
            { label: 'Avg per Day', value: '63', trend: 'increase', percentage: '4%', color: 'blue' },
            { label: 'Fulfillment Rate', value: '98.4%', trend: 'increase', percentage: '0.5%', color: 'purple' },
          ].map((stat, idx) => (
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
          <Heading size="sm" mb="6" color="secondary">Weekly Dispatch Volume</Heading>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(255, 159, 67, 0.05)'}} />
                <Bar dataKey="dispatches" fill="#FF9F43" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default MonthlyReport;
