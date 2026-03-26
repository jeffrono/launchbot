"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Step {
  title: string;
  description: string;
  imageUrl?: string;
}

interface StepByStepProps {
  title: string;
  steps: Step[];
  onComplete: (value: string) => void;
}

export function StepByStep({ title, steps, onComplete }: StepByStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markDone = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(`I've completed all ${steps.length} steps of: ${title}`);
    }
  };

  const step = steps[currentStep];
  const allDone = completedSteps.size === steps.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[85%]"
    >
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {/* Header with progress */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <span className="text-xs text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          {/* Step indicators */}
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  completedSteps.has(i)
                    ? "bg-green-500"
                    : i === currentStep
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center flex-shrink-0">
                {completedSteps.has(currentStep) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  currentStep + 1
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none prose-p:my-1">
                  <ReactMarkdown>{step.description}</ReactMarkdown>
                </div>
              </div>
            </div>

            {step.imageUrl && (
              <div className="mt-3 ml-10 rounded-xl overflow-hidden border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.imageUrl} alt={step.title} className="w-full" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <div className="px-5 pb-4 flex items-center gap-2">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {!allDone ? (
            <button
              onClick={markDone}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Got it <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> All done!
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <Check className="w-4 h-4" /> All steps completed!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
