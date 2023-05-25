import { Alert, Backdrop, Box, CircularProgress, Snackbar, Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import SearchInput from '../components/SearchInput'
import { gtag, install } from 'ga-gtag';
import { useEffect, useState } from 'react'
import {  PianoOutlined } from '@mui/icons-material';
import logo2 from '../../public/logo2.jpg'
import Image from 'next/image'
import TrackDetails from '../components/TrackDetails'
import { useRouter } from 'next/router'
import TrackSkeleton from '../components/TrackSkeleton'
import UploadTrack from '../components/UploadTrack'
import Header from '../components/Header'
import dynamic from 'next/dynamic'
import {Player} from 'react-simple-player';
import { JsonLd } from "react-schemaorg";

const SpotifyWebPlayer = dynamic(() => import('react-spotify-web-playback'), {
  loading: () => 'Loading...',
  ssr: false,
})

export default function Home({ trackDetails,loginResp }) {
  const router = useRouter()
  const [track, setTrack] = useState(trackDetails);
  const [loading,setLoading] = useState(true);
  const [currentTrackId, setCurrentTrackId] = useState(router.query?.trackId ? router.query.trackId[router.query.trackId.length-1] : null);
  const [token, setToken] = useState(loginResp ? loginResp.token : null);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);
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
  
  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    setLoading(false);
    if(!track || track.id !== trackDetails.id) {
      setTrack(trackDetails)
      setLoading(false)
    }
  }, [router.asPath, router.query, trackDetails])

  const selectTrack = (url, track) => {
    setLoading(true)
    setCurrentTrackId(track.id);
    router.push(url)
  }

  const handleNewSearch = (isFetching) => {
    setLoading(isFetching)
  }

  if(!track) {
    return(<Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>)
  }

  return (
    <div lang="en" className={styles.container}>
      <Head> 
        <title>Song key & Tempo BPM of song {((track && track.artists) ? track.artists[0].name : '')+' '+(track ? track.name : '')}, Similar songs for Harmonic Mixing</title>
        <meta name="description" content={`Song key & Tempo BPM of track ${((track && track.artists) ? track.artists[0].name : "")} ${track ? track.name : ""} , Similar tracks for mixing`} />
        <link rel="icon" href="/favicon3.png" />
        <link rel="alternate" href="http://songkeyfinder.app" hrefLang="en"/>
        <meta name="keywords" content={`Song key & Tempo BPM Finder Tool,${((track && track.artists) ? track.artists[0].name : "")} ${track ? track.name : ""},Similar tracks for mixing,bpm tempo finder, bpm counter, bpm calculator, bpm, Find song tempo, What bpm is this`} />
          <meta name="googlebot" content="index, follow" />
          <meta name="robots" content="index, follow" />
          <link rel="apple-touch-icon-precomposed" href="/favicon3.png" />
          <link rel="shortcut icon" href="/favicon3.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`Song key & Tempo BPM of track ${((track && track.artists) ? track.artists[0].name : "")} ${track ? track.name : ""}`} />
          <meta name="twitter:description" content={`Song key & Tempo BPM of track ${((track && track.artists) ? track.artists[0].name : "")} ${track ? track.name : ""} , Similar tracks for mixing`} />
          <meta name="twitter:image:src" content="/favicon3.png" />
        {/*<meta property="fb:admins" content="100002861414139">
          <meta property="fb:app_id" content="503426229739677">*/}
          <meta property="og:url" content="https://songkeyfinder.app" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={`Song key & Tempo BPM of track ${((track && track.artists) ? track.artists[0].name : "")} ${track ? track.name : ""}`} />
          <meta property="og:image" content="/favicon3.png"/>
          <meta property="og:description" content={`Song key & Tempo BPM of track ${((track && track.artists) ? track.artists[0].name : "")} ${track ? track.name : ""} , Similar tracks for mixing`}/>
          <meta property="og:site_name" content="songkeyfinder.app" />
          <meta itemProp="name" content={`Song key & Tempo BPM of track ${((track && track.artists) ? track.artists[0].name : "")} ${track ? track.name : ""}`} />
          <meta itemProp="description" content={`Song key & Tempo BPM of track ${((track && track.artists) ? track.artists[0].name : "")} ${track ? track.name : ""} , Similar tracks for mixing`} />
          <meta itemProp="image" content="./favicon3.png" />
         
      </Head>
      <main lang="en" className={styles.main}>
        <Header />
        <SearchInput handleNewSearch={handleNewSearch} isSearching={false} />
        {loading && <TrackSkeleton />}
        {track && <TrackDetails key={track.id} handlePlayTrack={handlePlayTrack} isFetching={loading} onSelectTrack={selectTrack} track={track} />}
        <UploadTrack />
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {(currentPlayingTrack !== null && currentPlayingTrack.artists) && 
            <Box sx={{position: 'fixed !important', display: 'flex', padding: '10px 0 10px 10px', background: 'rgb(246, 248, 250)',  borderTop: '1px solid #ddd', bottom: '0px', left: 0, width: '100%'}} >
              <Image unoptimized alt={'playerPhoto'+currentPlayingTrack.name} width={60} height={40} src={currentPlayingTrack.album?.images[0] && currentPlayingTrack.album.images[0].url} />
              <Player autoPlay src={currentPlayingTrack.preview_url} height={60} />
            </Box>
            }

          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity={notification.type || 'error'} sx={{ width: '100%' }}>
                  {notification.message || ''}
              </Alert>
          </Snackbar>
            
      </main>
    </div>
  )
}

// This function gets called at build time
export async function getServerSideProps({ params }) {
  // Call an external API endpoint to get posts
  const login = await fetch('https://songkeyfinder.app/api/authSpotify')
  const loginResp = await login.json();
  const track = await fetch('https://songkeyfinder.app/api/getTrackData?id='+params.trackId[params.trackId.length-1])
  const trackDetails = await track.json();

  if(trackDetails.err) {
    if(trackDetails.err === "AUTHORIZATION_REQUIRED") {
      return {
        redirect: {
          destination: "/api/authSpotify",
        },
      }
    } else {
      return {
        props: {
          trackDetails: trackDetails,
          loginResp: trackDetails.err
        },
      }
    }
  } else {
    return {
      props: {
        trackDetails,
        loginResp: loginResp
      },
    }
  }
}
