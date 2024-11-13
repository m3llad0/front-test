import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { Table }  from '@components';
describe('Table Component', () => {
    const columns = [
        { header: 'Name', key: 'name' },
        { header: 'Age', key: 'age' },
    ];

    const rows = [
        { name: 'John Doe', age: 30 },
        { name: 'Jane Doe', age: 25 },
    ];

    it('renders correctly with given columns and rows', () => {
        render(<Table columns={columns} rows={rows} />);
        
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
        
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('renders action buttons when renderActionButton is provided', () => {
        const renderActionButton = (row: any) => <button>Action</button>;
        
        render(<Table columns={columns} rows={rows} renderActionButton={renderActionButton} />);
        
        expect(screen.getAllByText('Action')).toHaveLength(rows.length);
    });

    it('applies the given className correctly', () => {
        const className = 'custom-class';
        
        const { container } = render(<Table columns={columns} rows={rows} className={className} />);
        
        expect(container.firstChild).toHaveClass(className);
    });
});