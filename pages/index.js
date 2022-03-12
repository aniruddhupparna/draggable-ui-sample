import Head from 'next/head'
import Draggable from 'react-draggable';
import styles from '../styles/Home.module.css'
import Image from 'next/image'

export default function Home() {

  function onDrop (e) {
    // if (e.target.classList.contains("drop-target")) {
      e.target.classList.remove('react-draggable-dragged');
    // }
  };

  function onStop(e) {
    e.target.classList.remove('react-draggable-dragged');
  };

  function handleDrag (e, ui) {
    // var left = ui.x, top = -ui.y;
    // var constrained = triangle.constrain(new aw.Graph.Point(left, top));
    // ui.position.left = constrained.x; 
    // ui.position.top = -constrained.y;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sensemaker</title>
        <meta name="description" content="Sensemaker Ui sample" />
      </Head>

      <main className={styles.main}>
        <div className="content">
        <div className={styles.map}>
          <svg height="300" width="300" style={{position: "relative"}}>
            <polygon points="0 300, 300 300, 150 0" style={{fill:"whitesmoke"}}>
            </polygon>
          </svg>
          <Draggable
                handle=".handle"
                
                bounds="parent"
                // onStart={this.handleStart}
                // onDrag={handleDrag}
                onStop={onStop}
                onDrop={onDrop}
                >
                  <div className={`handle ${styles.mapSelector}`}>
                    <Image src="/images/pointer.png" alt="Draggable pointer" width={32} height={32} /> 
                  </div>
          </Draggable>
        </div>
        <div style={{textAlign: 'center', padding: '20px'}}>
           <button style={{textAlign: 'center', padding: '10px 20px', cursor: 'pointer'}}>Save</button>
        </div>
      </div>
      </main>
    </div>
  )
}
