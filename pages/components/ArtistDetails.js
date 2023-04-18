/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import React, { Component, useEffect, useState } from 'react';
import ArtistCard from './ArtistCard';
import { Alert, Backdrop, Box, Chip, CircularProgress, Divider, Snackbar } from '@mui/material';
import TrackSkeleton from './TrackSkeleton';
import { useRouter } from 'next/router';
import TrackCard from './TrackCard';
import Image from 'next/image';
import { Player } from 'react-simple-player';

export default function ArtistDetails({ artistData }) {
  const router = useRouter();
  const isLoading = !artistData;
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);
  const [loading, setLoading] = useState(true)
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: ""});

  const showNotification = (type, message) => {
    setSnackbarOpen(true);
    setNotification({
        type: type,
        message
    })
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const OnPlayDeck2 = (track) => {
    setSelectedTrack(track);
    //setTrackOnDeck2(track)
  }

  const selectTrack = (url, track) => {
    setLoading(true)
    setCurrentTrackId(track.id);
    router.push(url)
  }

  const handlePlayTrack = (event, track) => {
    event.preventDefault();
    console.log(track)
    if(!track.preview_url) {
      showNotification('error','Oops, we cannot play the preview for this specific track!!')
      setCurrentPlayingTrack(null);
    } else {
      setCurrentPlayingTrack(track);
    }
  }

  if(!artistData) {
    return(<><Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop></>)
  }

  return (
      <>
       <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {isLoading && <Box sx={{maxWidth: '768px', width: '100%', mb: 2}}><TrackSkeleton /></Box>}
        {(isLoading) && <Box sx={{maxWidth: '768px', width: '100%', mb: 8}}><TrackSkeleton /></Box>}
        <Box sx={{maxWidth: '768px', width: '100%', mb: 8, mt: 4}}>
          {artistData && artistData.artist && <>
            <ArtistCard artistData={artistData} />
            <Divider sx={{textAlign: 'center', width: '100%', mt: 6, mb: 4}}>
                <Chip sx={{ fontSize: '0.9rem'}} label={`Top Tracks From ${artistData.artist.name}`} />
            </Divider>
            {(artistData && artistData.tracks && artistData.tracks.tracks && artistData.tracks.tracks.length > 0) && artistData.tracks.tracks.map(topTrack => 
                <TrackCard handlePlayTrack={handlePlayTrack} hideSimilarIcon={true} playOnDeck={OnPlayDeck2} onSelectTrack={selectTrack} key={topTrack.id} track={topTrack} />
            )}
          </>}
        </Box>
        {(currentPlayingTrack !== null && currentPlayingTrack.artists) && <Box sx={{position: 'fixed !important', display: 'flex', padding: '10px 0 10px 10px', background: 'rgb(246, 248, 250)',  borderTop: '1px solid #ddd', bottom: '0px', left: 0, width: '100%'}} >
              <Image unoptimized alt={'playerPhoto'+currentPlayingTrack.name} width={60} height={40} src={currentPlayingTrack.album?.images && currentPlayingTrack.album.images[0].url} />
              <Player autoPlay src={currentPlayingTrack.preview_url} height={60} />
            </Box>
            }

          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity={notification.type || 'error'} sx={{ width: '100%' }}>
                  {notification.message || ''}
              </Alert>
          </Snackbar>
      </>
    );
}
