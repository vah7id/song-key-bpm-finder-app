import { Alert, Backdrop, Box, Chip, CircularProgress, Divider, FormGroup, Grid, Snackbar, Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import SearchInput from '../components/SearchInput'
import { gtag, install } from 'ga-gtag';
import { useEffect, useState } from 'react'
import {  PianoOutlined, UploadFile } from '@mui/icons-material';
import logo2 from '../../public/logo2.jpg';
import Image from 'next/image'
import { useRouter } from 'next/router'
import UploadTrack from '../components/UploadTrack'
import TrackCard from '../components/TrackCard'
export default function Search() {
  const router = useRouter()
  const [isFetching, setIsFetching] = useState(true);
  const [tracksData, setTracksData] = useState([]) 
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: ""});

  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    fetch('/api/authSpotify').then(resp => resp.json()).then(resp => {
      if(router.query.query !== "") {
        fetch(`/api/findBpm?title=${router.query.query || ""}`).then(response => response.json()).then(response => {
          setIsFetching(false);
          if(response.err) {
             
          } else {
              setTracksData(response);
          }
        }).catch(err => {
            console.log(err.message)
            setIsFetching(false);
            showNotification('error', 'Oops, Unfortunately we cannot fetch the URL!! Please try again!!!');
        });
      }
    }).catch(err => {
      console.log(err)
      console.log('cannot authorize with spotify!!!')
    })
  }, [router.query.query, router.asPath])

  const handleNewSearch = (isFetching) => {
    setIsFetching(isFetching)
  }
      
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
  

  const selectTrack = (url, track) => {
    setTracksData([])
    setIsFetching(true);
    router.push(url)
}

  return (
    <div lang="en" className={styles.container}>
      <Head> 
        <title>Song key & Tempo BPM Finder Tool</title>
        <meta name="description" content="Song key & Tempo BPM Finder Tool, Find the bpm and key of every song" />
        <link rel="icon" href="/favicon3.png" />
        <link rel="alternate" href="http://songkeyfinder.app" hrefLang="en"/>
        <meta name="keywords" content="Song key & Tempo BPM Finder Tool, song key finder, bpm tempo finder" />
          <meta name="googlebot" content="index, follow" />
          <meta name="robots" content="index, follow" />
          <link rel="apple-touch-icon-precomposed" href="/favicon3.png" />
          <link rel="shortcut icon" href="/favicon3.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Song key & Tempo BPM Finder Tool" />
          <meta name="twitter:description" content="Song key & Tempo BPM Finder and song analyzer Tool" />
          <meta name="twitter:image:src" content="/favicon3.png" />
          {/*<meta property="fb:admins" content="100002861414139">
          <meta property="fb:app_id" content="503426229739677">*/}
          <meta property="og:url" content="https://songkeyfinder.app" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Song key & Tempo BPM Finder Tool" />
          <meta property="og:image" content="/favicon3.png"/>
          <meta property="og:description" content="NO ADS / NO BULLSHIT!!"/>
          <meta property="og:site_name" content="songkeyfinder.app" />
          <meta itemProp="name" content="Song key & Tempo BPM Finder Tool" />
          <meta itemProp="description" content="Song key & Tempo BPM Finder Tool" />
          <meta itemProp="image" content="./favicon3.png" />
      </Head>
      <main lang="en" className={styles.main}>
        <Link href="/" passHref>
          <Image style={{ minWidth: "225px", cursor: 'pointer'}} alt="logo" onClick={() => router.push('/')} src={logo2} />
        </Link>

        <Link href="/" passHref>
          <h1 className={styles.title}>
              Song key bpm finder
          </h1>
        </Link>
        <Typography variant="h2" style={{ maxWidth: '668px', fontSize: '0.85rem', lineHeight: '20px', opacity: '0.4', textAlign: 'center', margin: '16px 0 40px 0' }}>
            Find your track BPM & song key by just typing the song title or you can also upload your track to analyze, if you could not find it in our database!
        </Typography>
        <SearchInput handleNewSearch={handleNewSearch} isSearching={isFetching} />
        {(tracksData && tracksData.length > 0) && 
          <Box sx={{ maxWidth: '768px',width: '100%', mt: '25px' }}>
              <Grid container spacing={2}>
                  <Grid xs={12}>
                      <Divider sx={{textAlign: 'center', width: '100%', mt: 4, mb: 4}}>
                          <Chip label={`BPM, Song Key Results of ${router.query.query}`} />
                      </Divider>
                  </Grid>
                  
                  {tracksData.map((track, index) => {
                      return (<TrackCard onSelectTrack={selectTrack} key={'tr-'+index} track={track} />) })}
              </Grid>
          </Box>}

          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={notification.type || 'error'} sx={{ width: '100%' }}>
                    {notification.message || ''}
                </Alert>
            </Snackbar>
            
            {isFetching && <Backdrop
                sx={{ color: '#fff', textAlign: 'center', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isFetching}
                >
                <CircularProgress color="inherit" />
            </Backdrop>}
        <UploadTrack />
      </main>
    </div>
  )
}
