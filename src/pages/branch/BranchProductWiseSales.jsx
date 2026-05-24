import { useState, useEffect } from 'react';
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
  Badge,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Progress,
  IconButton,
  Avatar,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { 
  Search, 
  Download, 
  TrendingUp, 
  BarChart2, 
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  MoreVertical,
  Calendar,
  Filter,
  Eye,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import moment from 'moment';
import Layout from '../../components/Layout';
import API from '../../utils/api';

const BranchProductWiseSales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ productWise: [], weeklyTrend: [], stats: {}, sales: [] });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const toast = useToast();

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await API.get('/branch-sales');
      setData(response.data);
    } catch (error) {
      toast({ title: "Failed to load sales data", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const [filteredData, setFilteredData] = useState({ productWise: [], weeklyTrend: [], stats: {} });

  useEffect(() => {
    if (data.sales) {
      applyDateFilter();
    }
  }, [dateFilter, data.sales]);

  const applyDateFilter = () => {
    if (!data.sales) return;
    const now = moment();
    let start, end;

    switch (dateFilter) {
      case 'Today':
        start = now.clone().startOf('day');
        end = now.clone().endOf('day');
        break;
      case 'Yesterday':
        start = now.clone().subtract(1, 'days').startOf('day');
        end = now.clone().subtract(1, 'days').endOf('day');
        break;
      case 'Last 7 Days':
        start = now.clone().subtract(7, 'days').startOf('day');
        end = now.clone().endOf('day');
        break;
      case 'Last 30 Days':
        start = now.clone().subtract(30, 'days').startOf('day');
        end = now.clone().endOf('day');
        break;
      default:
        start = moment(0);
        end = now.clone().endOf('day');
    }

    const filteredSales = data.sales.filter(s => {
      const saleDate = moment(s.date);
      return saleDate.isBetween(start, end, null, '[]');
    });

    const productMap = {};
    filteredSales.forEach(s => {
      s.items.forEach(item => {
        if (!productMap[item.name]) {
          productMap[item.name] = { name: item.name, sold: 0, revenue: 0, growth: 0, status: 'Stable' };
        }
        productMap[item.name].sold += item.qty;
        productMap[item.name].revenue += item.total || (item.qty * item.price);
      });
    });

    const duration = end.diff(start, 'days') + 1;
    const prevStart = start.clone().subtract(duration, 'days');
    const prevEnd = start.clone().subtract(1, 'seconds');
    
    const prevSales = data.sales.filter(s => moment(s.date).isBetween(prevStart, prevEnd, null, '[]'));
    const prevProductMap = {};
    prevSales.forEach(s => {
      s.items.forEach(item => {
        if (!prevProductMap[item.name]) prevProductMap[item.name] = 0;
        prevProductMap[item.name] += item.qty;
      });
    });

    const finalProductWise = Object.values(productMap).map(p => {
      const prevQty = prevProductMap[p.name] || 0;
      if (prevQty > 0) {
        p.growth = Math.round(((p.sold - prevQty) / prevQty) * 100);
      } else {
        p.growth = p.sold > 0 ? 100 : 0;
      }
      
      if (p.growth > 10) p.status = 'Increasing';
      else if (p.growth < -10) p.status = 'Decreasing';
      else p.status = 'Stable';
      
      return p;
    });

    const trend = [];
    const daysToTrack = Math.min(duration, 30);
    for (let i = daysToTrack - 1; i >= 0; i--) {
      const d = end.clone().subtract(i, 'days');
      const dateStr = d.format('YYYY-MM-DD');
      const dayName = d.format('ddd');
      
      const daySales = filteredSales
        .filter(s => moment(s.date).format('YYYY-MM-DD') === dateStr)
        .reduce((sum, s) => sum + s.totalQty, 0);
      
      trend.push({ day: dayName, sales: daySales });
    }

    setFilteredData({
      productWise: finalProductWise,
      weeklyTrend: trend,
      stats: {
        totalSold: filteredSales.reduce((sum, s) => sum + s.totalQty, 0),
        revenue: filteredSales.reduce((sum, s) => sum + s.totalAmount, 0),
        avgSales: (filteredSales.reduce((sum, s) => sum + s.totalQty, 0) / (duration || 1)).toFixed(1)
      }
    });
  };

  const currentProducts = (filteredData.productWise || []).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(p => statusFilter === 'All' ? true : p.status === statusFilter);

  const sortedBySold = [...(filteredData.productWise || [])].sort((a, b) => b.sold - a.sold);
  const sortedByRevenue = [...(filteredData.productWise || [])].sort((a, b) => b.revenue - a.revenue);
  
  const topProduct = sortedBySold[0] || { name: '-', sold: 0, revenue: 0, growth: 0 };
  const topRevenueProduct = sortedByRevenue[0] || { name: '-', sold: 0, revenue: 0, growth: 0 };
  const avgSales = filteredData.stats.avgSales || 0;
  const avgGrowth = filteredData.productWise?.length > 0 ? (filteredData.productWise.reduce((sum, p) => sum + p.growth, 0) / filteredData.productWise.length).toFixed(1) : 0;

  const handleViewDetails = (product) => {
    const productSales = (data.sales || []).filter(s => 
      s.items.some(item => item.name === product.name)
    ).map(s => {
      const item = s.items.find(i => i.name === product.name);
      return {
        ...s,
        qty: item.qty,
        itemTotal: item.total || (item.qty * item.price)
      };
    });
    
    setSelectedProduct({ ...product, history: productSales });
    setIsModalOpen(true);
  };

  const handleDownloadReport = () => {
    if (currentProducts.length === 0) return;
    
    const headers = ['Product Name', 'Units Sold', 'Revenue (₹)', 'Growth %', 'Status'];
    const csvData = currentProducts.map(p => [
      `"${p.name}"`,
      p.sold,
      p.revenue,
      `${p.growth}%`,
      p.status
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Product_Sales_Report_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Filtered product sales report has been downloaded.",
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

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Product Sales Tracking</Heading>
            <Text color="gray.500" fontWeight="400" fontSize="sm">Analyze individual product performance and sales velocity</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Menu>
              <MenuButton as={Button} leftIcon={<Calendar size={16} />} rightIcon={<ChevronDown size={14} />} variant="outline" borderRadius="xl" size="sm">
                {dateFilter}
              </MenuButton>
              <MenuList borderRadius="xl" shadow="xl" border="none" p="1">
                <MenuItem fontSize="xs" fontWeight="700" onClick={() => setDateFilter('Today')}>Today</MenuItem>
                <MenuItem fontSize="xs" fontWeight="700" onClick={() => setDateFilter('Yesterday')}>Yesterday</MenuItem>
                <MenuItem fontSize="xs" fontWeight="700" onClick={() => setDateFilter('Last 7 Days')}>Last 7 Days</MenuItem>
                <MenuItem fontSize="xs" fontWeight="700" onClick={() => setDateFilter('Last 30 Days')}>Last 30 Days</MenuItem>
                <MenuDivider />
                <MenuItem fontSize="xs" fontWeight="700">Custom Range...</MenuItem>
              </MenuList>
            </Menu>
            <Button leftIcon={<Download size={16} />} colorScheme="brand" borderRadius="xl" shadow="sm" size="sm" onClick={handleDownloadReport}>Export report</Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 2, md: 2, lg: 4 }} spacing="6" mb="10">
           {[
              { label: 'MOST SOLD', name: topProduct.name, value: `${topProduct.sold} Units`, revenue: `₹${topProduct.revenue?.toLocaleString()}`, trend: `${topProduct.growth}%`, color: 'green', icon: ShoppingBag },
              { label: 'TOP REVENUE', name: topRevenueProduct.name, value: `${topRevenueProduct.sold} Units`, revenue: `₹${topRevenueProduct.revenue?.toLocaleString()}`, trend: `${topRevenueProduct.growth}%`, color: 'blue', icon: TrendingUp },
              { label: 'DAILY SPEED', name: `${avgSales} Units`, value: 'Avg Sales / Day', revenue: 'Active', trend: 'Good', color: 'orange', icon: BarChart2 },
              { label: 'GROWTH', name: `${avgGrowth > 0 ? '+' : ''}${avgGrowth}%`, value: 'Average Trend', revenue: 'Report', trend: avgGrowth > 0 ? 'Up' : 'Down', color: 'brand', icon: TrendingUp, isDark: true },
           ].map((stat, idx) => (
              <Box key={idx} className="premium-card" p="5" position="relative" overflow="hidden" transition="all 0.3s" _hover={{ transform: 'translateY(-3px)', shadow: 'md' }} bg={stat.isDark ? 'brand.500' : 'white'} color={stat.isDark ? 'white' : 'inherit'}>
                 <VStack align="start" spacing="3">
                    <Badge bg={stat.isDark ? 'whiteAlpha.200' : `${stat.color}.50`} color={stat.isDark ? 'white' : `${stat.color}.600`} borderRadius="full" px="2.5" py="0.5" fontSize="9px" fontWeight="700">{stat.label}</Badge>
                    <Box>
                       <Heading size="xs" fontWeight="700" noOfLines={1}>{stat.name}</Heading>
                       <Text fontSize="10px" opacity="0.6" fontWeight="600" mt="0.5">{stat.value}</Text>
                    </Box>
                    <HStack spacing="2">
                       <Text fontSize="xl" fontWeight="800" color={stat.isDark ? 'white' : 'brand.500'}>{stat.revenue}</Text>
                       {stat.trend && !stat.isDark && <Badge colorScheme={parseFloat(stat.trend) > 0 ? "green" : "red"} variant="ghost" fontSize="10px" fontWeight="700">{stat.trend}</Badge>}
                    </HStack>
                 </VStack>
              </Box>
           ))}
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6" mb="10">
           <Box gridColumn={{ lg: "span 2" }} className="premium-card" p="6">
              <Flex justify="space-between" align="center" mb="6">
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Weekly Sales Velocity</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Daily units sold across products</Text>
                 </VStack>
                 <Select maxW="130px" borderRadius="lg" size="xs" bg="background" fontWeight="600">
                    <option>This Week</option>
                    <option>Last Week</option>
                 </Select>
              </Flex>
              <Box h="300px">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.weeklyTrend || []}>
                       <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#298AC6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#298AC6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#A0AAB4', fontSize: 10, fontWeight: 600}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#A0AAB4', fontSize: 10, fontWeight: 600}} />
                       <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                       <Area type="monotone" dataKey="sales" stroke="#298AC6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </Box>
           </Box>

           <Box className="premium-card" p="6" bg="secondary" color="white">
              <VStack align="stretch" spacing="5">
                 <Heading size="xs" fontWeight="700">Sales Insights</Heading>
                 <Box p="4" bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
                    <HStack align="start" spacing="3">
                       <Icon as={TrendingUp} size={16} color="brand.400" mt="1" />
                       <VStack align="start" spacing="0">
                          <Text fontSize="xs" fontWeight="700">High Demand Alert!</Text>
                          <Text fontSize="10px" opacity="0.7">{topProduct.name} is selling very fast. Make sure to restock.</Text>
                       </VStack>
                    </HStack>
                 </Box>
                 <Box p="4" bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
                    <HStack align="start" spacing="3">
                       <Icon as={ArrowDownRight} size={16} color="blue.400" mt="1" />
                       <VStack align="start" spacing="0">
                          <Text fontSize="xs" fontWeight="700">Top Revenue Generator</Text>
                          <Text fontSize="10px" opacity="0.7">{topRevenueProduct.name} generated ₹{topRevenueProduct.revenue?.toLocaleString()} in sales.</Text>
                       </VStack>
                    </HStack>
                 </Box>
                 <Button colorScheme="brand" size="sm" borderRadius="lg" mt="2" rightIcon={<ArrowRight size={16} />} onClick={() => window.location.href = '/branch/product-sales'}>
                    View All Sales
                 </Button>
              </VStack>
           </Box>
        </Grid>

        <Box className="premium-card" overflow="hidden">
           <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
              <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
                 <VStack align="start" spacing="0">
                    <Heading size="xs" color="secondary" fontWeight="700">Performance Log</Heading>
                    <Text fontSize="10px" color="gray.400" fontWeight="500">Detailed unit and revenue tracking</Text>
                 </VStack>
                 <HStack spacing="3">
                    <InputGroup maxW="250px" size="sm">
                       <InputLeftElement pointerEvents="none">
                          <Search size={16} color="#919EAB" />
                       </InputLeftElement>
                       <Input 
                          placeholder="Search products..." 
                          bg="white" 
                          borderRadius="lg" 
                          border="1px solid" 
                          borderColor="gray.100"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </InputGroup>
                    <Menu>
                      <MenuButton as={Button} leftIcon={<Filter size={16} />} rightIcon={<ChevronDown size={14} />} variant="outline" borderRadius="lg" size="sm" px="4">
                        Filter: {statusFilter}
                      </MenuButton>
                      <MenuList borderRadius="xl" shadow="xl" border="none" p="1">
                        <MenuItem fontSize="xs" fontWeight="700" onClick={() => setStatusFilter('All')}>All Trends</MenuItem>
                        <MenuDivider />
                        <MenuItem fontSize="xs" fontWeight="700" color="green.500" onClick={() => setStatusFilter('Increasing')}>Increasing</MenuItem>
                        <MenuItem fontSize="xs" fontWeight="700" color="blue.500" onClick={() => setStatusFilter('Stable')}>Stable</MenuItem>
                        <MenuItem fontSize="xs" fontWeight="700" color="red.500" onClick={() => setStatusFilter('Decreasing')}>Decreasing</MenuItem>
                      </MenuList>
                    </Menu>
                    <Button leftIcon={<Download size={16} />} colorScheme="brand" variant="solid" borderRadius="lg" size="sm" px="4" onClick={handleDownloadReport}>Export Report</Button>
                 </HStack>
              </Flex>
           </Box>

           <Box overflowX="auto">
              <Table variant="simple">
                 <Thead bg="gray.50/50">
                    <Tr>
                       <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Product</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Units</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Revenue</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Trend</Th>
                       <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                       <Th color="gray.400" border="none" py="4" px="8"></Th>
                    </Tr>
                 </Thead>
                 <Tbody>
                    {currentProducts.length > 0 ? currentProducts.map((product, idx) => (
                       <Tr key={idx} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                          <Td borderColor="gray.100" py="4" px="8">
                             <HStack spacing="3">
                                <Avatar size="xs" icon={<ShoppingBag size={14} />} bg="brand.50" color="brand.500" borderRadius="lg" />
                                <Text fontWeight="700" color="secondary" fontSize="xs">{product.name}</Text>
                             </HStack>
                          </Td>
                          <Td borderColor="gray.100">
                             <VStack align="start" spacing="1">
                                <Text fontWeight="800" fontSize="xs">{product.sold}</Text>
                                <Progress value={Math.min((product.sold / (topProduct.sold || 1)) * 100, 100)} size="xs" w="60px" colorScheme="brand" borderRadius="full" />
                             </VStack>
                          </Td>
                          <Td borderColor="gray.100"><Text fontWeight="700" color="secondary" fontSize="xs">₹{product.revenue.toLocaleString()}</Text></Td>
                          <Td borderColor="gray.100">
                             <HStack spacing="1" color={product.growth > 0 ? 'green.500' : 'red.500'}>
                                <Icon as={product.growth > 0 ? ArrowUpRight : ArrowDownRight} size={12} />
                                <Text fontWeight="700" fontSize="10px">{Math.abs(product.growth)}%</Text>
                             </HStack>
                          </Td>
                          <Td borderColor="gray.100">
                             <Badge 
                                colorScheme={product.status === 'Increasing' ? 'green' : product.status === 'Stable' ? 'blue' : 'red'} 
                                variant="subtle" 
                                borderRadius="full" 
                                px="2" 
                                py="0.5" 
                                fontSize="9px" 
                                fontWeight="700"
                             >
                                {product.status}
                             </Badge>
                          </Td>
                          <Td borderColor="gray.100" py="4" px="8" textAlign="right">
                             <HStack justify="flex-end" spacing="1">
                                <IconButton 
                                  aria-label="View" 
                                  icon={<Eye size={14} />} 
                                  variant="ghost" 
                                  size="xs" 
                                  color="brand.500" 
                                  borderRadius="full" 
                                  onClick={() => handleViewDetails(product)}
                                />
                                <IconButton aria-label="Actions" icon={<MoreVertical size={14} />} variant="ghost" size="xs" borderRadius="full" />
                             </HStack>
                          </Td>
                       </Tr>
                    )) : (
                      <Tr>
                        <Td colSpan="6" textAlign="center" py="10" color="gray.500">No product sales found.</Td>
                      </Tr>
                    )}
                 </Tbody>
              </Table>
           </Box>
        </Box>
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader borderBottom="1px solid" borderColor="gray.100">
            <HStack spacing="3">
              <Avatar size="sm" icon={<ShoppingBag size={16} />} bg="brand.50" color="brand.500" />
              <VStack align="start" spacing="0">
                <Text fontSize="md">{selectedProduct?.name}</Text>
                <Text fontSize="xs" color="gray.500" fontWeight="normal">Product Sales History</Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p="6">
            <SimpleGrid columns={3} spacing="4" mb="8">
              <Box p="4" bg="gray.50" borderRadius="xl">
                <Text fontSize="xs" color="gray.500" mb="1">Total Units</Text>
                <Text fontWeight="800" fontSize="lg">{selectedProduct?.sold}</Text>
              </Box>
              <Box p="4" bg="gray.50" borderRadius="xl">
                <Text fontSize="xs" color="gray.500" mb="1">Total Revenue</Text>
                <Text fontWeight="800" fontSize="lg">₹{selectedProduct?.revenue?.toLocaleString()}</Text>
              </Box>
              <Box p="4" bg="gray.50" borderRadius="xl">
                <Text fontSize="xs" color="gray.500" mb="1">Growth</Text>
                <HStack color={selectedProduct?.growth > 0 ? 'green.500' : 'red.500'}>
                   <Icon as={selectedProduct?.growth > 0 ? ArrowUpRight : ArrowDownRight} size={14} />
                   <Text fontWeight="800" fontSize="lg">{Math.abs(selectedProduct?.growth || 0)}%</Text>
                </HStack>
              </Box>
            </SimpleGrid>

            <Text fontWeight="700" fontSize="sm" mb="4">Recent Sales Transactions</Text>
            <Box maxH="300px" overflowY="auto">
              <Table size="sm" variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th fontSize="10px">Invoice</Th>
                    <Th fontSize="10px">Date</Th>
                    <Th fontSize="10px" isNumeric>Qty</Th>
                    <Th fontSize="10px" isNumeric>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedProduct?.history?.map((sale, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs" fontWeight="600">{sale.invoiceId}</Td>
                      <Td fontSize="xs">{sale.date}</Td>
                      <Td fontSize="xs" isNumeric fontWeight="700">{sale.qty}</Td>
                      <Td fontSize="xs" isNumeric fontWeight="700">₹{sale.itemTotal?.toLocaleString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor="gray.100">
            <Button variant="ghost" mr={3} onClick={() => setIsModalOpen(false)} borderRadius="xl">
              Close
            </Button>
            <Button colorScheme="brand" borderRadius="xl" leftIcon={<Download size={16} />}>
              Download Log
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default BranchProductWiseSales;
