import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '@components';  // Adjust the import path if necessary
import '@testing-library/jest-dom';

describe('Select Component', () => {
  const options = [
    { value: '1', label: 'Option 1', extraText: 'Extra 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3', extraText: 'Extra 3' },
  ];

  test('renders the correct options', () => {
    render(<Select options={options} />);

    // Check if all options are rendered correctly
    expect(screen.getByText('Option 1 (Extra 1)')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3 (Extra 3)')).toBeInTheDocument();
  });

  test('handles selection change', () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);

    const selectElement = screen.getByRole('combobox');
    
    // Simulate selecting the second option
    fireEvent.change(selectElement, { target: { value: '2' } });

    // Check if the onChange handler is called with the correct value
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  test('applies the initial value', () => {
    render(<Select options={options} initialValue="3" />);

    // Check if the initial value is applied
    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectElement.value).toBe('3');
  });

  test('applies custom className if provided', () => {
    render(<Select options={options} className="custom-class" />);

    // Check if the custom class is applied
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('custom-class');
  });
});
