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
  isArea?: boolean;
}
const TrendChart: React.FC<TrendChartProps> = ({ data, isArea = false }) => {
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
      })
      .options({
        paddingRight: 20,
      })
      .axis({
        x: { title: false, labelAutoRotate: false },
        y: {
          title: false,
          labelFormatter: (d: number) =>
            d >= 1000 || d <= -1000 ? d / 1000 + 'k' : d,
        },
      });

    if (isArea) {
      chart
        .line()
        .encode('shape', 'smooth')
        .style('strokeWidth', 2)
        .tooltip(false);
      chart.area().encode('shape', 'smooth').style('fillOpacity', 0.3);
      chart.scale('color', {
        range: [
          'l(90) 0:#FECC6B 0.7:#FECC6B 1:#FECC6B4D',
          'l(270) 0:#EF4444 0.7:EF4444 1:#EF44444D',
        ],
      });
    } else {
      chart.line().encode('shape', 'smooth');
      chart.scale('color', {
        range: ['#FECC6B', '#3B82F6', '#8B5CF6'],
      });
    }

    chart.render();
    return chart;
  };

  const createIntervalChart = (data: DataItem[]) => {
    if (!chartRef.current) return;
    const chart = new Chart({
      container: chartRef.current,
      autoFit: true,
    });

    chart
      .interval()
      .data(data)
      .encode('x', 'date')
      .encode('y', 'value')
      .encode('color', 'type')
      .transform({ type: 'dodgeX' })
      .scale('color', {
        range: isArea
          ? [
              'l(90) 0:#FECC6B 0.7:#FECC6B 1:#FECC6B4D',
              'l(270) 0:#EF4444 0.7:EF4444 1:#EF44444D',
            ]
          : ['#FECC6B', '#3B82F6', '#8B5CF6'],
      })
      .axis({
        x: { title: false },
        y: { title: false },
      });

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
