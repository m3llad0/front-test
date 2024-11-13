import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@components';
import '@testing-library/jest-dom';

describe('Input', () => {
  test('renders with the correct initial value', () => {
    render(<Input initialValue="Test Value" />);

    // Check if the input has the correct initial value
    const inputElement = screen.getByDisplayValue('Test Value');
    expect(inputElement).toBeInTheDocument();
  });

  test('handles input change correctly', () => {
    const handleChange = jest.fn();
    render(<Input initialValue="Test Value" onChange={handleChange} />);

    // Find the input element and simulate typing
    const inputElement = screen.getByDisplayValue('Test Value');
    fireEvent.change(inputElement, { target: { value: 'New Value' } });

    // Check if the input value is updated and if the onChange handler is called
    expect(screen.getByDisplayValue('New Value')).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith('New Value');
  });

  test('applies custom className if provided', () => {
    render(<Input className="custom-class" />);

    const inputElement = screen.getByRole('textbox');
    // Check if the custom class is applied
    expect(inputElement).toHaveClass('custom-class');
  });

  test('displays the correct placeholder', () => {
    render(<Input placeholder="Enter text here" />);

    const inputElement = screen.getByPlaceholderText('Enter text here');
    expect(inputElement).toBeInTheDocument();
  });
});
