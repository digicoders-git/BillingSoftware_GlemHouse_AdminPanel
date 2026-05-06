import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { Eye, EyeOff, Save, Lock } from 'lucide-react';
import Layout from '../components/Layout';

const ChangePassword = () => {
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: 'Password updated.',
      description: "Your password has been changed successfully.",
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <Layout>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="6" gap="4">
          <Box>
            <Heading size="md" color="secondary">Change Password</Heading>
            <Text fontSize="sm" color="gray.500">Update your account security credentials</Text>
          </Box>
        </Flex>

        <Box className="premium-card" p={{ base: 6, md: 8 }}>
          <VStack spacing="6" align="stretch" maxW="600px">
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600">Current Password</FormLabel>
              <InputGroup size="lg">
                <Input 
                  type={showOld ? 'text' : 'password'} 
                  placeholder="Enter current password" 
                  borderRadius="lg"
                  fontSize="md"
                  bg="gray.50"
                  _focus={{ bg: 'white', borderColor: 'brand.500' }}
                />
                <InputRightElement h="full">
                  <IconButton 
                    variant="ghost" 
                    icon={showOld ? <EyeOff size={18} /> : <Eye size={18} />} 
                    onClick={() => setShowOld(!showOld)} 
                    aria-label="Toggle visibility"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600">New Password</FormLabel>
              <InputGroup size="lg">
                <Input 
                  type={showNew ? 'text' : 'password'} 
                  placeholder="Enter new password" 
                  borderRadius="lg"
                  fontSize="md"
                  bg="gray.50"
                  _focus={{ bg: 'white', borderColor: 'brand.500' }}
                />
                <InputRightElement h="full">
                  <IconButton 
                    variant="ghost" 
                    icon={showNew ? <EyeOff size={18} /> : <Eye size={18} />} 
                    onClick={() => setShowNew(!showNew)} 
                    aria-label="Toggle visibility"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600">Confirm New Password</FormLabel>
              <InputGroup size="lg">
                <Input 
                  type={showConfirm ? 'text' : 'password'} 
                  placeholder="Confirm new password" 
                  borderRadius="lg"
                  fontSize="md"
                  bg="gray.50"
                  _focus={{ bg: 'white', borderColor: 'brand.500' }}
                />
                <InputRightElement h="full">
                  <IconButton 
                    variant="ghost" 
                    icon={showConfirm ? <EyeOff size={18} /> : <Eye size={18} />} 
                    onClick={() => setShowConfirm(!showConfirm)} 
                    aria-label="Toggle visibility"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button 
              colorScheme="brand" 
              size="lg" 
              h="50px" 
              borderRadius="xl" 
              leftIcon={<Save size={20} />}
              onClick={handleSave}
              w={{ base: 'full', sm: '200px' }}
              boxShadow="0 4px 14px 0 rgba(255, 159, 67, 0.39)"
            >
              Update Password
            </Button>
          </VStack>
        </Box>
      </Box>
    </Layout>
  );
};

export default ChangePassword;
