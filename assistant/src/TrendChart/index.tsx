import { Runtime, corelib, extend } from '@antv/g2';
import { Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Chart = extend(Runtime, corelib());
interface DataItem {
  type: string;
  date: string;
  value: number;
}

interface Data {
  year: DataItem[];
  quarter: DataItem[];
  month: DataItem[];
}

interface TrendChartProps {
  data: Data;
}
const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [timeDimension, setTimeDimension] = useState<
    'year' | 'quarter' | 'month'
  >('month');

  const handleChange = (e: any) => {
    setTimeDimension(e?.target?.value as 'year' | 'quarter' | 'month');
  };

  const createLineChart = (data: DataItem[]) => {
    if (!chartRef.current) return;
    const chart = new Chart({
      container: chartRef.current,
      autoFit: true,
    });

    chart
      .data(data)
      .encode('x', 'date')
      .encode('y', 'value')
      .encode('color', 'type')
      .scale('y', {
        nice: true,
      });
    chart.line().encode('shape', 'smooth');
    chart.point().encode('shape', 'point').tooltip(false);

    chart.render();
    return chart;
  };

  const createIntervalChart = (data: DataItem[]) => {
    if (!chartRef.current) return;
    const chart = new Chart({
      container: 'TrendCharContainer',
      autoFit: true,
    });

    chart
      .interval()
      .data(data)
      .encode('x', 'date')
      .encode('y', 'value')
      .encode('color', 'type')
      .transform({ type: 'dodgeX' });

    chart.render();
    return chart;
  };

  const currentData = data[timeDimension] || [];

  useEffect(() => {
    let chart;
    if (currentData?.length > 3) {
      chart = createLineChart(currentData);
    } else {
      chart = createIntervalChart(currentData);
    }
    return () => {
      chart?.destroy();
    };
  }, [currentData]);

  return (
    <div>
      <Radio.Group defaultValue="month" size="middle" onChange={handleChange}>
        <Radio.Button value="year">year</Radio.Button>
        <Radio.Button value="quarter">quarter</Radio.Button>
        <Radio.Button value="month">month</Radio.Button>
      </Radio.Group>
      <div ref={chartRef} style={{ height: '400px', marginTop: 20 }} />
    </div>
  );
};

export default TrendChart;
