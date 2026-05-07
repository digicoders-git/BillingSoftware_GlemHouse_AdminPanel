import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E9F3F9',
      100: '#C8E2F0',
      200: '#A1CFE5',
      300: '#7BBBD9',
      400: '#54A8CD',
      500: '#298AC6', // Primary Blue
      600: '#216E9E',
      700: '#195377',
      800: '#10374F',
      900: '#081C28',
    },
    secondary: '#222021', // Dark Gray/Black
    dark: {
      500: '#222021',
    },
    background: '#EDEDEF', // Light Gray Background
    surface: '#FFFFFF',
    border: '#D1D5DB',
  },
  styles: {
    global: {
      body: {
        bg: '#EDEDEF',
        color: '#222021',
      }
    }
  },
  fonts: {
    heading: '"Source Sans 3", sans-serif',
    body: '"Source Sans 3", sans-serif',
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '700',
        color: '#222021',
        letterSpacing: '-0.02em',
      },
      sizes: {
        xl: { fontSize: ['xl', '2xl'], fontWeight: '800' },
        lg: { fontSize: ['lg', 'xl'] },
        md: { fontSize: ['md', 'lg'] },
        sm: { fontSize: ['sm', 'md'] },
        xs: { fontSize: ['xs', 'sm'] },
      }
    },
    Button: {
      baseStyle: {
        borderRadius: 'xl',
        fontWeight: '700',
        textTransform: 'none',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          }
        }),
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid',
          borderColor: 'gray.100',
          bg: 'white',
        }
      }
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderRadius: 'xl',
            bg: 'gray.50',
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px #298AC6',
            }
          }
        }
      }
    },
    Select: {
      variants: {
        outline: {
          field: {
            borderRadius: 'xl',
            bg: 'gray.50',
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px #298AC6',
            }
          }
        }
      }
    }
  }
});

export default theme;
