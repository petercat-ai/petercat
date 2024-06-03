import { CloseCircleFilled } from '@ant-design/icons';
import { type MetaData } from '@ant-design/pro-chat';
import { ActionIcon } from '@ant-design/pro-editor';
import React, { useState } from 'react';
import Chat from '../Chat';

export interface AssistantProps {
  assistantMeta?: MetaData;
  host?: string;
}

const drawerWidth = 400; // Tailwind doesn't support custom width directly, you might need to handle this separately

const Assistant = (props: AssistantProps) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [position, setPosition] = useState({ bottom: 120 });

  // Toggle the visibility of the drawer
  const toggleDrawer = () => {
    setChatVisible(!chatVisible);
  };

  const startDrag = (e: { clientY: any; preventDefault: () => void }) => {
    const startY = e.clientY;
    const initBottom = position.bottom;

    const onMouseMove = (moveEvent: { clientY: number }) => {
      const dy = moveEvent.clientY - startY;
      setPosition({ bottom: Math.max(0, initBottom - dy) });
    };

    const onMouseUp = () => {
      // Remove the event listeners when the mouse is released
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // Add mousemove and mouseup event listeners to the document
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    e.preventDefault(); // Prevent text selection
  };
  return (
    <div className="petercat-lui">
      {chatVisible ? (
        <div
          className="fixed right-0 top-0 h-full bg-[#FCFCFC] flex flex-row z-[999] overflow-hidden text-left text-black rounded-tl-[20px] rounded-bl-[20px]"
          style={{ width: drawerWidth, zIndex: 9999,borderBottomLeftRadius: "20px!important",boxShadow: "0px 8px 32px -12px rgba(0, 0, 0, 0.1)" }}
        >
          <Chat {...props} drawerWidth={drawerWidth} />
          <div className="absolute top-0 right-0 m-1">
            <ActionIcon
              icon={<CloseCircleFilled />}
              onClick={toggleDrawer}
              className="w-6 h-6"
            />
          </div>
        </div>
      ) : (
          <div
          className="fixed bottom-[120px] right-0 w-14 h-8 flex items-center justify-center rounded-full border border-[#ececee] shadow-[0_3.2px_12px_#00000014,_0_5px_25px_#0000000a] bg-white cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg active:cursor-grabbing"
          onMouseDown={startDrag}
          onClick={toggleDrawer}
          style={{
            bottom: `${position.bottom}px`,
            marginRight: '-18px',
            zIndex: 9999,
          }}
        >
          <img
            src={
              props.assistantMeta?.avatar ||
              'https://mdn.alipayobjects.com/huamei_yhboz9/afts/img/A*li7ySppF7TYAAAAAAAAAAAAADlDCAQ/original'
            }
            className="absolute left-2 w-6 h-6 rounded-full top-1/2 transform -translate-y-1/2"
          />
        </div>
      )}
    </div>
  );
};

export default Assistant;
