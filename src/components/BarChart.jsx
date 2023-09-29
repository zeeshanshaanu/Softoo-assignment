"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import useSWR from "swr";



function EChartComponent() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: chartData, isLoading } = useSWR(
    "https://api.thunder.softoo.co/vis/api/dashboard/ssu/fixed",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const processedData = chartData?.data?.reduce((result, item) => {
    const date = item.date;
    const time_interval = item.minute_window.split(" ")[1].slice(0, 5);
    const sourceTag = item.sourceTag;

    if (!result[time_interval]) {
      result[time_interval] = {};
    }

    if (!result[time_interval][date]) {
      result[time_interval][date] = {
        Main: 0,
        Solar: 0,
        DG: 0,
        Battery: 0,
        "Solar+Battery": 0,
        "Battery+Solar": 0,
        "Main+Solar": 0,
        "Main+Battery": 0,
        "Main+Solar+Battery": 0,
        "DG+Battery": 0,
        "DG+Solar+Battery": 0,
        "DG+Battery+Solar": 0,
        Undetermined: 0,
      };
    }

    result[time_interval][date][sourceTag] += 1;
    return result;
  }, {});

  const chartDataArray = [];

  for (const time_interval in processedData) {
    const entry = { time_interval };

    for (const date in processedData[time_interval]) {
      const sourceTagCounts = processedData[time_interval][date];
      for (const sourceTag in sourceTagCounts) {
        if (!entry[sourceTag]) {
          entry[sourceTag] = 0;
        }
        entry[sourceTag] += sourceTagCounts[sourceTag];
      }
    }

    chartDataArray.push(entry);
    // console.log(chartDataArray);
  }

  return (
    <div>
      <ResponsiveContainer height={"100%"} width={"100%"}>
        <BarChart
          layout="vertical"
          data={chartDataArray}
          barSize={40}
          margin={{ left: 50, right: 50 }}
        >
          <XAxis
            type="number"
            domain={[0, "dataMax"]}
            tickFormatter={(val) => `${val}:00`}
          />
          <YAxis
            type="category"
            dataKey="time_interval"
            stroke="#111"
            fontSize={12}
          />

          <Tooltip />

          <Legend />
          <Bar dataKey="Undetermined" stackId="a" fill="#BBE3FD" barSize={80} />
          <Bar dataKey="Solar" stackId="a" fill="#02E10C" barSize={80} />
          <Bar
            dataKey="Solar+Battery"
            stackId="a"
            fill="#86B0FF"
            barSize={80}
          />
          <Bar
            dataKey="Main"
            stackId="a"
            fill="#B798F5"
            barSize={20}
            strokeWidth={8}
          />
          <Bar
            dataKey="DG"
            stackId="a"
            fill="#803F3D"
            barSize={20}
            strokeWidth={8}
          />
          <Bar
            dataKey="Battery"
            stackId="a"
            fill="#FDE602"
            barSize={20}
            strokeWidth={8}
          />
          <Bar
            dataKey="Battery+Solar"
            stackId="a"
            fill="#86B0FF"
            barSize={20}
            strokeWidth={8}
          />
          <Bar
            dataKey="Main+Solar"
            stackId="a"
            fill="#7243D0"
            barSize={20}
            strokeWidth={8}
          />
          <Bar
            dataKey="Main+Battery"
            stackId="a"
            fill="#32864B"
            barSize={20}
            strokeWidth={8}
          />
          <Bar
            dataKey="Main+Solar+Battery"
            stackId="a"
            fill="#8BC486"
            barSize={20}
            strokeWidth={8}
          />
          <Bar
            dataKey="DG+Battery"
            stackId="a"
            fill="#FF00FF"
            barSize={20}
            strokeWidth={8}
          />
          <Bar
            dataKey="DG+Solar+Battery"
            stackId="a"
            fill="#00FFFF"
            barSize={80}
            strokeWidth={8}
          />
          <Bar
            dataKey="DG+Battery+Solar"
            stackId="a"
            fill="#00FFFF"
            barSize={80}
            strokeWidth={8}
          />
          <Bar
            dataKey=""
            stackId="a"
            fill="#FFF"
            barSize={80}
            strokeWidth={8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EChartComponent;
