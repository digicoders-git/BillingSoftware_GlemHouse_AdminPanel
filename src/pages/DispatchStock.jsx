import React, { useState, useEffect } from 'react';
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
  VStack,
  IconButton,
  Avatar,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Spinner,
  useToast
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
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { 
  MenuDivider
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { pdfTemplate } from '../utils/pdfTemplate';
import { downloadInvoiceAsJpg } from '../utils/downloadInvoice';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  useDisclosure,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
} from '@chakra-ui/react';

const DispatchStock = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchDispatches();
  }, [page, statusFilter]);

  const fetchDispatches = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/dispatches?pageNumber=${page}&status=${statusFilter}`);
      setDispatches(data.dispatches);
      setTotalPages(data.pages);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching dispatches",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'received': return 'green';
      case 'dispatched': return 'blue';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  const handleDownloadInvoice = async (dsp) => {
    setDownloading(true);
    try {
      // Create invoice data structure compatible with pdfTemplate
      const invoiceData = {
        invoiceNumber: dsp.invoiceNo || `DSP-${dsp._id.slice(-6).toUpperCase()}`,
        date: new Date(dsp.date).toLocaleDateString(),
        customerName: dsp.receiverBranch?.name || dsp.receiverSalesRep?.name || 'Receiver',
        customerPhone: dsp.receiverBranch?.branchId || dsp.receiverSalesRep?.salesId || '',
        paymentMethod: dsp.method,
        items: dsp.items.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          total: item.qty * item.price,
          expiryDate: item.expiryDate || '',
          hsn: item.hsn || '',
          batch: item.batch || ''
        })),
        subtotal: dsp.taxableAmount || dsp.totalAmount,
        tax: dsp.gstAmount || 0,
        discount: 0,
        totalAmount: dsp.totalAmount,
        isGstEnabled: dsp.billingType === 'With GST',
        billingType: dsp.billingType,
        senderType: dsp.senderType,
        receiverType: dsp.receiverType
      };

      const html = pdfTemplate(invoiceData);
      await downloadInvoiceAsJpg(html, `Dispatch_${invoiceData.invoiceNumber}.jpg`);
      
      toast({
        title: "Download Started",
        description: "Your dispatch invoice is being downloaded.",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        status: "error",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleExport = () => {
    if (dispatches.length === 0) return;
    
    const headers = ['Dispatch ID', 'From', 'To', 'Method', 'Items', 'Value', 'Date', 'Status'];
    const csvData = dispatches.map(d => [
      `DSP-${d._id.slice(-6).toUpperCase()}`,
      d.senderType === 'Admin' ? 'Admin' : (d.senderBranch?.name || 'Branch'),
      d.receiverBranch?.name || d.receiverSalesRep?.name || 'Unknown',
      d.method,
      d.totalItems,
      d.totalAmount,
      new Date(d.date).toLocaleDateString(),
      d.status
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Dispatch_History_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Dispatch history has been downloaded as CSV.",
      status: "success",
    });
  };

  const handleTrackShipment = (dsp) => {
    setSelectedDispatch(dsp);
    onOpen();
  };

  const steps = [
    { title: 'Pending', description: 'Order Placed' },
    { title: 'Dispatched', description: 'In Transit' },
    { title: 'Received', description: 'At Branch' },
  ];

  const getActiveStep = (status) => {
    switch (status) {
      case 'Received': return 3;
      case 'Dispatched': return 2;
      case 'Pending': return 1;
      default: return 0;
    }
  };

  // Calculate stats
  const totalDispatched = total;
  const inTransit = dispatches.filter(dsp => dsp.status === 'Pending' || dsp.status === 'Dispatched').length;
  const received = dispatches.filter(dsp => dsp.status === 'Received').length;

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Total Dispatch Stock</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="400">Track and monitor all product dispatches across Branches</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <IconButton 
              aria-label="Refresh" 
              icon={<RotateCcw size={16} />} 
              variant="outline" 
              borderRadius="xl" 
              size="sm" 
              onClick={fetchDispatches}
              isLoading={loading}
            />
            <Button leftIcon={<Printer size={16} />} variant="outline" borderRadius="xl" size="sm" color="gray.600">Print</Button>
            <Button
              leftIcon={<Package size={16} />} 
              colorScheme="brand" 
              borderRadius="xl" 
              shadow="sm" 
              size="sm"
              onClick={() => navigate('/admin/transfer-stock')}
            >
              Transfer Stock
            </Button>
          </HStack>
        </Flex>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" mb="10">
          {[
            { label: 'Total Shipments', value: totalDispatched, icon: Truck, color: 'brand' },
            { label: 'In Transit', value: inTransit, icon: Package, color: 'blue' },
            { label: 'Received', value: received, icon: ArrowUpRight, color: 'green' },
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
                  <Menu>
                    <MenuButton 
                      as={Button} 
                      size="sm" 
                      variant="ghost" 
                      leftIcon={<Filter size={16} />} 
                      rightIcon={<ChevronDown size={14} />}
                      fontSize="xs" 
                      fontWeight="700"
                    >
                      Filter: {statusFilter}
                    </MenuButton>
                    <MenuList borderRadius="xl" shadow="xl" border="none" p="1">
                      <MenuItem fontSize="xs" fontWeight="700" onClick={() => setStatusFilter('All')}>All Dispatches</MenuItem>
                      <MenuDivider />
                      <MenuItem fontSize="xs" fontWeight="700" color="orange.500" onClick={() => setStatusFilter('Pending')}>Pending</MenuItem>
                      <MenuItem fontSize="xs" fontWeight="700" color="blue.500" onClick={() => setStatusFilter('Dispatched')}>Dispatched</MenuItem>
                      <MenuItem fontSize="xs" fontWeight="700" color="green.500" onClick={() => setStatusFilter('Received')}>Received</MenuItem>
                    </MenuList>
                  </Menu>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    leftIcon={<Download size={16} />} 
                    fontSize="xs" 
                    fontWeight="700"
                    onClick={handleExport}
                  >
                    Download
                  </Button>
               </HStack>
            </Flex>
          </Box>

          <Box overflowX="auto">
            {loading ? (
              <Flex justify="center" align="center" py="20">
                <Spinner color="brand.500" />
              </Flex>
            ) : (
              <Table variant="simple">
                <Thead bg="gray.50/50">
                  <Tr>
                    <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Dispatch ID</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Route (From → To)</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Method</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Items / Value</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Date</Th>
                    <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                    <Th color="gray.400" border="none" py="4" px="8"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dispatches.length > 0 ? dispatches.map((dsp) => (
                    <Tr key={dsp._id} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                      <Td borderColor="gray.100" py="4" px="8">
                        <Text fontWeight="700" color="brand.500" fontSize="xs">DSP-{dsp._id.slice(-4).toUpperCase()}</Text>
                      </Td>
                      <Td borderColor="gray.100">
                        <VStack align="start" spacing="0">
                          <HStack spacing="2">
                            <Badge colorScheme="gray" fontSize="9px" variant="outline">FROM</Badge>
                            <Text fontSize="xs" fontWeight="700" color="gray.600">
                              {dsp.senderType === 'Admin' ? 'Main Warehouse (Admin)' : (dsp.senderBranch?.name || dsp.senderSalesRep?.name || 'Unknown Source')}
                            </Text>
                          </HStack>
                          <HStack spacing="2" mt="1">
                            <Badge colorScheme="brand" fontSize="9px">TO</Badge>
                            <Text fontSize="xs" fontWeight="800" color="secondary">
                              {dsp.receiverBranch?.name || dsp.receiverSalesRep?.name || dsp.receiverDistributor?.name || 'Unknown Destination'}
                            </Text>
                          </HStack>
                        </VStack>
                      </Td>
                      <Td borderColor="gray.100"><Text fontSize="xs" color="gray.600" fontWeight="600">{dsp.method}</Text></Td>
                      <Td borderColor="gray.100">
                        <VStack align="start" spacing="0">
                          <Text fontSize="xs" fontWeight="800" color="secondary">{dsp.totalItems} Units</Text>
                          <Text fontSize="10px" color="gray.400">
                             {dsp.billingType === 'Transfer' ? 'Transfer' : `₹${(dsp.totalAmount || 0).toLocaleString()}`}
                          </Text>
                        </VStack>
                      </Td>
                      <Td borderColor="gray.100">
                        <HStack spacing="1">
                          <Icon as={Calendar} size={12} color="gray.400" />
                          <Text fontSize="10px" color="gray.400" fontWeight="600">{new Date(dsp.date).toLocaleDateString()}</Text>
                        </HStack>
                      </Td>
                      <Td borderColor="gray.100">
                         <Badge 
                          colorScheme={getStatusColor(dsp.status)} 
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
                            <MenuItem icon={<Eye size={12} />} fontSize="xs" onClick={() => navigate(`/dispatch-summary/${dsp._id}`)}>View Details</MenuItem>
                            <MenuItem icon={<Download size={12} />} fontSize="xs" onClick={() => handleDownloadInvoice(dsp)} isDisabled={downloading}>Download Invoice</MenuItem>
                            <MenuItem icon={<Truck size={12} />} fontSize="xs" onClick={() => handleTrackShipment(dsp)}>Track Shipment</MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  )) : (
                    <Tr>
                      <Td colSpan="7" textAlign="center" py="10" color="gray.500">No dispatch records found</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>
          
          <Box p="4" bg="gray.50/20" borderTop="1px solid" borderColor="gray.100">
             <Flex justify="space-between" align="center">
                <Text fontSize="10px" color="gray.400" fontWeight="600">Showing {dispatches.length} records</Text>
                <HStack spacing="2">
                   <Button size="xs" variant="outline" fontSize="10px" h="24px" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Previous</Button>
                   <Text fontSize="xs" fontWeight="700">{page}</Text>
                   <Button size="xs" variant="outline" fontSize="10px" h="24px" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Next</Button>
                </HStack>
             </Flex>
          </Box>
        </Box>
      </Box>

      {/* Tracking Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <VStack align="start" spacing="0">
              <Text fontSize="sm" color="brand.500" fontWeight="800">SHIPMENT TRACKING</Text>
              <Heading size="md" color="secondary">Ref: {selectedDispatch?.reference || '---'}</Heading>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="10">
            <Box py="5">
               <Stepper index={getActiveStep(selectedDispatch?.status)} orientation='vertical' height='300px' gap='0'>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink='0'>
                      <StepTitle><Text fontSize="sm" fontWeight="800" color="secondary">{step.title}</Text></StepTitle>
                      <StepDescription><Text fontSize="xs" color="gray.400">{step.description}</Text></StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </Box>
            
            <Box bg="gray.50" p="4" borderRadius="xl">
               <HStack justify="space-between">
                  <Box>
                    <Text fontSize="10px" color="gray.400" fontWeight="800">DESTINATION</Text>
                    <Text fontSize="xs" fontWeight="700">{selectedDispatch?.branch?.name}</Text>
                  </Box>
                  <Box textAlign="right">
                    <Text fontSize="10px" color="gray.400" fontWeight="800">METHOD</Text>
                    <Text fontSize="xs" fontWeight="700">{selectedDispatch?.method}</Text>
                  </Box>
               </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default DispatchStock;

