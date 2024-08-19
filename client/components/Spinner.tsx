'use client';
import React from 'react';
import { Spinner } from '@nextui-org/spinner';

export interface ISpinnerProps {
  loading?: boolean;
  spinner?: React.ReactNode;
  children?: React.ReactNode;
}

const MySpinner = (props: ISpinnerProps) => {
  const { loading } = props;
  if (loading) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
          {props.spinner ?? <Spinner />}
        </div>
        {props.children}
      </>
    );
  }
  return props.children;
};

export default MySpinner;
