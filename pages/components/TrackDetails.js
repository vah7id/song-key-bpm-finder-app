/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { PianoOutlined, RefreshOutlined, SortRounded } from '@mui/icons-material';
import { Avatar, Backdrop, Box, Button, Card, CardContent, CardHeader, CardMedia, Chip, CircularProgress, Divider, Grid, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';
import styles from '../../styles/Home.module.css'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { getSongKeyTitle, msToTime } from './SearchInput';
import { useRouter } from 'next/router';
import TrackCard from './TrackCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrackSkeleton from './TrackSkeleton';
import TrackCardPrimary from './TrackCardPrimary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export default function TrackDetails({track, onSelectTrack, handlePlayTrack}) {
    const router = useRouter()

    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [trackOnDeck2, setTrackOnDeck2] = useState(null)
    const [trackId, setTrackId] = useState((router.query && router.query.trackId) ? router.query.trackId[router.query.trackId.length - 1] : "");
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortType, setSortType] = useState('popularity');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null)

    const open = Boolean(anchorEl);
    const handleOpenSortBy = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const handleCloseDeck = () => {
      setTrackOnDeck2(null)
    }

    const OnPlayDeck2 = (track) => {
      setSelectedTrack(track);
      //setTrackOnDeck2(track)
    }

    useEffect(() => {
        if(isRefreshing || (router.query && router.query.trackId && router.query.trackId[router.query.trackId.length - 1] !== trackId) || (recommendations && recommendations.length === 0)) {
            setLoading(true);
            const query = {
                seed_artists: [track && track.artists[0] ? track.artists[0].id : ""],
                seed_tracks: [track.id],
                limit: 25,
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
                setIsRefreshing(false);

            }).catch(err => {
                console.log(err)
                setLoading(false);
                setIsRefreshing(false);
                console.log('show empty recommendation')
            })
        }
    }, [router.asPath, router.query, trackId, isRefreshing])

    const selectTrack = (url, track) => {
        setLoading(true)
        setRecommendations([])
        onSelectTrack(url, track)
    }

    const handleSort = (type) => {
        setSortType(type);
        const tmp = recommendations;
        if(tmp.length > 0) {
          let sorted = tmp.slice(0);
          sorted.sort(function(a,b) {
              return a[type] - b[type];
          });
          setRecommendations(sorted);
        }
      }


    const refreshTheList = () => {
      setRecommendations([]);
      setIsRefreshing(true);
    }

    return (<>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {!track && <Box sx={{maxWidth: '768px', width: '100%', mb: 8}}><TrackSkeleton /></Box>}
        {(loading && !track) && <Box sx={{maxWidth: '768px', width: '100%', mb: 8}}><TrackSkeleton /></Box>}
        <Box sx={{maxWidth: '768px', width: '100%', mb: 8}}>
            <Grid xs={12}>
                <Divider sx={{textAlign: 'center', width: '100%', mt: 4, mb: 4}}>
                    <Chip sx={{ width: '320px'}} label={<Typography style={{width: '300px',fontSize: '0.85rem'}} noWrap>
                      {`BPM, Song Key: ${track && track.name} - ${track && track.artists && track.artists[0].name}`}</Typography>} />
                </Divider>
            </Grid>
           
            <TrackCardPrimary track={track} />
           
            <Divider sx={{textAlign: 'center', width: '100%', mt: 6, mb: 4}}>
                <Chip sx={{ fontSize: '0.9rem'}} label={`Recommendations for Harmonic Mixing`} />
            </Divider>
            <Typography mt={4} mb={4} style={{opacity: 0.6}} variant='subtitle2'>
                The following tracks will sound good when mixed with <Chip color="info" size="small" label={`${track && track.name} - ${track && track.artists && track.artists[0].name}`} />  because they have similar tempos, simlar key range, time signature (beat), loudness, energy, mode for djing purposes. Recommendation aligorithms via Spotify API.
            </Typography>

            {(loading) ? <><TrackSkeleton /><TrackSkeleton /><TrackSkeleton /><TrackSkeleton /></> : 
            <Grid container mb={2} spacing={2}>

              
              <Grid item xs={12} sm={12} md={12}>
                  <Typography style={{width: '100%',fontSize: '18px', padding: '0'}} variant="h5">
                    ({recommendations.length}) recommendation (relative) songs found for {track && track.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={6} mb={1}>
                <Button
                  color={'info'}
                  startIcon={<SortRounded />}
                  style={{textTransform: 'capitalize', padding: '5px 10px 5px 10px'}}
                  aria-controls={open ? 'fade-menu' : undefined}
                  aria-haspopup="true"
                  variant={'outlined'}
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleOpenSortBy}
                >
                  Sorted By: {sortType} <ArrowDropDownIcon size={'small'} />
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
                <Grid item mb={1} xs={12} sm={6} md={6}>
                  <Button onClick={refreshTheList}  startIcon={<RefreshOutlined />} sx={{opacity: 0.6, float:'right'}} color={'inherit'}>Refresh The List</Button>
                </Grid>
            </Grid>
          }

          {/*selectedTrack && 
          <Box className={styles.playerWrapper}>
            <Grid container spacing={0}>
                <Grid xs={12} md={12}>
                  <AudioPlayer deck={1} tracks={[selectedTrack]} />
                </Grid>
            </Grid>
        </Box>*/}

            {(recommendations && recommendations.length !== 0) && recommendations.map(recommendedTrack => <>
                <TrackCard handlePlayTrack={handlePlayTrack} hideSimilarIcon={true} playOnDeck={OnPlayDeck2} onSelectTrack={selectTrack} key={recommendedTrack.id} track={recommendedTrack} />
                </>)
            }
            {(recommendations && recommendations.length !== 0) && <Box mt={4} sx={{width: '100%', float: 'left', 'textAlign': 'center'}}>
                  <Button variant={'outlined'} onClick={refreshTheList} startIcon={<RefreshOutlined />} sx={{opacity: 0.7}} color={'inherit'}>Refresh The List</Button>
                </Box>}
        </Box>
       
        </>
    );
  
}
