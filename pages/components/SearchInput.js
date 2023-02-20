import * as React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {TextField, Button, Typography, Card, CardMedia, CardContent, BottomNavigation, BottomNavigationAction, Stack, IconButton, Skeleton, LinearProgress, Backdrop, CircularProgress, Grid, Divider, Breadcrumbs, Link, Chip, CardActions, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Autocomplete, Badge, FormControl, FormLabel, FormControlLabel, Switch, FormGroup} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShareURL from './ShareURL';
import styles from '../../styles/Home.module.css'
import SearchIcon from '@mui/icons-material/Search';
import { PianoOutlined, Router } from '@mui/icons-material';
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
        modeTitle = "Maj";
    if(mode === 0) 
        modeTitle = "Min";

    switch(key) {
        case -1:
            return "N/A";
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
            return "G#/A♭  " + modeTitle;
        case 9:
            return "A" + modeTitle;
        case 10:
            return "A#/B♭ " + modeTitle;
        case 11:
            return "B " + modeTitle;
        default:
            return "Not Detected";
    }
}

export default function SearchInput({isSearching = false, handleNewSearch}) {
    const [url, setURL] = React.useState('');
    const [isFetching, setIsFetching] = React.useState(false);
    const [openSnackbar, setSnackbarOpen] = React.useState(false);
    const [notification, setNotification] = React.useState({ type: null, message: ""});
    const [tracksData, setTracksData] = React.useState([]) 
    const [autocompleteItems, setAutocompleteItems] = React.useState([]) 
    const [analyseResult, setAnalyseResult] = React.useState(null) 
    const [fileUploaded, setFileUpload] = React.useState([])
    const router = useRouter();

    let queryLabel = '';

    if(router && router.query) {
        if(router.asPath.indexOf('tracks') > -1 && router.query.trackId) {
            queryLabel = router.query.trackId[0];
        }
        if(router.asPath.indexOf('search') > -1 && router.query.trackId) {
            queryLabel = router.query.query[0];
        }
    }

    const handleAutoComplete = () => {
        if(url.length > 3) {
            setTimeout(() => {
                fetch(`/api/search?title=${url || ""}`).then(response => response.json()).then(response => {
                    if(response.err) {
                        setAutocompleteItems([])
                    } else {
                        let options = []
                        response.map((track, index) => {
                            options[index] = { id: track.id, label: track.name   +' '+track.artists[0].name   }
                        })
                        setAutocompleteItems(options)
                    }
                }).catch(err => {
                    setAutocompleteItems([])
                });
            }, 500);
        }
    };

    React.useEffect(() => {
        if(url !== "" && autocompleteItems.length === 0 && ((router.query && url !== queryLabel))) {
            handleAutoComplete()
        }
    }, [url])

    
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

        if(!query && (!url || url === "") ) {
            showNotification('error', 'Oops!! Please type your song title first :)')
            return;
        }

        const title = query || url; 
        setAnalyseResult(null);
        setURL(title);
        
        if(title === "") {
            showNotification('error', 'Oops!! Please type your song title first :)')
            return;
        }

        if((router.query && queryLabel) && title.trim() === queryLabel.trim()) {
            return;
        }

        if(queryLabel === title && tracksData.length !== 0) {
            handleNewSearch(false);
            setIsFetching(false);
            return;
        }
        setIsFetching(true);
        handleNewSearch(true);
        setTracksData([]);
        router.push('/search/'+title);
    }
    
    const handlePaste = (event) => {
        handleChange(event.clipboardData.getData('text/plain'));
    }

    const handleSelectAutoComplete = (id, label) => {
        // fetch track and set data
        if(id) {
            setIsFetching(true);
            const url = label.replace(/ /g, '-').replace('&','').replace('&','').replace('&','').replace('&','').replace('&','-').replace('&','-').replace('&','-').replace('?','').replace('?','').replace('?','').replace('?','').replace('.','-').replace('.','-').replace('/','').replace('/','').replace('/','').replace('#','').replace('#','').replace('(','').replace('(','').replace('(','').replace('(','').replace(')','').replace(')','').replace(')','').replace(')','').replace(')','').replace('+','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','').replace('%','');
            setAutocompleteItems([])
            router.push(`/tracks/${url}/${id}`);
        }
    }

    const selectTrack = (url, track) => {
        setIsFetching(true);
        router.push(url)
    }

    return (
        <Box sx={{maxWidth: '768px', width: '100%'}}>
             <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                    <Grid item xs={10}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            filterOptions={(options) => options}
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
                                    handleChange(e.target.value)
                                }
                            }}
                            getOptionLabel={(option) => !option.label ? option : option.label}
                            onChange={(e, value) => {(value && value !== "" && value.id) ? handleSelectAutoComplete(value.id,value.label) : handleChange(value.label)}}
                            onPaste={handlePaste}
                            options={autocompleteItems}
                            disableClearable
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label={`${(router.query && queryLabel && router.asPath.indexOf('search') > -1) ? queryLabel : 'Type a song title here...'}`} />}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button 
                            onClick={() => handleChange(url)} 
                            size='large'  
                            sx={{ width: '90%', minWidth: '42px !important', padding: '15px'}} 
                            variant='contained'
                            >
                                <SearchIcon sx={{fontSize: '1.5rem !important'}} />
                        </Button>
                    </Grid>
                </Grid>
                
                
                <Box sx={{ width: '100%', mt: '10px', opacity: '0.3', fontSize: '14px' }}>
                    <Typography variant="subtitle">
                    Exp: It Was A Good Day Ice Cube :)
                    </Typography>
                </Box>
                {(isFetching || isSearching) && <Box sx={{ width: '100%', mt: '15px' }}>
                    <LinearProgress />
                </Box>}

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
