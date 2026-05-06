import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#FFF4E8',
      100: '#FFE1C2',
      200: '#FFC58E',
      300: '#FFA95A',
      400: '#FF8D26',
      500: '#FF9F43', // Primary
      600: '#FF8A1D',
      700: '#E67414',
      800: '#B3580F',
      900: '#803D0B',
    },
    secondary: '#1B2850',
    dark: {
      500: '#1B2850', // Secondary
    }
  },
  fonts: {
    heading: '"Source Sans 3", sans-serif',
    body: '"Source Sans 3", sans-serif',
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '600',
        letterSpacing: '-0.02em',
      },
      sizes: {
        xl: { fontSize: ['xl', '2xl'], fontWeight: '700' },
        lg: { fontSize: ['lg', 'xl'] },
        md: { fontSize: ['md', 'lg'] },
        sm: { fontSize: ['sm', 'md'] },
        xs: { fontSize: ['xs', 'sm'] },
      }
    },
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        fontWeight: '600',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          }
        })
      }
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
          border: 'none',
        }
      }
    }
  }
});

export default theme;
