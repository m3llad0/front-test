import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '@components';
import '@testing-library/jest-dom';

describe('Sidebar Component', () => {
  const toggleSidebar = jest.fn();
  const items = [
    { icon: <div>Icon</div>, name: 'Dashboard', link: '/dashboard' },
    { icon: <div>Icon</div>, name: 'Settings', link: '/settings' },
  ];
  const footer = { icon: <div>Icon</div>, text: 'Logout', link: '/logout' };

  test('renders the sidebar in collapsed state', () => {
    render(<Sidebar isOpen={false} toggleSidebar={toggleSidebar} items={items} footer={footer} MenuIcon={<div>Icon</div>} />);

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-16');

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  test('renders the sidebar in expanded state', () => {
    render(<Sidebar isOpen={true} toggleSidebar={toggleSidebar} items={items} footer={footer} MenuIcon={<div>Icon</div>} />);

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-64');

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('handles sidebar toggle button click', () => {
    render(<Sidebar isOpen={false} toggleSidebar={toggleSidebar} items={items} footer={footer} MenuIcon={<div>Icon</div>} />);

    const toggleButton = screen.getByRole('button', { name: 'Expand Sidebar' });
    fireEvent.click(toggleButton);

    expect(toggleSidebar).toHaveBeenCalled();
  });

  test('renders the items with correct links', () => {
    render(<Sidebar isOpen={true} toggleSidebar={toggleSidebar} items={items} footer={footer} MenuIcon={<div>Icon</div>} />);

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });

  test('renders the footer correctly', () => {
    render(<Sidebar isOpen={true} toggleSidebar={toggleSidebar} footer={footer} MenuIcon={<div>Icon</div>} />);

    const footerElement = screen.getByText('Logout').closest('a');
    expect(footerElement).toHaveAttribute('href', '/logout');
  });
});
