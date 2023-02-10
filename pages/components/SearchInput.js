import * as React from 'react';
import Box from '@mui/material/Box';
import DownloadIcon from '@mui/icons-material/Download';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SaveIcon from '@mui/icons-material/Save';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LoopIcon from '@mui/icons-material/Loop';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {TextField, Button, Typography, Card, CardMedia, CardContent, BottomNavigation, BottomNavigationAction, Stack, IconButton, Skeleton, LinearProgress, Backdrop, CircularProgress, Grid, Divider, Breadcrumbs, Link, Chip, CardActions, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Autocomplete} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import ShareURL from './ShareURL';
import styles from '../../styles/Home.module.css'
import SearchIcon from '@mui/icons-material/Search';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import { PianoOutlined } from '@mui/icons-material';
import SpeedIcon from '@mui/icons-material/Speed';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SearchInput() {
    const [url, setURL] = React.useState('');
    const [isFetching, setIsFetching] = React.useState(false);
    const [openSnackbar, setSnackbarOpen] = React.useState(false);
    const [notification, setNotification] = React.useState({ type: null, message: ""});
    const [tracksData, setTracksData] = React.useState([]) 
    const [features, setFeatures] = React.useState([]) 
    const [autocompleteItems, setAutocompleteItems] = React.useState([]) 

    
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
        if(!query) {
            return;
        }
        const title = query 
        setIsFetching(true);
        console.log(title)
        if(title === "") {
            showNotification('error', 'Oops!! Please type your song title first :)')
        }

        fetch(`/api/findBpm?title=${title || ""}`).then(response => response.json()).then(response => {
            setIsFetching(false);
            if(response.err) {
                showNotification('error', response.err.message);

            } else {
                console.log(response)
                console.log(response.extra)
                setTracksData(response.data);
                setFeatures(response.extra)
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

    function msToTime(duration) {
        var milliseconds = Math.floor((duration % 1000) / 100),
          seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
      
        return minutes + ":" + seconds;
      }

    const mobileCheck = () => {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };
    const getSongKeyTitle = (key, mode) => {
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


    const handleAutoComplete = (e) => {
        setURL(e.target.value)
        if(e.target.value.length > 3) {
            fetch(`/api/search?title=${e.target.value || ""}`).then(response => response.json()).then(response => {
                if(response.err) {
                    setAutocompleteItems([])
                } else {
                    let options = []
                    response.map((track, index) => {
                        options[index] = { id: track.id, label: track.artists[0].name  +' - '+track.name   }
                    })
                    setAutocompleteItems(options)
                }
            }).catch(err => {
                setAutocompleteItems([])
            });
        }
    }

    return (
        <Box sx={{maxWidth: '768px'}}>
             <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        onKeyUp={handleAutoComplete}
                        onKeyDown={(e) => {
                            if(e.keyCode == 13){
                                console.log(e.target.value)
                                handleChange(e.target.value)
                             }
                        }}
                        onChange={(e, value) => handleChange(value.label)}
                        onPaste={handlePaste}
                        options={autocompleteItems}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="Type a song title or artist..." />}
                        />
                    
                    </Grid>
                    <Grid item xs={3}>
                        <Button 
                            onClick={() => handleChange(url)} 
                            size='large'  
                            style={{ width: '100%', padding: '15px'}} 
                            variant='contained'
                            >
                                SEARCH
                        </Button>
                    </Grid>
                </Grid>
                
                
                <Box sx={{ width: '100%', mt: '10px', opacity: '0.3', fontSize: '14px' }}>
                    <Typography variant="subtitle">
                    For example: Ice Cube - It was a good day
                    </Typography>
                </Box>
                {isFetching && <Box sx={{ width: '100%', mt: '15px' }}>
                    <LinearProgress />
                </Box>}

            </Box>
            {(tracksData && tracksData.length > 0 && features && features.length > 0) && <Box sx={{ width: '100%', mt: '25px' }}>
                    <Grid  container spacing={2}>
                        {tracksData.map((track, index) => {
                            if(!features[index]) {
                                return(<></>)
                            }
                            return (<Grid key={track.id} item xs={12}>
                                <Card sx={{ display: 'flex' }}>
                                <CardMedia
                                    className={styles.cardImage}
                                    component="img"
                                    alt={track.artists[0].name+' - '+track.name}
                                    sx={{ width: 200 }}
                                    image={track.album.images[0].url}
                                />
                                <Box sx={{ width: '100%' ,display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{flex: '1 0 auto', paddingLeft: '24px'}}>
                                         <Box className={styles.cardObject}>
                                        <Typography style={{width: '100%'}} gutterBottom variant="h5" component="div">
                                            {track.artists[0].name}
                                        </Typography>
                                        <Typography style={{width: '100%', display: 'block', margin: '-10px 0 30px 0'}}  sx={{fontSize: '16px', paddingTop: '0'}} variant="caption" color="text.secondary">
                                            {track.name}
                                        </Typography>
                                        <Link target="_blank" href={track.external_urls.spotify}><Button color="success" variant="outlined" startIcon={<PlayCircleFilledWhiteIcon />}>
                                            Listen on Spotify
                                        </Button></Link>
                                        </Box>
                                        <Box className={styles.cardOptions} sx={{ bgcolor: 'background.paper' }}>
                                        <nav>
                                            <List sx={{ flex: '1 1 auto' }}>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                <ListItemIcon>
                                                    <SpeedIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`${features[index] ? Math.round(features[index].tempo) : 'Not Determined'} BPM`} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                <ListItemIcon>
                                                    <PianoOutlined />
                                                </ListItemIcon>
                                                <ListItemText primary={`${features[index] ? getSongKeyTitle(features[index].key,features[index].mode) : 'Not Determined'}`} />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                <ListItemIcon>
                                                    <LoopIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`${features[index] ? msToTime(features[index].duration_ms) : '00:00'}`} />
                                                </ListItemButton>
                                            </ListItem>
                                            </List>
                                        </nav>
                                        </Box>
                                </CardContent>
                              
                                </Box>
                            </Card>
                        </Grid>) })}
                     
                </Grid>
            </Box>}

            <Divider sx={{mt: 8}}>
                <Chip label="Or Via Upload The Track" />
            </Divider>
            <Card sx={{ maxWidth: '100%', mt: 8, padding: 4 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Find The Song Key & Tempo Via File Upload With Our Online Music Key, Tempo Analyzer.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Easily find the key of a song by extracting it from a MP3 (mp3 to key) or any other audio file thanks our Online Song Key Finder. Drop your audio file(s) in the song analyzer below and instantly get the Key in which a song was composed by magic. Detected Song Keys are 70-95% accurate depending on the selected option! its FREE, Enjoy :)
                </Typography>
                </CardContent>
                <CardActions>
                <Button color="success" variant="contained" component="label">
                Upload The Audio File (MP3)
                    <input hidden accept="image/*" multiple type="file" />
                </Button>
                <IconButton color="primary" aria-label="upload picture" component="label">
                    <input hidden accept="image/*" type="file" />
                    <AudioFileIcon /> 
                    <Typography sx={{paddingLeft: '10px', color: '#aaa'}} variant="caption"> Click or drop your file here</Typography>
                </IconButton>
              
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
