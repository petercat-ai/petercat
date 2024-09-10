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
          我们似乎遇到了一些导致崩溃的问题
          <br />
          请尝试刷新浏览器
        </p>
      </div>
    </div>
  );
};

export default Crash;
