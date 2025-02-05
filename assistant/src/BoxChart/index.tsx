import { Runtime, corelib, extend } from '@antv/g2';
import { Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Chart = extend(Runtime, corelib());
interface DataItem {
  date: string;
  value: number[];
}

interface Data {
  year: DataItem[];
  quarter: DataItem[];
  month: DataItem[];
}

interface AreaChartProps {
  data: Data;
  title?: string;
  height?: number;
}
const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title = '',
  height = 400,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [timeDimension, setTimeDimension] = useState<
    'year' | 'quarter' | 'month'
  >('month');

  const handleChange = (e: any) => {
    setTimeDimension(e?.target?.value as 'year' | 'quarter' | 'month');
  };

  const currentData = data[timeDimension] || [];

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = new Chart({
      container: chartRef.current,
      autoFit: true,
    });

    chart
      .box()
      .data(currentData)
      .encode('x', 'date')
      .encode('y', 'value')
      .scale('x', { paddingInner: 0.3, paddingOuter: 0 })
      .scale('y', { zero: true })
      .axis({
        x: { title: false, labelAutoRotate: false },
        y: { title: false },
      })
      .legend(false)
      .style({
        fill: '#FECC6B',
        stroke: '#FECC6B',
      })
      .tooltip([
        { name: 'min', channel: 'y' },
        { name: 'p25', channel: 'y1' },
        { name: 'medium', channel: 'y2' },
        { name: 'p75', channel: 'y3' },
        { name: 'max', channel: 'y4' },
      ]);

    chart.render();

    return () => {
      chart?.destroy();
    };
  }, [currentData, chartRef.current]);

  return (
    <div>
      <Radio.Group defaultValue="month" size="middle" onChange={handleChange}>
        <Radio.Button value="year">year</Radio.Button>
        <Radio.Button value="quarter">quarter</Radio.Button>
        <Radio.Button value="month">month</Radio.Button>
      </Radio.Group>

      <div ref={chartRef} style={{ height: `${height}px`, marginTop: 20 }} />
    </div>
  );
};

export default AreaChart;
