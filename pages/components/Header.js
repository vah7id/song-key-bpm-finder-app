/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import React from 'react';
import { Link, Typography } from '@mui/material';
import logo2 from '../../public/logo2.jpg'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router';

export default function Header() {
    const router = useRouter();
    return (
      <>
          <Image style={{ cursor: 'pointer'}} alt="logo" onClick={() => router.push('/search')} src={logo2} />

        <Link href="/search" passHref>
          <h1 className={styles.title}>
              Song key bpm finder / Find Similar songs for mixing
          </h1>
        </Link>
        <Typography variant="h2" style={{ maxWidth: '768px', fontSize: '0.85rem', lineHeight: '20px', opacity: '0.4', textAlign: 'center', margin: '16px 0 40px 0' }}>
            Find your song BPM & song key, and similar songs for mixing, by just typing the song title or you can also upload your audio file to analyze, if you could not find it in our database!
        </Typography>
      </>
    );
}
