
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { PianoOutlined, ShareOutlined, ShareRounded } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia,  Grid,  Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';

import styles from '../../styles/Home.module.css'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { getSongKeyTitle, msToTime } from './SearchInput';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ShareURL from './ShareURL';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
    
    return (
      <>
        <Card  key={track.id} sx={{ width: '100%', display: 'flex', mb: 2 }}>
            <CardContent sx={{flex: '1 0 auto', paddingBottom: '16px !important'}}>
                <Grid container spacing={2}>
                    <Grid item md={3} sm={2} xs={12} mt={1}>
                        <Image className={styles.artwork} alt={track.artists && track.artists[0].name+' - '+track.name} width={170} height={ 170} src={track.album?.images && track.album.images[0].url} />
                    </Grid>
                    <Grid item md={4} sm={4} ml={1} xs={11}>
                        <Typography className={styles.trackTitle} sx={{marginTop: '8px',width: '90%'}} gutterBottom variant="h5" component="div">
                            {track.name}
                        </Typography>
                        <Typography noWrap style={{width: '100%', display: 'block', margin: '-5px 0 0px 0', fontSize: '14px !important'}} gutterBottom sx={{fontSize: '16px !important', paddingTop: '0'}} variant="h5" color="text.primary">
                            {track.artists && track.artists[0].name}
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
      </>
    );
  
}
