import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  LoadingOutlined,
  UnorderedListOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Highlight } from '@ant-design/pro-editor';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { IExtraInfo, Status } from '../interface';

const getColorClass = (status: Status) => {
  const colorClasses = {
    [Status.loading]: 'text-blue-600',
    [Status.success]: 'text-green-600',
    [Status.end]: 'text-gray-500',
    [Status.failed]: 'text-red-600',
  };

  // Return the class, or a default value if the status is undefined
  return colorClasses[status] || 'text-gray-900';
};

const safeJsonParse = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Parsing error:', e);
    return null;
  }
};

export interface ThoughtChainProps {
  content?: IExtraInfo;
  status?: Status;
  source?: string;
  timeCost?: string;
}

const ThoughtChain: React.FC<ThoughtChainProps> = (params) => {
  const { content, status, source } = params;

  const [activeKey, setActiveKey] = useState([]);

  const items: CollapseProps['items'] = useMemo(() => {
    return [
      {
        key: '1',
        label:
          activeKey.length > 0 ? (
            <span
              className={`flex items-center justify-between text-xs min-w-[90px] ${getColorClass(
                status!,
              )}`}
            >
              <span className="mt-px mr-4">隐藏运行过程</span>
              <UpOutlined />
            </span>
          ) : (
            <span
              className={`flex items-center justify-between text-xs min-w-[90px] ${getColorClass(
                status!,
              )}`}
            >
              <span className="mt-px mr-4">{source}</span>
              <DownOutlined className={`${getColorClass(status!)}`} />
            </span>
          ),
        children: (
          <Collapse
            ghost
            size="small"
            expandIcon={(panelProps) => {
              const {
                status: itemStatus,
                knowledgeName,
                pluginName,
              } = (panelProps as IExtraInfo) || {};

              if (itemStatus === Status.loading) {
                return <LoadingOutlined className="text-blue-600 text-xs" />;
              } else if (knowledgeName) {
                return <FileTextOutlined className="text-gray-900 text-xs" />;
              } else if (pluginName) {
                return <ApiOutlined className="text-gray-900 text-xs" />;
              }
              return <></>;
            }}
          >
            {safeJsonParse(content?.data) ? (
              <Highlight language="json" theme="light" type="block">
                {JSON.stringify(safeJsonParse(content?.data), null, 2)}
              </Highlight>
            ) : (
              <>{content?.data}</>
            )}
          </Collapse>
        ),
      },
    ];
  }, [status, content, activeKey, source]);

  const onChange = useCallback((key: string | string[]) => {
    // @ts-ignore
    setActiveKey(key);
  }, []);

  return (
    <Collapse
      size="small"
      items={items}
      activeKey={activeKey}
      onChange={onChange}
      style={{ maxWidth: '100%' }}
      expandIcon={(panelProps) => {
        if (panelProps.isActive) {
          return <UnorderedListOutlined className="text-gray-900 text-xs" />;
        }
        switch (status) {
          case Status.success:
            return (
              <CheckCircleOutlined
                className={`text-xs ${getColorClass(status!)}`}
              />
            );
          case Status.loading:
            return (
              <LoadingOutlined
                className={`text-xs ${getColorClass(status!)}`}
              />
            );
          case Status.failed:
            return (
              <CloseCircleOutlined
                className={`text-xs ${getColorClass(status!)}`}
              />
            );
          case Status.end:
            return (
              <ExclamationCircleOutlined
                className={`text-xs ${getColorClass(status!)}`}
              />
            );
          default:
            return '';
        }
      }}
    />
  );
};

export default ThoughtChain;
