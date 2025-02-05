import { Runtime, corelib, extend } from '@antv/g2';
import { Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Chart = extend(Runtime, corelib());
interface DataItem {
  day: string;
  hour: string;
  value: number;
}

interface Data {
  year: DataItem[];
  quarter: DataItem[];
  month: DataItem[];
}

interface HeatmapProps {
  data: Data;
  title?: string;
  height?: number;
}
const Heatmap: React.FC<HeatmapProps> = ({
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
      .cell()
      .data(currentData)
      .transform({ type: 'group', color: 'max' })
      .encode('x', 'hour')
      .encode('y', 'day')
      .encode('color', 'value')
      .style('inset', 0.1)
      .axis({
        x: { title: false },
        y: { title: false },
      })
      .scale('color', { palette: 'oranges' })
      .animate('enter', { type: 'fadeIn' });
    chart.options({ legend: false });
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

export default Heatmap;
