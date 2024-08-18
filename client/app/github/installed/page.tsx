'use client';

import React from 'react';

export default function GithubAppInstalled() {
  return (
    <div className="flex h-screen w-full flex-col items-center bg-white pb-16 pt-20 sm:pb-20 md:pt-36 lg:py-32">
      <p className='font-display text-4xl font-bold tracking-tight text-slate-900'>
        Installation Approved
      </p>
      <p>
        Thank you for installing PeterCat's GitHub App!
      </p>
      <p>
        Your Team will now be able to use robots for your GitHub organization!
      </p>
    </div>
  )
}
