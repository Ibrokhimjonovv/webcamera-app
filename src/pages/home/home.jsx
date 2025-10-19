import React, { useState, useEffect } from 'react';
import "./home.scss";
import CameraComponent from '../../components/camera/camera';

const images = [
    { img: "DjdOorFXgAAy4Br" },
    { img: "DgzeF_ZW0AAbm7f" },
    { img: "DgtWVqNXUAAtsnZ" },
    { img: "CjoEoHAW0AAIwD8" },
    { img: "CjoiKRQWUAEm3YX" },
    { img: "Cjjq6WiWgAA6csE" },
    { img: "CjjdgIkXAAAq3Uq" },
    { img: "CTX-fwsXAAA0OC_" },
    { img: "CTYJk9oWcAAMSyj" },
    { img: "CTYXhpxWsAAHLml" },
    { img: "CS105BqWcAADOIj" },
    { img: "CTegGKPWcAA4yR_" },
    { img: "CTT4noaW4AAHPR3" },
    { img: "CTT3cfFW4AASaQi" },
    { img: "CB7cdz2WYAAGs5y" },
    { img: "CCV1ROVW0AAY6G6" },
    { img: "CCG7JIIW8AAErDA" },
    { img: "CCaIr8hWEAEGTkg" },
    { img: "CBIp7cPWkAAaWr4" },
    { img: "B_by0iRW8AE4oSG" },
    { img: "B_thkBRXAAA6c4l" },
    { img: "B_g64utUgAAoa_5" },
    { img: "B-KFoyhIAAAmkBz" },
    { img: "B-KDnJaCEAACe_X" },
    { img: "B_cA54xUwAAfBmm" },
];

const PageHome = () => {
    const [currentImageIndexes, setCurrentImageIndexes] = useState({
        img1: 0,
        img2: 1,
        img3: 2,
        img4: 3
    });

    const [nextImageIndexes, setNextImageIndexes] = useState({
        img1: 4,
        img2: 5,
        img3: 6,
        img4: 7
    });

    const [usedImages, setUsedImages] = useState(new Set([0, 1, 2, 3, 4, 5, 6, 7]));
    const [currentChangingImage, setCurrentChangingImage] = useState('img1');
    const [isChanging, setIsChanging] = useState(false);

    // Tasodifiy rasm tanlash (ishlatilmagan)
    const getRandomUnusedImage = () => {
        const unusedImages = images
            .map((_, index) => index)
            .filter(index => !usedImages.has(index));

        if (unusedImages.length === 0) {
            // Agar barcha rasmlar ishlatilgan bo'lsa, tozalaymiz
            setUsedImages(new Set());
            const newIndex = Math.floor(Math.random() * images.length);
            return newIndex;
        }

        const randomIndex = Math.floor(Math.random() * unusedImages.length);
        return unusedImages[randomIndex];
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isChanging) {
                setIsChanging(true);

                // Avval yangi rasmni tayyorlaymiz
                const newImageIndex = getRandomUnusedImage();
                setNextImageIndexes(prev => ({
                    ...prev,
                    [currentChangingImage]: newImageIndex
                }));

                // Animatsiya davomida yangi rasmni ko'rsatamiz
                setTimeout(() => {
                    // Asosiy rasmlarni yangilaymiz
                    setCurrentImageIndexes(prev => ({
                        ...prev,
                        [currentChangingImage]: newImageIndex
                    }));

                    // Yangi rasmni used ga qo'shamiz
                    setUsedImages(prev => new Set([...prev, newImageIndex]));

                    // Keyingi image ga o'tish
                    const nextImageOrder = ['img1', 'img2', 'img3', 'img4'];
                    const currentIndex = nextImageOrder.indexOf(currentChangingImage);
                    const nextIndex = (currentIndex + 1) % nextImageOrder.length;

                    setCurrentChangingImage(nextImageOrder[nextIndex]);
                    setIsChanging(false);
                }, 1500);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [currentChangingImage, isChanging, usedImages]);

    const getImageUrl = (imgName) => {
        return `https://webcamtoy.com/assets/photos/${imgName}.jpg`;
    };

    const [showCamera, setShowCamera] = useState(false);

    const handleButtonClick = () => {
        setShowCamera(true);
    };

    const handleCloseCamera = () => {
        setShowCamera(false);
    };

    return (
        <div className='page-home'>
            <div className="left-side-images">
                <div className="img-1 animated-image">
                    <div className="image-container">
                        <div
                            className="cimg current"
                            style={{
                                backgroundImage: `url(${getImageUrl(images[currentImageIndexes.img1].img)})`
                            }}
                        />
                    </div>
                </div>
                <div className="img-2 animated-image">
                    <div className="image-container">
                        <div
                            className="cimg current"
                            style={{
                                backgroundImage: `url(${getImageUrl(images[currentImageIndexes.img2].img)})`
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="middle-side">
                <div className="middle-logo">
                    <h1>My <div className="h1-img"><img src="/assets/images/diaphragm.png" alt="" /></div></h1>
                    <h1>WebCam</h1>
                </div>
                <p>Take selfies with over 80 fun effects!</p>
                <div id="button-init" className="button hot-pink" onClick={handleButtonClick}>
                    <div className="arrow"></div>
                    <p>Ready? Smile!</p>
                </div>
                <div className="gg-banner-ad"></div>
            </div>

            <div className="right-side-images">
                <div className="img-3 animated-image">
                    <div className="image-container">
                        <div
                            className="cimg current"
                            style={{
                                backgroundImage: `url(${getImageUrl(images[currentImageIndexes.img3].img)})`
                            }}
                        />
                    </div>
                </div>
                <div className="img-4 animated-image">
                    <div className="image-container">
                        <div
                            className="cimg current"
                            style={{
                                backgroundImage: `url(${getImageUrl(images[currentImageIndexes.img4].img)})`
                            }}
                        />
                    </div>
                </div>
            </div>
            {showCamera && <CameraComponent onClose={handleCloseCamera} />}
        </div>
    );
};

export default PageHome;