import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const card = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 20 }} color="text.secondary" >
        Sopra
      </Typography>
      <Typography sx={{ mt: 2 }} color="text.secondary">
        Beschreibung:
      </Typography>
      <Typography variant="body2">
        Wir haben nix besseres zu tun als Sopra zu machen. Trete uns gerne bei für Kopfschmerzen
      </Typography>
      <Typography sx={{ mt: 2 }} color="text.secondary">
        Mitglieder:
      </Typography>
      <Typography variant="body4">
        Hans, Susi, Bernd
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" color='error'>Entfernen</Button>
      <Button size="small" color='success'>Beitreten</Button>
    </CardActions>
  </React.Fragment>
);

export default function Projectcard() {
  return (
    <Box sx={{ minWidth: 150 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}