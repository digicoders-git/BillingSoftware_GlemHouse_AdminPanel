import React, { useState } from 'react';
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
  Icon,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  VStack,
  SimpleGrid,
  Tooltip,
  IconButton
} from '@chakra-ui/react';
import { 
  ArrowRight, 
  Package, 
  Calendar, 
  MapPin,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Truck,
  Clock,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Layout from '../components/Layout';

const ProductMovement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const movements = [
    { id: 'MOV-1021', product: 'Apple iPhone 15 Pro', sku: 'APL-IP15-P', from: 'Main Warehouse', to: 'Downtown Branch', qty: 50, time: '10:30 AM', status: 'Completed', priority: 'High' },
    { id: 'MOV-1022', product: 'Sony WH-1000XM5', sku: 'SNY-XM5', from: 'Main Warehouse', to: 'Westside Hub', qty: 100, time: '11:15 AM', status: 'In Transit', priority: 'Medium' },
    { id: 'MOV-1023', product: 'MacBook Air M2', sku: 'APL-MBA-M2', from: 'Downtown Branch', to: 'Central Plaza', qty: 5, time: '12:45 PM', status: 'Completed', priority: 'High' },
    { id: 'MOV-1024', product: 'Samsung Galaxy S24', sku: 'SAM-S24', from: 'Main Warehouse', to: 'North Station', qty: 30, time: '02:00 PM', status: 'Pending', priority: 'Low' },
    { id: 'MOV-1025', product: 'AirPods Pro 2', sku: 'APL-APP-2', from: 'Central Plaza', to: 'East Coast', qty: 45, time: '03:30 PM', status: 'In Transit', priority: 'Medium' },
    { id: 'MOV-1026', product: 'Logitech MX Master', sku: 'LOG-MX3', from: 'Main Warehouse', to: 'Westside Hub', qty: 80, time: '04:15 PM', status: 'Completed', priority: 'Low' },
  ];

  const stats = [
    { label: 'Active Transfers', value: '12', icon: Truck, color: 'blue' },
    { label: 'Completed Today', value: '48', icon: CheckCircle2, color: 'green' },
    { label: 'Pending Approval', value: '05', icon: Clock, color: 'orange' },
    { label: 'Issues Flagged', value: '01', icon: AlertCircle, color: 'red' },
  ];

  const filteredMovements = movements.filter(mov => 
    mov.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Product Movement Tracker</Heading>
            <Text color="gray.500" fontWeight="400" fontSize="sm">Real-time monitoring of stock transfers and inter-branch logistics</Text>
          </Box>
          <HStack spacing="3">
            <Button leftIcon={<Calendar size={16} />} variant="outline" borderRadius="xl" size="sm">View History</Button>
            <Button colorScheme="brand" borderRadius="xl" shadow="sm" size="sm">New Transfer</Button>
          </HStack>
        </Flex>

        {/* Live Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="6" mb="10">
          {stats.map((stat, idx) => (
            <Box key={idx} className="premium-card" p="5" transition="all 0.3s" _hover={{ transform: 'translateY(-3px)', shadow: 'md' }}>
              <Flex align="center" gap="4">
                <Box bg={`${stat.color}.50`} p="3.5" borderRadius="16px" color={`${stat.color}.500`}>
                  <Icon as={stat.icon} fontSize="20" />
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.5px">{stat.label}</Text>
                  <Heading size="md" color="secondary" mt="1" fontWeight="700">{stat.value}</Heading>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        <Box className="premium-card" overflow="hidden">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
             <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
                <HStack spacing="3">
                   <Heading size="xs" color="secondary" fontWeight="700">Live Movement Feed</Heading>
                   <Badge colorScheme="green" variant="subtle" borderRadius="full" px="2" py="0.5" fontSize="9px" fontWeight="700">Live</Badge>
                </HStack>
                <HStack spacing="3">
                   <InputGroup maxW="250px" size="sm">
                      <InputLeftElement pointerEvents="none">
                         <Search size={16} color="#919EAB" />
                      </InputLeftElement>
                      <Input 
                        placeholder="Search..." 
                        bg="white" 
                        border="1px solid" 
                        borderColor="gray.100" 
                        borderRadius="lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </InputGroup>
                   <Button leftIcon={<Filter size={16} />} variant="outline" borderRadius="xl" size="sm">Filters</Button>
                </HStack>
             </Flex>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50/50">
                <Tr>
                  <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">ID & Time</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Product</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Transfer Path</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Quantity</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                  <Th color="gray.400" border="none" py="4" px="8"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredMovements.map((mov) => (
                  <Tr key={mov.id} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                    <Td borderColor="gray.100" py="4" px="8">
                       <VStack align="start" spacing="0">
                          <Text fontWeight="700" color="brand.500" fontSize="xs">{mov.id}</Text>
                          <HStack spacing="1">
                             <Icon as={Clock} size={10} color="gray.400" />
                             <Text fontSize="10px" color="gray.400" fontWeight="600">{mov.time}</Text>
                          </HStack>
                       </VStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="3">
                        <Box p="2" bg="gray.50" borderRadius="12px">
                           <Package size={16} color="#1B2850" />
                        </Box>
                        <Box>
                          <Text fontWeight="700" color="secondary" fontSize="xs">{mov.product}</Text>
                          <Text fontSize="10px" color="gray.400" fontWeight="600">{mov.sku}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="3">
                        <Badge variant="subtle" bg="blue.50" color="blue.600" borderRadius="md" px="2" py="0.5" fontSize="9px" fontWeight="700">
                           {mov.from}
                        </Badge>
                        <Icon as={ArrowRight} size={12} color="gray.300" />
                        <Badge variant="subtle" bg="purple.50" color="purple.600" borderRadius="md" px="2" py="0.5" fontSize="9px" fontWeight="700">
                           {mov.to}
                        </Badge>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100"><Text fontSize="xs" fontWeight="800" color="secondary">{mov.qty} Units</Text></Td>
                    <Td borderColor="gray.100">
                      <Badge 
                        colorScheme={mov.status === 'Completed' ? 'green' : mov.status === 'In Transit' ? 'blue' : 'orange'} 
                        borderRadius="full" 
                        px="2.5"
                        py="0.5"
                        variant="subtle"
                        fontSize="9px"
                        fontWeight="700"
                      >
                         <HStack spacing="1">
                            <Box w="5px" h="5px" borderRadius="full" bg={mov.status === 'Completed' ? 'green.500' : mov.status === 'In Transit' ? 'blue.500' : 'orange.500'} />
                            <Text>{mov.status}</Text>
                         </HStack>
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100" px="8">
                       <IconButton icon={<MoreVertical size={14} />} variant="ghost" size="xs" borderRadius="full" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Box p="4" bg="gray.50/20" borderTop="1px solid" borderColor="gray.100">
             <Flex justify="space-between" align="center">
                <Text fontSize="10px" color="gray.400" fontWeight="600">Showing {filteredMovements.length} active movements</Text>
                <HStack spacing="2">
                   <Button size="xs" variant="outline" fontSize="10px" h="24px">Previous</Button>
                   <Button size="xs" colorScheme="brand" fontSize="10px" h="24px">1</Button>
                   <Button size="xs" variant="outline" fontSize="10px" h="24px">Next</Button>
                </HStack>
             </Flex>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default ProductMovement;
