
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { PianoOutlined, ShareOutlined, ShareRounded } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia,  CircularProgress,  Grid,  LinearProgress,  Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Typography, linearProgressClasses, styled } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';

import styles from '../../styles/Home.module.css'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { getSongKeyTitle, msToTime } from './SearchInput';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ShareURL from './ShareURL';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    marginBottom: '12px',
    borderRadius: 0,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 0,
      backgroundColor: '#59db81',
    },
  }));

export default function TrackCardPrimary({track, handlePlayTrack}) {
    const router = useRouter();
    const [shareVisible, setShareVisible] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    if(!track) {
        return (<></>)
    }

    const getEnergyLabel = (energy) => {
        if(energy*100 > 75) {
            return 'Very High';
        }
        if(energy*100 > 50) {
            return 'High';
        }
        if(energy*100 > 30) {
            return 'Chill';
        }
        if(energy*100 <= 30) {
            return 'Less';
        }
    }
    
    return (
      <>
        <Card  key={track.id} sx={{ width: '100%', display: 'flex', mb: 2 }}>
            <CardContent sx={{flex: '1 0 auto', paddingBottom: '16px !important'}}>
                <Grid container spacing={2}>
                    <Grid item md={3} sm={2} xs={12} mt={1}>
                        <Image unoptimized className={styles.artwork} alt={track.artists && track.artists[0].name+' - '+track.name} width={170} height={ 170} src={track.album?.images && track.album.images[0].url} />
                    </Grid>
                    <Grid item md={4} sm={4} ml={1} xs={11}>
                        <Typography className={styles.trackTitle} sx={{marginTop: '8px',width: '90%'}} gutterBottom variant="h5" component="div">
                            {track.name}
                        </Typography>
                        <Typography noWrap gutterBottom style={{width: '100%', display: 'block', margin: '-5px 0 0px 0', fontSize: '14px !important'}} sx={{fontSize: '16px !important', paddingTop: '0'}} variant="h5" color="text.primary">
                            {track.artists && (<a href={`/artists/${track.artists[0].name}/${track.artists[0].id}`}>Artist: {track.artists[0].name}</a>)}
                        </Typography>
                        <Typography noWrap gutterBottom sx={{width: '100%', display: 'block', margin: '-5px 0 0px 0', fontSize: '12px !important', paddingTop: '8px'}} color="text.secondary">
                            Album: {track.album && track.album.name}
                        </Typography>
                        <Typography noWrap gutterBottom sx={{width: '100%', display: 'block', margin: '-5px 0 0px 0', fontSize: '12px !important', paddingTop: '4px'}} color="text.secondary">
                            Released: {track.album && track.album.release_date}
                        </Typography>
                        
                        {<Button onClick={(e) => handlePlayTrack(e, track)} sx={{margin: '12px 15px 0 0', minWidth: '40px !important', width: '40px', paddingLeft: '24px !important'}} color="primary" variant="outlined" startIcon={<PlayCircleFilledWhiteIcon />} />}
                        <Button aria-describedby={id} onClick={(e) => handleClick(e)} sx={{margin: '12px 15px 0 0', minWidth: '40px !important', width: '40px !important', paddingLeft: '24px !important'}} color="warning"  variant="outlined" startIcon={<ShareOutlined />} />
                        {<Link target="_blank" href={track.external_urls && track.external_urls.spotify}>
                        <Button size={"small"} sx={{margin: '8px 0 0 0'}} color="success" variant="text" startIcon={<OpenInNewIcon />}>Listen On Spotify</Button></Link>}
                        
                        
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            >
                           <ShareURL title={`Song key & BPM / Mixing relative tracks list of ${track.artists && track.artists[0].name} - ${track.name}`} shareUrl={`https://songkeyfinder.app${router.asPath}`} />
                        </Popover>
                    </Grid>
                    <Grid item md={2} sm={3} xs={2}  mt={2}>
                        
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h6" component="div">
                            {`${track.key ? getSongKeyTitle(track.key,track.mode) : 'N/A'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center', opacity: 0.6}} gutterBottom variant="caption" component="div">
                            Key
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} mt={3} gutterBottom variant="h5" component="div">
                        {`${track.time_signature ? track.time_signature + '/4' : '4/4'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center', opacity: 0.6}} gutterBottom variant="caption" component="div">
                            Beat
                        </Typography>
                        
                    </Grid>
                    <Grid item md={2} sm={2} lg={2} xs={2}  mt={2}>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h5" component="div">
                            {`${track.tempo ? Math.round(track.tempo) : 'N/A'}`}
                        </Typography>
                       <Typography style={{width: '100%', textAlign: 'center', opacity: 0.6}} gutterBottom variant="caption" component="div">
                            BPM
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} mt={3} gutterBottom variant="h5" component="div">
                            {`${track.duration_ms ? msToTime(track.duration_ms) : '00:00'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center', opacity: 0.6}} gutterBottom variant="caption" component="div">
                            Time
                        </Typography>
                    </Grid>
                </Grid>
        </CardContent>
    </Card>
    
    <Card classes={'song-desc'} key={track.id} sx={{ width: '100%', mb: 2, padding: 4 }}>
            <Typography className='song-desc' style={{padding: '0 24px 0 0',lineHeight: '24px',fontSize: '16px !important', margin: '24px 0 !important', color: '#666'}} variant='body'>
                <b>{track.name}</b> is a song by {track.artists[0].name} with a tempo of {Math.round(track.tempo)} BPM. It can also be used half-time at {Math.round(track.tempo)/2} BPM or double-time at {Math.round(track.tempo)*2} BPM. The track runs {msToTime(track.duration_ms) } long with 
                a {getSongKeyTitle(track.key,track.mode)} key and a {track.mode === 1 ? 'Major' : 'Minor'} mode. It has {getEnergyLabel(track.energy)} energy and is {getEnergyLabel(track.danceability)} danceable with a time signature of {track.time_signature}/4 beats per bar.
            </Typography>
            <CardContent sx={{flex: '1 0 auto', padding: '16px 0 0px 0 !important'}}>
                <Typography variant="subtitle1">Popularity: {track.popularity}</Typography>
                <BorderLinearProgress variant="determinate" value={track.popularity} />
                <Typography variant="subtitle1">Happiness: {parseInt(track.happiness*100,10)}</Typography>
                <BorderLinearProgress variant="determinate"  value={track.happiness*100} />
                <Typography variant="subtitle1">Energy: {parseInt(track.energy*100,10)}</Typography>
                <BorderLinearProgress variant="determinate" value={track.energy*100} />
                <Typography variant="subtitle1">Danceability: {parseInt(track.danceability*100,10)}</Typography>
                <BorderLinearProgress variant="determinate" value={track.danceability*100} />
                <Typography variant="subtitle1">Instrumentalness: {parseInt(track.instrumentalness,10)} </Typography>
                <BorderLinearProgress variant="determinate" value={track.instrumentalness} />
                <Button variant="outlined" noWrap style={{ display: 'block', width: '100%', margin: '28px 0 0px 0'}} gutterBottom sx={{fontSize: '14px', padding: '8px 24px'}}>
                    {track.artists && (<a href={`/artists/${track.artists[0].name}/${track.artists[0].id}`}>See All Recent Tracks By: {track.artists[0].name}</a>)}
                </Button>
            </CardContent>
        </Card>
      </>
    );
  
}
