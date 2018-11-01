/**
 * Created by hao.cheng on 2017/4/21.
 */
import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';


const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const StatisticsChart = (props) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
          data={props.chartData}
          margin={{top: 15, right: 10, left: 10, bottom: 5}}
      >

        <XAxis dataKey="queryDate" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="tallyCount" name="有效次数" stroke="#229AFF"  />
        {/*<Line type="monotone" dataKey="notTallyCount" stroke="#2582ea" activeDot={{r: 8}}/>*/}
      </LineChart>
    </ResponsiveContainer>
);

export default StatisticsChart;