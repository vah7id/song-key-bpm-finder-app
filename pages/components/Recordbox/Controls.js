import { useState, useEffect, useRef, useCallback } from 'react';

import { Forward10Sharp, PauseCircleOutline, PlayCircleOutline, SkipNext, SkipNextOutlined, SkipPrevious, SkipPreviousOutlined, VolumeDownRounded, VolumeOffRounded, VolumeUpSharp } from '@mui/icons-material';
import { Slider, styled } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
//import Knob from "react-simple-knob";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';


 const IOSSlider = styled(Slider)(({ theme }) => ({
  color: '#3880ff',
  padding: '15px 0',
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
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
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
    borderRadius: 0,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: 'blue',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: '#bfbfbf',
    },
  },
}));

const Controls = ({
  audioRef,
  progressBarRef,
  duration,
  setTimeProgress,
  ws,
  currentTempo,
  tracks,
  adjustEQ,
  trackIndex,
  setTrackIndex,
  setCurrentTrack,
  handleNext,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(currentTempo);
  const [volume, setVolume] = useState(50);
  const [muteVolume, setMuteVolume] = useState(false);

  /*if(ws) {
    ws.on('finish', async () => {
      setIsPlaying(false);
      setTimeProgress(0);
      if( audioRef && audioRef.current ) {
        audioRef.current.currentTime = 0
      }
    });
  }*/

  const togglePlayPause = () => {
    if(ws) {
      ws.playPause()
      ws.setMute(false);
    }
    setIsPlaying((prev) => !prev);
  };

  const changeVol = (e) => {

    if(e.target.value !== volume && ws) {
      setVolume(e.target.value)
      ws.setVolume(e.target.value / 100)
      //if(audioRef.current && ws) {
       // ws.setVolume(e.target.value / 100)
       // audioRef.current.volume = e.target.value / 100;
        if(e.target.value / 100 < 0.02) {
          ws.setMute(true)
          //setMuteVolume(true)
          //audioRef.current.muted = true;
        } else {
          ws.setMute(false)
          //setMuteVolume(false)
         // audioRef.current.muted = false;
        }
      //}
    }
    
  }

  //const playAnimationRef = useRef();

  /*const repeat = useCallback(() => {
    if( audioRef && audioRef.current ) {
      
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      

      const cur = audioRef &&audioRef.current && audioRef.current.currentTime;
        if(ws && ws.getCurrentTime() !== cur) {
          let tmp = cur - ws.getCurrentTime();
          ws.skip(tmp)
        }

      if(progressBarRef && progressBarRef.current && progressBarRef.current.value) {
        progressBarRef.current.value = currentTime;
        progressBarRef.current.style.setProperty(
          '--range-progress',
          `${(progressBarRef.current.value / duration) * 100}%`
        );
      }
      playAnimationRef.current = requestAnimationFrame(repeat);
    }

  }, [audioRef, duration, progressBarRef, setTimeProgress]);*/

  /*useEffect(() => {
   // if(audioRef && audioRef.current) {
      
      if (isPlaying) {
       // audioRef.current.play();
        if(ws) {
          ws.play();
        }
      } else {
        if(ws) {
          ws.pause();
        }
       // audioRef.current.pause();
      }
      playAnimationRef.current = requestAnimationFrame(repeat);
   // }
  }, [isPlaying, audioRef, repeat]);*/

 /* useEffect(() => {
   // if(audioRef && audioRef.current) {
      if(currentTempo !== tempo) {
        console.log(currentTempo)
        console.log('===============')
      //  audioRef.current.playbackRate = currentTempo;
      
        if(ws) {
          ws.setPlaybackRate(currentTempo);
        }
        const cur = audioRef && audioRef.current && audioRef.current.currentTime;

        if(ws && ws.getCurrentTime() !== cur) {
          let tmp = cur - ws.getCurrentTime();
          ws.skip(tmp)
        }
        playAnimationRef.current = requestAnimationFrame(repeat);

      }
   // }
  }, [audioRef, currentTempo, tempo, repeat, ws]);*/

  const skipForward = () => {
    if (audioRef && audioRef.current)
      audioRef.current.currentTime += 5;
      if(ws) {
        ws.skipForward(5);
      }
  };

  const skipBackward = () => {
    if (audioRef && audioRef.current)
      audioRef.current.currentTime -= 5;
      if(ws) {
        ws.skipBackward(5);
      }
  };

  const handlePrevious = () => {
    return;
    if (trackIndex === 0) {
      let lastTrackIndex = tracks.length - 1;
      setTrackIndex(lastTrackIndex);
      setCurrentTrack(tracks[lastTrackIndex]);
    } else {
      setTrackIndex((prev) => prev - 1);
      setCurrentTrack(tracks[trackIndex - 1]);
    }
  };

  const onChangeKnob = (value, idx) => {
    adjustEQ(~~value, idx)
  }

 // useEffect(() => {
    //if (audioRef && audioRef.current) {
     // if(ws) {
     //   ws.setVolume(volume / 100)
    //  }
      //if(muteVolume) {
      //  ws.setMute(muteVolume)
      //}
      //audioRef.current.muted = muteVolume;
    //}
 // }, [volume, audioRef, muteVolume]);

  return (
    <div className="controls-wrapper">

      <div className="controls">
        <button className='playBtn' onClick={togglePlayPause}>
          {isPlaying ? <PauseCircleOutline /> : <PlayCircleFilledWhiteIcon />}
        </button>
   
        {/*<button onClick={skipBackward}>
          <SkipPreviousOutlined />
        </button>
        
        <button onClick={skipForward}>
          <SkipNext />
        </button>
        <Knob
          name="High"
          unit="dB"
          defaultPercentage={0.7}
          onChange={(e) => onChangeKnob(e, 1)}
          bg="#ccc"
          fg={'blue'}
          mouseSpeed={5}
          transform={p => parseInt(p * 50, 10) - 50}
          style={{
            float: "right",
            marginRight: '-32px !important',
            width: "75px",
            color: "#999"
          }} />
          <Knob
          name="Mid"
          unit="dB"
          defaultPercentage={0.7}
          onChange={(e) => onChangeKnob(e, 2)}
          bg="#ccc"
          fg={'blue'}
          mouseSpeed={5}
          transform={p => parseInt(p * 50, 10) - 50}
          style={{
            float: "right",
            marginRight: '-32px !important',
            width: "75px",
            color: "#999"
          }} />
          <Knob
          name="Low"
          unit="dB"
          defaultPercentage={0.7}
          bg="#ccc"
          onChange={(e) => onChangeKnob(e, 3)}
          fg={'blue'}
          mouseSpeed={5}
          transform={p => parseInt(p * 50, 10) - 50}
          style={{
            float: "right",
            marginRight: '-32px !important',
            width: "75px",
            color: "#999" // Sets font color of value and knob name
          }} />
        */}
       
      </div>
      <div className="volume">
        <IOSSlider
          aria-label="vol"
          defaultValue={0}
          step={5}
          onChange={changeVol}
          ref={progressBarRef} value={volume}
          min={0} max={100}
          valueLabelDisplay={'off'}
          />
       <button onClick={() => setMuteVolume((prev) => !prev)}>
          {muteVolume || volume < 5 ? (
            <VolumeOffRounded />
          ) : volume < 40 ? (
            <VolumeDownRounded />
          ) : (
            <VolumeUpSharp />
          )}
        </button>
      </div>

    </div>
  );
};

export default Controls;
