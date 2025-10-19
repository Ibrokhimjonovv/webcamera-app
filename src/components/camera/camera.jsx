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
    const [availableCameras, setAvailableCameras] = useState([]);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

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

    // Mavjud kameralarni olish
    const getAvailableCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setAvailableCameras(videoDevices);
            return videoDevices;
        } catch (error) {
            console.error('Kamerani olishda xatolik:', error);
            return [];
        }
    };

    // Real kamera shutter ovozi
    const playShutterSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Asosiy shutter ovozi
            const oscillator1 = audioContext.createOscillator();
            const gainNode1 = audioContext.createGain();
            
            oscillator1.connect(gainNode1);
            gainNode1.connect(audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator1.type = 'sine';
            
            gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            // Ikkinchi ovoz (shutter yopilishi)
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();
            
            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);
            
            oscillator2.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
            oscillator2.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
            oscillator2.type = 'sine';
            
            gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime + 0.1);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator1.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.15);
            
            oscillator2.start(audioContext.currentTime + 0.1);
            oscillator2.stop(audioContext.currentTime + 0.2);
            
        } catch (e) {
            console.log('Shutter sound error:', e);
            // Fallback: oddiy bip ovozi
            try {
                const fallbackContext = new (window.AudioContext || window.webkitAudioContext)();
                const fallbackOscillator = fallbackContext.createOscillator();
                const fallbackGain = fallbackContext.createGain();
                
                fallbackOscillator.connect(fallbackGain);
                fallbackGain.connect(fallbackContext.destination);
                
                fallbackOscillator.frequency.value = 800;
                fallbackOscillator.type = 'sine';
                
                fallbackGain.gain.setValueAtTime(0.3, fallbackContext.currentTime);
                fallbackGain.gain.exponentialRampToValueAtTime(0.01, fallbackContext.currentTime + 0.1);
                
                fallbackOscillator.start(fallbackContext.currentTime);
                fallbackOscillator.stop(fallbackContext.currentTime + 0.1);
            } catch (fallbackError) {
                console.log('Fallback sound error:', fallbackError);
            }
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

            // Countdown ovozi - qisqa va aniq
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Countdown sound error:', e);
        }
    };

    // Kamerani ochish funksiyasi - YANGILANGAN
    const startCamera = async (deviceId = null) => {
        try {
            setIsLoading(true);
            setError(null);

            // Avvalgi streamni to'xtatish
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }

            const constraints = {
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: deviceId ? undefined : facingMode,
                    deviceId: deviceId ? { exact: deviceId } : undefined
                }
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
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

                    // Timeout fallback
                    const timeoutId = setTimeout(() => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('canplay', onCanPlay);
                        video.removeEventListener('error', onError);

                        if (isLoading) {
                            setIsLoading(false);
                            applyVideoTransform();
                        }
                        resolve();
                    }, 5000);

                    // Cleanup timeout when video loads
                    video.addEventListener('loadedmetadata', () => clearTimeout(timeoutId));
                    video.addEventListener('canplay', () => clearTimeout(timeoutId));
                });
            }

        } catch (err) {
            console.error('Kamera ochishda xatolik:', err);
            let errorMessage = 'The camera could not be opened. Please try again.';
            
            if (err.name === 'NotAllowedError') {
                errorMessage = 'Camera permission not granted. Please allow camera access in your browser settings.';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'No camera found. Please check if your device has a camera.';
            } else if (err.name === 'NotSupportedError') {
                errorMessage = 'Your browser does not support camera access.';
            } else if (err.name === 'OverconstrainedError') {
                errorMessage = 'Camera constraints could not be satisfied. Trying alternative camera...';
                // Alternative kamera urinishi
                setTimeout(() => switchToNextCamera(), 1000);
                return;
            }
            
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    // Keyingi kameraga o'tish
    const switchToNextCamera = async () => {
        try {
            const cameras = await getAvailableCameras();
            if (cameras.length <= 1) {
                setError('Only one camera available');
                return;
            }

            const nextIndex = (currentCameraIndex + 1) % cameras.length;
            setCurrentCameraIndex(nextIndex);
            
            await startCamera(cameras[nextIndex].deviceId);
            
            // Yangi kamera turini aniqlash
            const newFacingMode = nextIndex === 0 ? 'user' : 'environment';
            setFacingMode(newFacingMode);
            
        } catch (error) {
            console.error('Camera switch error:', error);
            setError('Failed to switch camera');
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
                    }, 500);
                    return 0;
                }

                // Har bir countdown uchun ovoz
                playCountdownSound();

                return prev - 1;
            });
        }, 1000);
    };

    // Flash effekti - faqat old kamerada ishlashi
    const triggerFlash = () => {
        if (!flash || facingMode === 'environment') return;

        setShowFlash(true);
        setTimeout(() => {
            setShowFlash(false);
        }, 200);
    };

    // Yakuniy rasm olish
    const capturePhotoFinal = () => {
        if (videoRef.current && canvasRef.current && stream) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Flash effektini ishga tushirish (faqat old kamerada)
            triggerFlash();

            // Haqiqiy kamera shutter ovozi
            playShutterSound();

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.error('Video not ready');
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

    // Kamerani almashtirish - YANGILANGAN VERSIYA
    const switchCamera = async () => {
        try {
            await switchToNextCamera();
        } catch (error) {
            console.error('Camera switch failed:', error);
            // Fallback: oddiy facingMode o'zgartirish
            const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
            setFacingMode(newFacingMode);
            await startCamera();
        }
    };

    // Rasmni yuklab olish
    const downloadImage = () => {
        if (capturedImage) {
            const link = document.createElement('a');
            link.download = `photo-${Date.now()}.png`;
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
        const initializeCamera = async () => {
            await getAvailableCameras();
            await startCamera();
        };
        
        initializeCamera();

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
                        <h3>Camera Error</h3>
                        <p>{error}</p>
                        <div className="error-buttons">
                            <button
                                className="retry-button"
                                onClick={startCamera}
                            >
                                Try Again
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
                            Mirror (Front camera only)
                        </label>
                    </div>
                    <div className="settings-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={square}
                                onChange={(e) => setSquare(e.target.checked)}
                            />
                            Square Mode
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
                            Screen Flash (Front camera only)
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
                        Close Settings
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
                            {isMobile && availableCameras.length > 1 && (
                                <div className="camera-info">
                                    Camera {currentCameraIndex + 1}/{availableCameras.length}
                                </div>
                            )}
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
                                    <p>Initializing camera...</p>
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
                        {isMobile && availableCameras.length > 1 && (
                            <button 
                                className="control-button switch-camera" 
                                onClick={switchCamera}
                                disabled={isLoading}
                            >
                                {facingMode === 'user' ? '📷' : '👤'}
                            </button>
                        )}
                        <button
                            className="settings-button"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <img src="https://webcamtoy.com/assets/images/gear.svg" alt="Settings" />
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
                        Close Filters
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