import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  // timeline: string;
  details: string;
  analysis: string;
};

export const Diary = ({ details, analysis }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`mt-4 w-full rounded-lg border border-gray-200`}>
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={toggleAccordion}
      >
        <h1 className="text-2xl font-semibold text-gray-800">日報</h1>
        <div>{isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}</div>
      </div>
      {isOpen && (
        <div className="rounded-b-lg border-t border-gray-200 px-6">
          <div className="mt-4 space-y-4">
            <div>
              <ReactMarkdown className="markdown">{details}</ReactMarkdown>
            </div>
            <div className="markdown">
              <h2 className="mt-2 font-semibold text-gray-800">AI分析</h2>
              <p className="mt-2 text-gray-700">{analysis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
