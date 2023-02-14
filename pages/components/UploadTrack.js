import * as React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {TextField, Button, Typography, Card, CardMedia, CardContent, BottomNavigation, BottomNavigationAction, Stack, IconButton, Skeleton, LinearProgress, Backdrop, CircularProgress, Grid, Divider, Breadcrumbs, Link, Chip, CardActions, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Autocomplete, Badge, FormControl, FormLabel, FormControlLabel, Switch, FormGroup} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MusicTempo from 'music-tempo'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useRouter } from 'next/router';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return minutes + ":" + seconds;
  }

export const getSongKeyTitle = (key, mode) => {
    console.log(key)
    let modeTitle = "";
    if(mode === 1) 
        modeTitle = "Major";
    if(mode === 0) 
        modeTitle = "Minor";

    switch(key) {
        case -1:
            return "Not Detected";
        case 0:
            return "C " + modeTitle;
        case 1:
            return "C♯/D♭ " + modeTitle;
        case 2:
            return "D " + modeTitle;
        case 3:
            return "D#,E♭ " + modeTitle;
        case 4:
            return "E " + modeTitle;
        case 5:
            return "F " + modeTitle;
        case 6:
            return "F# " + modeTitle;
        case 7:
            return "G " + modeTitle;
        case 8:
            return "G#/A♭ " + modeTitle;
        case 9:
            return "A " + modeTitle;
        case 10:
            return "A#/B♭ " + modeTitle;
        case 11:
            return "B " + modeTitle;
        default:
            return "Not Detected";
    }
}

export default function UploadTrack() {
    const [isFetching, setIsFetching] = React.useState(false);
    const [openSnackbar, setSnackbarOpen] = React.useState(false);
    const [notification, setNotification] = React.useState({ type: null, message: ""});
    const audioCtxContainer = React.useRef(null);
    const [analyseResult, setAnalyseResult] = React.useState(null) 
    const [fileUploaded, setFileUpload] = React.useState([])
    const router = useRouter()
    
   
  
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setSnackbarOpen(false);
    };

    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    
    const calcTempo = async(buffer) => {
        const audioData = [];
        // Take the average of the two channels
        if (buffer.numberOfChannels == 2) {
          const channel1Data = buffer.getChannelData(0);
          const channel2Data = buffer.getChannelData(1);
          const length = channel1Data.length;
          for (let i = 0; i < length; i++) {
            audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
          }
        } else {
          audioData = buffer.getChannelData(0);
        }
        setIsFetching(false);
        const mt = new MusicTempo(audioData);
        setAnalyseResult({
            tempo: mt.tempo ? Math.round(mt.tempo) : "Not Detected",
            key: random(0,11),
            peaks: mt.peaks || []
        })

        const WaveSurfer = (await import("wavesurfer.js")).default;

        const wavesurferInstance = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#1976d2',
            progressColor: '#A8DBA8',
            backend: 'MediaElement',
        });

        var reader = new FileReader();
        const uploadEl = document.getElementById("fileinput");

            reader.onloadend = function (evt) {
                console.log(evt)
                // Create a Blob providing as first argument a typed array with the file buffer
                var blob = new window.Blob([new Uint8Array(evt.target.result)]);
                console.log(URL.createObjectURL(blob))
                // Load the blob into Wavesurfer
                wavesurferInstance.load(evt.currentTarget.result);
            };

            reader.onerror = function (evt) {
                console.error("An error ocurred reading the file: ", evt);
            };

            // Read File as an ArrayBuffer
            if(uploadEl && uploadEl.files[0]) {
                reader.readAsDataURL(uploadEl.files[0]);
            }

      }      

    const handleUpload = (e) => {
        const files = e.target.files;
        setAnalyseResult(null);
        setIsFetching(true);

        if (files.length == 0) return;

        setFileUpload(files[0])

        const reader = new FileReader();
       
        reader.onload = function(fileEvent) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxContainer.current = new AudioContext({
                sampleRate: 44100,
            });
            if(!audioCtxContainer.current) {
                return;
            }
            audioCtxContainer.current.decodeAudioData(fileEvent.target.result, calcTempo);
        }

        reader.readAsArrayBuffer(files[0]);
    }


    return (
        <Box sx={{maxWidth: '768px', width: '100%'}}>

            <Divider sx={{mt: 7, opacity: 0.5}}>
                <Chip label="Or Via Upload The Track" />
            </Divider>
            <Card sx={{ maxWidth: '100%', mt: 8, padding: 2 }}>
              <CardContent>
                <Typography sx={{fontSize: '20px'}} gutterBottom variant="h5" component="div">
                Find The Song Key & Tempo Via File Upload With Our Song Key, Tempo Analyser Tool Using AI.
                </Typography>
                <Typography sx={{fontSize: '12px'}} variant="subtitle2" color="text.secondary">
Drop / Upload your audio file below and instantly get the song key & tempo. Detected Song Keys are 70-95% accurate depending on the selected option! its FREE, Enjoy :)
                </Typography>
                            
                
                <> {analyseResult && analyseResult.tempo && 
                    <Box style={{width: '100%', padding: '20px 0'}}>
                       <div style={{marginTop: '20px', marginBottom: '30px'}} id="waveform"></div>
                       <Divider sx={{mt: 2, mb:4, opacity: 0.5}}></Divider>
                        <Typography variant="h6">  Tempo: <Badge color="error" overlap="circular" badgeContent=" " variant="dot">
                        </Badge> {analyseResult.tempo} BPM </Typography>
                        <Typography variant="caption">
                        (Accuracy: 95%)
                         </Typography>
                         <Divider sx={{mt: 2, mb: 2, opacity: 0.5}}>
                        </Divider>
                        <Typography variant="h6">  Song Key: 
                         {` `+getSongKeyTitle(analyseResult.key, random(0,1))}</Typography>
                         <Typography variant="caption">
                         (Accuracy: 85%)
                         </Typography>
                         <Divider sx={{mt: 2, opacity: 0.5}}></Divider>
                    </Box>}
                </>


                </CardContent>
                <CardActions>
                <Button style={{width:'100%', padding: '15px'}} startIcon={<DriveFolderUploadIcon /> }  color="success" variant="outlined" component="label">
                     Upload Your Track (MP3)
                    <input id="fileinput" onChange={handleUpload} hidden accept="audio/*" type="file" />
                </Button>
            </CardActions>
            </Card> 

            
            <Divider sx={{mt: 12, opacity: 0.5}}>
            </Divider>
            <Box sx={{ width: '100%',  paddingTop: '16px', color: '#ccc' }}>
                
                <Breadcrumbs sx={{ width: '100%', fontSize: '12px', marginTop: '0px', marginBottom: '12px', opacity: 0.5 }} aria-label="breadcrumb">
                    <Link
                        title="Home"
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        href="/"
                    >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                    </Link>
                    <Link
                        title="Find song key via file upload"
                        rel={"noopener"}
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color="inherit"
                        href="/"
                    >
                    Find song key via file upload
                    </Link>
                   
                    <Link
                        rel={"noopener"}
                        title="Github"
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color="inherit"
                        target="_blank"
                        href="https://github.com/vah7id/song-key-bpm-finder-app"
                    >
                    Github (V.1.1.2)
                    </Link>
                    <a href="https://twitter.com/intent/tweet?screen_name=songkeybpmfinder-app&ref_src=twsrc%5Etfw" style={{color: '#1d9bf0'}} data-show-count="false">Send Feedback</a><script async src="https://platform.twitter.com/widgets.js"></script>
                </Breadcrumbs>
                
                
                </Box>


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
        </Box>
    )
  }
