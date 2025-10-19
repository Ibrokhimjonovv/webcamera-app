import React, { useRef, useEffect, useState } from 'react';
import './camera.scss';

const CameraComponent = ({ onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isPreview, setIsPreview] = useState(false);
    const [facingMode, setFacingMode] = useState('user');

    // Yangi state'lar
    const [showSettings, setShowSettings] = useState(false);
    const [mirror, setMirror] = useState(true);
    const [square, setSquare] = useState(false);
    const [countdown, setCountdown] = useState(false);
    const [flash, setFlash] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [countdownValue, setCountdownValue] = useState(0);
    const [isCapturing, setIsCapturing] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('none');
    const [showFilters, setShowFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Audio refs
    const shutterSoundRef = useRef(null);
    const countdownSoundRef = useRef(null);

    // 80 ta turli effektlar
    const filters = [
        { name: 'Normal', value: 'none' },
        { name: 'Sepia', value: 'sepia(1)' },
        { name: 'Grayscale', value: 'grayscale(1)' },
        { name: 'Invert', value: 'invert(1)' },
        { name: 'Brightness', value: 'brightness(1.5)' },
        { name: 'Contrast', value: 'contrast(2)' },
        { name: 'Saturation', value: 'saturate(2)' },
        { name: 'Hue Rotate', value: 'hue-rotate(90deg)' },
        { name: 'Blur', value: 'blur(2px)' },
        { name: 'Vintage', value: 'sepia(0.5) contrast(1.2) brightness(0.9)' },
        { name: 'Warm', value: 'sepia(0.3) saturate(1.5) hue-rotate(-10deg)' },
        { name: 'Cool', value: 'sepia(0.1) saturate(1.2) hue-rotate(180deg) brightness(1.1)' },
        { name: 'Dramatic', value: 'contrast(2) brightness(0.8) saturate(1.5)' },
        { name: 'Soft', value: 'contrast(1.2) brightness(1.1) saturate(0.8)' },
        { name: 'Noir', value: 'grayscale(1) contrast(2) brightness(0.7)' },
        { name: 'Sunset', value: 'sepia(0.4) saturate(1.6) hue-rotate(-30deg)' },
        { name: 'Ocean', value: 'hue-rotate(180deg) saturate(1.3)' },
        { name: 'Forest', value: 'hue-rotate(120deg) saturate(1.4)' },
        { name: 'Vibrant', value: 'saturate(2) contrast(1.3)' },
        { name: 'Pastel', value: 'saturate(0.6) brightness(1.2)' },
        { name: 'Mono', value: 'grayscale(1) contrast(1.5)' },
        { name: 'High Contrast', value: 'contrast(3)' },
        { name: 'Low Contrast', value: 'contrast(0.7)' },
        { name: 'Warm Vintage', value: 'sepia(0.7) hue-rotate(-20deg) saturate(1.3)' },
        { name: 'Cool Vintage', value: 'sepia(0.5) hue-rotate(200deg) saturate(1.2)' },
        { name: 'Dreamy', value: 'blur(1px) brightness(1.1) saturate(0.9)' },
        { name: 'Sharp', value: 'contrast(1.7) saturate(1.3)' },
        { name: 'Faded', value: 'contrast(0.8) brightness(1.1) saturate(0.7)' },
        { name: 'Cinematic', value: 'contrast(1.4) brightness(0.9) saturate(1.1)' },
        { name: 'Romantic', value: 'sepia(0.3) saturate(1.2) brightness(1.1)' },
        { name: 'Mysterious', value: 'contrast(1.6) brightness(0.8) hue-rotate(270deg)' },
        { name: 'Golden', value: 'sepia(0.4) saturate(1.5) hue-rotate(20deg)' },
        { name: 'Silver', value: 'grayscale(0.8) contrast(1.4) brightness(1.1)' },
        { name: 'Bronze', value: 'sepia(0.6) saturate(1.4) hue-rotate(30deg)' },
        { name: 'Platinum', value: 'grayscale(0.6) contrast(1.3) brightness(1.2)' },
        { name: 'Ruby', value: 'hue-rotate(330deg) saturate(1.6)' },
        { name: 'Emerald', value: 'hue-rotate(140deg) saturate(1.5)' },
        { name: 'Sapphire', value: 'hue-rotate(220deg) saturate(1.4)' },
        { name: 'Amethyst', value: 'hue-rotate(280deg) saturate(1.5)' },
        { name: 'Topaz', value: 'hue-rotate(45deg) saturate(1.3)' },
        { name: 'Sunrise', value: 'sepia(0.3) hue-rotate(-45deg) saturate(1.4)' },
        { name: 'Sunset Glow', value: 'sepia(0.5) hue-rotate(45deg) saturate(1.6)' },
        { name: 'Twilight', value: 'hue-rotate(240deg) saturate(1.2) brightness(0.9)' },
        { name: 'Moonlight', value: 'grayscale(0.3) hue-rotate(200deg) brightness(0.8)' },
        { name: 'Aurora', value: 'hue-rotate(160deg) saturate(1.8)' },
        { name: 'Fire', value: 'sepia(0.8) hue-rotate(-40deg) saturate(2)' },
        { name: 'Ice', value: 'hue-rotate(180deg) saturate(0.5) brightness(1.3)' },
        { name: 'Earth', value: 'sepia(0.6) hue-rotate(60deg) saturate(1.2)' },
        { name: 'Sky', value: 'hue-rotate(210deg) saturate(1.3) brightness(1.1)' },
        { name: 'Ocean Deep', value: 'hue-rotate(200deg) saturate(1.5) brightness(0.9)' },
        { name: 'Forest Deep', value: 'hue-rotate(100deg) saturate(1.6) brightness(0.9)' },
        { name: 'Desert', value: 'sepia(0.7) hue-rotate(30deg) saturate(1.3)' },
        { name: 'Jungle', value: 'hue-rotate(130deg) saturate(1.7)' },
        { name: 'Arctic', value: 'grayscale(0.5) hue-rotate(180deg) brightness(1.4)' },
        { name: 'Tropical', value: 'hue-rotate(90deg) saturate(1.8)' },
        { name: 'Retro', value: 'sepia(0.8) contrast(1.4) saturate(1.1)' },
        { name: 'Modern', value: 'contrast(1.6) saturate(1.2) brightness(1.1)' },
        { name: 'Futuristic', value: 'hue-rotate(270deg) saturate(1.4) contrast(1.8)' },
        { name: 'Classic', value: 'sepia(0.4) contrast(1.3)' },
        { name: 'Elegant', value: 'grayscale(0.2) contrast(1.2) brightness(1.1)' },
        { name: 'Dramatic B&W', value: 'grayscale(1) contrast(2.5) brightness(0.8)' },
        { name: 'Soft B&W', value: 'grayscale(1) contrast(1.2) brightness(1.2)' },
        { name: 'High Key', value: 'brightness(1.8) contrast(1.1)' },
        { name: 'Low Key', value: 'brightness(0.6) contrast(1.4)' },
        { name: 'Silhouette', value: 'brightness(0.4) contrast(2)' },
        { name: 'HDR', value: 'contrast(1.8) saturate(1.4) brightness(1.2)' },
        { name: 'Matte', value: 'contrast(0.9) brightness(1.1) saturate(0.8)' },
        { name: 'Glossy', value: 'contrast(1.5) brightness(1.3) saturate(1.2)' },
        { name: 'Textured', value: 'contrast(1.4) brightness(0.9)' },
        { name: 'Smooth', value: 'blur(0.5px) brightness(1.1)' },
        { name: 'Grainy', value: 'contrast(1.3) brightness(0.95)' },
        { name: 'Clean', value: 'contrast(1.2) brightness(1.15) saturate(0.9)' },
        { name: 'Warm Clean', value: 'sepia(0.1) contrast(1.2) brightness(1.1)' },
        { name: 'Cool Clean', value: 'hue-rotate(180deg) contrast(1.1) brightness(1.15)' },
        { name: 'Neutral', value: 'contrast(1.1) brightness(1.05)' },
        { name: 'Bold', value: 'contrast(1.8) saturate(1.6)' },
        { name: 'Subtle', value: 'contrast(1.1) saturate(1.1)' },
        { name: 'Rich', value: 'contrast(1.4) saturate(1.5) brightness(1.1)' },
        { name: 'Muted', value: 'contrast(0.9) saturate(0.7) brightness(1.05)' },
        { name: 'Vivid', value: 'saturate(2) contrast(1.3)' },
        { name: 'Pastel Dream', value: 'saturate(0.5) brightness(1.3)' },
        { name: 'Dark Fantasy', value: 'contrast(1.6) brightness(0.7) hue-rotate(300deg)' },
        { name: 'Light Fantasy', value: 'contrast(1.2) brightness(1.4) hue-rotate(60deg)' }
    ];

    // Qurilma turini aniqlash
    useEffect(() => {
        const checkDevice = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(mobile);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);

    // Audio elementlarini yaratish
    useEffect(() => {
        // Shutter sound
        shutterSoundRef.current = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
        
        // Countdown sound
        countdownSoundRef.current = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
        
        // Audio kontekstini ishga tushirish
        const initAudio = async () => {
            try {
                // Shutter sound yaratish
                const shutterContext = new (window.AudioContext || window.webkitAudioContext)();
                const shutterOscillator = shutterContext.createOscillator();
                const shutterGain = shutterContext.createGain();
                
                shutterOscillator.connect(shutterGain);
                shutterGain.connect(shutterContext.destination);
                
                shutterOscillator.frequency.setValueAtTime(1000, shutterContext.currentTime);
                shutterOscillator.type = 'sine';
                shutterGain.gain.setValueAtTime(0.3, shutterContext.currentTime);
                shutterGain.gain.exponentialRampToValueAtTime(0.01, shutterContext.currentTime + 0.1);
                
                shutterOscillator.start(shutterContext.currentTime);
                shutterOscillator.stop(shutterContext.currentTime + 0.1);
                
            } catch (e) {
                console.log('Audio init error:', e);
            }
        };
        
        initAudio();
    }, []);

    // Shutter ovozini chalish
    const playShutterSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Kamera shutter ovozi
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Shutter sound error:', e);
        }
    };

    // Countdown ovozini chalish
    const playCountdownSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Countdown ovozi
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Countdown sound error:', e);
        }
    };

    // Kamerani ochish funksiyasi
    const startCamera = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Avvalgi streamni to'xtatish
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode
                }
            });

            setStream(mediaStream);

            if (videoRef.current) {
                const video = videoRef.current;
                video.srcObject = mediaStream;

                return new Promise((resolve) => {
                    const onLoaded = () => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('canplay', onCanPlay);
                        video.removeEventListener('error', onError);

                        setIsLoading(false);
                        applyVideoTransform();
                        resolve();
                    };

                    const onCanPlay = () => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('canplay', onCanPlay);
                        video.removeEventListener('error', onError);

                        setIsLoading(false);
                        applyVideoTransform();
                        resolve();
                    };

                    const onError = (err) => {
                        console.error('Video error:', err);
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('canplay', onCanPlay);
                        video.removeEventListener('error', onError);

                        setIsLoading(false);
                        setError('Error loading video');
                        resolve();
                    };

                    video.removeEventListener('loadedmetadata', onLoaded);
                    video.removeEventListener('canplay', onCanPlay);
                    video.removeEventListener('error', onError);

                    video.addEventListener('loadedmetadata', onLoaded);
                    video.addEventListener('canplay', onCanPlay);
                    video.addEventListener('error', onError);

                    setTimeout(() => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('canplay', onCanPlay);
                        video.removeEventListener('error', onError);

                        if (isLoading) {
                            setIsLoading(false);
                            applyVideoTransform();
                        }
                        resolve();
                    }, 3000);
                });
            }

        } catch (err) {
            console.error('Kamera ochishda xatolik:', err);
            if (err.name === 'NotAllowedError') {
                setError('Camera permission not granted. Please grant camera permission in your browser settings.');
            } else if (err.name === 'NotFoundError') {
                setError('Camera not found. Please check if your device has a camera.');
            } else if (err.name === 'NotSupportedError') {
                setError('Your browser does not support the camera.');
            } else {
                setError('The camera could not be opened. Please try again.');
            }
            setIsLoading(false);
        }
    };

    // Video transformatsiyasini qo'llash
    const applyVideoTransform = () => {
        if (videoRef.current) {
            if (facingMode === 'user' && mirror) {
                videoRef.current.style.transform = 'scaleX(-1)';
            } else {
                videoRef.current.style.transform = 'scaleX(1)';
            }
        }
    };

    // Countdown boshlash
    const startCountdown = () => {
        if (isCapturing) return;

        setIsCapturing(true);
        setCountdownValue(3);

        // Dastlabki countdown ovozi
        playCountdownSound();

        const countdownInterval = setInterval(() => {
            setCountdownValue(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    setTimeout(() => {
                        // Oxirgi countdown ovozi va rasm olish
                        playCountdownSound();
                        capturePhotoFinal();
                        setIsCapturing(false);
                    }, 1000);
                    return 0;
                }

                // Har bir countdown uchun ovoz
                playCountdownSound();

                return prev - 1;
            });
        }, 1000);
    };

    // Flash effekti
    const triggerFlash = () => {
        if (!flash) return;

        setShowFlash(true);
        setTimeout(() => {
            setShowFlash(false);
        }, 300);
    };

    // Yakuniy rasm olish
    const capturePhotoFinal = () => {
        if (videoRef.current && canvasRef.current && stream) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Flash effektini ishga tushirish
            triggerFlash();

            // Shutter ovozini chalish
            playShutterSound();

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.error('Video hali tayyor emas');
                return;
            }

            let width = video.videoWidth;
            let height = video.videoHeight;
            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = width;
            let sourceHeight = height;

            if (square) {
                const size = Math.min(width, height);
                sourceWidth = size;
                sourceHeight = size;
                sourceX = (width - size) / 2;
                sourceY = (height - size) / 2;
                width = size;
                height = size;
            }

            canvas.width = width;
            canvas.height = height;

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (facingMode === 'user' && mirror) {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
            }

            context.drawImage(
                video,
                sourceX, sourceY, sourceWidth, sourceHeight,
                0, 0, width, height
            );

            if (currentFilter !== 'none') {
                context.save();
                context.filter = currentFilter;
                context.drawImage(canvas, 0, 0);
                context.restore();
            }

            if (facingMode === 'user' && mirror) {
                context.setTransform(1, 0, 0, 1, 0, 0);
            }

            const imageDataUrl = canvas.toDataURL('image/png');

            setTimeout(() => {
                setCapturedImage(imageDataUrl);
                setIsPreview(true);
                stream.getTracks().forEach(track => track.stop());
            }, 100);
        }
    };

    // Rasm olish (countdown bilan)
    const capturePhoto = () => {
        if (countdown) {
            startCountdown();
        } else {
            setIsCapturing(true);
            setTimeout(() => {
                capturePhotoFinal();
                setIsCapturing(false);
            }, 100);
        }
    };

    // Kamerani almashtirish - TO'G'RILANGAN VERSIYA
    const switchCamera = async () => {
        try {
            // Old va orqa kamera o'rtasida almashtirish
            const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
            setFacingMode(newFacingMode);
            
            // Kamerani qayta ishga tushirish
            await startCamera();
        } catch (error) {
            console.error('Kamera almashtirishda xatolik:', error);
            // Agar orqa kamera mavjud bo'lmasa, old kameraga qaytish
            if (facingMode === 'environment') {
                setFacingMode('user');
                await startCamera();
            }
        }
    };

    // Rasmni yuklab olish
    const downloadImage = () => {
        if (capturedImage) {
            const link = document.createElement('a');
            link.download = `my-webcam-photo-${Date.now()}.png`;
            link.href = capturedImage;
            link.click();
        }
    };

    // Ortga qaytish (kamerani qayta ochish)
    const backToCamera = async () => {
        setCapturedImage(null);
        setIsPreview(false);
        await startCamera();
    };

    // Kamerani to'xtatish
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (onClose) {
            onClose();
        }
    };

    // Fullscreen rejim
    const toggleFullScreen = () => {
        if (!fullScreen) {
            const elem = document.querySelector('.camera-overlay');
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    // Fullscreen o'zgarishini kuzatish
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement
            );
            setFullScreen(isFullscreen);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Video transformatsiyasini yangilash
    useEffect(() => {
        applyVideoTransform();
    }, [mirror, facingMode]);

    // Komponent yuklanganda kamerni ochish
    useEffect(() => {
        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Kamerani almashtirganda
    useEffect(() => {
        if (!isPreview) {
            startCamera();
        }
    }, [facingMode]);

    const [isFullscreenImg, setIsFullScreenImg] = useState(false);

    const isFullscreenImgF = () => {
        setIsFullScreenImg(!isFullscreenImg)
    }

    if (error) {
        return (
            <div className="camera-overlay">
                <div className="error-overlay">
                    <div className="error-message">
                        <div className="error-icon">⚠️</div>
                        <h3>Camera not opening</h3>
                        <p>{error}</p>
                        <button
                            className="retry-button"
                            onClick={startCamera}
                        >
                            Retry
                        </button>
                        <button
                            className="close-error-button"
                            onClick={stopCamera}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="camera-overlay">
            {/* Sozlamalar menyusi */}
            {showSettings && !isPreview && (
                <div className="settings-menu">
                    <div className="settings-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={mirror}
                                onChange={(e) => setMirror(e.target.checked)}
                            />
                            Mirror (Oyna)
                        </label>
                    </div>
                    <div className="settings-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={square}
                                onChange={(e) => setSquare(e.target.checked)}
                            />
                            Square (Kvadrat)
                        </label>
                    </div>
                    <div className="settings-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={countdown}
                                onChange={(e) => setCountdown(e.target.checked)}
                            />
                            Countdown (3 seconds)
                        </label>
                    </div>
                    <div className="settings-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={flash}
                                onChange={(e) => setFlash(e.target.checked)}
                            />
                            Flash
                        </label>
                    </div>
                    <div className="settings-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={fullScreen}
                                onChange={toggleFullScreen}
                            />
                            Full Screen
                        </label>
                    </div>

                    <div className="settings-item back-settings-item" onClick={() => setShowSettings(!showSettings)}>
                        Close
                    </div>
                </div>
            )}

            <div className="camera-container">
                {
                    !isPreview && (
                        <div className="camera-header">
                            <button className="close-button" onClick={stopCamera}>
                                ✕
                            </button>
                        </div>
                    )
                }

                <div className={`video-container ${square ? 'square-mode' : ''}`}>
                    {isPreview ? (
                        <div className={`preview-container ${isFullscreenImg ? "full" : ""}`}>
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="preview-image"
                            />
                            <div className="full-screen-btn" onClick={isFullscreenImgF}>
                                <img src={`/assets/images/${!isFullscreenImg ? "fullscreen" : "shrink"}.png`} alt="" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="camera-video"
                                style={{
                                    display: isLoading ? 'none' : 'block',
                                    filter: currentFilter
                                }}
                            />
                            {isLoading && (
                                <div className="loading-overlay">
                                    <div className="loading-spinner"></div>
                                    <p>Camera is opening...</p>
                                </div>
                            )}
                            {isCapturing && countdownValue > 0 && (
                                <div className="countdown-overlay">
                                    <div className="countdown-number">
                                        {countdownValue}
                                    </div>
                                </div>
                            )}
                            {showFlash && (
                                <div className="flash-overlay"></div>
                            )}
                        </>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                {!isLoading && !isPreview && (
                    <div className="camera-controls">
                        {/* Kamerani almashtirish tugmasi */}
                        {isMobile && (
                            <button className="control-button switch-camera" onClick={switchCamera}>
                                {facingMode === 'user' ? '📷' : '👤'}
                            </button>
                        )}
                        <button
                            className="settings-button"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <img src="https://webcamtoy.com/assets/images/gear.svg" alt="" />
                        </button>
                        <button
                            className="control-button capture-button"
                            onClick={capturePhoto}
                            disabled={isCapturing}
                        >
                            {isCapturing && countdownValue > 0 ? countdownValue :
                                <img src="https://webcamtoy.com/assets/images/camera.svg" alt="Capture" />
                            }
                        </button>
                        <button className="control-button filters-toggle" onClick={() => setShowFilters(!showFilters)}>
                            <img src="/assets/images/filter.png" alt="Filters" />
                        </button>
                    </div>
                )}

                {isPreview && (
                    <div className="camera-controls preview-controls">
                        <div id="button-init" className="button hot-pink control-button back-button" onClick={backToCamera}>
                            <div className="arrow"></div>
                            <p>Back</p>
                        </div>
                        <p>Cool pic. Let's Save it…</p>
                        <div id="button-init" className="button hot-pink control-button download-button" onClick={downloadImage}>
                            <div className="arrow"></div>
                            <p>Save</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Filterlar menyusi */}
            {showFilters && !fullScreen && !isPreview && (
                <div className="filters-menu">
                    <div className="close-filter" onClick={() => setShowFilters(!showFilters)}>
                        Close
                    </div>
                    <div className="filters-grid">
                        {filters.map((filter, index) => (
                            <div
                                key={index}
                                className={`filter-item ${currentFilter === filter.value ? 'active' : ''}`}
                                onClick={() => setCurrentFilter(filter.value)}
                            >
                                <div
                                    className="filter-preview"
                                    style={{ filter: filter.value }}
                                ></div>
                                <span className="filter-name">{filter.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraComponent;