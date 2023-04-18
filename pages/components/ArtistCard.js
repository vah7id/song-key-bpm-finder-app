
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

export default function ArtistCard({artistData}) {
    const router = useRouter();
    if(!artistData) {
        return (<></>)
    }

    if(artistData && artistData.artist && artistData.artist.length === 0) {
        return (<></>)
    }

    const artist = artistData.artist;
    const tracks = artistData.tracks;


    return (
      <>
        <Card key={artist.id} className={styles.cardW} sx={{ width: '100%',  mb: 2 }}>
            <CardContent style={{width: '100% !important', paddingBottom: '16px !important'}}>
                <Grid container spacing={2}>
                    <Grid item sm={2} xs={2}>
                        <Image unoptimized className={styles.artwork2} alt={artist.artists && artist.artists[0].name+' - '+artist.name} width={85} height={85} src={artist.images && artist.images[0].url} />
                    </Grid>
                    <Grid item md={6} xs={9} sm={6}>
                        <Typography className={styles.artistTitle} style={{width: '100%', marginTop: '0px !important'}}  variant="h5" component="div" noWrap>
                            {artist.name}
                        </Typography>
                        <Typography  className={styles.artistTitle} style={{width: '100%', marginTop: '0px !important', marginBottom: '16px !important'}}  variant="body" component="div" noWrap>
                            Genre: {artist.genres[0]}
                        </Typography>
                        {artist?.external_urls && <Button style={{marginTop: '4px'}} variant="outlined"><Link href={artist?.external_urls.spotify} target="_blank" >Open Artist Page on Spotify</Link></Button>}
                    </Grid>
                </Grid>
        </CardContent>
    </Card>
      </>
    );
}
