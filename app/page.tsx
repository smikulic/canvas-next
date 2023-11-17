"use client";

// import Image from 'next/image'
import CanvasBackground from "@/components/canvas-background.jsx";
import CanvasBackground2 from "@/components/canvas-background copy.jsx";
import CssBackground from "@/components/css-background.jsx";
import { useEffect, useLayoutEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export default function Home() {
  // const [windowDimensions, setWindowDimensions] = useState({
  //   x: 0,
  //   y: 0,
  // });

  // useEffect(() => {
  //   // 1. set window size
  //   if (windowDimensions.x === 0 && windowDimensions.y === 0) {
  //     setWindowDimensions({
  //       x: window.innerWidth,
  //       y: window.innerHeight,
  //     });
  //   }
  // }, [windowDimensions]);
  // return (
  //   <>
  //     <CssBackground />
  //   </>
  // );

  return (
    <>
      {/* <CanvasBackground imageUrl="/canvas-bg.png" /> */}
      <CanvasBackground2 imageUrl="/canvas-bg.png" />
      {/* <div id="overlay">
        <div className="content contactUs">Content 1</div>
        <div className="content">Content 2</div>
      </div> */}
    </>
  );
}
