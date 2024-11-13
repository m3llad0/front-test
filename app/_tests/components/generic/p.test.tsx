import { render, screen } from '@testing-library/react';
import { P } from '@components';
import '@testing-library/jest-dom';

describe('Paragraph', () => {
  test('renders the children correctly', () => {
    render(<P>Test Paragraph</P>);

    // Check if the text is rendered
    expect(screen.getByText('Test Paragraph')).toBeInTheDocument();
  });

  test('applies the correct className', () => {
    render(<P className="custom-class">Test Paragraph</P>);

    const paragraphElement = screen.getByText('Test Paragraph');

    // Check if the correct classes are applied
    expect(paragraphElement).toHaveClass('text-qt_dark custom-class');
  });

  test('passes down additional props correctly', () => {
    render(<P id="test-id">Test Paragraph</P>);

    const paragraphElement = screen.getByText('Test Paragraph');

    // Check if additional props are passed (like id)
    expect(paragraphElement).toHaveAttribute('id', 'test-id');
  });
});
