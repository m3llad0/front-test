import { Lato } from "next/font/google";

const lato = Lato({
  weight: ["400","700","900",],
  subsets: ["latin"],
});

interface HeaderProps {
  children: React.ReactNode;
  regular?: boolean;  // Add a prop to control the boldness
  className?: string;
}

export default function Header1({ children, regular = false, className = '' }: HeaderProps) {
  return (
    <h1 className={`text-3xl tracking-tight ${lato.className} ${regular ? 'font-normal' : 'font-bold'} ${className}`}>
      {children}
    </h1>
  );
}