import React from 'react';
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
  Button
} from '@chakra-ui/react';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp
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

const data = [
  { month: 'Jan', total: 4000 },
  { month: 'Feb', total: 3000 },
  { month: 'Mar', total: 5000 },
  { month: 'Apr', total: 4500 },
  { month: 'May', total: 6000 },
  { month: 'Jun', total: 5500 },
  { month: 'Jul', total: 7000 },
  { month: 'Aug', total: 6500 },
  { month: 'Sep', total: 8000 },
  { month: 'Oct', total: 7500 },
  { month: 'Nov', total: 9000 },
  { month: 'Dec', total: 10000 },
];

const YearlyReport = () => {
  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Annual Growth Report</Heading>
            <Text fontSize="sm" color="gray.500">Yearly overview for 2023</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button size="sm" variant="outline" leftIcon={<Calendar size={16} />} flex={1}>2023</Button>
            <Button size="sm" colorScheme="brand" leftIcon={<Download size={16} />} flex={1}>Export</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap="6" mb="8">
          {[
            { label: 'Total Yearly Dispatches', value: '24,500', trend: 'increase', percentage: '28%', color: 'brand' },
            { label: 'Annual Revenue', value: '$2.4M', trend: 'increase', percentage: '35%', color: 'green' },
            { label: 'New Branches Added', value: '8', trend: 'increase', percentage: '12%', color: 'blue' },
          ].map((stat, idx) => (
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
          <Heading size="sm" mb="6" color="secondary">Monthly Growth Trend</Heading>
          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9F43" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF9F43" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#FF9F43" strokeWidth={4} fillOpacity={1} fill="url(#colorYear)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default YearlyReport;
