import { Runtime, corelib, extend } from '@antv/g2';
import { Switch } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const Chart = extend(Runtime, corelib());

export interface DataItem {
  user: string;
  value: number;
}

export interface BotFilterChartProps {
  data: DataItem[];
}

const RankChart: React.FC<BotFilterChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [filterBots, setFilterBots] = useState<boolean>(true);

  const filteredData = useMemo(() => {
    if (filterBots) {
      return data?.filter((item) => !item.user.includes('[bot]'))?.slice(0, 10);
    }
    return data?.slice(0, 10);
  }, [filterBots, data]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart({
      container: chartRef.current,
      autoFit: true,
    });

    const medal = (datum: string, chartInstance: any) => {
      const { document } = chartInstance.getContext().canvas;
      const group = document?.createElement('g', {});
      const clipPath = document.createElement('circle', {
        style: {
          cx: -10,
          cy: 0,
          r: 10,
        },
      });
      const icon = document.createElement('image', {
        style: {
          src: `https://avatars.githubusercontent.com/${datum}?s=48&v=4`,
          width: 20,
          height: 20,
          x: -20,
          y: -10,
          clipPath: clipPath,
        },
      });
      group.appendChild(clipPath);
      group.appendChild(icon);
      return group;
    };

    chart
      .interval()
      .scale('x', {
        type: 'band',
        padding: 0.5,
      })
      .data(filteredData)
      .encode('x', 'user')
      .encode('y', 'value')
      .style({
        fill: 'l(136) 0:rgb(247, 124, 0) 1:rgb(255, 177, 98)',
        padding: 10,
        radius: 2,
      })
      .label({
        text: 'value',
        textAlign: (d: any) => (+d.value > 1 ? 'right' : 'start'),
        fill: (d: any) => (+d.value > 1 ? '#fff' : '#000'),
        dx: (d: any) => (+d.value > 1 ? -5 : 5),
      })
      .interaction('elementHighlight', { background: true })
      .coordinate({ transform: [{ type: 'transpose' }] })
      .scale('color', { palette: 'category10' })
      .axis('x', {
        labelFormatter: (user: string) => medal(user, chart),
      });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [filteredData]);

  return (
    <div>
      <label style={{ marginBottom: 8, display: 'inline-block' }}>
        <span style={{ marginRight: 8 }}>Exclude Bots</span>
        <Switch checked={filterBots} onChange={setFilterBots} />
      </label>

      <div
        ref={chartRef}
        style={{
          height: '500px',
          marginTop: 20,
        }}
      />
    </div>
  );
};

export default RankChart;
