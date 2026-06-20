import { TbCheck } from 'react-icons/tb';

const OrderTrackingTimeline = ({ steps = [] }) => {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm transition-colors ${
                step.completed ? 'bg-accent text-white' : 'bg-white/5 text-white/30 border border-white/10'
              }`}
            >
              {step.completed ? <TbCheck /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-px flex-1 min-h-[36px] ${step.completed ? 'bg-accent' : 'bg-white/10'}`} />
            )}
          </div>
          <div className="pb-9">
            <div className={`text-sm font-medium ${step.completed ? 'text-white' : 'text-white/35'}`}>
              {step.label} {step.completed && '✓'}
            </div>
            {step.completedAt && (
              <div className="text-xs text-white/30 mt-0.5">
                {new Date(step.completedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTrackingTimeline;
