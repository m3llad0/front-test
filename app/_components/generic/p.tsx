interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Paragraph({ children, className = '', ...props }: ParagraphProps) {
  return (
    // font qt dark
    <p className={`text-qt_dark ${className}`} {...props}>
      {children}
    </p>
  );
}