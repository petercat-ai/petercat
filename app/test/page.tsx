'use client';
import React, { useState } from 'react';

export default function Test() {
  const [message, setMessage] = useState();

  fetch(`/api/test`)
    .then((res) => res.json())
    .then((data) => {
      setMessage(data.message);
    });
  return <>{message}</>;
}
