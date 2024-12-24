'use client';

import React from 'react';
import dayjs from 'dayjs';
import { Column } from '@ant-design/charts';
import { Card, Progress } from '@nextui-org/react';
import { useAnalyze, useTopBots, useTopUsers } from '../hooks/useAnalyze';
import { maxBy, sortBy } from 'lodash';

export default function AdminPage() {
  const { data = [], isLoading } = useAnalyze();
  const { data: topBots = [] } = useTopBots();
  const { data: topUsers = [] } = useTopUsers();

  const chartProps = {
    xField: d => new Date(d.usage_date),
    colorField: 'bot_name',
    height: 400,
    stack: true,
    legend: false,
    sort: { by: 'x' },
    scale: { color: { palette: 'tableau10' }},
    axis: {
      x: {
        labelFormatter: x => dayjs(x).format('MM-DD'),
      }
    },
  }

  return (
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Usage: Tokens</h1>
        </div>
  
        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="col-span-2 grid grid-rows-2 gap-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Input Tokens</h2>
              <div className="text-gray-400">
                <Column
                  {...chartProps}
                  data={sortBy(data, ['usage_date', 'input_tokens'])}
                  yField={'input_tokens'}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Output Tokens</h2>
              <div className="text-gray-400">
                <Column
                  {...chartProps}
                  data={sortBy(data, ['usage_date', 'output_tokens'])}
                  yField={'output_tokens'}
                />
              </div>
            </Card>
          </div>
          <div>
            <Card className="p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Top Bots</h2>
              <div className="text-gray-400">
                {topBots.map(record => {
                  return <Progress
                    className="max-w-md"
                    color="primary"
                    formatOptions={{ style: "decimal"}}
                    label={record.bot_name}
                    maxValue={maxBy(topBots, 'total_tokens')?.total_tokens}
                    value={record.total_tokens}
                    showValueLabel={true}
                    size="sm"
                  />
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Top Users</h2>
              <div className="text-gray-400">
                {topUsers.map(record => {
                  return <Progress
                    className="max-w-md"
                    color="primary"
                    formatOptions={{ style: "decimal"}}
                    label={record.user_name}
                    maxValue={maxBy(topBots, 'total_tokens')?.total_tokens}
                    value={record.total_tokens}
                    showValueLabel={true}
                    size="sm"
                  />
                })}
              </div>
            </Card>
          </div>
        </div>

      </div>
    );
}
