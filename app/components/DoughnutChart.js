import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function DoughnutChart({ dataDoughnut }) {
  return <Doughnut data={dataDoughnut} />;
}

export default DoughnutChart;
