import I18N from '@/app/utils/I18N';
import { Checkbox } from '@nextui-org/react';
import { useState } from 'react';

interface IDeployItemProps {
  checked: boolean;
  disabled?: boolean;
  key: string;
  title: React.ReactNode;
  canHide: boolean;
  subTitle?: string;
  /** children 是否默认隐藏 */
  defaultIsHide: boolean;
  onChange?: (key: string, checked: boolean) => void;
  children: React.ReactNode;
}

export const DeployItem: React.FC<IDeployItemProps> = ({
  key,
  checked,
  onChange,
  title,
  subTitle,
  canHide,
  children,
  defaultIsHide,
  disabled = false,
}) => {
  const [isChildrenHide, setIsChildrenHide] = useState(defaultIsHide);
  return (
    <div className="flex flex-col border border-gray-300 p-[16px] rounded-[8px]">
      <div className="flex justify-between items-center">
        <span className="text-[14px]">
          <Checkbox
            isDisabled={disabled}
            color="default"
            onChange={(e) => {
              onChange?.(key, e.target.checked);
            }}
            isSelected={checked}
          />
          <span className="font-sans font-semibold">{title}</span>
        </span>
        {canHide && (
          <span className="cursor-pointer text-gray-500 text-[14px]">
            {isChildrenHide ? (
              <span
                onClick={() => {
                  if (canHide) {
                    setIsChildrenHide(false);
                  }
                }}
              >
                {subTitle}
              </span>
            ) : (
              <span
                onClick={() => {
                  setIsChildrenHide(true);
                }}
              >
                {I18N.DeployBotModal.DeployItem.shouQi}</span>
            )}
          </span>
        )}
      </div>
      <div
        style={{
          overflow: 'hidden',
          transition: 'all 0.3s linear(0 0%, 0.09 25%, 1 100%)',
          maxHeight: 0,
          opacity: 0,
          display: 'block',
          ...(!isChildrenHide && {
            marginTop: '16px',
            maxHeight: '300px',
            opacity: 1,
            overflow: 'auto',
          }),
        }}
      >
        {children}
      </div>
    </div>
  );
};
