import { render, screen } from '@testing-library/react';
import { KeyValuePair } from '@components';  // Adjust import path if needed
import '@testing-library/jest-dom';

describe('KeyValuePair', () => {
  test('renders keyName and value correctly', () => {
    render(<KeyValuePair keyName="Test Key" value={1234} />);

    // Check if keyName is rendered
    expect(screen.getByText('Test Key')).toBeInTheDocument();

    // Check if value is rendered and formatted
    expect(screen.getByText('1,234')).toBeInTheDocument();  // .toLocaleString() formats the number
  });

  test('applies custom className if provided', () => {
    render(<KeyValuePair keyName="Test Key" value={1234} className="custom-class" />);

    // Check if the custom class is applied to the wrapper div
    const wrapperElement = screen.getByText('Test Key').closest('div');
    expect(wrapperElement).toHaveClass('custom-class');
  });

  test('handles string values correctly', () => {
    render(<KeyValuePair keyName="Test Key" value="Test Value" />);

    // Check if value as a string is rendered correctly
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });
});
