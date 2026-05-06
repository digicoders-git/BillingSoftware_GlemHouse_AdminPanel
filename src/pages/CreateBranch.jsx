import React from 'react';
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
  Select, 
  Textarea, 
  VStack,
  HStack,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { ChevronRight, Save, X, Image as ImageIcon } from 'lucide-react';
import Layout from '../components/Layout';

const CreateBranch = () => {
  return (
    <Layout>
      <Box>
        <Flex justify="space-between" align="center" mb="6">
          <Box>
            <Heading size="md" color="secondary">Create New Branch</Heading>
            <Breadcrumb spacing="8px" separator={<ChevronRight size={14} color="gray" />} mt="1">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" color="gray.500" fontSize="sm">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/manage-branches" color="gray.500" fontSize="sm">Branches</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" color="primary" fontSize="sm" fontWeight="600">Create Branch</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
        </Flex>

        <Box className="premium-card" p="8">
          <form>
            <VStack spacing="8" align="stretch">
              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="primary" display="inline-block" pb="1">Branch Information</Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 3, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Branch Name</FormLabel>
                      <Input placeholder="Enter branch name" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 3, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Branch Code</FormLabel>
                      <Input placeholder="e.g. BR-001" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 3, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Branch Category</FormLabel>
                      <Select placeholder="Select category" h="45px" borderRadius="lg">
                        <option>Retail Store</option>
                        <option>Warehouse</option>
                        <option>Distribution Center</option>
                      </Select>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="primary" display="inline-block" pb="1">Contact Details</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Branch Manager</FormLabel>
                      <Input placeholder="Full name" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Phone Number</FormLabel>
                      <Input placeholder="+1 (000) 000-0000" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Email Address</FormLabel>
                      <Input placeholder="branch@example.com" type="email" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="primary" display="inline-block" pb="1">Location Information</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Full Address</FormLabel>
                      <Textarea placeholder="Enter complete branch address" borderRadius="lg" rows={4} />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">City</FormLabel>
                      <Input placeholder="City" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Zip Code</FormLabel>
                      <Input placeholder="Zip Code" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box>
                <Heading size="sm" mb="6" color="secondary" borderBottom="2px solid" borderColor="primary" display="inline-block" pb="1">Login Credentials</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Login ID / Username</FormLabel>
                      <Input placeholder="Enter username" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Password</FormLabel>
                      <Input type="password" placeholder="Enter password" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box>
                <Heading size="sm" mb="4" color="secondary" borderBottom="2px solid" borderColor="primary" display="inline-block" pb="1">Branch Image</Heading>
                <Box 
                  border="2px dashed" 
                  borderColor="gray.200" 
                  borderRadius="xl" 
                  p="10" 
                  textAlign="center"
                  _hover={{ borderColor: 'primary', bg: 'primary.50' }}
                  cursor="pointer"
                  transition="all 0.2s"
                >
                  <VStack spacing="2">
                    <Icon as={ImageIcon} boxSize="10" color="gray.400" />
                    <Text fontWeight="700" color="secondary">Click to upload or drag and drop</Text>
                    <Text fontSize="xs" color="gray.500">PNG, JPG or GIF (max. 2MB)</Text>
                  </VStack>
                </Box>
              </Box>

              <Flex justify="end" gap="3" pt="6" borderTop="1px solid" borderColor="gray.100">
                <Button variant="outline" colorScheme="gray" leftIcon={<X size={18} />} px="8">
                  Cancel
                </Button>
                <Button colorScheme="brand" leftIcon={<Save size={18} />} px="10">
                  Save Branch
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Box>
    </Layout>
  );
};

export default CreateBranch;
