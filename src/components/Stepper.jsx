import React from 'react';

export function Stepper({ currentStep, totalSteps = 3 }) {
  return (
    <div className="stepper-container">
      <div className="stepper-dots-track">
        {[1, 2, 3].map((step, idx) => (
          <React.Fragment key={step}>
            <div className={`stepper-circle ${currentStep === step ? 'active' : ''}`}>
              {step}
            </div>
            {idx < 2 && <div className="stepper-line"></div>}
          </React.Fragment>
        ))}
      </div>
      <span className="stepper-label">{currentStep} of {totalSteps}</span>
    </div>
  );
}
