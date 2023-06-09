import { Box, Button, Chip, Divider, Grid, Typography } from '@mui/material'
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

export default function Search() {
  const [selectedTrack, setselectedTrack] = useState(false);
  const [selectedArtist, setselectedArtist] = useState(false);
  const router = useRouter()
  const [tracksData, setTracksData] = useState([]) 

  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    fetch('/api/authSpotify').then(resp => resp.json()).then(resp => {
      console.log('authorized with spotify api!')
    }).catch(err => {
      console.log(err)
      console.log('cannot authorize with spotify!!!')
    })
  })

  const handleTrackSearch = (data) => {
    if(data) {
        setselectedTrack(data)
    }
  }

  const handleArtistSearch = (data) => {
    if(data) {
        setselectedArtist(data)
    }
  }

  const handleSearch = () => {
    // fetch here and set track data
    fetch('https://songkeyfinder.app/api/findBpm?title=track:'+selectedTrack+',artist:'+selectedArtist).then(resp => resp.json()).then(resp => {
        console.log(resp)
    })
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
        <SearchQuery type={'track'} handleNewSearch={handleTrackSearch} isSearching={selectedTrack} />
        <SearchQuery type={'artist'} handleNewSearch={handleArtistSearch} isSearching={selectedArtist} />
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
        {(tracksData && tracksData.length === 1) && <Box sx={{ width: '100%', mt: '25px' }}>
            <Grid  container spacing={2}>
                <Grid xs={12}>
                    <Divider sx={{textAlign: 'center', width: '100%', mt: 4, mb: 4}}>
                        <Chip label={`BPM, Song Key Results of ${url}`} />
                    </Divider>
                </Grid>
                
                {tracksData.map((track, index) => {
                    return (<TrackCard onSelectTrack={selectTrack} key={'tr-'+index} track={track} />) })}
                
            </Grid>
        </Box>}
      </main>
    </div>
  )
}
