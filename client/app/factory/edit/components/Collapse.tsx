import ChevronDownIcon from '@/public/icons/ChevronDownIcon';
import React, { useState, ReactNode } from 'react';

interface CollapseProps {
  title: string;
  children: ReactNode;
}

const Collapse: React.FC<CollapseProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="overflow-hidden cursor-pointer">
      <div
        className="flex items-center w-full text-foreground text-m"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDownIcon className="mr-1" />
        ) : (
          <ChevronDownIcon className="mr-1 transform -rotate-90" />
        )}
        {title}
      </div>
      <div
        className={`transition-height duration-300 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        } overflow-hidden`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Collapse;
