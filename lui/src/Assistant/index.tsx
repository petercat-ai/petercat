import { CloseCircleFilled } from '@ant-design/icons';
import { ActionIcon } from '@ant-design/pro-editor';
import React, { useEffect, useState } from 'react';
import Chat, { ChatProps } from '../Chat';
import BubbleIcon from '../icons/BubbleIcon';

export interface AssistantProps extends ChatProps {
  showBubble: boolean;
  visible: boolean;
}

const drawerWidth = 400;

const Assistant = (props: AssistantProps) => {
  const { showBubble = true, visible } = props;
  const [chatVisible, setChatVisible] = useState(visible);
  const [position, setPosition] = useState({ bottom: 120 });

  const toggleDrawer = () => {
    setChatVisible(!chatVisible);
  };

  const startAnimation = () => {
    const element = document.getElementById('petercat-lui-tip');
    if (!element) {
      return;
    }
    if (!element.classList.contains('animate-shake')) {
      element.classList.add('animate-shake');
    }
  };

  const stoptAnimation = () => {
    const element = document.getElementById('petercat-lui-tip');
    if (!element) {
      return;
    }
    if (element.classList.contains('animate-shake')) {
      element.classList.remove('animate-shake');
    }
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
    setChatVisible(visible);
  }, [visible]);

  return (
    <div className="petercat-lui">
      {chatVisible ? (
        <div
          className="fixed right-0 top-0 h-full flex flex-row z-[999] overflow-hidden text-left text-black rounded-tl-[20px] rounded-bl-[20px] border-[0.5px] border-[#E4E4E7] shadow-[0px_8px_32px_-12px_rgba(0,0,0,0.1)]"
          style={{
            width: drawerWidth,
            zIndex: 9999,
            borderBottomLeftRadius: '20px!important',
            boxShadow: '0px 8px 32px -12px rgba(0, 0, 0, 0.1)',
          }}
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
                className="animate-shake  absolute top-[-9px] left-[-47px] px-2 py-1 w-[52px] h-[22px] bg-[#3F3F46] shadow-xl rounded-full rounded-br-none text-[10px] text-white
               "
              >
                Ask me
              </div>
              <BubbleIcon />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Assistant;
