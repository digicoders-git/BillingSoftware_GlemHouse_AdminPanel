import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  HStack, 
  IconButton,
  Avatar,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Grid,
  SimpleGrid,
  VStack
} from '@chakra-ui/react';
import { 
  Package, 
  Download, 
  Filter, 
  EllipsisVertical as MoreVertical, 
  ArrowUpRight,
  Truck,
  Calendar,
  Eye,
  Printer,
  Search
} from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const DispatchStock = () => {
  const navigate = useNavigate();
  const dispatches = [
    { id: 'DSP-1024', branch: 'Downtown Branch', product: 'Apple iPhone 15', qty: '50 units', date: '2024-05-06', status: 'Delivered', priority: 'High' },
    { id: 'DSP-1025', branch: 'Westside Hub', product: 'Samsung Galaxy S24', qty: '30 units', date: '2024-05-06', status: 'In Transit', priority: 'Medium' },
    { id: 'DSP-1026', branch: 'Central Plaza', product: 'Sony Headphones', qty: '120 units', date: '2024-05-05', status: 'Pending', priority: 'Low' },
    { id: 'DSP-1027', branch: 'North Station', product: 'Dell Laptop XPS', qty: '15 units', date: '2024-05-05', status: 'Delivered', priority: 'High' },
    { id: 'DSP-1028', branch: 'East Coast Center', product: 'Logitech Mouse', qty: '200 units', date: '2024-05-04', status: 'Cancelled', priority: 'Low' },
  ];

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Total Dispatch Stock</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="400">Track and monitor all product dispatches across branches</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button leftIcon={<Printer size={16} />} variant="outline" borderRadius="xl" size="sm" color="gray.600">Print</Button>
            <Button leftIcon={<Package size={16} />} colorScheme="brand" borderRadius="xl" shadow="sm" size="sm" onClick={() => navigate('/record-dispatch')}>New Dispatch</Button>
          </HStack>
        </Flex>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" mb="10">
          {[
            { label: 'Total Dispatched', value: '4,520', icon: Truck, color: 'brand' },
            { label: 'In Transit', value: '840', icon: Package, color: 'blue' },
            { label: 'Delivered', value: '3,680', icon: ArrowUpRight, color: 'green' },
          ].map((stat, idx) => (
            <Box key={idx} className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-3px)', shadow: 'md' }}>
              <Flex align="center" gap="4">
                <Box bg={`${stat.color}.50`} p="3.5" borderRadius="16px" color={`${stat.color}.500`}>
                  <Icon as={stat.icon} fontSize="20" />
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.5px">{stat.label}</Text>
                  <Heading size="md" color="secondary" fontWeight="700">{stat.value}</Heading>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        <Box className="premium-card" overflow="hidden">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
               <Heading size="xs" color="secondary" fontWeight="700">Dispatch History</Heading>
               <HStack spacing="3">
                  <Button size="sm" variant="ghost" leftIcon={<Filter size={16} />} fontSize="xs" fontWeight="700">Filters</Button>
                  <Button size="sm" variant="ghost" leftIcon={<Download size={16} />} fontSize="xs" fontWeight="700">Download</Button>
               </HStack>
            </Flex>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50/50">
                <Tr>
                  <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Dispatch ID</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Branch</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Product</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Quantity</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Date</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                  <Th color="gray.400" border="none" py="4" px="8"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {dispatches.map((dsp) => (
                  <Tr key={dsp.id} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                    <Td borderColor="gray.100" py="4" px="8">
                       <Text fontWeight="700" color="brand.500" fontSize="xs">{dsp.id}</Text>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Avatar size="xs" name={dsp.branch} bg="secondary" color="white" />
                        <Text fontSize="xs" fontWeight="700" color="secondary">{dsp.branch}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontSize="xs" color="gray.600" fontWeight="600">{dsp.product}</Text></Td>
                    <Td borderColor="gray.100"><Text fontSize="xs" fontWeight="800" color="secondary">{dsp.qty}</Text></Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="1">
                        <Icon as={Calendar} size={12} color="gray.400" />
                        <Text fontSize="10px" color="gray.400" fontWeight="600">{dsp.date}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100">
                       <Badge 
                        colorScheme={dsp.status === 'Delivered' ? 'green' : dsp.status === 'In Transit' ? 'blue' : dsp.status === 'Pending' ? 'orange' : 'red'} 
                        borderRadius="full" 
                        px="2.5"
                        py="0.5"
                        variant="subtle"
                        fontSize="9px"
                        fontWeight="700"
                      >
                         {dsp.status}
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100" px="8" textAlign="right">
                      <Menu>
                        <MenuButton as={IconButton} icon={<MoreVertical size={14} />} size="xs" variant="ghost" borderRadius="full" />
                        <MenuList borderRadius="xl" shadow="2xl" border="none" p="1">
                          <MenuItem icon={<Eye size={12} />} fontSize="xs">View Details</MenuItem>
                          <MenuItem icon={<Download size={12} />} fontSize="xs">Download Invoice</MenuItem>
                          <MenuItem icon={<Truck size={12} />} fontSize="xs">Track Shipment</MenuItem>
                        </MenuList>
                      </Menu>
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

export default DispatchStock;
