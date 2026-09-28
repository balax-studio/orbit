import React from 'react';
import { TutorialManager, type TutorialTask } from '../../domain/tutorial/TutorialManager';

interface TutorialWidgetProps {
  tutorialManager: TutorialManager;
}

export const TutorialWidget: React.FC<TutorialWidgetProps> = ({ tutorialManager }) => {
  const task: TutorialTask = tutorialManager.getTaskDetails();

  if (task.id === 'COMPLETED') {
    return null; // Eğitim bittiyse gizle
  }

  return (
    <div 
      className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-1 w-64 bg-[#FFE156] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3"
    >
      <div className="flex items-center justify-between border-b-2 border-black pb-1 mb-1">
        <span className="text-xs font-black uppercase tracking-wider text-black">A2 EĞİTİM GÖREVİ</span>
        {task.id === 'WELCOME' && (
          <span className="animate-pulse w-3 h-3 bg-red-500 border-2 border-black rounded-none"></span>
        )}
      </div>
      <h3 className="text-sm font-bold text-black">{task.title}</h3>
      <p className="text-xs font-medium text-black leading-tight">
        {task.description}
      </p>
    </div>
  );
};
