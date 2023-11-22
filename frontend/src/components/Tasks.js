import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

export default function Tasks() {
  const [selectedDate, setSelectedDueDate] = useState("");

  const handleDueDate = (event) => {
    setSelectedDueDate(event.target.value);
  };

  return (
    <Box
      sx={{ width: "250px", "& .MuiTextField-root": { marginTop: "20px" } }} //Der Abstand von den Textfeldern wird hier angegeben.
      
    >
      <div>
        <TextField                                 //Titel einfügen
          required
          id="outlined-required-title"
          label="Titel"                          
          placeholder="neuer Händler"
        />
        <TextField                                // Beschreibung einfügen
          required
          id="outlined-required-description"
          label="Beschreibung"
          placeholder="Suche einen neuen Händler."
        />

        <TextField                                 // Mitglied einer Task zuweisen
          required
          id="outlined-required-description"
          label="einem Mitglied zuweisen"
          placeholder="Max009"
        />

        <TextField
          id="outlined-date"
          label="Due Date"                        // Fälligkeitsdatum auswählen
          type="date"
          value={selectedDate}
          onChange={handleDueDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </Box>
  );
}
