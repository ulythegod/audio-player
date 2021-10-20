import React, {useState, useRef, useEffect} from 'react'
import styles from "../styles/AudioPlayer.module.css"
import {FaArrowLeft} from "react-icons/fa"
import {FaArrowRight} from "react-icons/fa"
import {BiPlay} from "react-icons/bi"
import {BiPause} from "react-icons/bi"

const AudioPlayer = () => {
    //state
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying);
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }

    //references
    const audioPlayer = useRef(); //reference for audio
    const progressBar = useRef(); //reference for progress bar
    const animationRef = useRef(); //reference for animation
    
    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = (minutes < 10) ? ('0' + minutes) : minutes;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = (seconds < 10) ? ('0' + seconds) : seconds;
        return returnedMinutes + ':' + returnedSeconds;
    };

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    };

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    }

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`);
        setCurrentTime(progressBar.current.value);
    }

    const backThirty = () => {
        progressBar.current.value = Number(progressBar.current.value - 30); 
        changeRange();
    };

    const forwardThirty = () => {
        progressBar.current.value = Number(progressBar.current.value + 30); 
        changeRange();
    }

    return (
        <div className={styles.audioPlayer}>
            <audio ref={audioPlayer} src="https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3" preload="metadata"></audio>
            <button className={styles.forwardBackward} onClick={backThirty}><FaArrowLeft /> 30</button>
            <button className={styles.playPause} onClick={togglePlayPause}>
                {isPlaying ? <BiPause /> : <BiPlay className={styles.play}/>}
            </button>
            <button className={styles.forwardBackward} onClick={forwardThirty}>30 <FaArrowRight /></button>

            {/* current time*/}
            <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

            {/* range */}
            <div>
                <input className={styles.progressBar} type="range" defaultValue="0" ref={progressBar} onChange={changeRange}></input>
            </div>

            {/* duration */}
            <div className={styles.duration}>{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
        </div>
    )
}

export { AudioPlayer }
