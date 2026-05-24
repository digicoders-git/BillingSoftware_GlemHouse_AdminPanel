import React, { useState, useEffect } from 'react';
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
  FormControl,
  FormLabel,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  VStack,
  Divider,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { 
  Calendar, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  FileText,
  ShoppingBag,
  Download,
  Filter,
  FileDown,
  Printer,
  ChevronRight,
  RefreshCcw
} from 'lucide-react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BranchReports = () => {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const toast = useToast();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/branch-sales/reports?startDate=${startDate}&endDate=${endDate}&type=${reportType}`);
      setData(data);
    } catch (error) {
      toast({ title: "Failed to generate report", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const downloadCSV = () => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => item[header]));
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `branch_${reportType}_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "CSV Downloaded", status: "success" });
  };

  const downloadPDF = () => {
    if (data.length === 0) return;

    const doc = new jsPDF();
    const userRole = localStorage.getItem('userRole') || 'branch';
    let roleText = 'Branch';
    if (userRole === 'sales') roleText = 'sales Rep';
    if (userRole === 'distributor') roleText = 'Partner';
    
    // Add Header
    doc.setFontSize(16);
    doc.setTextColor(41, 138, 198); // Brand color
    doc.text(`GLEM HOUSE CONSUMER CARE PVT LTD - ${roleText} Report`, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Type: ${reportType.toUpperCase()}`, 14, 32);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 38);
    doc.text(`Generated on: ${moment().format('YYYY-MM-DD HH:mm')}`, 14, 44);

    const headers = Object.keys(data[0]).map(h => h.toUpperCase());
    const body = data.map(item => Object.values(item));

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 50,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 138, 198], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 50 }
    });

    doc.save(`branch_${reportType}_report_${startDate}_to_${endDate}.pdf`);
    toast({ title: "PDF Downloaded", status: "success" });
  };

  const calculateTotal = () => {
    if (!data || data.length === 0) return 0;
    
    let total = 0;
    if (reportType === 'sales') {
        total = data.reduce((sum, item) => sum + (Number(item["Amount"]) || 0), 0);
    } else if (reportType === 'category') {
        total = data.reduce((sum, item) => sum + (Number(item["Revenue"]) || 0), 0);
    } else if (reportType === 'products') {
        total = data.reduce((sum, item) => sum + (Number(item["Total sales"]) || 0), 0);
    }
    return total;
  };

  const totalVal = calculateTotal();

  return (
    <Layout>
      <Box pb="10" sx={{
        '@media print': {
          '.no-print': { display: 'none' },
          'nav': { display: 'none' },
          'header': { display: 'none' },
          '.premium-card': { boxShadow: 'none', border: 'none', p: 0 },
          'body': { bg: 'white' }
        }
      }}>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="800">Advanced Analytics</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="500">Generate and export comprehensive branch reports</Text>
          </Box>
          <HStack spacing="3" className="no-print">
            <Button leftIcon={<FileDown size={18} />} colorScheme="green" variant="outline" borderRadius="xl" onClick={downloadCSV} isDisabled={data.length === 0}>CSV</Button>
            <Button leftIcon={<Printer size={18} />} colorScheme="brand" borderRadius="xl" px="8" onClick={() => window.print()} isDisabled={data.length === 0}>Print Data</Button>
          </HStack>
        </Flex>

        {/* Filter Panel */}
        <Box className="premium-card no-print" p="6" mb="8">
           <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap="6" align="end">
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700" color="gray.500">REPORT TYPE</FormLabel>
                <Select h="50px" borderRadius="xl" bg="gray.50" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option value="sales">sales Transactions</option>
                  <option value="products">Product Performance</option>
                  <option value="category">Category-wise Analysis</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700" color="gray.500">START DATE</FormLabel>
                <Input type="date" h="50px" borderRadius="xl" bg="gray.50" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700" color="gray.500">END DATE</FormLabel>
                <Input type="date" h="50px" borderRadius="xl" bg="gray.50" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormControl>

              <Button leftIcon={<RefreshCcw size={18} />} colorScheme="brand" h="50px" borderRadius="xl" onClick={fetchReport} isLoading={loading}>Generate Report</Button>
           </Grid>
        </Box>

        {/* Stats Summary */}
        {data.length > 0 && (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" mb="8" className="no-print">
            <Box className="premium-card" p="6" bg="brand.50" border="1px solid" borderColor="brand.100">
               <Stat>
                  <StatLabel color="brand.600" fontWeight="700">TOTAL REVENUE</StatLabel>
                  <StatNumber color="secondary" fontSize="3xl" fontWeight="800">₹{totalVal.toLocaleString()}</StatNumber>
                  <StatHelpText color="brand.500" fontWeight="600">Selected Period</StatHelpText>
               </Stat>
            </Box>
            <Box className="premium-card" p="6">
               <Stat>
                  <StatLabel color="gray.500" fontWeight="700">RECORD COUNT</StatLabel>
                  <StatNumber color="secondary" fontSize="3xl" fontWeight="800">{data.length}</StatNumber>
                  <StatHelpText fontWeight="600">Total Entries Found</StatHelpText>
               </Stat>
            </Box>
            <Box className="premium-card" p="6">
               <Stat>
                  <StatLabel color="gray.500" fontWeight="700">AVG VALUE</StatLabel>
                  <StatNumber color="secondary" fontSize="3xl" fontWeight="800">
                    ₹{(totalVal / (data.length || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </StatNumber>
                  <StatHelpText fontWeight="600">Per Record Average</StatHelpText>
               </Stat>
            </Box>
          </SimpleGrid>
        )}

        {/* Data Preview */}
        <Box className="premium-card" overflow="hidden">
           <Box p="4" bg="gray.50" borderBottom="1px solid" borderColor="gray.100">
              <Text fontSize="xs" fontWeight="800" color="secondary">LIVE PREVIEW (LATEST 50 RECORDS)</Text>
           </Box>
           <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead bg="white">
                  <Tr>
                    {data.length > 0 && Object.keys(data[0]).map((header, i) => (
                      <Th key={i} py="4" color="gray.400" fontSize="10px">{header.toUpperCase()}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {loading ? (
                    <Tr><Td colSpan={10} textAlign="center" py="10"><Spinner color="brand.500" /></Td></Tr>
                  ) : data.length > 0 ? (
                    data.slice(0, 50).map((row, idx) => (
                      <Tr key={idx} _hover={{ bg: 'gray.50/50' }}>
                        {Object.entries(row).map(([key, val], i) => {
                          const isCurrency = ['Amount', 'Total sales', 'Revenue'].includes(key);
                          return (
                            <Td key={i} py="4" fontWeight="600" color="secondary" fontSize="xs">
                              {isCurrency ? `₹${Number(val).toLocaleString()}` : val}
                            </Td>
                          );
                        })}
                      </Tr>
                    ))
                  ) : (
                    <Tr><Td colSpan={10} textAlign="center" py="10" color="gray.500">No data found for selected filters.</Td></Tr>
                  )}
                </Tbody>
              </Table>
           </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default BranchReports;
