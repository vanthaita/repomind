import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <SignIn
      appearance={{
        variables: {
          colorPrimary: '#FF4081', // Example: Pink primary color
          fontFamily: 'Roboto, sans-serif',
        },
        elements: {
          rootBox: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Add a subtle shadow
            padding: '20px',
            borderRadius: '12px',
          },
          card: {
            border: '1px solid #ddd', // Example: Custom card border
          },
          formButtonPrimary: {
            backgroundColor: '#FF4081', // Match primary color
            color: 'white',
            '&:hover': {
              backgroundColor: '#F50057', // Darker shade on hover
            },
          },
          // ... more elements to customize (inputs, labels, etc.)
        },
      }}
    />
  );
}