import { Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import SearchInput from './components/SearchInput'
import { gtag, install } from 'ga-gtag';
import { useEffect, useState } from 'react'
import {  PianoOutlined, UploadFile } from '@mui/icons-material';
import { useRouter } from 'next/router'
import UploadTrack from './components/UploadTrack'
import Header from './components/Header'

export default function Home() {
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter()

  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    fetch('/api/authSpotify').then(resp => resp.json()).then(resp => {
      console.log('authorized with spotify api!')
    }).catch(err => {
      console.log(err)
      console.log('cannot authorize with spotify!!!')
    })
  })

  const handleNewSearch = (isFetching) => {
    setIsFetching(isFetching)
  }

  return (
    <div lang="en" className={styles.container}>
      <Head> 
        <title>Song key & Tempo BPM Finder Tool, Find similar songs for mixing tool online</title>
        <meta name="description" content="Song key & Tempo BPM Finder Tool, Find bpm/key of song and its similar songs" />
        <link rel="icon" href="/favicon3.png" />
        <link rel="alternate" href="http://songkeyfinder.app" hrefLang="en"/>
        <meta name="keywords" content="Song key & Tempo BPM Finder Tool, song key finder, bpm tempo finder, similar songs mixing" />
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
        <SearchInput handleNewSearch={handleNewSearch} isSearching={isFetching} />
        <UploadTrack />
      </main>
    </div>
  )
}
