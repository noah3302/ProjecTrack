import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Member from './Member';
import FaceIcon from '@mui/icons-material/Face';
import { Box, Chip, CircularProgress, TextField } from '@mui/material';

function isNotIn(a, m) {
  return a.filter((userA) => !m.some(userM => userA.id === userM.id))
}

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferListe({ members, userId, founderId }) {
  let { id } = useParams(); // current project id
  const [checked, setChecked] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [transfer, setTransfer] = React.useState(false);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState(members.filter(member => member.id !== userId && member.id !== founderId));
  const [leftSearch, setLeftSearch] = React.useState('');
  const [rightSearch, setRightSearch] = React.useState('');

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const allUser = await Member.getAllUsers();
        setLeft(isNotIn(allUser, members));
        setLoading(false)
      } catch (error) {
        console.error('Fehler beim Abrufen der Mitgliederdaten:', error);
      }
    };

    fetchAllUser();
  }, []);

  const chipStyle = {
    marginRight: "8px",
    marginBottom: "5px",
    fontSize: "10px",
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // const handleAllRight = () => {
  //   setRight(right.concat(left));
  //   setLeft([]);
  // };

  const handleCheckedRight = async () => {
    setTransfer(true)
    const apiCalls = []

    // ausgewählte User zum Projekt hinzufügen
    leftChecked.forEach(user => {
      apiCalls.push(Member.addMember(id, {
        ...user
      }))
    })

    Promise.all([...apiCalls]).then((responses) => {
      setRight(right.concat(leftChecked));
      setLeft(not(left, leftChecked));
      setChecked(not(checked, leftChecked));

      setTransfer(false)
    })
  };

  const handleCheckedLeft = async () => {
    setTransfer(true)
    const apiCalls = []

    // ausgewählte User zum Projekt hinzufügen
    rightChecked.forEach(user => {
      apiCalls.push(Member.removeMember(id, user.id))
    })

    Promise.all([...apiCalls]).then((responses) => {
      // if (responses.every(res => res.ok)) {
      setLeft(left.concat(rightChecked));
      setRight(not(right, rightChecked));
      setChecked(not(checked, rightChecked));
      // }

      setTransfer(false)
    })
  };

  // const handleAllLeft = () => {
  //   setLeft(left.concat(right));
  //   setRight([]);
  // };

  const handleSearchInputLeft = (event) => {
    setLeftSearch(event.target.value.toLowerCase())
  }

  const handleSearchInputRight = (event) => {
    setRightSearch(event.target.value.toLowerCase())
  }

  const customList = (items, search) => (
    <Paper sx={{ width: '100%', minHeight: 90, height: '100%', maxHeight: 200, overflow: 'auto' }}>
      {loading ?
        <Box sx={{ display: 'flex', justifyContent: 'center', placeItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
        :
        <List dense component="div" role="list">
          {items.map((user) => {
            const labelId = `transfer-list-item-${user.nickname}-label`;

            if (!user.nickname.toLowerCase().includes(search)) return null;

            return (
              <ListItem
                key={user.id}
                role="listitem"
                button
                onClick={handleToggle(user)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(user) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={user.nickname} />
              </ListItem>
            );
          })}
        </List>
      }
    </Paper>
  );

  return (
    // sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}
    <Grid container spacing={2}>

      <Grid item xs={12} sm sx={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ opacity: '0.8', margin: '0 0 0.5rem 0' }}>Mitglieder hinzufügen</p>
        <TextField id="outlined-basic" label="User suchen" variant="outlined" sx={{ margin: '0.5rem 0' }} onInput={handleSearchInputLeft} />
        {customList(left, leftSearch)}
        {leftChecked.length > 0 ?
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            <p>Ausgewählte User:</p>
            {leftChecked.map(checkedUser => (
              <Chip
                key={checkedUser.id}
                icon={<FaceIcon />}
                label={checkedUser.nickname}
                style={chipStyle}
                size="small"
              />
            ))}
          </Box>
          :
          null
        }
      </Grid>

      <Grid item xs={12} sm='auto' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Grid container direction="column" alignItems="center">
          {transfer ?
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
            :
            <>
              {/* <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleAllRight}
                  disabled={left.length === 0}
                  aria-label="move all right"
                >
                  ≫
                </Button> */}
              < Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
              {/* <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleAllLeft}
                  disabled={right.length === 0}
                  aria-label="move all left"
                >
                  ≪
                </Button> */}
            </>
          }
        </Grid>
      </Grid>

      <Grid item xs={12} sm sx={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ opacity: '0.8', margin: '0 0 0.5rem 0' }}>Aktive Mitglieder</p>
        <TextField id="outlined-basic" label="User suchen" variant="outlined" sx={{ margin: '0.5rem 0' }} onInput={handleSearchInputRight} />
        {customList(right, rightSearch)}
        {rightChecked.length > 0 ?
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            <p>Ausgewählte User:</p>
            {rightChecked.map(checkedUser => (
              <Chip
                key={checkedUser.id}
                icon={<FaceIcon />}
                label={checkedUser.nickname}
                style={chipStyle}
                size="small"
              />
            ))}
          </Box>
          :
          null
        }
      </Grid>

    </Grid >
  );
}
