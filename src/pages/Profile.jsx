import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Avatar, 
  Button, 
  Grid, 
  GridItem,
  VStack,
  HStack,
  Icon,
  Divider,
  Input,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { Camera, Mail, Phone, MapPin, Shield, Bell } from 'lucide-react';
import Layout from '../components/Layout';

const Profile = () => {
  return (
    <Layout>
      <Box>
        <Heading size="md" mb="6" color="secondary">User Profile</Heading>
        
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="6">
          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <VStack spacing="6" align="stretch">
              <Box className="premium-card" p="8" textAlign="center">
                <Box position="relative" display="inline-block" mb="4">
                  <Avatar size="2xl" name="Admin User" src="https://bit.ly/dan-abramov" border="4px solid white" shadow="lg" />
                  <IconButton 
                    aria-label="Change photo" 
                    icon={<Camera size={16} />} 
                    position="absolute" 
                    bottom="0" 
                    right="0" 
                    colorScheme="brand" 
                    borderRadius="full"
                    size="sm"
                  />
                </Box>
                <Heading size="md" color="secondary">Admin User</Heading>
                <Text color="gray.500" fontSize="sm">Super Administrator</Text>
                <HStack justify="center" mt="4" spacing="2">
                  <Badge colorScheme="green" variant="subtle">Active</Badge>
                  <Badge colorScheme="brand" variant="subtle">Pro Plan</Badge>
                </HStack>
              </Box>

              <Box className="premium-card" p="6">
                <Heading size="xs" mb="4" color="secondary" textTransform="uppercase">Contact Information</Heading>
                <VStack align="stretch" spacing="4">
                  <HStack spacing="4">
                    <Icon as={Mail} color="primary" />
                    <Box>
                      <Text fontSize="xs" color="gray.500">Email Address</Text>
                      <Text fontSize="sm" fontWeight="600">admin@dreamspos.com</Text>
                    </Box>
                  </HStack>
                  <HStack spacing="4">
                    <Icon as={Phone} color="primary" />
                    <Box>
                      <Text fontSize="xs" color="gray.500">Phone Number</Text>
                      <Text fontSize="sm" fontWeight="600">+1 234 567 890</Text>
                    </Box>
                  </HStack>
                  <HStack spacing="4">
                    <Icon as={MapPin} color="primary" />
                    <Box>
                      <Text fontSize="xs" color="gray.500">Location</Text>
                      <Text fontSize="sm" fontWeight="600">New York, USA</Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <Box className="premium-card" p="8">
              <Heading size="sm" mb="6" color="secondary">Account Settings</Heading>
              <VStack spacing="6" align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">First Name</FormLabel>
                      <Input defaultValue="Admin" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">Last Name</FormLabel>
                      <Input defaultValue="User" h="45px" borderRadius="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">Bio</FormLabel>
                      <Textarea placeholder="Tell us about yourself" borderRadius="lg" rows={4} />
                    </FormControl>
                  </GridItem>
                </Grid>
                
                <Divider />
                
                <Box>
                  <Heading size="xs" mb="4" color="secondary">Notifications</Heading>
                  <VStack align="stretch" spacing="3">
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="600" fontSize="sm">Email Notifications</Text>
                        <Text fontSize="xs" color="gray.500">Receive daily summary reports via email</Text>
                      </Box>
                      <Switch colorScheme="brand" defaultChecked />
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="600" fontSize="sm">Dispatch Alerts</Text>
                        <Text fontSize="xs" color="gray.500">Get notified when a branch receives stock</Text>
                      </Box>
                      <Switch colorScheme="brand" defaultChecked />
                    </Flex>
                  </VStack>
                </Box>

                <Flex justify="end" pt="4">
                  <Button colorScheme="brand" px="10" w={{ base: 'full', sm: 'auto' }}>Save Changes</Button>
                </Flex>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

import { IconButton, Badge, Switch, Textarea } from '@chakra-ui/react';

export default Profile;
