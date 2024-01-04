import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { apiget } from "../API/Api";
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

const Arbeitsstatistik = () => {
  const [data, setData] = useState([]);
  const [nicknames, setNicknames] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    const fetchArbeitssta = async () => {
      try {
        const response = await apiget(`arbeitsstatistik/${id}`);
        console.log(response);

        const names = Object.keys(response.name);
        setNicknames(names);

        const allPhases = names.reduce((acc, name) => {
          Object.keys(response.name[name]).forEach(phase => {
            if (!acc.includes(phase)) {
              acc.push(phase);
            }
          });
          return acc;
        }, []);
        const seriesData = allPhases.map(phase => ({
          data: names.map(name => response.name[name][phase] || 0),
          label: phase,
          id: phase,
          stack: 'total'
        }));
        setData(seriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchArbeitssta();
  }, []);

  return (
    <>
      <Typography>Report-Ansicht</Typography>
      <BarChart
        width={700}
        height={300}
        series={data}
        xAxis={[{ data: nicknames, scaleType: 'band' }]}
      />
    </>
  );
}

export default Arbeitsstatistik;

