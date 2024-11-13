import { render, screen, fireEvent } from '@testing-library/react';
import { QuantityInput } from '@components';  // Adjust the import path if necessary
import '@testing-library/jest-dom';

describe('QuantityInput', () => {
  test('renders with the correct initial value', () => {
    render(<QuantityInput initialValue={5} />);

    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement).toHaveValue(5);
  });

  test('increments value when + button is clicked', () => {
    const handleChange = jest.fn();
    render(<QuantityInput initialValue={5} onChange={handleChange} />);

    const incrementButton = screen.getByText('+');
    const inputElement = screen.getByRole('spinbutton');

    fireEvent.click(incrementButton);

    // Check if the value is incremented
    expect(inputElement).toHaveValue(6);
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  test('decrements value when - button is clicked', () => {
    const handleChange = jest.fn();
    render(<QuantityInput initialValue={5} onChange={handleChange} />);

    const decrementButton = screen.getByText('-');
    const inputElement = screen.getByRole('spinbutton');

    fireEvent.click(decrementButton);

    // Check if the value is decremented
    expect(inputElement).toHaveValue(4);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  test('does not decrement below the minimum value', () => {
    const handleChange = jest.fn();
    render(<QuantityInput initialValue={0} min={0} onChange={handleChange} />);

    const decrementButton = screen.getByText('-');
    const inputElement = screen.getByRole('spinbutton');

    fireEvent.click(decrementButton);

    // Check if the value stays at the minimum value
    expect(inputElement).toHaveValue(0);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('does not increment beyond the maximum value', () => {
    const handleChange = jest.fn();
    render(<QuantityInput initialValue={10} max={10} onChange={handleChange} />);

    const incrementButton = screen.getByText('+');
    const inputElement = screen.getByRole('spinbutton');

    fireEvent.click(incrementButton);

    // Check if the value stays at the maximum value
    expect(inputElement).toHaveValue(10);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('handles input change correctly', () => {
    const handleChange = jest.fn();
    render(<QuantityInput initialValue={5} onChange={handleChange} />);

    const inputElement = screen.getByRole('spinbutton');

    // Simulate typing a new value
    fireEvent.change(inputElement, { target: { value: '7' } });

    // Check if the value updates correctly
    expect(inputElement).toHaveValue(7);
    expect(handleChange).toHaveBeenCalledWith(7);
  });

  test('handles empty input by resetting to min value on blur', () => {
    const handleChange = jest.fn();
    render(<QuantityInput initialValue={5} min={1} onChange={handleChange} />);

    const inputElement = screen.getByRole('spinbutton');

    // Simulate empty input
    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.blur(inputElement);

    // Check if the value resets to min value
    expect(inputElement).toHaveValue(1);
    expect(handleChange).toHaveBeenCalledWith(1);
  });
});
