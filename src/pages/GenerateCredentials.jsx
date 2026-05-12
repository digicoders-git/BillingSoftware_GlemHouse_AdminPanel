import React from 'react';
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
  Input,
  InputGroup,
  InputLeftElement,
  Select
} from '@chakra-ui/react';
import { 
  Search, 
  Key, 
  Copy, 
  RefreshCw, 
  Mail,
  Filter,
  CheckCircle
} from 'lucide-react';
import Layout from '../components/Layout';

const GenerateCredentials = () => {
  const Branches = [
    { id: 'BR001', name: 'Downtown Branch', email: 'downtown@dreamspos.com', status: 'Active', lastGenerated: '2023-10-20' },
    { id: 'BR002', name: 'Westside Hub', email: 'westside@dreamspos.com', status: 'Inactive', lastGenerated: '2023-09-15' },
    { id: 'BR003', name: 'Central Plaza', email: 'central@dreamspos.com', status: 'Active', lastGenerated: '2023-10-22' },
    { id: 'BR004', name: 'North Station', email: 'north@dreamspos.com', status: 'Active', lastGenerated: 'Never' },
  ];

  return (
    <Layout>
      <Box>
        <Flex justify="space-between" align="center" mb="6">
          <Box>
            <Heading size="md" color="secondary">Branch Login Credentials</Heading>
            <Text fontSize="sm" color="gray.500">Generate and manage access credentials for each branch</Text>
          </Box>
        </Flex>

        <Box className="premium-card">
          <Flex p="6" justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.50">
            <HStack spacing="3">
              <InputGroup size="sm" maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <Search color="gray" size={16} />
                </InputLeftElement>
                <Input placeholder="Search branch..." borderRadius="md" />
              </InputGroup>
              <Select size="sm" maxW="150px" borderRadius="md">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </HStack>
          </Flex>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="background">
                <Tr>
                  <Th border="none">Branch Name</Th>
                  <Th border="none">Email / Username</Th>
                  <Th border="none">Last Generated</Th>
                  <Th border="none">Status</Th>
                  <Th border="none" textAlign="right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Branches.map((branch) => (
                  <Tr key={branch.id} _hover={{ bg: 'gray.50/50' }}>
                    <Td borderColor="gray.100">
                      <Text fontWeight="600" color="secondary" fontSize="sm">{branch.name}</Text>
                      <Text fontSize="xs" color="gray.400">{branch.id}</Text>
                    </Td>
                    <Td borderColor="gray.100">
                      <HStack spacing="2">
                        <Mail size={14} color="gray" />
                        <Text fontSize="sm">{branch.email}</Text>
                      </HStack>
                    </Td>
                    <Td borderColor="gray.100">
                      <Text fontSize="sm" color="gray.600">{branch.lastGenerated}</Text>
                    </Td>
                    <Td borderColor="gray.100">
                      <Badge colorScheme={branch.status === 'Active' ? 'green' : 'red'} borderRadius="full" px="2">
                        {branch.status}
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100" textAlign="right">
                      <HStack spacing="2" justify="end">
                        <Button 
                          size="xs" 
                          colorScheme="brand" 
                          leftIcon={<Key size={12} />}
                        >
                          Generate
                        </Button>
                        <IconButton 
                          aria-label="Refresh" 
                          icon={<RefreshCw size={14} />} 
                          size="xs" 
                          variant="outline" 
                        />
                        <IconButton 
                          aria-label="Copy" 
                          icon={<Copy size={14} />} 
                          size="xs" 
                          variant="outline" 
                        />
                      </HStack>
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

export default GenerateCredentials;
