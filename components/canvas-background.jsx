"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWindowSize } from "../app/page";

const CanvasBackground = ({ imageUrl }) => {
  const [width, height] = useWindowSize();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let cameraZoom = 1;

    function draw() {
      // 1. set canvas background size
      canvas.width = width;
      canvas.height = height;

      // 2. Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
      context.translate(window.innerWidth / 2, window.innerHeight / 2);
      context.scale(cameraZoom, cameraZoom);
      context.translate(
        -window.innerWidth / 2 + cameraOffset.x,
        -window.innerHeight / 2 + cameraOffset.y
      );
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const image = new Image();
      image.src = imageUrl;
      context.drawImage(image, 0, 0, width, height);
    }

    context.fillStyle = "#fff";
    context.fillRect(-100, -100, 200, 280);

    requestAnimationFrame(draw);

    console.log("DRAW!");
    draw();

    // const clickHandler = () => {
    //   context.fillStyle = 'blue';
    //   context.fillRect(0, 0, props.width, props.height);
    // };

    // canvas.addEventListener('click', clickHandler);

    // return () => {
    //   canvas.removeEventListener('click', clickHandler);
    // };
  }, [imageUrl, width, height]);

  return (
    <>
      <canvas
        ref={canvasRef}
        // width={windowDimensions.x}
        // height={windowDimensions.y}
        style={{
          // border: "5px solid red",
          background: "#ccc",
          // position: "absolute",
          // top: 0,
          // left: 0,
          // zIndex: 1,
        }}
      />
    </>
  );
};

export default CanvasBackground;
