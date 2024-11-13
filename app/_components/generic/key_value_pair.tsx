import { P } from '@components';

interface KeyValuePairProps {
  keyName: string;
  value: string | number;
  className?: string;
}

export default function KeyValuePair({ keyName, value, className }: KeyValuePairProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <P className='text-sm text-qt_primary font-bold'>{keyName}</P>
      <P className='text-sm text-qt_primary font-normal'>{value.toLocaleString()}</P>
    </div>
  )
}