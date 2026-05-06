import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Grid, 
  GridItem, 
  FormControl, 
  FormLabel, 
  Input, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  IconButton, 
  VStack, 
  Divider,
  HStack,
  Select,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { 
  Plus, 
  Trash, 
  Printer, 
  Download, 
  Save, 
  Search,
  User,
  ShoppingBag
} from 'lucide-react';
import Layout from '../../components/Layout';

const BranchNewInvoice = () => {
  const [items, setItems] = useState([
    { id: 1, name: '', qty: 1, price: 0, total: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', qty: 1, price: 0, total: 0 }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Generate New Invoice</Heading>
            <Text fontSize="sm" color="gray.500">Create a professional bill for your customer</Text>
          </Box>
          <HStack spacing="3" w={{ base: 'full', md: 'auto' }}>
            <Button leftIcon={<Printer size={18} />} variant="outline" borderRadius="xl" flex={1}>Print</Button>
            <Button leftIcon={<Download size={18} />} variant="outline" borderRadius="xl" flex={1}>Download</Button>
            <Button leftIcon={<Save size={18} />} colorScheme="brand" borderRadius="xl" flex={1}>Save Invoice</Button>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6">
          {/* Main Billing Section */}
          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <Box className="premium-card" p="6" mb="6">
              <HStack mb="6" spacing="2">
                <Box p="2" bg="brand.50" borderRadius="lg" color="brand.500">
                  <ShoppingBag size={20} />
                </Box>
                <Heading size="sm" color="secondary">Product Details</Heading>
              </HStack>
              
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th border="none">Product Name</Th>
                      <Th border="none">Qty</Th>
                      <Th border="none">Price</Th>
                      <Th border="none">Total</Th>
                      <Th border="none"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr key={item.id}>
                        <Td borderColor="gray.100" minW="200px">
                          <Input placeholder="Select Product" variant="filled" bg="gray.50" borderRadius="lg" h="45px" />
                        </Td>
                        <Td borderColor="gray.100" w="100px">
                          <Input type="number" defaultValue={1} variant="filled" bg="gray.50" borderRadius="lg" h="45px" />
                        </Td>
                        <Td borderColor="gray.100" w="120px">
                          <Input placeholder="0.00" variant="filled" bg="gray.50" borderRadius="lg" h="45px" />
                        </Td>
                        <Td borderColor="gray.100" w="120px">
                          <Text fontWeight="800" color="secondary">$0.00</Text>
                        </Td>
                        <Td borderColor="gray.100" textAlign="right">
                          <IconButton 
                            icon={<Trash size={16} />} 
                            colorScheme="red" 
                            variant="ghost" 
                            size="sm" 
                            borderRadius="full"
                            onClick={() => removeItem(item.id)}
                            isDisabled={items.length === 1}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              
              <Button 
                leftIcon={<Plus size={16} />} 
                variant="dashed" 
                w="full" 
                mt="4" 
                borderColor="brand.300" 
                color="brand.500"
                onClick={addItem}
                _hover={{ bg: 'brand.50' }}
              >
                Add Another Item
              </Button>
            </Box>

            <Box className="premium-card" p="6">
              <Heading size="sm" mb="6" color="secondary">Notes / Terms</Heading>
              <Input as="textarea" placeholder="Enter any additional notes or terms here..." h="100px" py="3" bg="gray.50" border="none" borderRadius="xl" />
            </Box>
          </GridItem>

          {/* Customer & Summary Section */}
          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <Box className="premium-card" p="6" mb="6">
              <HStack mb="6" spacing="2">
                <Box p="2" bg="blue.50" borderRadius="lg" color="blue.500">
                  <User size={20} />
                </Box>
                <Heading size="sm" color="secondary">Customer Details</Heading>
              </HStack>
              
              <VStack spacing="4" align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="700" color="gray.500">Customer Name</FormLabel>
                  <Input placeholder="John Doe" h="45px" borderRadius="lg" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="700" color="gray.500">Phone Number</FormLabel>
                  <Input placeholder="+1 234 567 890" h="45px" borderRadius="lg" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="700" color="gray.500">Payment Method</FormLabel>
                  <Select h="45px" borderRadius="lg">
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Digital Wallet</option>
                  </Select>
                </FormControl>
              </VStack>
            </Box>

            <Box className="premium-card" p="6">
              <Heading size="sm" mb="6" color="secondary">Bill Summary</Heading>
              <VStack spacing="3" align="stretch">
                <Flex justify="space-between">
                  <Text color="gray.500" fontSize="sm">Subtotal</Text>
                  <Text fontWeight="700" fontSize="sm">$0.00</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.500" fontSize="sm">Tax (10%)</Text>
                  <Text fontWeight="700" fontSize="sm">$0.00</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.500" fontSize="sm">Discount</Text>
                  <Text fontWeight="700" fontSize="sm" color="red.500">-$0.00</Text>
                </Flex>
                <Divider my="2" />
                <Flex justify="space-between" align="center">
                  <Text fontWeight="800" fontSize="md" color="secondary">Total Amount</Text>
                  <Text fontWeight="800" fontSize="xl" color="brand.500">$0.00</Text>
                </Flex>
                
                <Button colorScheme="brand" size="lg" h="55px" mt="4" borderRadius="xl" shadow="lg" leftIcon={<Save size={20} />}>
                  Complete Transaction
                </Button>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BranchNewInvoice;
