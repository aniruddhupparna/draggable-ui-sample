import Head from 'next/head'
import Draggable from 'react-draggable';
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import {useRef, useEffect, useState} from "react"

export default function Home() {
  var W = 300;
  var H = 300;
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [point, setPoint] = useState({x: W / 2, y: H / 2})

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, [])
  

  var triangle = {
    a: { x: 0, y: 300 },
    b: { x: 300, y: 300 },
    c: { x: 150, y: 0 }
};
  
 function checkCanvasClick(evt) {
   console.log("x", evt.pageX - canvasRef.current.offsetLeft, "y", evt.pageY - canvasRef.current.offsetTop, " canvas offset", )
      setPoint({x: (evt.pageX - canvasRef.current.offsetLeft), y: evt.pageY - canvasRef.current.offsetTop})
      test();
 }
  

  
  function test() {
      var result = ptInTriangle(point, triangle.a, triangle.b, triangle.c);
      console.log("result",result)
      render();
  }
  
  function ptInTriangle(p, p0, p1, p2) {
      var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
      var sign = A < 0 ? -1 : 1;
      var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
      var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
      
      return s > 0 && t > 0 && (s + t) < 2 * A * sign;
  }
  
  function render() {
      ctx?.fillStyle = "#fff";
      ctx?.fillRect(0, 0, 300, 300);
      drawTriangle(triangle.a, triangle.b, triangle.c);
      drawPoint(point);
  }
  
  function drawTriangle(p0, p1, p2) {
      ctx?.fillStyle = "lightgrey";
      ctx?.beginPath();
      ctx?.moveTo(p0.x, p0.y);
      ctx?.lineTo(p1.x, p1.y);
      ctx?.lineTo(p2.x, p2.y);
      ctx?.closePath();
      ctx?.fill();
      ctx?.fillStyle = "#000";
      ctx?.font = "12px monospace";
  }
  
  function drawPoint(p) {
      ctx?.fillStyle = "royalblue";
      ctx?.beginPath();
      ctx?.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx?.fill();
  }
  
  // function onDrop (e) {
  //   // if (e.target.classList.contains("drop-target")) {
  //     e.target.classList.remove('react-draggable-dragged');
  //   // }
  // };

  // function onStop(e) {
  //   e.target.classList.remove('react-draggable-dragged');
  // };

  // function handleDrag (e, ui) {
  //   const left = ui.x; 
  //   const top = -ui.y;
  //   console.log("X", left, "y", top, "x/y", left/top)
  //   const slope = 
  //   // var constrained = triangle.constrain(new aw.Graph.Point(left, top));
  //   ui.position.left = ; 
  //   ui.position.top = -constrained.y;
  // };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sensemaker</title>
        <meta name="description" content="Sensemaker Ui sample" />
      </Head>

      <main className={styles.main}>
        <canvas width="300" height="300" ref={canvasRef} onClick={checkCanvasClick}></canvas>
        {  test()}
        <div style={{textAlign: 'center', padding: '20px'}}>
           <button style={{textAlign: 'center', padding: '10px 20px', cursor: 'pointer'}}>Save</button>
        </div>
      </main>
    </div>
  )
}
