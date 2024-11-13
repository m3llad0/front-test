import { render, screen } from '@testing-library/react';
import { SelectGroup } from '@components';  // Adjust the import path if necessary
import '@testing-library/jest-dom';

describe('SelectGroup', () => {
  const columns = [
    { label: 'Column 1', render: () => <div>Custom Content 1</div> },
    { label: 'Column 2', render: () => <div>Custom Content 2</div> },
  ];

  test('renders the columns with their labels correctly', () => {
    render(<SelectGroup columns={columns} />);

    // Check if column labels are rendered
    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();

    // Check if custom content for each column is rendered
    expect(screen.getByText('Custom Content 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Content 2')).toBeInTheDocument();
  });

  test('renders the footer if provided', () => {
    render(<SelectGroup columns={columns} footer={<div>Footer Content</div>} />);

    // Check if the footer is rendered
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  // test('applies custom className if provided', () => {
  //   render(<SelectGroup columns={columns} className="custom-class" />);

  //   const container = screen.getByRole('group'); // Or another appropriate selector
  //   // Check if the custom class is applied
  //   expect(container).toHaveClass('custom-class');
  // });

  test('renders without footer if not provided', () => {
    render(<SelectGroup columns={columns} />);

    // Check that the footer does not exist in the document
    expect(screen.queryByText('Footer Content')).not.toBeInTheDocument();
  });
});
