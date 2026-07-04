import {
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
  Box, Flex, Button
} from '@chakra-ui/react';
import { Printer, Download } from 'lucide-react';
import { pdfTemplate } from '../utils/pdfTemplate';
import { downloadInvoiceAsJpg } from '../utils/downloadInvoice';

const ReturnInvoiceModal = ({ isOpen, onClose, returnData, getSenderName, getReceiverName, actionButtons }) => {
  if (!returnData) return null;

  const generateBillData = () => {
      let totalAmount = 0;
      const itemsData = returnData.items.map(item => {
        const price = item.product?.price || 0;
        const total = price * item.qty;
        totalAmount += total;
        return {
          name: item.name || item.product?.name || 'Unknown Product',
          qty: item.qty,
          price: price,
          total: total,
          hsn: item.product?.hsn || 'N/A',
          batch: item.product?.batch || 'N/A',
          expiry: item.product?.expiry || ''
        };
      });

      return {
        billingType: 'Return Slip',
        billNo: returnData.returnCode,
        clientName: getSenderName ? getSenderName(returnData) : (returnData.senderBranch?.name || returnData.senderSalesRep?.name || returnData.senderDistributor?.name || 'Unknown Sender'),
        clientPhone: 'N/A',
        clientAddress: `Returned by: ${returnData.senderType} \nReturned to: ${returnData.receiverType}`,
        clientGSTIN: 'N/A',
        items: itemsData,
        totalAmount: totalAmount,
        subTotal: totalAmount,
        totalTax: 0,
      taxPercentage: 0,
      createdAt: returnData.createdAt,
      isGstEnabled: false,
      senderType: returnData.senderType,
      receiverType: returnData.receiverType
    };
  };

  const htmlContent = pdfTemplate(generateBillData());

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const handleDownload = async () => {
    await downloadInvoiceAsJpg(htmlContent, `ReturnSlip_${returnData.returnCode}.jpg`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="gray.50" borderRadius="2xl">
        <ModalCloseButton />
        <ModalBody p="6">
          <Flex justify="flex-end" mb="4" gap="4">
            <Button leftIcon={<Download size={16} />} colorScheme="green" size="sm" onClick={handleDownload}>
              Download JPG
            </Button>
            <Button leftIcon={<Printer size={16} />} colorScheme="blue" size="sm" onClick={handlePrint}>
              Print Slip
            </Button>
          </Flex>

          <Box bg="white" p="0" borderRadius="xl" shadow="sm" overflow="auto" maxH="70vh" className="invoice-container">
            {/* Render the exact same HTML template as the rest of the app */}
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </Box>
          
          {actionButtons && (
            <Box mt="6" pt="4">
              {actionButtons}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReturnInvoiceModal;
