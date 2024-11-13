interface StepperProps {
  steps: { label: string }[];
  currentStep: number;
  className?: string;
  spacing?: number;
}

export default function Stepper({ steps, currentStep, className, spacing=20 }: StepperProps) {
  return (
    <div className={`flex items-center w-full ${className}`}>
      {steps.map((step, index) => (
        <div key={index} 
          className="relative flex-1 flex flex-col items-center"
        >
          {/* Step Line (Only if it's not the last step) */}
          {index < steps.length - 1 && (
            <div
              className={`absolute top-4 left-1/2 w-full h-1 ${
                index < currentStep
                  ? 'bg-qt_blue'
                  : 'bg-qt_mid'
              } z-0 `}
              style={{ 
                height: index < currentStep ? '2px' : '1px' // Make the line thicker for passed steps
              }}
            />
          )}

          {/* Step Circle */}
          <div
            className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center ${
              index < currentStep
                ? 'bg-qt_blue text-white border-qt_blue'
                : currentStep === index
                ? 'bg-white text-qt_blue border-qt_blue'
                : 'bg-white text-gray-500 border-gray-300'
            }`}
          >
            {index + 1}
          </div>

          {/* Step Label */}
          <div
            className={`mt-2 text-center whitespace-nowrap ${
              currentStep === index ? 'text-qt_blue' : 'text-gray-500'
            }`}
          >
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}
