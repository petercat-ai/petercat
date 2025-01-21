import { Chart } from '@antv/g2';
import { Radio } from 'antd';
import React, { useEffect, useState } from 'react';

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

interface TrendCharProps {
  data: Data;
}
const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [timeDimension, setTimeDimension] = useState<
    'year' | 'quarter' | 'month'
  >('month');

  const handleChange = (e: any) => {
    setTimeDimension(e?.target?.value as 'year' | 'quarter' | 'month');
  };

  const createLineChart = (data: DataItem[]) => {
    const chart = new Chart({
      container: 'TrendCharContainer',
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
  };

  const createIntervalChart = (data: DataItem[]) => {
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
      .transform({ type: 'dodgeX' })
      .interaction('elementHighlight', { background: true });

    chart.render();
  };

  const currentData = data[timeDimension] || [];

  useEffect(() => {
    if (currentData?.length > 3) {
      createLineChart(currentData);
    } else {
      createIntervalChart(currentData);
    }
  }, [currentData]);

  return (
    <div>
      <Radio.Group defaultValue="month" size="middle" onChange={handleChange}>
        <Radio.Button value="year">year</Radio.Button>
        <Radio.Button value="quarter">quarter</Radio.Button>
        <Radio.Button value="month">month</Radio.Button>
      </Radio.Group>
      <div
        id="TrendCharContainer"
        style={{ height: '400px', marginTop: '20px' }}
      />
    </div>
  );
};

export default TrendChart;
