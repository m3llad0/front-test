import { render, screen } from '@testing-library/react';
import { H1 } from '@components';
import '@testing-library/jest-dom';

// Mock the Lato font className for testing
jest.mock('next/font/google', () => ({
  Lato: () => ({
    className: 'mock-lato-class',
  }),
}));

describe('Header1', () => {
  test('renders children correctly', () => {
    render(<H1>Test Header</H1>);

    // Check if the header text is rendered
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  test('applies the bold font style by default', () => {
    render(<H1>Bold Header</H1>);

    const headerElement = screen.getByText('Bold Header');

    // Check if the correct bold class is applied
    expect(headerElement).toHaveClass('font-bold');
  });

  test('applies the normal font style when regular prop is true', () => {
    render(<H1 regular>Regular Header</H1>);

    const headerElement = screen.getByText('Regular Header');

    // Check if the correct normal font class is applied
    expect(headerElement).toHaveClass('font-normal');
  });

  test('applies the Lato font class', () => {
    render(<H1>Lato Header</H1>);

    const headerElement = screen.getByText('Lato Header');

    // Check if the Lato font class is applied
    expect(headerElement).toHaveClass('mock-lato-class');
  });

  test('applies custom className if provided', () => {
    render(<H1 className="custom-class">Custom Header</H1>);

    const headerElement = screen.getByText('Custom Header');

    // Check if the custom class is applied
    expect(headerElement).toHaveClass('custom-class');
  });
});
