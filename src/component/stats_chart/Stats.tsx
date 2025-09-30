import { EChartsOption } from 'echarts';
import SankeyChart from 'echarts-for-react';
import { useContext, useEffect, useMemo } from 'react';
import { BContext } from '../../utils/Context';

export default function Stats() {
  const { tradePath, madeAchoice } = useContext(BContext);

  const option: EChartsOption = useMemo(() => ( {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'sankey',
        data: tradePath.map((token) => ({ name: token })),
        links: tradePath.slice(0, -1).map((from, i) => ({
          source: from,
          target: tradePath[i + 1],
          value: 1,
        })),
        emphasis: {
          focus: 'adjacency'
        },
        levels: [
          {
            depth: 0,
            itemStyle: {
              color: '#fbb4ae'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6
            }
          },
          {
            depth: 1,
            itemStyle: {
              color: '#b3cde3'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6
            }
          },
          {
            depth: 2,
            itemStyle: {
              color: '#ccebc5'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6
            }
          },
          {
            depth: 3,
            itemStyle: {
              color: '#decbe4'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6
            }
          }
        ],
        lineStyle: {
          curveness: 0.5
        }
      }
    ]
  }), [tradePath]);

  useEffect(() => {

  }, [madeAchoice])
  

  return (
    <div className='h-[100%] flex flex-col justify-center items-center'>
      {
        madeAchoice !== "path found" ?

        <h1>Watch Out</h1>

        :

        <>
              <h1 className='justify-self-start text-center font-bold'>{madeAchoice === "path found" ? "Route path for this trade" : "Possible route paths"}</h1>
              <SankeyChart option={option} style={{ height: '75%', width: '100%' }} />
        </>
      }
    </div>
  );
}