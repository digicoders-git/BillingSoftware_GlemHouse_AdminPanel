import { useState, useEffect, useRef } from 'react';
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
  Input,
  FormControl,
  FormLabel,
  IconButton,
  Badge,
  Textarea,
  useToast,
  Spinner} from '@chakra-ui/react';
import { 
  Camera, 
  MapPin, 
  Save, 
  Building2, 
  ShieldCheck, 
  Briefcase,
  ExternalLink,
  Lock,
  FileText} from 'lucide-react';
import Layout from '../components/Layout';
import API from '../utils/api';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [branchInfo, setBranchInfo] = useState(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    name: '',
    profilePic: '',
    role: ''
  });
  
  const toast = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      setProfile(data);
      
      // If branch manager, fetch branch details
      if (data.role === 'branch') {
        try {
          const branchRes = await API.get('/branch-inventory'); // Dashboard data usually has branch info
          setBranchInfo(branchRes.data.branch);
        } catch (e) {
          console.log("Branch info not available");
        }
      }
      
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        status: 'error',
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const { data } = await API.put('/users/profile', profile);
      setProfile(data);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
        status: 'success',
        duration: 3000,
        position: 'top-right'
      });
      // Notify navbar to update
      window.dispatchEvent(new Event('profile_updated'));
      setSaving(false);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
      setSaving(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await API.post('/upload', formData, config);
      const updatedProfile = { ...profile, profilePic: data };
      setProfile(updatedProfile);
      
      // Persist to database immediately
      await API.put('/users/profile', updatedProfile);
      
      setUploading(false);
      window.dispatchEvent(new Event('profile_updated'));
      toast({
        title: 'Image Uploaded',
        description: 'Bhai, profile image has been saved permanently.',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast({
        title: 'Upload Failed',
        description: 'Images only (jpg, jpeg, png)',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <Flex justify="center" align="center" h="70vh">
          <Spinner color="brand.500" size="xl" thickness="4px" />
        </Flex>
      </Layout>
    );
  }

  const getProfilePic = (pic) => {
    if (!pic) return 'https://bit.ly/dan-abramov';
    if (pic.startsWith('http')) return pic;
    const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5555';
    const path = pic.startsWith('uploads/') ? pic : `uploads/${pic}`;
    return `${API_URL}/${path}`;
  };

  return (
    <Layout>
      <Box pb="10">
        <Flex justify="space-between" align="center" mb="8">
           <Box>
              <Heading size="lg" color="secondary" fontWeight="800">My Account</Heading>
              <Text fontSize="sm" color="gray.500" fontWeight="500">Manage your personal information and settings</Text>
           </Box>
           <HStack spacing="3">
              <Button leftIcon={<Lock size={16} />} variant="outline" borderRadius="xl" size="sm" onClick={() => window.location.href='/change-password'}>Security</Button>
           </HStack>
        </Flex>
        
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="8">
          <GridItem colSpan={{ base: 3, lg: 1 }}>
            <VStack spacing="8" align="stretch">
              <Box className="premium-card" p="8" textAlign="center" position="relative">
                <Box 
                  position="absolute" 
                  top="0" left="0" right="0" h="100px" 
                  bgGradient="linear(to-r, brand.500, brand.300)" 
                  borderTopRadius="2xl"
                />
                
                <Box position="relative" display="inline-block" mt="4" mb="4">
                  <Avatar 
                    size="2xl" 
                    name={profile.name} 
                    src={getProfilePic(profile.profilePic)} 
                    border="4px solid white" 
                    shadow="2xl" 
                  />
                  <IconButton 
                    aria-label="Change photo" 
                    icon={uploading ? <Spinner size="xs" /> : <Camera size={16} />} 
                    position="absolute" 
                    bottom="2" 
                    right="2" 
                    colorScheme="brand" 
                    borderRadius="full"
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                    isDisabled={uploading}
                    shadow="lg"
                  />
                  <Input 
                    type="file" 
                    display="none" 
                    ref={fileInputRef} 
                    onChange={uploadFileHandler} 
                  />
                </Box>
                <Heading size="md" color="secondary" fontWeight="800">{profile.name}</Heading>
                <Text color="gray.500" fontSize="sm" fontWeight="600" mb="4">
                   {profile.role === 'admin' ? 'System Administrator' : `${branchInfo?.name || 'Branch'} Manager`}
                </Text>
                
                <HStack justify="center" spacing="2" mb="2">
                  <Badge colorScheme="green" variant="solid" borderRadius="full" px="3">Verified Account</Badge>
                  <Badge colorScheme="brand" variant="subtle" borderRadius="full" px="3">{profile.role.toUpperCase()}</Badge>
                </HStack>
              </Box>

              <Box className="premium-card" p="6">
                <HStack mb="6" spacing="3">
                   <Box p="2" bg="brand.50" color="brand.500" borderRadius="lg"><Building2 size={18}/></Box>
                   <Heading size="xs" color="secondary" textTransform="uppercase" letterSpacing="wider">Work Details</Heading>
                </HStack>
                <VStack align="stretch" spacing="5">
                  <HStack spacing="4">
                    <Icon as={ShieldCheck} color="brand.500" size={18} />
                    <Box>
                      <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Designation</Text>
                      <Text fontSize="sm" fontWeight="700" color="secondary">{profile.role === 'admin' ? 'Master Admin' : 'Branch Manager'}</Text>
                    </Box>
                  </HStack>
                  <HStack spacing="4">
                    <Icon as={MapPin} color="brand.500" size={18} />
                    <Box>
                      <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Working At</Text>
                      <Text fontSize="sm" fontWeight="700" color="secondary">{branchInfo?.name || 'Main Office'}</Text>
                    </Box>
                  </HStack>
                  {branchInfo && (
                    <HStack spacing="4">
                       <Icon as={Briefcase} color="brand.500" size={18} />
                       <Box>
                         <Text fontSize="10px" fontWeight="800" color="gray.400" textTransform="uppercase">Branch ID</Text>
                         <Text fontSize="sm" fontWeight="700" color="secondary">#BRN-{branchInfo._id?.slice(-6).toUpperCase()}</Text>
                       </Box>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={{ base: 3, lg: 2 }}>
            <Box className="premium-card" p="8">
              <HStack mb="8" spacing="3" justify="space-between">
                 <HStack spacing="3">
                    <Box p="2.5" bg="blue.50" color="blue.500" borderRadius="xl"><FileText size={20}/></Box>
                    <Heading size="sm" color="secondary" fontWeight="700">Account Information</Heading>
                 </HStack>
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    color="brand.500" 
                    rightIcon={<ExternalLink size={14} />}
                    onClick={() => window.dispatchEvent(new Event('profile_updated'))}
                 >
                    Sync Data
                 </Button>
              </HStack>

              <VStack spacing="8" align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="xs" fontWeight="700" color="gray.500">FIRST NAME</FormLabel>
                      <Input 
                        value={profile.firstName || ''} 
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        h="55px" borderRadius="xl" bg="gray.50" border="none"
                        placeholder="John"
                        _focus={{ bg: 'white', shadow: 'md' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="xs" fontWeight="700" color="gray.500">LAST NAME</FormLabel>
                      <Input 
                        value={profile.lastName || ''} 
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        h="55px" borderRadius="xl" bg="gray.50" border="none"
                        placeholder="Doe"
                        _focus={{ bg: 'white', shadow: 'md' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isReadOnly>
                      <FormLabel fontSize="xs" fontWeight="700" color="gray.500">EMAIL ADDRESS (LOCKED)</FormLabel>
                      <Input 
                        value={profile.email} 
                        h="55px" borderRadius="xl" bg="gray.100" border="none" color="gray.500"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl>
                      <FormLabel fontSize="xs" fontWeight="700" color="gray.500">PHONE NUMBER</FormLabel>
                      <Input 
                        value={profile.phone || ''} 
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        h="55px" borderRadius="xl" bg="gray.50" border="none"
                        placeholder="+91 0000000000"
                        _focus={{ bg: 'white', shadow: 'md' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize="xs" fontWeight="700" color="gray.500">LOCATION / ADDRESS</FormLabel>
                      <Input 
                        value={profile.location || ''} 
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        h="55px" borderRadius="xl" bg="gray.50" border="none"
                        placeholder="City, State, Country"
                        _focus={{ bg: 'white', shadow: 'md' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize="xs" fontWeight="700" color="gray.500">PERSONAL BIO</FormLabel>
                      <Textarea 
                        value={profile.bio || ''} 
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Write a short bio about yourself..." 
                        borderRadius="xl" rows={5} bg="gray.50" border="none"
                        _focus={{ bg: 'white', shadow: 'md' }}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
                
                <Box pt="4">
                   <Button 
                    colorScheme="brand" 
                    px="12" 
                    h="60px"
                    w={{ base: 'full', sm: 'auto' }}
                    leftIcon={<Save size={20} />}
                    isLoading={saving}
                    onClick={handleUpdate}
                    borderRadius="2xl"
                    fontSize="md"
                    fontWeight="800"
                    shadow="0 10px 25px rgba(41, 138, 198, 0.4)"
                    _hover={{ transform: 'translateY(-2px)', shadow: '0 15px 30px rgba(41, 138, 198, 0.5)' }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Profile;
