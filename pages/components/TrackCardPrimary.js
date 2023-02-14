
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { PianoOutlined, ShareOutlined, ShareRounded } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia,  Grid,  Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';
import styles from '../../styles/Home.module.css'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { getSongKeyTitle, msToTime } from './SearchInput';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ShareURL from './ShareURL';

export default function TrackCardPrimary({track}) {
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
    
    return (
      <>
        <Card  key={track.id} sx={{ width: '100%', display: 'flex', mb: 2 }}>
            <CardContent sx={{flex: '1 0 auto', paddingBottom: '16px !important'}}>
                <Grid container spacing={2}>
                    <Grid item md={3} sm={3} xs={12}>
                        <Image className={styles.artwork} alt={track.artists && track.artists[0].name+' - '+track.name} width={window.innerWidth < 600 ? 280 : 180} height={window.innerWidth < 600 ? 280 : 180} src={track.album?.images && track.album.images[0].url} />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                        <Typography className={styles.trackTitle} style={{marginLeft: '8px',marginTop: 8,width: '100%'}} gutterBottom variant="h5" component="div" noWrap>
                            {track.name}
                        </Typography>
                        <Typography noWrap style={{width: '100%', display: 'block', margin: '-5px 0 0px 8px', fontSize: '14px !important'}} gutterBottom sx={{fontSize: '16px', paddingTop: '0'}} variant="h6" color="text.primary">
                            {track.artists && track.artists[0].name}
                        </Typography>
                        <Typography noWrap style={{width: '100%', display: 'block', margin: '-5px 0 0px 8px', fontSize: '13px !important'}} gutterBottom sx={{fontSize: '12px', paddingTop: '8px'}} variant="subtitle1" color="text.secondary">
                            Album: <b>{track.album && track.album.name}</b>
                        </Typography>
                        <Typography noWrap style={{width: '100%', display: 'block', margin: '-5px 0 0px 8px', fontSize: '13px !important'}} gutterBottom sx={{fontSize: '12px', paddingTop: '4px'}} variant="subtitle1" color="text.secondary">
                            Released: <b>{track.album && track.album.release_date}</b>
                        </Typography>
                        <Link target="_blank" href={track.external_urls && track.external_urls.spotify}><Button sx={{margin: '12px 15px 0 8px', minWidth: '40px !important', width: '40px', paddingLeft: '24px !important'}} color="success" variant="outlined" startIcon={<PlayCircleFilledWhiteIcon />} /></Link>
                        <Button aria-describedby={id} onClick={(e) => handleClick(e)} sx={{margin: '12px 15px 0 0', minWidth: '40px !important', width: '40px !important', paddingLeft: '24px !important'}} color="warning"  variant="outlined" startIcon={<ShareOutlined />} />
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
                           <ShareURL title={`Song key & BPM of the track `+track.artists && track.artists[0].name+' - '+track.name} url={window.location.href} />
                        </Popover>
                    </Grid>
                    <Grid item md={2} sm={2} xs={3}  mt={2}>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h5" component="div">
                        {`${track.tempo ? Math.round(track.tempo) : 'N/A'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} gutterBottom variant="h6" component="div">
                            {`${track.key ? getSongKeyTitle(track.key,track.mode) : 'N/A'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center', opacity: 0.6}} gutterBottom variant="caption" component="div">
                            Key
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center', opacity: 0.6}} gutterBottom variant="caption" component="div">
                            Time
                        </Typography>
                    </Grid>
                    <Grid item md={3} sm={3} xs={2}  mt={2}>
                    <Typography style={{width: '100%', textAlign: 'center', opacity: 0.6}} gutterBottom variant="caption" component="div">
                            BPM
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} mt={3} gutterBottom variant="h5" component="div">
                        {`${track.duration_ms ? msToTime(track.duration_ms) : '00:00'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center'}} mt={3} gutterBottom variant="h5" component="div">
                        {`${track.time_signature ? track.time_signature + '/4' : '4/4'}`}
                        </Typography>
                        <Typography style={{width: '100%', textAlign: 'center', opacity: 0.6}} gutterBottom variant="caption" component="div">
                            Beat
                        </Typography>
                    </Grid>
                </Grid>
        </CardContent>
    </Card>
      </>
    );
  
}
