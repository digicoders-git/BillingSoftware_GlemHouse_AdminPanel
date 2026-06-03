import { useState, useEffect, useRef } from 'react'; // Optimized imports
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  VStack, 
  Badge, 
  Avatar, 
  Spinner, 
  useToast, 
  Tag} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Printer, 
  Download
} from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';
import { useReactToPrint } from 'react-to-print';
import { numberToWords } from '../utils/pdfTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const DispatchSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const printRef = useRef();
  
  const [dispatch, setDispatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice_${dispatch?.invoiceNo || 'Dispatch'}`,
  });

  useEffect(() => {
    fetchDispatchDetails();
  }, [id]);

  const fetchDispatchDetails = async () => {
    try {
      const { data } = await API.get(`/dispatches/${id}`);
      setDispatch(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching details",
        status: "error",
        duration: 3000,
      });
      navigate('/total-dispatch-stock');
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${dispatch.invoiceNo}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast({
        title: "PDF Download Failed",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
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

  const amountInWords = numberToWords(dispatch.totalAmount || dispatch.totalValue || 0);
  const isTransfer = dispatch.billingType === 'Transfer' || (dispatch.senderType === 'Admin' && dispatch.receiverType === 'Branch');

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="8" gap="4">
          <Box>
            <HStack spacing="3" mb="2" cursor="pointer" onClick={() => navigate(-1)} _hover={{ color: 'brand.500' }}>
               <ArrowLeft size={18} />
               <Text fontSize="sm" fontWeight="700">Back to List</Text>
            </HStack>
            <HStack spacing="4">
              <Heading size="lg" color="secondary" fontWeight="900" letterSpacing="-1px">
                Invoice Summary
              </Heading>
              <Badge colorScheme={dispatch.status === 'Received' ? 'green' : 'blue'} borderRadius="full" px="3" py="1" variant="subtle" fontSize="10px" fontWeight="800">
                {dispatch.status}
              </Badge>
            </HStack>
          </Box>
          <HStack spacing="3">
            <Button 
                leftIcon={<Printer size={16} />} 
                variant="outline" 
                borderRadius="xl"
                onClick={() => handlePrint()}
            >
                Print Invoice
            </Button>
            <Button 
                leftIcon={<Download size={16} />} 
                colorScheme="brand" 
                borderRadius="xl"
                onClick={handleDownloadPDF}
                isLoading={isGeneratingPDF}
                loadingText="Generating..."
            >
                Download PDF
            </Button>
          </HStack>
        </Flex>

        <Box 
          display="flex" 
          justifyContent="center" 
          bg="gray.100" 
          p={{ base: 2, md: 10 }} 
          borderRadius="3xl"
        >
          {/* INVOICE REPLICA START - MATCHING pdfTemplate.js */}
          <Box 
            ref={printRef}
            bg="white"
            w="800px"
            minH="1000px"
            border="2px solid #000"
            color="#000"
            fontFamily="'Arial', sans-serif"
            position="relative"
            sx={{
              "@media print": {
                boxShadow: "none",
                border: "2px solid #000 !important",
                m: "0",
                p: "0",
                width: "100% !important",
                height: "auto",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              },
              "& *": { boxSizing: "border-box" }
            }}
          >
            {/* Watermark Logic from pdfTemplate.js */}
            <Box 
              position="absolute" 
              top="35%" 
              left="10%" 
              width="80%" 
              opacity="0.1" 
              transform="rotate(-30deg)" 
              zIndex="0" 
              pointerEvents="none" 
              textAlign="center"
              sx={{
                 "@media print": {
                    opacity: "0.12 !important",
                    display: "block !important"
                 }
              }}
            >
               <img src="/main.png" alt="" style={{ width: '70%', height: 'auto', margin: '0 auto' }} />
            </Box>



            {/* Header */}
            <VStack spacing="0" p="15px 15px" borderBottom="2px solid #000" textAlign="center" position="relative" zIndex="1" bg="white">
               <Text fontSize="16px" fontWeight="900" textDecoration="underline" mb="2">
                 {isTransfer ? 'STOCK TRANSFER' : (dispatch.billingType === 'With GST' ? 'TAX INVOICE' : 'ESTIMATE / QUOTATION')}
               </Text>
               <Text fontSize="26px" fontWeight="800" letterSpacing="1px" mb="1" mt="1" lineHeight="1">GLEM HOUSE CONSUMER CARE PVT LTD</Text>
               <VStack spacing="1" fontSize="13px" fontWeight="700">
                 <Text>Address: 1/093,New A, Jiyamau, Hazratganj, Lucknow (Uttar Pradesh)-226001</Text>
                 <Text>Gst no: 09AAACG1234H1Z5</Text>
                 <Text>Email Id: contact@glemhouse.com</Text>
               </VStack>
            </VStack>

            {/* Info Section */}
            <Flex borderBottom="2px solid #000" minH="120px" position="relative" zIndex="1" bg="white">
              <Box w="60%" borderRight="2px solid #000" p="12px 15px">
                <Text fontWeight="950" textDecoration="underline" textAlign="center" mb="12px" fontSize="14px" textTransform="uppercase">Detail of Receiver / Consignee</Text>
                <VStack align="start" spacing="2" fontWeight="900" fontSize="13px">
                  <HStack spacing="2">
                    <Text w="90px">Name :</Text>
                    <Text>{(dispatch.receiverBranch?.name || dispatch.receiverSalesRep?.name || dispatch.receiverDistributor?.name || 'N/A').toUpperCase()}</Text>
                  </HStack>
                  <HStack spacing="2" align="start">
                    <Text w="90px">Address :</Text>
                    <Text>{(dispatch.receiverBranch?.location || dispatch.receiverSalesRep?.location || dispatch.receiverDistributor?.location || 'AS PER RECORDS').toUpperCase()}</Text>
                  </HStack>
                  <HStack spacing="2">
                    <Text w="90px">Contact :</Text>
                    <Text>{dispatch.receiverBranch?.contact || dispatch.receiverSalesRep?.contact || dispatch.receiverDistributor?.contact || 'N/A'}</Text>
                  </HStack>
                  <HStack spacing="2">
                    <Text w="90px">ID :</Text>
                    <Text>{dispatch.receiverBranch?.branchId || dispatch.receiverSalesRep?.salesId || dispatch.receiverDistributor?.distributorId || 'N/A'}</Text>
                  </HStack>
                </VStack>
              </Box>
              <Box w="40%" p="12px 15px" fontWeight="800">
                <VStack align="start" spacing="2" mt="15px" fontSize="13px">
                  <HStack><Text w="95px">Invoice No. :</Text><Text fontSize="14px" fontWeight="950">{dispatch.invoiceNo || 'N/A'}</Text></HStack>
                  <HStack><Text w="95px">Date :</Text><Text>{new Date(dispatch.date).toLocaleDateString('en-GB')}</Text></HStack>
                </VStack>
              </Box>
            </Flex>

            {/* Main Table */}
            <Box position="relative" zIndex="1" bg="white">
              <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                    <th style={{ borderBottom: '2px solid #000', borderRight: '2px solid #000', padding: '12px 8px', width: isTransfer ? '8%' : '6%', fontWeight: '950', fontSize: '13px' }}>S. NO.</th>
                    <th style={{ borderBottom: '2px solid #000', borderRight: '2px solid #000', padding: '12px 8px', width: isTransfer ? '42%' : '30%', fontWeight: '950', fontSize: '13px' }}>Description</th>
                    <th style={{ borderBottom: '2px solid #000', borderRight: '2px solid #000', padding: '12px 8px', width: '10%', fontWeight: '950', fontSize: '13px' }}>HSN Code</th>
                    <th style={{ borderBottom: '2px solid #000', borderRight: '2px solid #000', padding: '12px 8px', width: '10%', fontWeight: '950', fontSize: '13px' }}>Batch No.</th>
                    <th style={{ borderBottom: '2px solid #000', borderRight: '2px solid #000', padding: '12px 8px', width: '10%', fontWeight: '950', fontSize: '13px' }}>Exp. Date</th>
                    <th style={{ borderBottom: '2px solid #000', borderRight: isTransfer ? 'none' : '2px solid #000', padding: '12px 8px', width: '8%', fontWeight: '950', fontSize: '13px' }}>Qty.</th>
                    {!isTransfer && (
                      <>
                        <th style={{ borderBottom: '2px solid #000', borderRight: '2px solid #000', padding: '12px 8px', width: '12%', fontWeight: '950', fontSize: '13px' }}>Rate</th>
                        <th style={{ borderBottom: '2px solid #000', padding: '12px 8px', width: '12%', fontWeight: '950', fontSize: '13px' }}>Amount</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dispatch.items.map((item, idx) => {
                    let rawExpiry = item.expiryDate || item.expiry || item.product?.expiry || '';
                    let expiryDisplay = 'N/A';
                    if (rawExpiry && rawExpiry.trim()) {
                      const m = rawExpiry.match(/^(\d{4})-(\d{2})$/);
                      expiryDisplay = m ? `${m[2]}/${m[1]}` : rawExpiry;
                    }
                    const hsnValue = (item.hsn && item.hsn.trim() && item.hsn !== 'N/A') ? item.hsn : ((item.product?.hsn && item.product.hsn.trim() && item.product.hsn !== 'N/A') ? item.product.hsn : 'N/A');
                    const batchValue = (item.batch && item.batch.trim() && item.batch !== 'N/A') ? item.batch : ((item.product?.batch && item.product.batch.trim() && item.product.batch !== 'N/A') ? item.product.batch : 'N/A');
                    return (
                    <tr key={idx}>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000', padding: '10px 8px', textAlign: 'center', fontWeight: '900' }}>{idx + 1}</td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000', padding: '10px 8px', fontWeight: '900' }}>{item.name}</td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000', padding: '10px 8px', textAlign: 'center', fontWeight: '900' }}>{hsnValue}</td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000', padding: '10px 8px', textAlign: 'center', fontWeight: '900' }}>{batchValue}</td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000', padding: '10px 8px', textAlign: 'center', fontWeight: '900' }}>{expiryDisplay}</td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: isTransfer ? 'none' : '2px solid #000', padding: '10px 8px', textAlign: 'center', fontWeight: '950' }}>{item.qty}</td>
                      {!isTransfer && (
                        <>
                          <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000', padding: '10px 8px', textAlign: 'right', fontWeight: '900' }}>{`₹${(item.price || 0).toLocaleString('en-IN')}`}</td>
                          <td style={{ borderBottom: '1.5px solid #000', padding: '10px 8px', textAlign: 'right', fontWeight: '950' }}>{`₹${((item.qty || 0) * (item.price || 0)).toLocaleString('en-IN')}`}</td>
                        </>
                      )}
                    </tr>
                    );
                  })}
                  {/* Filler rows */}
                  {Array.from({ length: Math.max(0, 8 - (dispatch.items?.length || 0)) }).map((_, i) => (
                    <tr key={`empty-${i}`} style={{ height: '35px' }}>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000' }}></td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000' }}></td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000' }}></td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000' }}></td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000' }}></td>
                      <td style={{ borderBottom: '1.5px solid #000', borderRight: isTransfer ? 'none' : '2px solid #000' }}></td>
                      {!isTransfer && (
                        <>
                          <td style={{ borderBottom: '1.5px solid #000', borderRight: '2px solid #000' }}></td>
                          <td style={{ borderBottom: '1.5px solid #000' }}></td>
                        </>
                      )}
                    </tr>
                  ))}
                  {/* Spacer for bottom items */}
                  <tr style={{ height: '40px', borderBottom: isTransfer ? '2px solid #000' : 'none' }}>
                    <td style={{ borderRight: '2px solid #000' }}></td>
                    <td style={{ borderRight: '2px solid #000' }}></td>
                    <td style={{ borderRight: '2px solid #000' }}></td>
                    <td style={{ borderRight: '2px solid #000' }}></td>
                    <td style={{ borderRight: '2px solid #000' }}></td>
                    <td style={{ borderRight: isTransfer ? 'none' : '2px solid #000' }}></td>
                    {!isTransfer && (
                      <>
                        <td style={{ borderRight: '2px solid #000' }}></td>
                        <td></td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </Box>

            {/* Totals Section */}
            <Box position="relative" zIndex="1" bg="white">
            {!isTransfer && (
               <>
                 <Flex justify="flex-end" borderTop="2px solid #000">
                    <Box w="85%" bg="#f0f0f0" p="10px" fontWeight="950" textAlign="center" borderRight="2px solid #000" borderBottom="2px solid #000" sx={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>SUBTOTAL</Box>
                    <Box w="15%" p="10px" fontWeight="950" textAlign="right" borderBottom="2px solid #000">
                      ₹{(dispatch.taxableAmount || dispatch.totalValue || 0).toLocaleString('en-IN')}
                    </Box>
                 </Flex>
                 {dispatch.billingType === 'With GST' && (
                   <Flex justify="flex-end">
                      <Box w="85%" bg="#f0f0f0" p="10px" fontWeight="950" textAlign="center" borderRight="2px solid #000" borderBottom="2px solid #000" sx={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>TAX ({dispatch.gstRate}%)</Box>
                      <Box w="15%" p="10px" fontWeight="950" textAlign="right" borderBottom="2px solid #000">
                         ₹{(dispatch.gstAmount || 0).toLocaleString('en-IN')}
                      </Box>
                   </Flex>
                 )}
                 <Flex justify="flex-end">
                    <Box w="85%" bg="#f0f0f0" p="10px" fontWeight="950" textAlign="center" borderRight="2px solid #000" borderBottom="2px solid #000" sx={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>GRAND TOTAL</Box>
                    <Box w="15%" p="10px" fontWeight="950" textAlign="right" borderBottom="2px solid #000">
                      ₹{(dispatch.totalAmount || dispatch.totalValue || 0).toLocaleString('en-IN')}
                    </Box>
                 </Flex>
               </>
            )}
            </Box>

            {/* Amount in words */}
            {!isTransfer && (
              <Box borderBottom="2px solid #000" p="12px 15px" fontWeight="950" textTransform="uppercase" fontSize="13px" position="relative" zIndex="1" bg="white">
                 Total Amount (in words) : RUPEES {amountInWords}
              </Box>
            )}

            {/* Footer Section */}
            <Flex justify="space-between" align="flex-end" p="15px 15px 20px 15px" mt="auto" position="relative" zIndex="1" bg="white">
               <Box fontSize="10px" fontWeight="800">
                  E. & O. E.<br />
                  Subject to Lucknow Jurisdiction.
               </Box>
               <Box textAlign="right" fontWeight="900">
                  <Text fontSize="11px" mb="1">For <strong>GLEM HOUSE CONSUMER CARE PVT LTD</strong></Text>
                  <Box h="50px" />
                  <Text fontSize="12px" borderTop="2.5px solid #000" pt="6px" display="inline-block" minW="200px" textAlign="center">Authorized Signatory</Text>
               </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default DispatchSummary;

