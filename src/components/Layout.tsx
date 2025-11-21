import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useWizardStore } from '../stores/useWizardStore';
import { useProjectStore } from '../stores/useProjectStore';
import { SaveIndicator } from './SaveIndicator';
import { Progress } from './ui';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { currentStep, steps, isStepCompleted } = useWizardStore();
  const { currentProject } = useProjectStore();

  const isWizardPage = location.pathname.startsWith('/wizard');

  if (!isWizardPage) {
    return <Outlet />;
  }

  const completedSteps = steps.filter((step) => isStepCompleted(step.id)).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-primary-600">
                StartupPlan
              </Link>
              {currentProject && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-700 font-medium">{currentProject.name}</span>
                </>
              )}
            </div>
            <SaveIndicator />
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">진행률</span>
              <span className="text-sm font-medium text-gray-900">
                {completedSteps}/{steps.length}
              </span>
            </div>
            <Progress value={progressPercentage} showLabel />
          </div>

          <nav className="space-y-1">
            {steps.map((step) => {
              const isCompleted = isStepCompleted(step.id);
              const isCurrent = currentStep === step.id;

              return (
                <Link
                  key={step.id}
                  to={`/wizard/${step.id}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isCurrent
                      ? 'bg-primary-50 text-primary-700'
                      : isCompleted
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full text-xs flex-shrink-0',
                    isCurrent
                      ? 'bg-primary-600 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="truncate">{step.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

