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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  VStack
} from '@chakra-ui/react';
import { 
  Plus, 
  Search, 
  Pencil as Edit, 
  Trash2, 
  EllipsisVertical as MoreVertical, 
  Filter,
  Download,
  Eye
} from 'lucide-react';
import Layout from '../components/Layout';

const ManageBranches = () => {
  const branches = [
    { id: 'BR001', name: 'Downtown Branch', location: 'New York, USA', manager: 'John Doe', status: 'Active', contact: '+1 234 567 890' },
    { id: 'BR002', name: 'Westside Hub', location: 'Los Angeles, USA', manager: 'Jane Smith', status: 'Inactive', contact: '+1 987 654 321' },
    { id: 'BR003', name: 'Central Plaza', location: 'Chicago, USA', manager: 'Mike Johnson', status: 'Active', contact: '+1 456 789 012' },
    { id: 'BR004', name: 'North Station', location: 'Boston, USA', manager: 'Sarah Williams', status: 'Active', contact: '+1 321 654 987' },
    { id: 'BR005', name: 'East Coast Center', location: 'Miami, USA', manager: 'Robert Brown', status: 'Pending', contact: '+1 159 357 456' },
  ];

  return (
    <Layout>
      <Box pb="10">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="10" gap="4">
          <Box>
            <Heading size="lg" color="secondary" fontWeight="700" letterSpacing="-0.5px">Manage Branches</Heading>
            <Text fontSize="sm" color="gray.500" fontWeight="400">View and manage all branch locations within your network</Text>
          </Box>
          <Button leftIcon={<Plus size={16} />} colorScheme="brand" borderRadius="xl" size="sm" shadow="sm">
            Add New Branch
          </Button>
        </Flex>

        <Box className="premium-card" overflow="hidden">
          <Box p="6" borderBottom="1px solid" borderColor="gray.50" bg="gray.50/20">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap="4">
              <HStack spacing="3">
                 <Heading size="xs" color="secondary" fontWeight="700">Branch Directory</Heading>
              </HStack>
              <HStack spacing="3">
                <InputGroup size="sm" maxW={{ base: 'full', md: '250px' }}>
                  <InputLeftElement pointerEvents="none">
                    <Search color="gray" size={16} />
                  </InputLeftElement>
                  <Input placeholder="Search branches..." borderRadius="lg" bg="white" />
                </InputGroup>
                <Button size="sm" variant="outline" leftIcon={<Filter size={16} />} borderRadius="lg" fontWeight="600">Filter</Button>
                <Button size="sm" variant="outline" leftIcon={<Download size={16} />} borderRadius="lg" fontWeight="600">Export</Button>
              </HStack>
            </Flex>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50/50">
                <Tr>
                  <Th color="gray.400" border="none" py="4" px="8" fontSize="10px">Branch ID</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Branch Name</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Manager</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Contact</Th>
                  <Th color="gray.400" border="none" py="4" fontSize="10px">Status</Th>
                  <Th color="gray.400" border="none" py="4" px="8" textAlign="right"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {branches.map((branch) => (
                  <Tr key={branch.id} _hover={{ bg: 'gray.50/30' }} transition="all 0.2s">
                    <Td borderColor="gray.100" py="4" px="8">
                      <Text fontWeight="700" color="brand.500" fontSize="xs">{branch.id}</Text>
                    </Td>
                    <Td borderColor="gray.100" py="4">
                       <HStack spacing="3">
                          <Avatar size="xs" name={branch.name} bg="secondary" color="white" />
                          <VStack align="start" spacing="0">
                             <Text fontWeight="700" color="secondary" fontSize="xs">{branch.name}</Text>
                             <Text fontSize="10px" color="gray.400">{branch.location}</Text>
                          </VStack>
                       </HStack>
                    </Td>
                    <Td borderColor="gray.100" py="4">
                      <Text color="gray.600" fontSize="xs" fontWeight="600">{branch.manager}</Text>
                    </Td>
                    <Td borderColor="gray.100" py="4">
                      <Text color="gray.600" fontSize="xs" fontWeight="600">{branch.contact}</Text>
                    </Td>
                    <Td borderColor="gray.100" py="4">
                      <Badge 
                        colorScheme={branch.status === 'Active' ? 'green' : branch.status === 'Inactive' ? 'red' : 'orange'} 
                        borderRadius="full" 
                        px="2.5"
                        py="0.5"
                        fontSize="9px"
                        fontWeight="700"
                        variant="subtle"
                      >
                        {branch.status}
                      </Badge>
                    </Td>
                    <Td borderColor="gray.100" py="4" px="8" textAlign="right">
                      <HStack spacing="1" justify="end">
                        <IconButton aria-label="View" icon={<Eye size={14} />} size="xs" variant="ghost" color="gray.400" borderRadius="full" />
                        <IconButton aria-label="Edit" icon={<Edit size={14} />} size="xs" variant="ghost" color="gray.400" borderRadius="full" />
                        <IconButton aria-label="Delete" icon={<Trash2 size={14} />} size="xs" variant="ghost" color="red.400" borderRadius="full" />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Box p="4" bg="gray.50/20" borderTop="1px solid" borderColor="gray.100">
             <Flex justify="space-between" align="center">
                <Text fontSize="10px" color="gray.400" fontWeight="600">Showing 5 active branches</Text>
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

export default ManageBranches;
