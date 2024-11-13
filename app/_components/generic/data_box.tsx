import P from './p';
import H1 from './h1';

interface ParagraphProps {
  header: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: string;
  className?: string;
}

export default function DataBox({ header, value, subtitle, accent = '#2451E3', className = '' }: ParagraphProps) {
  return (
    <div className={`data-box flex items-center bg-white rounded-lg border border-qt_mid py-4 px-6  ${className}`}>
      <div className="flex items-stretch">
        <div className={`rounded`} style={{ backgroundColor: accent, width: '2px' }}></div>
        <div className="ml-4 flex flex-col justify-center">
          <P>{header}</P>
          <H1>{value}</H1>
          <P className='text-sm'>{subtitle}</P>
        </div>
      </div>
    </div>
  );
}
