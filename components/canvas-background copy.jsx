"use client";

import React, { useEffect, useRef, useState } from "react";

const CanvasBackground = ({ imageUrl, zoomFactor = 1.5 }) => {
  const canvasRef = useRef(null);
  // const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    // const context = canvas.getContext("2d");

    let ctx = canvas.getContext("2d");

    let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let cameraZoom = 0.75;
    // let cameraZoom = 1;
    let MAX_ZOOM = 2;
    let MIN_ZOOM = 0.5;
    let SCROLL_SENSITIVITY = 0.0005;

    function draw() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
      ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(
        -window.innerWidth / 2 + cameraOffset.x,
        -window.innerHeight / 2 + cameraOffset.y
      );
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const image = new Image();
      image.src = imageUrl;
      ctx.drawImage(
        image,
        -window.innerWidth,
        -window.innerHeight,
        window.innerWidth * 2,
        window.innerHeight * 2
      );

      // 1st link
      ctx.fillStyle = "#fff";
      drawRect(-920, -150, 200, 280);
      ctx.fillStyle = "#000";
      drawText("Contact us", -880, -10, 24, "arial");

      // const imageContactUs = new Image();
      // imageContactUs.src = "/contact-us.png";
      // ctx.drawImage(imageContactUs, -970, -305, 300, 490);

      // 2nd link
      ctx.fillStyle = "#fff";
      drawRect(-120, -700, 360, 240);
      ctx.fillStyle = "#000";
      drawText("Careers", 10, -570, 24, "arial");

      requestAnimationFrame(draw);
    }

    // Gets the relevant location from a mouse or single touch event
    function getEventLocation(e) {
      if (e.touches && e.touches.length == 1) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY };
      }
    }

    function drawRect(x, y, width, height) {
      ctx.fillRect(x, y, width, height);
    }

    function drawText(text, x, y, size, font) {
      ctx.font = `${size}px ${font}`;
      ctx.fillText(text, x, y);
    }

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    function onPointerDown(e) {
      isDragging = true;
      dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x;
      dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y;
    }

    function onPointerUp(e) {
      isDragging = false;
      initialPinchDistance = null;
      lastZoom = cameraZoom;
    }

    function onPointerMove(e) {
      if (isDragging) {
        cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x;
        cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y;
      }
    }

    function handleTouch(e, singleTouchHandler) {
      if (e.touches.length == 1) {
        singleTouchHandler(e);
      } else if (e.type == "touchmove" && e.touches.length == 2) {
        isDragging = false;
        handlePinch(e);
      }
    }

    let initialPinchDistance = null;
    let lastZoom = cameraZoom;

    function handlePinch(e) {
      e.preventDefault();

      let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

      // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
      let currentDistance =
        (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

      if (initialPinchDistance == null) {
        initialPinchDistance = currentDistance;
      } else {
        adjustZoom(null, currentDistance / initialPinchDistance);
      }
    }

    function adjustZoom(zoomAmount, zoomFactor) {
      if (!isDragging) {
        if (zoomAmount) {
          cameraZoom += zoomAmount;
        } else if (zoomFactor) {
          console.log(zoomFactor);
          cameraZoom = zoomFactor * lastZoom;
        }

        cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
        cameraZoom = Math.max(cameraZoom, MIN_ZOOM);

        console.log(zoomAmount);
      }
    }

    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("touchstart", (e) => handleTouch(e, onPointerDown));
    canvas.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("touchend", (e) => handleTouch(e, onPointerUp));
    canvas.addEventListener("mousemove", onPointerMove);
    canvas.addEventListener("touchmove", (e) => handleTouch(e, onPointerMove));
    canvas.addEventListener("wheel", (e) =>
      adjustZoom(e.deltaY * SCROLL_SENSITIVITY)
    );

    // Ready, set, go
    draw();

    // return () => {
    //   canvas.removeEventListener("wheel", handleWheel);
    // };
  }, [imageUrl, position]);

  // const handleMouseDown = (e: any) => {
  //   setStartPos({
  //     x: e.clientX - position.x,
  //     y: e.clientY - position.y,
  //   });
  //   setIsDragging(true);
  // };

  // const handleMouseMove = (e: any) => {
  //   if (!isDragging) return;
  //   setPosition({
  //     x: e.clientX - startPos.x,
  //     y: e.clientY - startPos.y,
  //   });
  // };

  // const handleMouseUp = () => {
  //   setIsDragging(false);
  // };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      {/* <div id="overlay">
        <div className="content contactUs" style={{ top: 0 }}>Content 1</div>
        <div className="content">Content 2</div>
      </div> */}
    </>
  );
  // return (
  //   <canvas
  //     ref={canvasRef}
  //     style={{
  //       // width: "100%", // Set width
  //       // height: "100vh", // Set height
  //       // backgroundImage: "url(canvas-bg.png)",
  //       // backgroundSize: "conver", // or 'contain' based on your preference
  //       // backgroundPosition: "center",
  //       // backgroundRepeat: "no-repeat", // Prevents the image from repeating
  //       position: "absolute",
  //       top: 0,
  //       left: 0,
  //       zIndex: 1,
  //       cursor: isDragging ? "grabbing" : "grab",
  //     }}
  //     onMouseDown={handleMouseDown}
  //     onMouseMove={handleMouseMove}
  //     onMouseUp={handleMouseUp}
  //     onMouseLeave={handleMouseUp}
  //     // style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
  //   />
  // );
};

export default CanvasBackground;
