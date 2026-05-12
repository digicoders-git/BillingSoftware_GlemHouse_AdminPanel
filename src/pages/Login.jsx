import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Input, 
  Button, 
  FormControl, 
  FormLabel, 
  VStack, 
  Image,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userData', JSON.stringify(data));
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${data.name}!`,
        status: 'success',
        duration: 2000,
        position: 'top-right'
      });

      if (data.role === 'admin') {
        navigate('/');
      } else if (data.role === 'branch') {
        navigate('/branch/dashboard');
      } else if (data.role === 'sales') {
        navigate('/sales/dashboard');
      } else if (data.role === 'distributor') {
        navigate('/distributor/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="background" p="4">
      <Box 
        bg="white"
        w="full" 
        maxW="420px" 
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        boxShadow="0 10px 40px rgba(0,0,0,0.08)"
        border="1px solid"
        borderColor="gray.100"
      >
        <VStack spacing="4" align="center" mb="6">
          <Box 
            bg="#222021" 
            p="0" 
            borderRadius="2xl" 
            w="full" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            boxShadow="md"
          >
            <Image 
              src="/main.png" 
              alt="DreamsPOS Logo" 
              w="170px"
              h="auto"
            />
          </Box>
          <Box textAlign="center">
            <Heading size="md" color="#222021" fontWeight="800">Sign In</Heading>
            <Text fontSize="xs" color="gray.500" mt="1" fontWeight="500">Enter your credentials to access your panel</Text>
          </Box>
        </VStack>

        <form onSubmit={handleLogin}>
          <VStack spacing="4">
            <FormControl id="email" isRequired>
              <FormLabel fontSize="xs" mb="1" fontWeight="600" color="#222021">Email Address</FormLabel>
              <Input 
                type="email" 
                placeholder="admin@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                h="45px" 
                borderRadius="xl"
                bg="background"
                border="1px solid"
                borderColor="gray.200"
                fontSize="14px"
                _focus={{ borderColor: '#298AC6', bg: 'white', boxShadow: '0 0 0 1px #298AC6' }}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel fontSize="xs" mb="1" fontWeight="600" color="#222021">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  h="45px"
                  borderRadius="xl"
                  bg="background"
                  border="1px solid"
                  borderColor="gray.200"
                  fontSize="14px"
                  _focus={{ borderColor: '#298AC6', bg: 'white', boxShadow: '0 0 0 1px #298AC6' }}
                />
                <InputRightElement h="full" pr="2">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShow(!show)}
                    icon={show ? <EyeOff size={16} color="#637381" /> : <Eye size={16} color="#637381" />}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    _hover={{ bg: 'transparent', color: '#222021' }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button 
              type="submit"
              w="full" 
              bg="#298AC6"
              color="white" 
              h="45px" 
              fontSize="15px" 
              fontWeight="700"
              borderRadius="xl"
              mt="2"
              isLoading={loading}
              _hover={{ bg: '#216E9E', transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Sign In
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
