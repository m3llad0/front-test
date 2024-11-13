import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@components';
import '@testing-library/jest-dom';

describe('Button', () => {
  test('renders the button with correct text and class', () => {
    render(<Button className="custom-class">Click Me</Button>);

    const buttonElement = screen.getByText('Click Me');

    // Check if the button is rendered with the correct text
    expect(buttonElement).toBeInTheDocument();

    // Check if the button has the correct base classes and the custom class
    expect(buttonElement).toHaveClass('bg-qt_blue rounded-lg text-white font-roboto py-2 px-4 custom-class');
  });

  test('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const buttonElement = screen.getByText('Click Me');
    fireEvent.click(buttonElement);

    // Check if the click handler is called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('passes down additional props to the button', () => {
    render(<Button type="submit">Submit</Button>);

    const buttonElement = screen.getByText('Submit');

    // Check if the button has the correct type attribute
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});
