import { render, screen } from '@testing-library/react';
import { BottomNav } from '@components';
import '@testing-library/jest-dom';

// Mock the useRouter hook for testing Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('BottomNav', () => {
  const items = [
    { icon: <svg data-testid="home-icon" />, name: 'Home', link: '/' },
    { icon: <svg data-testid="search-icon" />, name: 'Search', link: '/search' },
    { icon: <svg data-testid="profile-icon" />, name: 'Profile', link: '/profile' },
  ];

  test('renders the navigation items correctly', () => {
    render(<BottomNav items={items} />);

    // Check if icons are rendered
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();

    // Check if the names are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();

    // Check if links are correct
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Search').closest('a')).toHaveAttribute('href', '/search');
    expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/profile');
  });
});