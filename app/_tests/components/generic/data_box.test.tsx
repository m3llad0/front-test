import { render, screen } from '@testing-library/react';
import { DataBox } from '@components'; // Assuming DataBox is in the same directory
import '@testing-library/jest-dom';

describe('DataBox Component', () => {
  test('renders header, value, and subtitle correctly', () => {
    render(
      <DataBox
        header="Test Header"
        value="Test Value"
        subtitle="Test Subtitle"
      />
    );

    // Check if header, value, and subtitle are rendered correctly
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  test('does not render subtitle when not provided', () => {
    render(
      <DataBox
        header="Test Header"
        value="Test Value"
      />
    );

    // Subtitle should not exist in the document
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  test('applies the accent color correctly', () => {
    const { container } = render(
      <DataBox
        header="Test Header"
        value="Test Value"
        accent="#FF0000" // Custom accent color
      />
    );

    // Check if the accent color is applied correctly
    const accentDiv = container.querySelector('div[style]');
    expect(accentDiv).toHaveStyle('background-color: #FF0000');
  });

  test('renders with default accent color when not provided', () => {
    const { container } = render(
      <DataBox
        header="Test Header"
        value="Test Value"
      />
    );

    // Check if the default accent color is applied
    const accentDiv = container.querySelector('div[style]');
    expect(accentDiv).toHaveStyle('background-color: #2451E3'); // Default accent color
  });

  test('applies custom className if provided', () => {
    const { container } = render(
      <DataBox
        header="Test Header"
        value="Test Value"
        className="custom-class"
      />
    );

    // Check if the custom class is applied
    const dataBoxElement = container.querySelector('.data-box');
    expect(dataBoxElement).toHaveClass('custom-class');
  });
});