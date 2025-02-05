import { Runtime, corelib, extend } from '@antv/g2';
import { Radio } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Chart = extend(Runtime, corelib());
interface DataItem {
  date: string;
  value: number;
  type?: string;
}

interface Data {
  year: DataItem[];
  quarter: DataItem[];
  month: DataItem[];
}

interface LineChartProps {
  data: Data;
  colors?: string[];
}
const LineChart: React.FC<LineChartProps> = ({ data, colors }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [timeDimension, setTimeDimension] = useState<
    'year' | 'quarter' | 'month'
  >('month');

  const handleChange = (e: any) => {
    setTimeDimension(e?.target?.value as 'year' | 'quarter' | 'month');
  };

  const hasTypeField = (data: DataItem[]) =>
    data.some((item) => item.type !== undefined);

  const createLineChart = (data: DataItem[]) => {
    if (!chartRef.current) return;
    const chart = new Chart({
      container: chartRef.current,
      autoFit: true,
    });

    const chartDefinition = chart
      .data(data)
      .encode('x', 'date')
      .encode('y', 'value')
      .scale('y', { nice: true })

      .options({ paddingRight: 20 })
      .axis({
        x: { title: false, labelAutoRotate: false },
        y: {
          title: false,
          labelFormatter: (d: number) =>
            d >= 1000 || d <= -1000 ? d / 1000 + 'k' : d,
        },
      });

    if (hasTypeField(data)) {
      chartDefinition.encode('color', 'type').scale('color', {
        range: colors ? colors : ['#FECC6B', '#3B82F6', '#8B5CF6'],
      });
    }

    chartDefinition.line().encode('shape', 'smooth');

    chart.render();
    return chart;
  };

  const createIntervalChart = (data: DataItem[]) => {
    if (!chartRef.current) return;
    const chart = new Chart({
      container: chartRef.current,
      autoFit: true,
    });

    const chartDefinition = chart
      .interval()
      .data(data)
      .encode('x', 'date')
      .encode('y', 'value')

      .transform({ type: 'dodgeX' })
      .axis({
        x: { title: false },
        y: { title: false },
      });

    if (hasTypeField(data)) {
      chartDefinition.encode('color', 'type').scale('color', {
        range: colors ? colors : ['#FECC6B', '#3B82F6', '#8B5CF6'],
      });
    }

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

export default LineChart;
