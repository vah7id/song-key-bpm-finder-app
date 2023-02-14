import { Box, CircularProgress, Typography } from '@mui/material'
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
export default function Home() {
  const router = useRouter()
  const [track, setTrack] = useState(null);
  const [loading,setLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(router.query?.trackId ? router.query.trackId[router.query.trackId.length-1] : null);
  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    setLoading(true);
    fetch('/api/authSpotify').then(resp => resp.json()).then(resp => {
        if(!track || (router.query && router.query.trackId &&  currentTrackId !== router.query.trackId[router.query.trackId.length-1])) {
            fetch('/api/getTrackData?id='+router.query.trackId[router.query.trackId.length-1]).then(resp => resp.json()).then(resp => {
                setTrack(resp);
                setCurrentTrackId(resp.id)
                setLoading(false);
            }).catch(err => {
                console.log(err)
                setTrack(null);
                console.log('redirect to 404')
                setLoading(false);
            })
        }
    }).catch(err => {
      console.log(err)
      setLoading(false);
      console.log('cannot authorize with spotify!!!')
    })
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
        <Image alt="logo" onClick={() => router.push('/')} src={logo2} />

        <Link href="/" passHref>
          <h1 className={styles.title}>
              Song key bpm finder
          </h1>
        </Link>
        <Typography variant="h2" style={{ maxWidth: '668px', fontSize: '0.85rem', lineHeight: '20px', opacity: '0.4', textAlign: 'center', margin: '16px 0 40px 0' }}>
            Find your track BPM & song key by just typing the song title or you can also upload your track to analyze, if you could not find it in our database!
        </Typography>
        <SearchInput handleNewSearch={handleNewSearch} isSearching={false} />
        {loading && <TrackSkeleton />}
        {track && <TrackDetails isFetching={loading} onSelectTrack={selectTrack} track={track} />}
        <UploadTrack />
      </main>
    </div>
  )
}
