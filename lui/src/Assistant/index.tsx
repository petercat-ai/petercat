import { CloseCircleFilled } from '@ant-design/icons';
import { ActionIcon } from '@ant-design/pro-editor';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import Chat, { ChatProps } from '../Chat';
import BubbleIcon from '../icons/BubbleIcon';

export interface AssistantProps extends ChatProps {
  showBubble: boolean;
  isVisible: boolean;
  onClose?: () => void;
}

const drawerWidth = 400;

const Assistant = (props: AssistantProps) => {
  const { showBubble = true, isVisible, onClose } = props;
  const [chatVisible, setChatVisible] = useState(isVisible);
  const [position, setPosition] = useState({ bottom: 120 });

  const toggleDrawer = () => {
    setChatVisible(!chatVisible);
    onClose?.();
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

  useEffect(() => {
    setChatVisible(isVisible);
  }, [isVisible]);

  const cls = classnames('fixed top-0 h-full ease-in flex flex-row z-[999] overflow-hidden text-left text-black rounded-l-[20px] border-[0.5px] border-[#E4E4E7] shadow-[0px_8px_32px_-12px_rgba(0,0,0,0.1)]', {
    [`right-[-400px]`]: !chatVisible,
    [`right-0`]: chatVisible,
    [`transition-[right]`]: chatVisible,
  });

  return (
    <div className="petercat-lui-assistant">
        <div
          className={cls}
          style={{
            width: drawerWidth,
            height: '100vh',
            zIndex: 9999,
            borderBottomLeftRadius: '20px!important',
            boxShadow: '0px 8px 32px -12px rgba(0, 0, 0, 0.1)',
          }}
        >
          {chatVisible && <>
            <Chat
              style={{ backgroundColor: '#FCFCFC' }}
              {...props}
              drawerWidth={drawerWidth}
            />
            <div className="absolute top-0 right-0 m-1">
              <ActionIcon
                icon={<CloseCircleFilled />}
                onClick={toggleDrawer}
                className="w-6 h-6"
              />
            </div>
          </>}
        </div>

        <>
          {showBubble && (
            <div
              className="fixed bottom-[120px] right-0 flex items-center justify-center rounded-full shadow-[0_8px_8px_-5px_#00000014,_0_16px_24px_-5px_#00000029] bg-white cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg active:cursor-grabbing"
              onMouseDown={startDrag}
              onClick={toggleDrawer}
              style={{
                bottom: `${position.bottom}px`,
                marginRight: '24px',
                zIndex: 9999,
              }}
            >
              <div
                id="petercat-lui-tip"
                className="animate-shake absolute top-[-9px] left-[-47px] px-[8px] py-[4px] w-[52px] h-[22px] bg-[#3F3F46] shadow-xl rounded-full rounded-br-none text-[10px] text-white"
                style={{ boxSizing: 'border-box' }}
              >
                Ask me
              </div>
              <BubbleIcon />
            </div>
          )}
        </>
    </div>
  );
};

export default Assistant;
