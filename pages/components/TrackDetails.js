/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { PianoOutlined, SortRounded } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Chip, Divider, Grid, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, Typography } from '@mui/material';
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
import TrackCardPrimary from './TrackCardPrimary';

export default function TrackDetails({track, isFetching, onSelectTrack}) {
    const router = useRouter()

    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(isFetching)
    const [trackId, setTrackId] = useState((router.query && router.query.trackId) ? router.query.trackId[router.query.trackId.length - 1] : "");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpenSortBy = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  

    useEffect(() => {
        if((router.query && router.query.trackId && router.query.trackId[router.query.trackId.length - 1] !== trackId) || (recommendations && recommendations.length === 0)) {
            setLoading(true);
            const query = {
                seed_artists: [track.artists ? track.artists[0].id : ""],
                seed_tracks: [track.id],
                limit: 30,
                min_popularity: 10,
                max_popularity: 100,
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
                console.log('show empty recommendation')
            })
        }
    }, [router.asPath, router.query, trackId])

    const selectTrack = (url, track) => {
        setLoading(true)
        setRecommendations([])
        onSelectTrack(url, track)
    }

    const handleSort = (type) => {
        const tmp = recommendations;
    
        if(tmp.length > 0) {
          let sorted = tmp.slice(0);
          sorted.sort(function(a,b) {
              return a[type] - b[type];
          });
          setRecommendations(sorted);
        }
      }

    if(loading || !track || !track.artists ) {
        return (<Box sx={{maxWidth: '768px', width: '100%', mb: 8}}><TrackSkeleton /><TrackSkeleton /><TrackSkeleton /><TrackSkeleton /></Box>)
    }
    return (
        <Box sx={{maxWidth: '768px', width: '100%', mb: 8}}>
            <Grid xs={12}>
                <Divider sx={{textAlign: 'center', width: '100%', mt: 4, mb: 4}}>
                    <Chip sx={{ width: '320px'}} label={<Typography style={{width: '300px',fontSize: '0.85rem'}} noWrap>{`BPM, Song Key: ${track.name} - ${track.artists && track.artists[0].name}`}</Typography>} />
                </Divider>
            </Grid>
           
            <TrackCardPrimary track={track} />
           
            <Divider sx={{textAlign: 'center', width: '100%', mt: 6, mb: 4}}>
                <Chip sx={{ fontSize: '0.9rem'}} label={`Recommendations for Harmonic Mixing`} />
            </Divider>
            <Typography mt={4} mb={4} style={{opacity: 0.6}} variant='subtitle2'>
                The following tracks will sound good when mixed with <Chip color="info" size="small" label={`${track.name} - ${track.artists && track.artists[0].name}`} />  because they have similar tempos, simlar key range, time signature (beat), loudness, energy, mode for djing purposes. Recommendation aligorithms via Spotify API.
            </Typography>

            {(loading) ? <><TrackSkeleton /></> : <Grid container mb={4} spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
                <Typography style={{width: '100%',textAlign: 'left', padding: '8px 0', opacity: 0.4}} variant="subtitle2">{recommendations.length} recommended (Relative) songs for {track.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} >
                    <Button
                      color={'info'}
                      startIcon={<SortRounded />}
                      style={{float: 'right'}}
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleOpenSortBy}
                    >
                      Sort The Playlist By ...
                    </Button>
                    <Menu
                      id="fade-menu"
                      MenuListProps={{
                        'aria-labelledby': 'fade-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => handleSort('popularity')}>Sort By Popularity</MenuItem>
                      <MenuItem onClick={() => handleSort('key')}>Sort By Key</MenuItem>
                      <MenuItem onClick={() => handleSort('tempo')}>Sort By Tempo</MenuItem>
                      <MenuItem onClick={() => handleSort('time_signature')}>Sort By Beat</MenuItem>
                      <MenuItem onClick={() => handleSort('happiness')}>Sort By Happiness</MenuItem>
                      <MenuItem onClick={() => handleSort('energy')}>Sort By Energy</MenuItem>
                      <MenuItem onClick={() => handleSort('danceability')}>Sort By Danceability</MenuItem>

                    </Menu>
                  </Grid>
                </Grid>}

            {(recommendations && recommendations.length !== 0) && recommendations.map(recommendedTrack => 
                <TrackCard onSelectTrack={selectTrack} key={recommendedTrack.id} track={recommendedTrack} />)
            }
        </Box>
    );
  
}
