import React from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

export default function Stats() {
  // Define the chart options
  const option: EChartsOption = {
    legend: {
      top: 'bottom',
    },
    toolbox: {
      show: false,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 250],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        label: {
          color: '#FFFFFF'
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' },
        ],
      },
    ],
  };

  return (
    <div className='h-[500px] md:h-auto'>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}