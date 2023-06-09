import { Alert, Box, Button, Chip, Divider, Grid, Snackbar, Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import SearchQuery from '../components/SearchQuery'
import { gtag, install } from 'ga-gtag';
import { useEffect, useState } from 'react'
import {  PianoOutlined, UploadFile } from '@mui/icons-material';
import { useRouter } from 'next/router'
import UploadTrack from '../components/UploadTrack'
import Header from '../components/Header'
import SearchIcon from '@mui/icons-material/Search';
import TrackCard from '../components/TrackCard'
import Image from 'next/image'
import { Player } from 'react-simple-player'

export default function Search() {
  const [selectedTrack, setselectedTrack] = useState(false);
  const [selectedArtist, setselectedArtist] = useState(false);
  const router = useRouter()
  const [tracksData, setTracksData] = useState([]) 
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: ""});

  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);
  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    fetch('/api/authSpotify').then(resp => resp.json()).then(resp => {
      console.log('authorized with spotify api!')
    }).catch(err => {
      console.log(err)
      console.log('cannot authorize with spotify!!!')
    })
  })

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

  const handleClosePlayer = () => {
    setCurrentPlayingTrack(null)
  }

  const handleTrackSearch = (data) => {
        setselectedTrack(data)
  }

  const handleArtistSearch = (data) => {
        setselectedArtist(data)
  }

  const handleSearch = () => {
    // fetch here and set track data
    fetch('/api/findBpm?title=track:'+selectedTrack+' artist:'+selectedArtist).then(resp => resp.json()).then(resp => {
        console.log(resp)
        setTracksData(resp)
        if(resp.data.length === 0) {
            showNotification('error','Oops, we cannot fetch any songs atm!!')
        }
    }).catch(err => {
        showNotification('error','Oops, we cannot fetch any songs atm!!')
        setTracksData([])
    })
  }
    const selectTrack = (url) => {
        router.push(url)
    }

  return (
    <div lang="en" className={styles.container}>
      <Head> 
        <title>Song key & Tempo BPM Finder Tool, Find similar songs for mixing </title>
        <meta name="description" content="Song key & Tempo BPM Finder Tool, Find bpm/key of song and its similar songs" />
        <link rel="icon" href="/favicon3.png" />
        <link rel="alternate" href="http://songkeyfinder.app" hrefLang="en"/>
        <meta name="keywords" content="Song key & Tempo BPM Finder Tool, song key finder, bpm tempo finder, similar songs mixing,, bpm counter, bpm calculator, bpm, Find song tempo, What bpm is this" />
          <meta name="googlebot" content="index, follow" />
          <meta name="robots" content="index, follow" />
          <link rel="apple-touch-icon-precomposed" href="/favicon3.png" />
          <link rel="shortcut icon" href="/favicon3.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Song key & Tempo BPM Finder Tool, Find similar songs for mixing" />
          <meta name="twitter:description" content="Song key & Tempo BPM Finder and song analyzer Tool, Find similar songs for mixing" />
          <meta name="twitter:image:src" content="/favicon3.png" />
        {/*<meta property="fb:admins" content="100002861414139">
          <meta property="fb:app_id" content="503426229739677">*/}
          <meta property="og:url" content="https://songkeyfinder.app" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Song key & Tempo BPM Finder Tool, Find similar songs for mixing" />
          <meta property="og:image" content="/favicon3.png"/>
          <meta property="og:description" content="NO ADS / NO BULLSHIT!! Find similar songs for mixing"/>
          <meta property="og:site_name" content="songkeyfinder.app" />
          <meta itemProp="name" content="Song key & Tempo BPM Finder Tool, Find similar songs for mixing" />
          <meta itemProp="description" content="Song key & Tempo BPM Finder Tool, Find similar songs for mixing" />
          <meta itemProp="image" content="./favicon3.png" />
      </Head>
      <main lang="en" className={styles.main}>
        <Header />
        <SearchQuery type={'track'} handleNewSearch={handleTrackSearch} isSearching={false} />
        <SearchQuery type={'artist'} handleNewSearch={handleArtistSearch} isSearching={false} />
        <Box  xs={12}>
            <Button
                onClick={() => handleSearch()} 
                size='large'  
                sx={{ width: '100%', padding: '20px'}} 
                variant='contained'
                >
                    <SearchIcon sx={{fontSize: '1.5rem !important'}} />
                    Search for the similar songs 
            </Button>
        </Box>

        {(tracksData && tracksData.length > 0) && <Box sx={{ maxWidth: '768px',width: '100%', mt: '25px' }}>
            <Grid  container spacing={2}>
                <Grid xs={12}>
                    <Divider sx={{textAlign: 'center', width: '100%', mt: 4, mb: 4}}>
                        <Chip label={`Results of advanced search, ${selectedTrack} , ${selectedArtist}`} />
                    </Divider>
                </Grid>
                
                {tracksData.map((track, index) => {
                    return (<TrackCard handlePlayTrack={handlePlayTrack} onSelectTrack={selectTrack} key={'tr-'+index} track={track} />) })}
            </Grid>
        </Box>}
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity={notification.type || 'error'} sx={{ width: '100%' }}>
                  {notification.message || ''}
              </Alert>
          </Snackbar>
        {(currentPlayingTrack !== null && currentPlayingTrack.artists) && 
            <Box sx={{position: 'fixed !important', display: 'flex', padding: '10px 0 10px 10px', background: 'rgb(246, 248, 250)',  borderTop: '1px solid #ddd', bottom: '0px', left: 0, width: '100%'}} >
              <Image unoptimized alt={'playerPhoto'+currentPlayingTrack.name} width={60} height={40} src={currentPlayingTrack.album?.images[0] && currentPlayingTrack.album.images[0].url} />
              <Player autoPlay src={currentPlayingTrack.preview_url} height={60} />
            </Box>
            }
      </main>
    </div>
  )
}
