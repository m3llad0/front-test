import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from '@components';
import '@testing-library/jest-dom';

// Mocking an example SVG icon for testing
const MockIcon = (props: any) => <svg {...props} data-testid="mock-icon" />;

describe('IconButton', () => {
  test('renders the icon correctly', () => {
    render(<IconButton icon={<MockIcon />} />);

    // Check if the icon is rendered correctly
    const iconElement = screen.getByTestId('mock-icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('h-6 w-6');
  });

  test('applies custom className if provided', () => {
    render(<IconButton icon={<MockIcon />} className="custom-class" />);

    const buttonElement = screen.getByRole('button');
    // Check if the custom class is applied to the button
    expect(buttonElement).toHaveClass('custom-class');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<IconButton icon={<MockIcon />} onClick={handleClick} />);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    // Check if onClick handler is called when the button is clicked
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('passes additional props to the button', () => {
    render(<IconButton icon={<MockIcon />} aria-label="icon button" />);

    const buttonElement = screen.getByRole('button');
    // Check if the aria-label is passed down correctly
    expect(buttonElement).toHaveAttribute('aria-label', 'icon button');
  });
});
