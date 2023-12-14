'use client';
import React, { useState } from 'react';

export default function Test() {
  const [message, setMessage] = useState();

  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  fetch(`${url}/api/test`)
    .then((res) => res.json())
    .then((data) => {
      setMessage(data.message);
    });
  return <>{message}</>;
}
