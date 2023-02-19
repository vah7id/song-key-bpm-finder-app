import { Backdrop, Box, CircularProgress, Typography } from '@mui/material'
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
export default function Home({ trackDetails }) {
  const router = useRouter()
  const [track, setTrack] = useState(trackDetails);
  const [loading,setLoading] = useState(true);
  const [currentTrackId, setCurrentTrackId] = useState(router.query?.trackId ? router.query.trackId[router.query.trackId.length-1] : null);
  
  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    setLoading(false);
  }, [router.asPath, router.query])

  const selectTrack = (url, track) => {
    setLoading(true)
    setTrack(null);
    setCurrentTrackId(track.id);
    router.push(url)
  }

  const handleNewSearch = (isFetching) => {
    setLoading(isFetching)
  }

  if(!trackDetails) {
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
        <title>Song key & Tempo BPM of track {(track.artists ? track.artists[0].name : '')+' '+track.name || ''}</title>
        <meta name="description" content={`Song key & Tempo BPM of track ${(track.artists ? track.artists[0].name : "")} ${track.name || ""} , Similar tracks for mixing`} />
        <link rel="icon" href="/favicon3.png" />
        <link rel="alternate" href="http://songkeyfinder.app" hrefLang="en"/>
        <meta name="keywords" content={`Song key & Tempo BPM Finder Tool,${(track.artists ? track.artists[0].name : '')},${track.name || ""},Similar tracks for mixing,bpm tempo finder`} />
          <meta name="googlebot" content="index, follow" />
          <meta name="robots" content="index, follow" />
          <link rel="apple-touch-icon-precomposed" href="/favicon3.png" />
          <link rel="shortcut icon" href="/favicon3.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`Song key & Tempo BPM of track ${(track.artists ? track.artists[0].name : "")} ${track.name || ""}`} />
          <meta name="twitter:description" content={`Song key & Tempo BPM of track ${(track.artists ? track.artists[0].name : "")} ${track.name || ""} , Similar tracks for mixing`} />
          <meta name="twitter:image:src" content="/favicon3.png" />
        {/*<meta property="fb:admins" content="100002861414139">
          <meta property="fb:app_id" content="503426229739677">*/}
          <meta property="og:url" content="https://songkeyfinder.app" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={`Song key & Tempo BPM of track ${(track.artists ? track.artists[0].name : "")} ${track.name || ""}`} />
          <meta property="og:image" content="/favicon3.png"/>
          <meta property="og:description" content={`Song key & Tempo BPM of track ${(track.artists ? track.artists[0].name : "")} ${track.name || ""} , Similar tracks for mixing`}/>
          <meta property="og:site_name" content="songkeyfinder.app" />
          <meta itemProp="name" content="Song key & Tempo BPM Finder Tool" />
          <meta itemProp="description" content="Song key & Tempo BPM Finder Tool" />
          <meta itemProp="image" content="./favicon3.png" />
      </Head>
      <main lang="en" className={styles.main}>
        <Header />
        <SearchInput handleNewSearch={handleNewSearch} isSearching={false} />
        {loading && <TrackSkeleton />}
        {track && <TrackDetails isFetching={loading} onSelectTrack={selectTrack} track={track} />}
        <UploadTrack />
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </main>
    </div>
  )
}

// This function gets called at build time
export async function getServerSideProps({ params }) {
  // Call an external API endpoint to get posts
  const login = await fetch('http://localhost:3000/api/authSpotify')
  const track = await fetch('http://localhost:3000/api/getTrackData?id='+params.trackId[params.trackId.length-1])
  const trackDetails = await track.json();


  return {
    props: {
      trackDetails,
    },
  }
}
