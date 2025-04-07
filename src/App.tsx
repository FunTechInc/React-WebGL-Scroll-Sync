import WebGLCanvas from "./components/WebGLCanvas";
import { StableScroller } from "@funtech-inc/spice";
import "./App.css";

function App() {
   return (
      <StableScroller>
         <div
            style={{
               position: "relative",
               width: "100%",
               padding: "10vw",
               overflow: "hidden",
            }}>
            <div
               style={{
                  position: "absolute",
                  height: "100%",
                  top: 0,
                  left: 0,
               }}>
               <WebGLCanvas />
            </div>
            <div
               style={{
                  // height: "500vh",
                  display: "flex",
                  flexDirection: "column",
                  gap: "50px",
               }}>
               <div
                  className="image"
                  style={{
                     position: "relative",
                     width: "100%",
                     height: "50vh",
                     // aspectRatio: "16/9",
                     // backgroundColor: "red",
                     zIndex: -20,
                  }}></div>
               <div
                  className="image"
                  style={{
                     position: "relative",
                     width: "100%",
                     // aspectRatio: "16/9",
                     height: "80vh",
                     // backgroundColor: "red",
                     zIndex: -2,
                  }}></div>
            </div>
         </div>
      </StableScroller>
   );
}

export default App;
