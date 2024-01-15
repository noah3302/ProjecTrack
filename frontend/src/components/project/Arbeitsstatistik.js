import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { apiget } from "../../API/Api";
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

const Arbeitsstatistik = () => {
  //Zustände definieren für die Daten und Nicknamen
  const [data, setData] = useState([]);
  const [nicknames, setNicknames] = useState([]);
  let { id } = useParams(); //Id wird aus der URL extrahiert

  useEffect(() => {
    const fetchArbeitssta = async () => {
      try {
        const response = await apiget(`arbeitsstatistik/${id}`); //Daten von der API abrufen
        console.log(response);
        //Nicknamen extrahieren und im Zustand speichern
        const names = Object.keys(response.name); 
        setNicknames(names);

        const allPhases = names.reduce((acc, name) => { //Phasen werden gesammelt
          Object.keys(response.name[name]).forEach(phase => { //Alle Phasen werden durchlaufen für jeden Nicknamen
            if (!acc.includes(phase)) { //Prüfen ob Phase schon im kumulierten Array enthalten ist
              acc.push(phase); //Falls nein wird sie hinzugefügt
            }
          });
          return acc;
        }, []);
        
        const seriesData = allPhases.map(phase => ({  //Daten für Diagramm
          data: names.map(name => response.name[name][phase] || 0), //Datenpunkte für alle Phasen
          label: phase,
          id: phase,
          stack: 'total' //Balken werden auf selben Stapel angezeigt
        }));
        
        setData(seriesData); //Im Zustand werden Daten gespeichert
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    //Arbeitsstatistik abrufen
    fetchArbeitssta();
  }, []); //wird nur einmal beim Laden der Komponente ausgeführt

  return (
    <>
      <Typography>Report-Ansicht</Typography>
      <BarChart
        width={500}   //Breite der Balken
        height={300}
        series={data}
        xAxis={[{ data: nicknames, scaleType: 'band' }]}
      />
    </>
  );
}

export default Arbeitsstatistik;
