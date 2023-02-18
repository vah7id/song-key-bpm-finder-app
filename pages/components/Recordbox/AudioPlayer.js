import { useEffect, useRef, useState } from 'react';

// import components
import DisplayTrack from './DisplayTrack';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import { Box, Input, Slider, styled, Typography } from '@mui/material';

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

  
const IOSSlider = styled(Slider)(({ theme }) => ({
  color: '#3880ff',
  height: 75,
  marginTop: 20,
  padding: '0px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 11,
    fontWeight: 'normal',
    top: 0,
    right: -8,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color:  '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));

export default function AudioPlayer({tracks, deck}) {
  // states
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTempo, setCurrentTempo] = useState(0.825);
  const [tpl, setTpl] = useState(tracks ? tracks[0].tempo : 100);
  const [wsFilters, setWsFilters] = useState(null);

  const [currentTrack, setCurrentTrack] = useState(
    tracks ? tracks[trackIndex] : null
  );
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [wsLoaded, setWSLoaded] = useState(null);
  const [ws, setWS] = useState(null);
  

  useEffect(() => {
    if((currentTrack && 
      currentTrack.preview_url && wsLoaded !== currentTrack.preview_url) ) {
      loadWS();
    }
  }, [currentTrack, wsLoaded, ws])

  useEffect(() => {
    if(ws && ws.backend) {
      console.log(wsFilters)
      //ws.backend.setFilters(wsFilters);
    }
  }, [wsFilters, ws])


  // reference
  const audioRef = useRef();
  const progressBarRef = useRef();


  const adjustEQ = (newValue, idx) => {
    if(ws && ws.filters) {
      if(wsFilters[idx].gain.value !== newValue) {
        ws.filters[idx].gain.value = newValue;
        setWsFilters(ws.filters);
      }
    }
  }

  const handleNext = () => {
    return;
    if (trackIndex >= tracks.length - 1) {
      setTrackIndex(0);
      setCurrentTrack(tracks[0]);
    } else {
      setTrackIndex((prev) => prev + 1);
      setCurrentTrack(tracks[trackIndex + 1]);
    }
  };

  const loadWS = async() => {
    if(!ws) {
      const WaveSurfer = (await import("wavesurfer.js")).default;
      const TimelinePlugin = await require("wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js");

      const wavesurferInstance = WaveSurfer.create({
          container: deck === 1 ? '#waveform' : "#waveform2",
          waveColor: '#aaaaaa',
          progressColor: '#3880ff',
          mediaType:'audio',
          height:50,
          backend: 'MediaElement',
          plugins: [
            TimelinePlugin.create({
                container:deck === 1 ? '#wave-timeline' : "#wave-timeline2"
            })
          ]
      });

      wavesurferInstance.load(currentTrack.preview_url);

      wavesurferInstance.on('audioprocess', async () => {
        setTimeProgress(wavesurferInstance.getCurrentTime());
      });

      wavesurferInstance.on('seek', async () => {
        setTimeProgress(wavesurferInstance.getCurrentTime());
      });

      wavesurferInstance.on('dblclick', async () => {
        setTimeProgress(wavesurferInstance.getCurrentTime());
      });

      wavesurferInstance.on('interaction', async () => {
        setTimeProgress(wavesurferInstance.getCurrentTime());
      });

      wavesurferInstance.on('ready', async () => {
        //wavesurferInstance.setMute(true);
        //wavesurferInstance.setVolume(0);

        let EQ = [
          {
              f: 32,
              type: 'lowshelf'
          },
          {
              f: 64,
              type: 'peaking'
          },
          {
              f: 125,
              type: 'peaking'
          },
          {
              f: 250,
              type: 'peaking'
          },
          {
              f: 500,
              type: 'peaking'
          },
          {
              f: 1000,
              type: 'peaking'
          },
          {
              f: 2000,
              type: 'peaking'
          },
          {
              f: 4000,
              type: 'peaking'
          },
          {
              f: 8000,
              type: 'peaking'
          },
          {
              f: 16000,
              type: 'highshelf'
          }
        ];

        // Create filters
        let filters = EQ.map(function(band) {
          if(wavesurferInstance && wavesurferInstance.backend) {
            let filter = wavesurferInstance.backend.ac.createBiquadFilter();
            filter.type = band.type;
            filter.gain.value = 0;
            filter.Q.value = 1;
            filter.frequency.value = band.f;
            return filter;
          }
        });

        // Connect filters to wavesurfer
        console.log(filters)
        if(wavesurferInstance && wavesurferInstance.backend && !filters) {
          wavesurferInstance.backend.setFilters(filters);
        }

        // Bind filters to vertical range sliders
        //let container = document.querySelector('#equalizer');
        //filters.forEach(function(filter) {
            /*let input = document.createElement('input');
            Object.assign(input, {
                type: 'range',
                min: -40,
                max: 40,
                value: 0,
                title: filter.frequency.value
            });
            input.style.display = 'inline-block';
            input.setAttribute('orient', 'vertical');
            wavesurferInstance.util.style(input, {
                webkitAppearance: 'slider-vertical',
                width: '50px',
                height: '150px'
            });
            container.appendChild(input);*/

            //let onChange = function(e) {
              //  filter.gain.value = ~~e.target.value;
            //};

            //input.addEventListener('input', onChange);
            //input.addEventListener('change', onChange);
        //});

        // For debugging
        setWsFilters(filters);
        wavesurferInstance.filters = filters;
        setWS(wavesurferInstance)
      });
      wavesurferInstance.on('play', async () => {
        //wavesurferInstance.setMute(true);
        //wavesurferInstance.setVolume(0);

      });
      wavesurferInstance.on('pause', async () => {
        setTimeProgress(wavesurferInstance.getCurrentTime());

        //wavesurferInstance.setMute(true);
        //wavesurferInstance.setVolume(0);
      });
      wavesurferInstance.on('finish', async () => {
        setTimeProgress(0);
      });
      
 
      setWS(wavesurferInstance)
      setWSLoaded(currentTrack.preview_url)
    }
  }

  const onTempoChanged = (event, newValue) => {
    if(audioRef && audioRef.current && event) {
      event.preventDefault();
      if(newValue !== progressBarRef.current.playbackRate) {
        //progressBarRef.current.playbackRate = newValue;
       // console.log(newValue)
        setCurrentTempo(newValue);
        setTpl(newValue);

        if(ws) {
          ws.setPlaybackRate(currentTempo);
        }
        
      }
    }
  }

  const marks = [
    {
      value: 0,
      label: '-8',
    },
    {
      value: 0.5,
      label: '0',
    },
    {
      value: 1,
      label: '+8',
    },
  ];

  function valuetext(value) {
    return `${value}`;
  }

  function valueLabelFormat(value) {
    console.log(value)
    return `BPM`;

    if(value < 0.825) {
      return `-${Math.round(value*10)}`;
    } else {
      return `+${Math.round(value*10)}`;
    }
  }

  return (
    <>
      <div className="audio-player">
        <div className="inner">
          
          <DisplayTrack
            {...{
              currentTrack,
              audioRef,
              setDuration,
              progressBarRef,
              handleNext,
            }}
          />
          <Controls
            {...{
              audioRef,
              currentTempo,
              ws,
              progressBarRef,
              duration,
              adjustEQ,
              setTimeProgress,
              tracks,
              trackIndex,
              setTrackIndex,
              setCurrentTrack,
              handleNext,
            }}
          />

          {deck === 1 ? <> 
            <div id="waveform">
                <div className="progress progress-striped active" id="progress-bar">
                    <div className="progress-bar progress-bar-info"></div>
                </div>
            </div>
            <div id="wave-timeline"></div>
            </> : <>
            <div id="waveform2">
                <div className="progress progress-striped active" id="progress-bar">
                    <div className="progress-bar progress-bar-info"></div>
                </div>
            </div>
            <div id="wave-timeline2"></div>
          </>}

          <ProgressBar
            {...{ progressBarRef, ws, preview_url: currentTrack.preview_url, audioRef, timeProgress, duration }}
          />

            {/*<div className="tempoWrapper">
              <Slider
                aria-label="Tempo"
                defaultValue={currentTempo}
                sx={{
                  '& input[type="range"]': {
                    WebkitAppearance: 'slider-vertical',
                  },
                }}
                valueLabelFormat={'BPM'}
                getAriaValueText={valuetext}
                orientation={'vertical'}
                onChange={onTempoChanged}
                value={currentTempo}
                disabled={(ws && ws.isPlaying()) || false}
                marks
                color={'info'}
                size={'small'}
                min={0.5} max={1} step={0.08}
                valueLabelDisplay={'on'}
              />
              </div>*/}

        </div>
      </div>
    </>
  );
};
