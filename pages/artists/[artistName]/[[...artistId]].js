import { Alert, Snackbar, SnackbarContent, Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../../styles/Home.module.css'
import SearchInput from '../../components/SearchInput'
import { gtag, install } from 'ga-gtag';
import { useEffect, useState } from 'react'
import {  PianoOutlined } from '@mui/icons-material';
import logo2 from '../../../public/logo2.jpg'
import Image from 'next/image'
import ArtistDetails from '../../components/ArtistDetails'
import { useRouter } from 'next/router'
import UploadTrack from '../../components/UploadTrack'
import { JsonLd } from "react-schemaorg";

export default function Home({artistData}) {

  const router = useRouter()
  const [artist, setArtist] = useState(artistData);
  const [isFetching, setIsFetching] = useState(false);

  const { id } = router.query
  const search = router.query;

  const handleNewSearch = (isFetching) => {
    setIsFetching(isFetching)
  }

  useEffect(() => {
    install('G-LDDJ32MXZ1'); 
    fetch('/api/authSpotify').then(resp => resp.json()).then(resp => {
        if(!artist) {
            fetch('/api/getArtistData?id='+search.query).then(resp => resp.json()).then(resp => {
                setArtist(resp);
            }).catch(err => {
                console.log(err)
                console.log('redirect to 404')
            })
        }
    }).catch(err => {
      console.log(err)
      console.log('cannot authorize with spotify!!!')
    })
  })
  return (
    <div lang="en" className={styles.container}>
      <Head> 
        <title>Song key & Tempo BPM Finder Tool, {artistData.artist.name} top songs</title>
        <meta name="description" content="Song key & Tempo BPM Finder Tool, Find the bpm and key of every song" />
        <link rel="icon" href="/favicon3.png" />
        <link rel="alternate" href="http://songkeyfinder.app" hrefLang="en"/>
        <meta name="keywords" content={`Song key & Tempo BPM Finder Tool, song key finder, bpm tempo finder,${artistData.artist.name} top songs, bpm counter, bpm calculator, bpm, Find song tempo, What bpm is this`} />
          <meta name="googlebot" content="index, follow" />
          <meta name="robots" content="index, follow" />
          <link rel="apple-touch-icon-precomposed" href="/favicon3.png" />
          <link rel="shortcut icon" href="/favicon3.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Song key & Tempo BPM Finder Tool" />
          <meta name="twitter:description" content="Song key & Tempo BPM Finder and song analyzer Tool" />
          <meta name="twitter:image:src" content="/favicon3.png" />
          <meta property="og:url" content="https://songkeyfinder.app" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Song key & Tempo BPM Finder Tool" />
          <meta property="og:image" content="/favicon3.png"/>
          <meta property="og:description" content="NO ADS / NO BULLSHIT!!"/>
          <meta property="og:site_name" content="songkeyfinder.app" />
          <meta itemProp="name" content="Song key & Tempo BPM Finder Tool" />
          <meta itemProp="description" content="Song key & Tempo BPM Finder Tool" />
          <meta itemProp="image" content="./favicon3.png" />
          <JsonLd
          item={{
            "@context": "https://schema.org",
            "@type": "Artist",
            name: `Song Key & Tempo of artist: ${artistData.artist ? artistData.artist.name : ''}`,
            url: `https://songkeyfinder.app/artists/${artistData.artist.name}/${artistData.artist.id}`,
            image: `${artistData.artist.images[0] ? artistData.artist.images[0].url : "https://songkeyfinder.app/logo2.jpg"}`,
            description: "Song key & Tempo BPM Finder Tool, Find tempo bpm/key of song and its similar songs",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
            },
          }}
          />
      </Head>
      <main lang="en" className={styles.main}>
      <Image src={logo2} />
        <h1 className={styles.title}>
            Song key bpm finder
        </h1>
        <Typography variant="h2" style={{ maxWidth: '668px', fontSize: '0.85rem', lineHeight: '20px', opacity: '0.4', textAlign: 'center', margin: '8px 0 40px 0' }}>
            Find your track BPM & song key by just typing the song title or you can also upload your track to analyze, if you could not find it in our database!
        </Typography>
        <SearchInput  handleNewSearch={handleNewSearch} isSearching={isFetching} />
        <ArtistDetails artistData={artist} />
        <UploadTrack />
      </main>

    </div>
  )
}

// This function gets called at build time
export async function getServerSideProps({ search, params }) {
  // Call an external API endpoint to get posts
  const {query,path} = params;
  const login = await fetch('https://songkeyfinder.app/api/authSpotify')
  const loginResp = await login.json();
  const artist = await fetch('https://songkeyfinder.app/api/getArtistData?id='+params.artistId)
  const artistData = await artist.json();
  
  if(artistData.err) {
    if(artistData.err === "AUTHORIZATION_REQUIRED") {
      return {
        redirect: {
          destination: "/api/authSpotify",
        },
      }
    } else {
      return {
        props: {
          artistData: [],
          loginResp: artistData.err
        },
      }
    }
  } else {
    return {
      props: {
        artistData,
        loginResp: loginResp
      },
    }
  }
}
