import { ArrowRightIcon } from "@icons";

interface ProposalProps {
  original_value: string;
  new_value: string;
  className?: string;
}

export default function Proposal({ original_value, new_value, className = '' }: ProposalProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {original_value}
      <ArrowRightIcon className='text-qt_dark mx-3 h-4 w-4' />
      {new_value}
    </div>
  );
}