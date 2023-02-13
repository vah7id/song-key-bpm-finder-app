/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { PianoOutlined } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Chip, Divider, Grid, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React, { Component } from 'react';
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';
import styles from '../../styles/Home.module.css'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { getSongKeyTitle, msToTime } from './SearchInput';

export default function TrackDetails({track}) {
    console.log(track)
    if(!track || !track.artists ) {
        return (<>Loading...</>)
    }
    return (
      <Box sx={{maxWidth: '768px', width: '100%', mb: 8}}>
        <Grid  xs={12}>
                <Divider sx={{textAlign: 'center', width: '100%', mt: 4, mb: 4}}>
                    <Chip label={`BPM, Song Key of ${track.name} - ${track.artists && track.artists[0].name}`} />
                </Divider>
            </Grid>
                <Card className={styles.cardW} sx={{ width: '100%', display: 'flex' }}>
                    <CardMedia
                        className={styles.cardImage}
                        component="img"
                        alt={track.artists && track.artists[0].name+' - '+track.name}
                        sx={{ width: 200 }}
                        image={track.album?.images && track.album.images[0].url}
                    />
                    <Box sx={{ width: '100%' ,display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{flex: '1 0 auto', paddingLeft: '24px'}}>
                                <Box className={styles.cardObject}>
                            <Typography style={{width: '100%'}} gutterBottom variant="h5" component="div">
                                {track.artists && track.artists[0].name}
                            </Typography>
                            <Typography style={{width: '100%', display: 'block', margin: '-10px 0 30px 0'}}  sx={{fontSize: '16px', paddingTop: '0'}} variant="caption" color="text.secondary">
                                {track.name}
                            </Typography>
                            <Link target="_blank" href={track.external_urls && track.external_urls.spotify}><Button color="success" variant="outlined" startIcon={<PlayCircleFilledWhiteIcon />}>
                                Listen on Spotify
                            </Button></Link>
                            </Box>
                            <Box className={styles.cardOptions} sx={{ bgcolor: 'background.paper' }}>
                            <nav>
                                <List sx={{ flex: '1 1 auto' }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemIcon>
                                        <SpeedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`${track.tempo ? Math.round(track.tempo) : 'Not Determined'} BPM`} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemIcon>
                                        <PianoOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={`${track.key ? getSongKeyTitle(track.key,track.mode) : 'Not Determined'}`} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemIcon>
                                        <LoopIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`${track.duration_ms ? msToTime(track.duration_ms) : '00:00'}`} />
                                    </ListItemButton>
                                </ListItem>
                                </List>
                            </nav>
                            </Box>
                    </CardContent>
                    
                    </Box>
                </Card>
                <Divider sx={{textAlign: 'center', width: '100%', mt: 4, mb: 4}}>
                    <Chip label={`Recommendations for Harmonic Mixing`} />
                </Divider>
        </Box>
    );
  
}
