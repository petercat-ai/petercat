import I18N from '@/app/utils/I18N';
import React from 'react';

const Crash: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen text-center mt-[-80px]">
      <div>
        <img
          style={{ maxHeight: '300px', minHeight: '200px', width: 'auto' }}
          src="/images/crash.svg"
          alt="Error Illustration"
          className="mb-4 w-24"
        />
        <p className="text-base text-gray-500">
          {I18N.components.Crash.woMenSiHuYu}<br />
          {I18N.components.Crash.qingChangShiShuaXin}</p>
      </div>
    </div>
  );
};

export default Crash;
