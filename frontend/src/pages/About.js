import React from "react";
import { Box, Typography } from "@mui/material";

export default function About() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        About
      </Typography>
      <Typography paragraph>
      Willkommen auf unserer "About"-Seite! Wir sind ein Team von sechs Entwicklern, die
        zusammengefunden haben, um ein hervorragendes Kanban Board für Sie zu erstellen.
      </Typography>
      <Typography paragraph>
      Unser Team besteht aus den folgenden Mitgliedern:
      </Typography>
      <ul>
        <li>
          Dimitrios Saltsoglidis
        </li>
        <li>
          Michele De Rinaldis
        </li>
        <li>
          Noah Braun
        </li>
        <li>
          Maxine Pedde
        </li>
        <li>
          Theresa Kottmann
        </li>
        <li>
          Markus Schwarzkopf
        </li>
      </ul>
      <Typography paragraph>
      Gemeinsam haben wir unser Know-how und unsere Leidenschaft für effiziente
        Workflows eingebracht, um ein benutzerfreundliches und leistungsfähiges Kanban Board zu entwickeln 
      </Typography>
      <Typography paragraph>
      Vielen Dank, dass Sie sich für unser Produkt entschieden haben. Wenn Sie Fragen oder Anregungen haben, sind wir gerne für Sie da.
      </Typography>
      <Typography paragraph>
        Kontaktieren Sie uns gerne per E-Mail:
        <a href="mailto:ProjekTrack@example.com">ProjekTrack@example.com</a>
      </Typography>
      <Typography variant="h6" paragraph>
        Impressum:
      </Typography>
      <Typography paragraph>
        Dimitrios Saltsoglidis (vertretungsberechtigte Person)
        </Typography>
        <Typography paragraph>
        Kelterstraße 10
        </Typography>
        <Typography paragraph>
        74679 Weißbach
      </Typography>
      <Typography paragraph>
        Handelsregisternummer: HRB 12345
      </Typography>
      <Typography paragraph>
        Umsatzsteuer-Identifikationsnummer: DE123456789
      </Typography>
    </Box>
  );
}
