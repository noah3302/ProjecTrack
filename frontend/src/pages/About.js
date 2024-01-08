import React from "react";
import { Box, Typography } from "@mui/material";

export default function About() {

  return (
    <Box sx={{ p: 4, maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        About
      </Typography>

      <Typography paragraph>
        Willkommen auf unserer "About"-Seite! Wir sind ein Team von sechs Entwicklern, die zusammengefunden haben, um ein hervorragendes Kanban Board für Sie zu erstellen.
      </Typography>

      <Typography paragraph>
        Unser Team besteht aus den folgenden Mitgliedern:
      </Typography>
      <ul style={{ listStyleType: "disc", pl: "20px" }}>
        <li>Dimitrios Saltsoglidis</li>
        <li>Michele De Rinaldis</li>
        <li>Noah Braun</li>
        <li>Maxine Pedde</li>
        <li>Theresa Kottmann</li>
        <li>Markus Schwarzkopf</li>
      </ul>

      <Typography paragraph>
        Gemeinsam haben wir unser Know-How und unsere Leidenschaft für effiziente Workflows eingebracht, um ein benutzerfreundliches und leistungsfähiges Kanban Board zu entwickeln.
      </Typography>

      <Typography paragraph>
        Vielen Dank, dass Sie sich für unser Produkt entschieden haben. Wenn Sie Fragen oder Anregungen haben, sind wir gerne für Sie da.
      </Typography>

      <Typography paragraph>
        Kontaktieren Sie uns gerne per E-Mail:{" "}
        <a href="mailto:ProjecTrack@example.com">ProjecTrack@example.com</a>
      </Typography>

      <Box mt={4}>
        <Typography variant="h6" paragraph>
          Impressum:
        </Typography>
        <Typography variant="body2">
          Dimitrios Saltsoglidis (vertretungsberechtigte Person)
          <br />
          Kelterstraße 10
          <br />
          74679 Weißbach
          <br />
          Handelsregisternummer: HRB 12345
          <br />
          Umsatzsteuer-Identifikationsnummer: DE123456789
        </Typography>
      </Box>
    </Box>
  );
}