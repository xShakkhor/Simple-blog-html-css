import { useRef, useState, useEffect, useCallback } from 'react'

const MUSIC_URL = '/music/cosmos-bg.mp3'

export function useBackgroundMusic() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [error, setError] = useState(null)

  useEffect(() => {
    const audio = new Audio(MUSIC_URL)
    audio.loop = true
    audio.volume = 0.5
    audio.preload = 'auto'

    const handleCanPlay = () => {
      setIsLoaded(true)
      setError(null)
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {})
    }

    const handleError = (event) => {
      console.error('Audio load error:', event)
      setError('Failed to load music')
      setIsLoaded(false)
    }

    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((playError) => {
          console.error('Play error:', playError)
          setError('Click to enable audio')
        })
    }
  }, [isPlaying])

  const setAudioVolume = useCallback((nextVolume) => {
    setVolume(nextVolume)
  }, [])

  return {
    isPlaying,
    isLoaded,
    volume,
    error,
    togglePlay,
    setVolume: setAudioVolume,
  }
}
