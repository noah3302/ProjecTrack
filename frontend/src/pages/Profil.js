import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Card, Typography, Button, Box } from '@mui/material';
import { apiput, apidelete, apiget } from '../API/Api';
import { UserAuth } from "../Context/Authcontext";

export default function Profil() {
    const [vorname, setVorname] = React.useState('');
    const [nachname, setNachname] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [isEditMode, setIsEditMode] = React.useState(false);

    const { user } = UserAuth(); // Assuming UserAuth provides the user object

    const input = {
        margin: "1rem",
        backgroundColor: "withe",
        width: "18rem"
    };
    
    console.log("user", user)

    React.useEffect(() => {
        // Fetch user data for editing if user ID is available
        const fetchUserData = async () => {
            try {
                const userData = await apiget(`users/${user.google_id}`);
                if (userData) {
                    setVorname(userData.vorname || '');
                    setNachname(userData.nachname || '');
                    setNickname(userData.nickname || '');
                    setIsEditMode(true);
                }
            } catch (error) {
                console.error("Fehler beim Laden des Profils:", error);
            }
        };

        // Assuming user object contains ID
        if (user.google_id) {
            fetchUserData();
        }
    }, [user.google_id]);

    const handleSaveProfile = async () => {
        try {
            if (isEditMode) {
                // Update existing profile
                await apiput(`users/${user.google_id}`, {
                    vorname: vorname,
                    nachname: nachname,
                    nickname: nickname,
                    // Add other profile data here
                });
                console.log("Profil erfolgreich aktualisiert");
            } else {
                // Create new profile
                await apiput('users', {
                    vorname: vorname,
                    nachname: nachname,
                    nickname: nickname,
                    // Add other profile data here
                });
                console.log("Profil erfolgreich erstellt");
            }
        } catch (error) {
            console.error("Fehler beim Speichern des Profils:", error);
        }
    };

    const handleDeleteProfile = async () => {
        try {
            // Assuming google_id contains the ID of the profile to be deleted
            const confirmDelete = window.confirm("Möchten Sie Ihr Profil wirklich löschen?");
            
            if (confirmDelete) {
                await apidelete(`users/${user.google_id}`);
                console.log("Profil erfolgreich gelöscht");
                // Optionally, you can add logic to navigate to another page or perform other actions after deletion
            } else {
                console.log("Löschen des Profils abgebrochen");
            }
        } catch (error) {
            console.error("Fehler beim Löschen des Profils:", error);
        }
    };

    return (
        <>
            <Box sx={{ marginTop: "8rem" }}>
                <Card sx={{ marginLeft: "auto", marginRight: "auto", width: "20rem", padding: "2rem" }}>
                    <Typography align="center" variant='h5' mb={"1rem"}>Persönliche Daten</Typography>
                    <TextField style={input} label="Vorname" id="textinput" value={vorname} onChange={(e) => setVorname(e.target.value)} />
                    <TextField style={input} label="Nachname" id="textinput" value={nachname} onChange={(e) => setNachname(e.target.value)} />
                    <TextField style={input} label="Nickname" id="textinput" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    <Button color="success" sx={{ marginLeft: "1rem" }} onClick={handleSaveProfile}>
                        {isEditMode ? 'Aktualisieren' : 'Erstellen'}
                    </Button>
                    <Button color='error' sx={{ float: "right", marginRight: "1rem" }} onClick={handleDeleteProfile}>
                        Profil löschen
                    </Button>
                </Card>
            </Box>
        </>
    );
}
