import { render, screen } from '@testing-library/react';
import { GrilledTable } from '@components';
import '@testing-library/jest-dom';

describe('GrilledTable', () => {
  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Age', key: 'age' },
    { header: 'Actions', key: 'actions', render: (row: any) => <button>Edit {row.name}</button> }
  ];

  const rows = [
    { name: 'John', age: 25 },
    { name: 'Doe', age: 30 },
  ];

  test('renders the title, header, and footer correctly', () => {
    render(
      <GrilledTable
        title={<h1>Test Title</h1>}
        header={<h2>Test Header</h2>}
        columns={columns}
        rows={rows}
        footer={<div>Test Footer</div>}
      />
    );

    // Check if title is rendered
    expect(screen.getByText(/test title/i)).toBeInTheDocument();

    // Check if header is rendered
    expect(screen.getByText(/test header/i)).toBeInTheDocument();

    // Check if footer is rendered
    expect(screen.getByText(/test footer/i)).toBeInTheDocument();
  });

  test('renders the table columns and rows correctly', () => {
    render(
      <GrilledTable
        columns={columns}
        rows={rows}
      />
    );

    // Check if columns are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check if rows are rendered
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();

    // Check if custom render works for actions column
    expect(screen.getByText('Edit John')).toBeInTheDocument();
    expect(screen.getByText('Edit Doe')).toBeInTheDocument();
  });

  test('renders without title and footer when not provided', () => {
    render(<GrilledTable columns={columns} rows={rows} />);

    // Check that title and footer are not rendered
    const title = screen.queryByText(/test title/i);
    const footer = screen.queryByText(/test footer/i);

    expect(title).not.toBeInTheDocument();
    expect(footer).not.toBeInTheDocument();
  });
});
