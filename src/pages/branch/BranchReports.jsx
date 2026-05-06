import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  Grid,
  SimpleGrid,
  Icon,
  Badge
} from '@chakra-ui/react';
import { 
  Calendar, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  FileText,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import Layout from '../../components/Layout';

const BranchReports = () => {
  return (
    <Layout>
      <Box>
        <Box mb="8">
          <Heading size="lg" color="secondary" fontWeight="800">Branch Reports</Heading>
          <Text color="gray.500" mt="1">Access all your branch sales and inventory reports</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
          {[
            { 
              title: "Daily Sales Report", 
              desc: "View detailed report of today's sales and revenue", 
              icon: FileText, 
              color: "blue",
              to: "/branch/sales-history"
            },
            { 
              title: "Monthly Sales Report", 
              desc: "Monthly analysis of your branch performance", 
              icon: TrendingUp, 
              color: "green",
              to: "/branch/performance"
            },
            { 
              title: "Stock Movement Report", 
              desc: "Track how products are moving in/out of branch", 
              icon: ShoppingBag, 
              color: "orange",
              to: "/branch/inventory-log"
            },
            { 
              title: "Category-wise Sales", 
              desc: "See which categories are performing best", 
              icon: PieChartIcon, 
              color: "purple",
              to: "/branch/performance"
            },
            { 
              title: "Low Stock Report", 
              desc: "List of all items that need immediate restocking", 
              icon: FileText, 
              color: "red",
              to: "/branch/low-stock"
            }
          ].map((item, idx) => (
            <Box key={idx} className="premium-card" p="6" cursor="pointer" _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }} transition="all 0.3s">
              <Flex align="center" gap="4" mb="4">
                <Box p="3" borderRadius="xl" bg={`${item.color}.50`} color={`${item.color}.500`}>
                  <Icon as={item.icon} size={24} />
                </Box>
                <Badge colorScheme={item.color} variant="subtle" borderRadius="full" px="2">Report</Badge>
              </Flex>
              <Heading size="sm" mb="2" color="secondary">{item.title}</Heading>
              <Text fontSize="sm" color="gray.500" mb="6">{item.desc}</Text>
              <Button size="sm" variant="ghost" colorScheme={item.color} rightIcon={<ArrowRight size={16} />}>
                View Report
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  );
};

export default BranchReports;
