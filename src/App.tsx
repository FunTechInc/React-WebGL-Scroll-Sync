import WebGLCanvas from "./components/WebGLCanvas";
import { StableScroller } from "@funtech-inc/spice";
import "./App.css";

const WebGLView = (props: React.HTMLAttributes<HTMLDivElement>) => {
   return (
      <div
         {...props}
         className="image"
         style={{
            position: "relative",
            width: "100%",
            height: "50svh",
            zIndex: 1,
            border: "0.2em solid white",
            fontSize: "13px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            flexDirection: "column",
            gap: "0.2em",
            ...props.style,
         }}>
         React WebGL Scroll Sync
         <a
            href="https://github.com/lusionltd/WebGL-Scroll-Sync"
            target="_blank">
            based on Lusion
         </a>
      </div>
   );
};

function App() {
   return (
      <StableScroller>
         <div
            style={{
               position: "relative",
               width: "100%",
               padding: "3vw",
               overflow: "hidden",
            }}>
            <div
               style={{
                  position: "absolute",
                  height: "100%",
                  top: 0,
                  left: 0,
                  zIndex: -1,
               }}>
               <WebGLCanvas />
            </div>
            <div
               style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  flexDirection: "column",
                  gap: "3vw",
               }}>
               <WebGLView />
               <WebGLView />
               <WebGLView />
               <WebGLView />
               <WebGLView />
               <WebGLView />
               <WebGLView />
               <WebGLView />
            </div>
            <div
               style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1em",
                  fontSize: "13px",
                  marginTop: "5vw",
               }}>
               <a
                  href="https://github.com/FunTechInc/React-WebGL-Scroll-Sync"
                  target="_blank">
                  GitHub
               </a>
               <a href="https://www.funtech.inc/" target="_blank">
                  FunTech
               </a>
            </div>
         </div>
      </StableScroller>
   );
}

export default App;
