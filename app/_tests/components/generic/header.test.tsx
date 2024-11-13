import { render, screen } from "@testing-library/react";
import { Header } from "@components"; // Adjust the import path as needed
import { usePathname } from "next/navigation";
import '@testing-library/jest-dom';

// Mocking the `usePathname` function
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Define the type for HeaderProps if not already defined
interface HeaderProps {
  name: string;
  role: string;
  detail: string;
  // Add other props expected by the Header component here
}

describe("Header Component", () => {
  // Define defaultProps with all required fields for the Header component
  const defaultProps: HeaderProps = {
    name: "John Doe",
    role: "Admin",
    detail: "Admin Profile",
    // Add other required props as needed
  };

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/somepath");
  });

  test("renders search input with default SearchIcon", () => {
    render(<Header {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText("Busca dentro de la app");
    expect(searchInput).toBeInTheDocument();
  });

  test("renders bell icon with default BellIcon", () => {
    render(<Header {...defaultProps} />);
    const bellIcon = screen.getByText("🔔");
    expect(bellIcon).toBeInTheDocument();
  });

  test("renders ProfileChip with name and role", () => {
    render(<Header {...defaultProps} />);
    const profileChip = screen.getByText("John Doe");
    expect(profileChip).toBeInTheDocument();
  });

  // Add more tests as needed
});