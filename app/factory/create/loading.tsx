import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
      <Spinner />
    </div>
  );
}
