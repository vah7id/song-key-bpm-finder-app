
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { PianoOutlined } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia,  Grid,  Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';
import styles from '../../styles/Home.module.css'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { getSongKeyTitle, msToTime } from './SearchInput';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function TrackCard({track, onSelectTrack}) {
    const router = useRouter();
    if(!track) {
        return (<></>)
    }
    const url = (track.artists && track.artists[0].name+'-'+track.name).replace(/ /g, '').replace('&','-').replace('&','-').replace('&','-').replace('&','-').replace('&','-').replace('&','-').replace('&','-').replace('?','').replace('?','').replace('?','').replace('?','').replace('.','-').replace('.','-').replace('/','').replace('/','').replace('/','').replace('#','').replace('#','').replace('(','').replace('(','').replace('(','').replace('(','').replace(')','').replace(')','').replace(')','').replace(')','').replace(')','').replace('+','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','');
    return (
      <>
        <Card onClick={() => onSelectTrack('/tracks/'+url+'/'+track.id, track)} key={track.id} className={styles.cardW} sx={{ width: '100%',  mb: 2 }}>
            <CardContent style={{width: '100% !important', paddingBottom: '0 !important'}}>
                <Grid container spacing={2}>
                    <Grid item sm={2} xs={2}>
                        <Image className={styles.artwork2} alt={track.artists && track.artists[0].name+' - '+track.name} width={85} height={85} src={track.album?.images && track.album.images[0].url} />
                    </Grid>
                    <Grid item md={4} xs={9} sm={4}>
                        <Typography className={styles.trackTitle} style={{width: '100%'}} gutterBottom variant="h5" component="div" noWrap>
                            {track.name}
                        </Typography>
                        <Typography noWrap style={{width: '100%', display: 'block', margin: '-5px 0 0px 0'}} gutterBottom sx={{fontSize: '14px', paddingTop: '0'}} variant="subtitle1" color="text.secondary">
                            {track.artists && track.artists[0].name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sm={2}  mt={2}>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h5" component="div">
                        {`${track.tempo ? Math.round(track.tempo) : 'N/A'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="caption" component="div">
                            BPM
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sm={2}  mt={2}>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h6" component="div">
                            {`${track.key ? getSongKeyTitle(track.key,track.mode) : 'N/A'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="caption" component="div">
                            Key
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sm={2}  mt={2}>
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
