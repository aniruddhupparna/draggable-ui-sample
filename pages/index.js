import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import {useState, useEffect, useRef} from "react"
import { ScatterChart, XAxis, YAxis, Scatter, Cell } from 'recharts';
import { getAnswers, postAnswers } from '../services/utils';

// const data01 = [
//   {
//     "x": 100,
//     "y": 200
//   }
// ]

const paddingTopOffset = 100;

export default function Home() {
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [answersData, setAnswersData] = useState([]);
  const pointRef = useRef(null)
  const [maxAvgDistance, setMaxAvgDistance] = useState(336); // we assume this value based on the max distance between 2 points in our len = 300  height = 300 triangle
  const triangle = {a: { x: 0, y: 300 }, b: { x: 300, y: 300 }, c: { x: 150, y: 0 }}
  let coordinates = {x: 150, y: 150}

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
    getAnswers().then(data => addAvgDistance(data))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addAvgDistance(data) {
    data.forEach(x => x.average_distance = data.map(y => distance(x, y)).reduce((a,b) => a + b, 0) / data.length)
    setMaxAvgDistance(Math.max(...data.map(x => x.average_distance)))
    setAnswersData(data)
  }

  function distance(pointA, pointB) {
    return ((pointA.x-pointB.x)**2 + (pointB.y-pointB.y)**2)**0.5
   }

  function handleStop (evt) {
    setTimeout(function() {
      evt.target.style.visibility = "";
    }, 1);

    coordinates = {x: evt.pageX - canvasRef.current.offsetLeft, y: (evt.pageY - canvasRef.current.offsetTop - paddingTopOffset)}
    const inside = ptInTriangle(coordinates, triangle.a, triangle.b, triangle.c)
   
    if (!inside) {
      pointRef.current.style.left = `${canvasRef.current.offsetLeft + 130}px`
      pointRef.current.style.top = `${canvasRef.current.offsetTop + 150}px`
      coordinates = {x: pointRef.current.style.left, y: pointRef.current.style.top}
    } else {
       // we subtract paddingTopOffset to account for the top padding we have given above canvas
      // we subtract 16px to account for half the size of pointer itself
      pointRef.current.style.left = `${evt.pageX - 16}px`
      pointRef.current.style.top = `${evt.pageY - paddingTopOffset - 16}px`
    }
  };

  function ptInTriangle(p, p0, p1, p2) {
    // check of point is inside triangle using barycentric coordinates
    var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    var sign = A < 0 ? -1 : 1;
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
    
    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}


  function drawTriangle(p0, p1, p2) {
    if(ctx){
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "12px monospace";
    }
}

function render() {
  if(ctx) {
    ctx.fillStyle = "#1f2227";
    ctx.fillRect(0, 0, 300, 300);
    drawTriangle(triangle.a, triangle.b, triangle.c);
  }
}

function startDrag(e) {
  setTimeout(function() {
    e.target.style.visibility = "hidden";
  }, 1);
}

function savePos(e) {
  postAnswers(coordinates).then(data => {
    getAnswers().then(res => addAvgDistance(res))
  })
}

  return (
    <div className={styles.container}>
      <Head>
        <title>Sensemaker</title>
        <meta name="description" content="Sensemaker Ui sample" />
      </Head>

      <main className={styles.main}>
        <div className={styles.canvasContainer}>
          <span className={styles.triangleLables} style={{top: "-30px"}}>Eating</span>
          <span className={styles.triangleLables} style={{top: "280px", left: "calc(50vw - 230px)"}}>Sleeping</span>
          <span className={styles.triangleLables} style={{top: "280px", left: "calc(50vw + 150px)"}}>Working</span>
        <canvas width="300" height="300" ref={canvasRef}
           ></canvas>
           {render()}
            <div className={styles.mapSelector} ref={pointRef} onDragStart={startDrag} onDragEnd={handleStop}>
              <Image src="/images/pointer.png" alt="Draggable pointer" width={32} height={32} /> 
            </div>
        <div style={{textAlign: 'center', padding: '20px'}}>
           <button className={styles.saveBtn} onClick={savePos}>Save</button>
        </div>
        </div>
        <div className={styles.outputHeading}>OUTPUT HEAT MAP</div>
        <div className={styles.scatterPlotContainer}>
        <svg height="300" width="300" className={styles.outputPlot}>
            <polygon points="0 300, 300 300, 150 0" style={{fill:"whitesmoke"}}>
            </polygon>
          </svg>
        <ScatterChart width={370} height={335}>
          <XAxis dataKey="x" name="x"  type="number" domain={[0, 300]} axisLine={false} tick={false}/>
          <YAxis dataKey="y" name="y" reversed={true} type="number" domain={[0, 300]} axisLine={false} tick={false}/>
          {answersData.length > 0 && 
          <>
          <Scatter name="selections" data={answersData.slice(0, -1)}>
              {answersData.slice(0, -1).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`rgba(0, 0, 255, ${(1 - entry.average_distance / maxAvgDistance)})`} />
            ))}
          </Scatter>
          <Scatter name="last_selection" data={[answersData.slice(-1)[0]]} fill="red"/>
          </>}
        </ScatterChart>
        </div>
        <div className={styles.answerListConatiner}>
          {answersData.length > 0 && (<div style={{marginBottom: '20px'}}>List of DB entries</div>
          )}
          <div>
          {answersData.map(answer => 
            <div key={answer['_id']}>{`id: ${answer['_id']}`}</div>
          )
          }
          </div>
        </div>
      </main>
    </div>
  )
}
