import React, { createContext, useState, ReactNode } from 'react';

export type Survey = {
  id: string;
  siteName: string;
  clientName: string;
  description: string;
  priority: string;
  date: string;
};

type SurveyContextType = {
  surveys: Survey[];
  addSurvey: (survey: Survey) => void;
};

export const SurveyContext = createContext<SurveyContextType>({
  surveys: [],
  addSurvey: () => {},
});

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      siteName: 'Site A Inspection',
      clientName: 'Acme Corp',
      description: '',
      priority: 'High',
      date: '2023-10-25 10:30 AM',
    },
    {
      id: '2',
      siteName: 'Downtown Plot',
      clientName: 'Globex',
      description: '',
      priority: 'Medium',
      date: '2023-10-25 09:15 AM',
    },
  ]);

  const addSurvey = (survey: Survey) => {
    setSurveys((prev) => [survey, ...prev]);
  };

  return (
    <SurveyContext.Provider value={{ surveys, addSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export default function SurveyContextComponent() {
  return null;
}
