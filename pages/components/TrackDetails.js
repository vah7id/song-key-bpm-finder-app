/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { PianoOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Chip, Divider, Grid, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';
import styles from '../../styles/Home.module.css'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { getSongKeyTitle, msToTime } from './SearchInput';
import { useRouter } from 'next/router';
import TrackCard from './TrackCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrackSkeleton from './TrackSkeleton';

export default function TrackDetails({track, isFetching, onSelectTrack}) {
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if(recommendations.length === 0) {
            setLoading(true);
            const query = {
                seed_artists: [track.artists ? track.artists[0].id : ""],
                seed_tracks: [track.id],
                limit: 25,
                min_popularity: 20,
                max_danceability: track.danceability + 0.2,
                min_danceability: track.danceability - 0.2,
                max_energy: track.energy + 0.2,
                min_energy: track.energy - 0.2,
                max_tempo: track.tempo + 25,
                min_tempo: track.tempo - 25,
                min_key: track.key === -1 ? 0 :track.key-1,
                max_key: track.key === -1 ? 11 :track.key+1,
                max_valence: track.happiness + 0.3,
                min_valence:track.happiness - 0.3,
                max_time_signature: track.time_signature+1,
                min_time_signature: track.time_signature-1,
            }
            fetch('/api/getRecommendation?qs='+JSON.stringify(query)).then(resp => resp.json()).then(resp => {
                setRecommendations(resp)
                setLoading(false);
            }).catch(err => {
                console.log(err)
                setLoading(false);
                console.log('show emoty recommendation')
              })
        }
    }, [router.asPath])

    const selectTrack = (url, track) => {
        setLoading(true)
        setRecommendations([])
        onSelectTrack(url, track)
      }
      
    if(isFetching || !track || !track.artists ) {
        return (<TrackSkeleton />)
    }
    return (
      <Box sx={{maxWidth: '768px', width: '100%', mb: 8}}>
        <Grid xs={12}>
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
                                <ListItemText primary={`${track.tempo ? Math.round(track.tempo) : 'N/A'} BPM`} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                <ListItemIcon>
                                    <PianoOutlined />
                                </ListItemIcon>
                                <ListItemText primary={`${track.key ? getSongKeyTitle(track.key,track.mode) : 'N/A'}`} />
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

            {(loading) && <><TrackSkeleton /><TrackSkeleton /><TrackSkeleton /><TrackSkeleton /></>}

            {(recommendations && recommendations.length !== 0) && recommendations.map(recommendedTrack => 
                <TrackCard onSelectTrack={selectTrack} key={recommendedTrack.id} track={recommendedTrack} />)
            }
             </Box>
    );
  
}
