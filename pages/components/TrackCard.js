
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { Album, MoreOutlined, PianoOutlined, PlayCircle, PlayCircleOutline } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia,  Grid,  IconButton,  Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';
import styles from '../../styles/Home.module.css'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { getSongKeyTitle, msToTime } from './SearchInput';
import { useRouter } from 'next/router';
import Image from 'next/image';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

export default function TrackCard({track, onSelectTrack, playOnDeck = null, handlePlayTrack, hideSimilarIcon = false}) {
    const router = useRouter();
    if(!track) {
        return (<></>)
    }
    const playOnDjController = () => {
        if(playOnDeck) {
            playOnDeck(track);
        }
    }
    
    const url = (track.artists && track.artists[0].name+'-'+track.name).replace(/ /g, '').replace('&','-').replace('&','-').replace('&','-').replace('&','-').replace('&','-').replace('&','-').replace('&','-').replace('?','').replace('?','').replace('?','').replace('?','').replace('.','-').replace('.','-').replace('/','').replace('/','').replace('/','').replace('#','').replace('#','').replace('(','').replace('(','').replace('(','').replace('(','').replace(')','').replace(')','').replace(')','').replace(')','').replace(')','').replace('+','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','');
    return (
      <>
        <Card key={track.id} className={styles.cardW} sx={{ width: '100%',  mb: 2 }}>
            <CardContent style={{width: '100% !important', paddingBottom: '16px !important'}}>
                <Grid container spacing={2}>
                    <Grid item sm={2} xs={2}>
                        <Image onClick={() => onSelectTrack('/tracks/'+url+'/'+track.id, track)} className={styles.artwork2} alt={track.artists && track.artists[0].name+' - '+track.name} width={85} height={85} src={track.album?.images && track.album.images[0].url} />
                    </Grid>
                    <Grid item md={4} xs={9} sm={4}>
                        <Typography onClick={() => onSelectTrack('/tracks/'+url+'/'+track.id, track)} className={styles.trackTitle} style={{width: '100%', marginTop: '0px !important'}}  variant="h5" component="div" noWrap>
                            {track.name}
                        </Typography>
                        <Typography  onClick={() => onSelectTrack('/tracks/'+url+'/'+track.id, track)} noWrap style={{width: '100%', display: 'block', margin: '0px 0 0px 0'}} gutterBottom sx={{fontSize: '14px', paddingTop: '0'}} variant="subtitle1" color="text.secondary">
                            {track.artists && track.artists[0].name}
                        </Typography>
                        {<Button size={'small'} color={'success'} startIcon={<PlayCircle fontSize="inherit" />} onClick={(event) => handlePlayTrack(event, track)} style={{padding: '2px 6px',fontSize: '12px !important',margin: '5px 12px 0 0'}}  variant={'outlined'}>Play</Button>}
                        <Button size={'small'} color={'info'} startIcon={<QueueMusicIcon fontSize="inherit" />}  onClick={() => onSelectTrack('/tracks/'+url+'/'+track.id, track)} style={{padding: '2px 6px',fontSize: '12px !important',marginTop: '5px'}}  variant={'text'}>Similar Songs</Button>

                    </Grid>
                    <Grid onClick={() => onSelectTrack('/tracks/'+url+'/'+track.id, track)} item xs={4} sm={2}  mt={2}>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h5" component="div">
                        {`${track.tempo ? Math.round(track.tempo) : 'N/A'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="caption" component="div">
                            BPM
                        </Typography>
                    </Grid>
                    <Grid onClick={() => onSelectTrack('/tracks/'+url+'/'+track.id, track)} item xs={4} sm={2}  mt={2}>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h6" component="div">
                            {`${track.key ? getSongKeyTitle(track.key,track.mode) : 'N/A'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="caption" component="div">
                            Key
                        </Typography>
                    </Grid>
                    <Grid onClick={() => onSelectTrack('/tracks/'+url+'/'+track.id, track)} item xs={4} sm={2}  mt={2}>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h5" component="div">
                        {`${track.time_signature ? track.time_signature + '/4' : '4/4'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="caption" component="div">
                            Beat
                        </Typography>
                    </Grid>
                </Grid>
        </CardContent>
    </Card>
      </>
    );
}
