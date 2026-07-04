import { useState, useEffect } from 'react';
import { 
  Box, Flex, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, 
  Button, Input, Select, useToast, Spinner, IconButton} from '@chakra-ui/react';
import { RefreshCw, Trash2, Plus } from 'lucide-react';
import API from '../../utils/api';
import Layout from '../../components/Layout';

const InitiateReturn = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [returnItems, setReturnItems] = useState([]);
  const [note, setNote] = useState('');
  const [upstreamId, setUpstreamId] = useState('');
  const [upstreamOptions, setUpstreamOptions] = useState([]);
  
  const toast = useToast();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchInventory();
    fetchUpstreamOptions();
  }, []);

  const fetchInventory = async () => {
    try {
      let endpoint = '';
      if (userRole === 'distributor') endpoint = '/distributor-inventory';
      else if (userRole === 'sales') endpoint = '/branch-inventory';
      else if (userRole === 'branch') endpoint = '/branch-inventory';
      
      const { data } = await API.get(endpoint);
      const fetchedInventory = data.inventory || data;
      setInventory(fetchedInventory.filter(inv => inv.productID || inv.product));
    } catch (error) {
      toast({ title: "Failed to load inventory", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchUpstreamOptions = async () => {
    try {
      if (userRole === 'distributor') {
        // Distributor returns to Superstockist
        const { data } = await API.get('/sales');
        const salesList = data.sales || data;
        setUpstreamOptions(salesList.map(s => ({ id: s._id, name: s.name, label: `Superstockist: ${s.name}` })));
      } else if (userRole === 'sales') {
        // Superstockist returns to Branch
        const { data } = await API.get('/Branches');
        const branchesList = data.Branches || data;
        setUpstreamOptions(branchesList.map(b => ({ id: b._id, name: b.name, label: `Branch: ${b.name}` })));
      }
      // Branch returns to Admin (no specific ID needed)
    } catch (error) {
      console.error(error);
    }
  };

  const addItem = (inv) => {
    const productId = inv.productID || inv.product?._id || inv.product;
    if (returnItems.find(i => i.product === productId)) {
      return toast({ title: "Item already added to return list", status: "warning" });
    }
    setReturnItems([...returnItems, { 
      product: productId, 
      name: inv.name || inv.product?.name || 'Unknown',
      sku: inv.sku || inv.product?.sku || '',
      maxQty: inv.stock || inv.currentStock || inv.quantity || 0,
      qty: 1, 
      reason: 'Damaged' 
    }]);
  };

  const updateItem = (productId, field, value) => {
    setReturnItems(returnItems.map(item => {
      if (item.product === productId) {
        if (field === 'qty') {
          const validQty = Math.max(1, Math.min(item.maxQty, Number(value)));
          return { ...item, [field]: validQty };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeItem = (productId) => {
    setReturnItems(returnItems.filter(item => item.product !== productId));
  };

  const submitReturn = async () => {
    if (returnItems.length === 0) return toast({ title: "Add items to return", status: "error" });
    if (userRole !== 'branch' && !upstreamId) return toast({ title: "Select a receiver", status: "error" });

    setSubmitting(true);
    try {
      await API.post('/returns', {
        items: returnItems,
        receiverId: upstreamId,
        note
      });
      toast({ title: "Return initiated successfully", status: "success" });
      setReturnItems([]);
      setNote('');
      fetchInventory();
    } catch (error) {
      toast({ title: error.response?.data?.message || "Failed to initiate return", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box pb="10">
        <Flex justify="space-between" align="center" mb="8">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="900">Initiate Return</Heading>
            <Text fontSize="sm" color="gray.500">Return stock to your upstream provider</Text>
          </Box>
        </Flex>

        <Flex gap="6" direction={{ base: 'column', lg: 'row' }}>
          {/* Inventory Selection */}
          <Box flex="1" bg="white" p="6" borderRadius="2xl" shadow="sm">
            <Heading size="sm" mb="4">Available Stock</Heading>
            {loading ? <Spinner /> : (
              <Box maxH="600px" overflowY="auto">
                {inventory.length > 0 ? inventory.map(inv => {
                  const stock = inv.stock || inv.currentStock || inv.quantity || 0;
                  const name = inv.name || inv.product?.name || 'Unknown';
                  return (
                  <Flex key={inv._id} justify="space-between" align="center" p="3" borderBottom="1px solid" borderColor="gray.100">
                    <Box>
                      <Text fontWeight="700">{name}</Text>
                      <Text fontSize="xs" color="gray.500">Stock: {stock}</Text>
                    </Box>
                    <Button size="sm" colorScheme="blue" variant="solid" leftIcon={<Plus size={14} />} onClick={() => addItem(inv)} isDisabled={stock === 0}>Add</Button>
                  </Flex>
                  );
                }) : <Text color="gray.500">No stock available</Text>}
              </Box>
            )}
          </Box>

          {/* Return Form */}
          <Box flex="2" bg="white" p="6" borderRadius="2xl" shadow="sm">
            <Heading size="sm" mb="6">Return Details</Heading>
            
            {userRole !== 'branch' && (
              <Box mb="6">
                <Text fontSize="sm" fontWeight="600" mb="2">Return To (Upstream Provider) *</Text>
                <Select placeholder="Select Provider" value={upstreamId} onChange={(e) => setUpstreamId(e.target.value)}>
                  {upstreamOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </Select>
              </Box>
            )}

            <Table variant="simple" size="sm" mb="6">
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Quantity</Th>
                  <Th>Reason</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {returnItems.map(item => (
                  <Tr key={item.product}>
                    <Td><Text fontWeight="700">{item.name}</Text></Td>
                    <Td>
                      <Input 
                        type="number" 
                        value={item.qty} 
                        onChange={(e) => updateItem(item.product, 'qty', e.target.value)}
                        max={item.maxQty}
                        w="80px"
                      />
                    </Td>
                    <Td>
                      <Select value={item.reason} onChange={(e) => updateItem(item.product, 'reason', e.target.value)}>
                        <option value="Damaged">Damaged</option>
                        <option value="Expired">Expired</option>
                        <option value="Unsold">Unsold</option>
                        <option value="Other">Other</option>
                      </Select>
                    </Td>
                    <Td>
                      <IconButton icon={<Trash2 size={16} />} colorScheme="red" variant="ghost" size="sm" onClick={() => removeItem(item.product)} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Box mb="6">
              <Text fontSize="sm" fontWeight="600" mb="2">Additional Notes</Text>
              <Input as="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any comments..." py="3" minH="80px" />
            </Box>

            <Button colorScheme="brand" w="full" size="lg" onClick={submitReturn} isLoading={submitting} leftIcon={<RefreshCw size={18} />}>
              Submit Return
            </Button>
          </Box>
        </Flex>
      </Box>
    </Layout>
  );
};

export default InitiateReturn;
