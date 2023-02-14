import * as React from 'react';
import Box from '@mui/material/Box';
import DownloadIcon from '@mui/icons-material/Download';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import SaveIcon from '@mui/icons-material/Save';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LoopIcon from '@mui/icons-material/Loop';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {TextField, Button, Typography, Card, CardMedia, CardContent, BottomNavigation, BottomNavigationAction, Stack, IconButton, Skeleton, LinearProgress, Backdrop, CircularProgress, Grid, Divider, Breadcrumbs, Link, Chip, CardActions, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Autocomplete, Badge, FormControl, FormLabel, FormControlLabel, Switch, FormGroup} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import ShareURL from './ShareURL';
import styles from '../../styles/Home.module.css'
import SearchIcon from '@mui/icons-material/Search';
import { PianoOutlined, Router } from '@mui/icons-material';
import MusicTempo from 'music-tempo'
import SpeedIcon from '@mui/icons-material/Speed';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useRouter } from 'next/router';
import TrackCard from './TrackCard';

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

export default function SearchInput() {
    const [url, setURL] = React.useState('');
    const [isFetching, setIsFetching] = React.useState(false);
    const [openSnackbar, setSnackbarOpen] = React.useState(false);
    const [notification, setNotification] = React.useState({ type: null, message: ""});
    const [tracksData, setTracksData] = React.useState([]) 
    const [autocompleteItems, setAutocompleteItems] = React.useState([]) 
    const [analyseResult, setAnalyseResult] = React.useState(null) 
    const [fileUploaded, setFileUpload] = React.useState([])
    const router = useRouter()

    const handleAutoComplete = () => {
        if(url.length > 3) {
            fetch(`/api/search?title=${url || ""}`).then(response => response.json()).then(response => {
                if(response.err) {
                    setAutocompleteItems([])
                } else {
                    let options = []
                    response.map((track, index) => {
                        options[index] = { id: track.id, label: track.name   +' '+track.artists[0].name   }
                    })
                    console.log(options)
                    setAutocompleteItems(options)
                }
            }).catch(err => {
                setAutocompleteItems([])
            });
        }
    }

    React.useEffect(() => {
        if(url !== "" && autocompleteItems.length === 0) {
            console.log(autocompleteItems)
            handleAutoComplete()
        }
    }, [url, autocompleteItems])
    
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

    const handleChange = (query) => {
        console.log(query)
        console.log(url)

        if(!query && (!url || url === "") ) {
            return;
        }
        setAnalyseResult(null);
        const title = query || url; 

        setIsFetching(true);
        if(title === "") {
            showNotification('error', 'Oops!! Please type your song title first :)')
        }

        fetch(`/api/findBpm?title=${title || ""}`).then(response => response.json()).then(response => {
            setIsFetching(false);
            if(response.err) {
                showNotification('error', response.err.message);
            } else {
                setTracksData(response);
            }
        }).catch(err => {
            console.log(err.message)
            setIsFetching(false);
            showNotification('error', 'Oops, Unfortunately we cannot fetch the URL!! Please try again!!!');
        });
    }

    
    const handlePaste = (event) => {
        handleChange(event.clipboardData.getData('text/plain'));
    }

    const handleSelectAutoComplete = (id, label) => {
        // fetch track and set data
        if(id) {
            setIsFetching(true)
            fetch(`/api/fetchTrack?id=${id}`).then(response => response.json()).then(response => {
                setIsFetching(false)
                if(response.err) {
                    
                } else {
                    console.log(response)
                    setTracksData([response])
                }
            }).catch(err => {
                setIsFetching(false)
            });
        }
    }
    
    const selectTrack = (url, track) => {
        setIsFetching(true);
        router.push(url)
    }

    return (
        <Box sx={{maxWidth: '768px', width: '100%'}}>
             <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            freeSolo
                            onInputChange={(event, newInputValue) => {
                                if (event?.type === "change") {
                                    console.log(newInputValue)
                                    setAutocompleteItems([])
                                    setURL(newInputValue)
                                }
                            }}
                            onKeyDown={(e) => {
                                if(e.keyCode == 13){
                                    e.preventDefault()
                                    console.log(e.target.value)
                                    handleChange(e.target.value)
                                }
                            }}
                            getOptionLabel={(option) => !option.label ? option : option.label}
                            onChange={(e, value) => {console.log(value);(value && value !== "" && value.id) ? handleSelectAutoComplete(value.id,value.label) : handleChange(value.label)}}
                            onPaste={handlePaste}
                            options={autocompleteItems}
                            disableClearable
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Type a song title here..." />}
                        />
                        
                    </Grid>
                    <Grid item xs={2}>
                        <Button 
                            onClick={() => handleChange(url)} 
                            size='large'  
                            style={{ width: '90%', padding: '15px'}} 
                            variant='contained'
                            >
                                <SearchIcon />
                        </Button>
                    </Grid>
                </Grid>
                
                
                <Box sx={{ width: '100%', mt: '10px', opacity: '0.3', fontSize: '14px' }}>
                    <Typography variant="subtitle">
                    exp: Ice Cube - It was a good day
                    </Typography>
                </Box>
                {isFetching && <Box sx={{ width: '100%', mt: '15px' }}>
                    <LinearProgress />
                </Box>}

            </Box>
            {(tracksData && tracksData.length > 0) && <Box sx={{ width: '100%', mt: '25px' }}>
                    <Grid  container spacing={2}>
                        <Grid  xs={12}>
                            <Divider sx={{textAlign: 'center', width: '100%', mt: 4, mb: 4}}>
                                <Chip label={`BPM, Song Key Results of ${url}`} />
                            </Divider>
                        </Grid>
                        <FormGroup>
                        {/*<FormControlLabel onChange={handleSort} control={<Switch defaultChecked />} label={"Sort By Song Key"} />*/}
                        </FormGroup>
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
 
        </Box>
    )
  }
