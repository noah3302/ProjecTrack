import React, { useEffect, useState } from 'react';
import { BarChart, PieChart } from '@mui/x-charts';
import { apiget } from "../../API/Api";
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Alert, Box, Button } from '@mui/material';

const Arbeitsstatistik = ({ projectusers }) => {
  const [taskData, setTaskData] = useState([]);
  const [phasescores, setPhaseScores] = useState([]);
  const [dueDateData, setDueDateData] = useState([]);
  const [nicknames, setNicknames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let { id } = useParams();

  useEffect(() => {
    const fetchArbeitssta = async () => {
      try {
        const response = await apiget(`arbeitsstatistik/${id}`);

        // Benutzerdaten extrahieren
        setTaskData(response.name.user_phase_task_count);

        // Verteilung pro Phase
        setPhaseScores(response.name.phase_scores);

        // Due Date Daten extrahieren
        setDueDateData(response.name.due_date_task_count);

        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        setError('Fehler beim Abrufen der Daten');
      }
    };

    // Arbeitsstatistik abrufen
    fetchArbeitssta();
  }, [id, projectusers]);


  return (
    <>
      <Typography>Task-Ansicht</Typography>
      <Box>
        <Typography>Anzahl der Tasks in jeder Phase</Typography>
        {taskData && Object.keys(taskData).length > 0 ? (
          <BarChart
            width={500}
            height={300}
            series={Object.keys(taskData[Object.keys(taskData)[0]]).map(phase => ({
              data: Object.keys(taskData).map(nickname => taskData[nickname][phase] || 0),
              label: phase,
              id: phase,
              stack: 'total',
            }))}
            xAxis={[{ data: Object.keys(taskData), scaleType: 'band' }]}
          />
        ) : (
          <Typography>Keine Daten verfügbar.</Typography>
        )}
        {/* <Button onClick={test}>Verteilung der Aufgaben pro Phase</Button>
        {phasescores && Object.keys(phasescores).length > 0 ? (
          <PieChart
            width={500}
            height={300}
            data={Object.keys(phasescores).map(phase => ({
              name: String(phase),
              value: phasescores[phase],
            }))}
            innerRadius={60}
          />
        ) : (
          <Typography>Keine Daten verfügbar.</Typography>
        )} */}
      </Box>
    </>
  );
}

export default Arbeitsstatistik;