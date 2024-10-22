"use client";

import React, {useEffect, useRef, useState} from 'react'
import Webcam from 'react-webcam'
import {load, cocoSsdLoad} from '@tensorflow-models/coco-ssd';
import * as tf from "@tensorflow/tfjs";
import { renderPrediction } from '@/utils/renderPrediction';

let detectInterval;

function ObjectDetection() {
    const [isLoading, setIsLoading] = useState(true)

    const webcamRef = useRef(null);

    const canvasRef = useRef(null)

    const runCoco = async () => {
        setIsLoading(true);
        const net = await cocoSsdLoad();
        setIsLoading(false);

        detectInterval = setInterval(() => {
            runObjectDetection(net)
        }, 10)
    }

    async function runObjectDetection(net) {
        if (
            canvasRef.current &&
            webcamRef.current !== null &&
            webcamRef.current.video?.readyState === 4
        ) {
            canvasRef.current.width = webcamRef.current.video.videoWidth;
            canvasRef.current.height = webcamRef.current.video.videoHeight;

            // find detected object

            const detectedObjects = await net.detect(
                webcamRef.current.video,
                undefined,
                0.6
            )

            console.log(detectedObjects);
            
            const context = canvasRef.current.getContent("2d");
            renderPrediction(detectedObjects, context)
        }
    }


    const showmyVideo = () =>{
        if(webcamRef.current !== null && 
            webcamRef.current.video?.readyState === 4
        ){
            const myVideoWidth = webcamRef.current.video.videoWidth;
            const myVideoHeight = webcamRef.current.video.videoHeight;

            webcamRef.current.video.width = myVideoWidth;
            webcamRef.current.video.height = myVideoHeight
        }
    };

    useEffect(() => {
        runCoco();
        showmyVideo();
    }, [])
  return (

    <div className='mt-8'>{
            isLoading ? (
                <div>Loading AI model</div>
            ) : (
        <div className='relative flex justify-center items-center gradient p-1.5 rounded-md'>

            {/* {webcam} */}
            <Webcam 
            ref={webcamRef}
            className='rounded-md w-full lg:h-[720px]' muted/>
            {/* {canvas} */}
            <canvas ref={canvasRef}
            className='absolute top-0 left-0 z-99999 w-full lg:h-[720px]'
            >
            </canvas>
        </div>) }
    </div>
  )
}

export default ObjectDetection