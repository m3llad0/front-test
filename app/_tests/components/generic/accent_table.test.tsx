import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { AccentTable } from '@components';

describe('AccentTable', () => {
  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Age', key: 'age' },
    { header: 'Actions', key: 'actions', render: (row: any) => <button>Edit {row.name}</button> }
  ];

  const rows = [
    { name: 'John', age: 25 },
    { name: 'Doe', age: 30 },
  ];

  test('renders the table header and footer correctly', () => {
    render(
      <AccentTable
        header={<h1>Table Header</h1>}
        columns={columns}
        rows={rows}
        footer={<div>Table Footer</div>}
      />
    );

    // Check if header is rendered
    expect(screen.getByText(/table header/i)).toBeInTheDocument();

    // Check if footer is rendered
    expect(screen.getByText(/table footer/i)).toBeInTheDocument();

    // Check if column headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('renders the table rows correctly', () => {
    render(
      <AccentTable
        columns={columns}
        rows={rows}
      />
    );

    // Check if rows are rendered
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();

    // Check if custom render works for actions column
    expect(screen.getByText('Edit John')).toBeInTheDocument();
    expect(screen.getByText('Edit Doe')).toBeInTheDocument();
  });

  test('does not render the footer when not provided', () => {
    render(<AccentTable columns={columns} rows={rows} />);

    // Check that footer is not rendered
    const footer = screen.queryByText(/table footer/i);
    expect(footer).not.toBeInTheDocument();
  });
});