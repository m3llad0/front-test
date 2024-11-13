import { render, screen } from '@testing-library/react';
import { ProfileChip } from '@components';
import '@testing-library/jest-dom';
import { useRouter, usePathname } from 'next/navigation';

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('ProfileChip Component', () => {
  beforeEach(() => {
    // Mock the pathname to test the profile URL behavior
    (usePathname as jest.Mock).mockReturnValue('/home');
  });

  test('renders the profile chip with initials when no image is provided', () => {
    render(<ProfileChip name="John Doe" detail="Developer" />);

    const initials = screen.getByText('J');
    expect(initials).toBeInTheDocument();

    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toBeInTheDocument();

    const detailElement = screen.getByText('Developer');
    expect(detailElement).toBeInTheDocument();
  });

  test('renders the profile chip with an image when provided', () => {
    render(
      <ProfileChip
        name="John Doe"
        detail="Developer"
        image="https://example.com/profile.jpg"
      />
    );
  
    const image = screen.getByAltText('John Doe');
    expect(image).toBeInTheDocument();
  
    // Check that the image `src` contains the Next.js optimized URL
    expect(image).toHaveAttribute('src');
    const srcValue = image.getAttribute('src') || '';
    expect(srcValue).toContain('/_next/image');
  });

  test('creates correct profile link based on the current path', () => {
    render(<ProfileChip name="John Doe" detail="Developer" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/home/perfil'); // Assuming the mocked pathname is '/home'
  });
});
