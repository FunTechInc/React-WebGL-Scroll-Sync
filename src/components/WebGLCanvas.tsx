import * as THREE from "three";
import { useRef, useState, useLayoutEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import vertexShader from "../shaders/img.vert";
import fragmentShader from "../shaders/img.frag";
import { useStableScroller } from "@funtech-inc/spice";
import { useNoise } from "@funtech-inc/use-shader-fx";

interface DOMRect {
   width: number;
   height: number;
   x: number;
   y: number;
}

interface SharedUniforms {
   resolution: THREE.Vector2;
   scrollOffset: THREE.Vector2;
}

interface NoiseImageProps extends SharedUniforms {
   domElement: HTMLElement;
   noiseTexture: THREE.Texture;
}

interface SceneProps extends SharedUniforms {
   domElements: HTMLElement[];
   updateScroll: () => void;
}

const PADDING = 0.25;

const WRAPPER_STYPE = {
   position: "absolute" as const,
   top: 0,
   left: 0,
   width: "100%",
   height: "100svh",
   pointerEvents: "none" as const,
   willChange: "transform",
};

const NoiseImage = ({
   domElement,
   resolution,
   scrollOffset,
   noiseTexture,
}: NoiseImageProps) => {
   const stableScroller = useStableScroller();
   const meshRef = useRef<THREE.Mesh>(null);
   const materialRef = useRef<THREE.ShaderMaterial>(null);
   const rect = useRef<DOMRect>({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
   });

   useLayoutEffect(() => {
      const updateRect = () => {
         const _rect = domElement.getBoundingClientRect();
         rect.current = {
            width: _rect.width,
            height: _rect.height,
            x: _rect.left + window.scrollX,
            y: _rect.top + (stableScroller?.scrollTop || window.scrollY),
         };
      };
      updateRect();
      const resizeObserver = new ResizeObserver(updateRect);
      resizeObserver.observe(domElement);
      window.addEventListener("resize", updateRect);
      return () => {
         resizeObserver.disconnect();
         window.removeEventListener("resize", updateRect);
      };
   }, [domElement, stableScroller]);

   const domWH = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
   const domXY = useRef<THREE.Vector2>(new THREE.Vector2(1, 1));
   useFrame(() => {
      if (!meshRef.current || !materialRef.current) return;

      domWH.current.set(rect.current.width, rect.current.height);
      domXY.current.set(rect.current.x, rect.current.y);

      const canvasTop = scrollOffset.y;
      const canvasBottom = canvasTop + resolution.y;
      const isVisible =
         rect.current.y < canvasBottom &&
         rect.current.y + rect.current.height > canvasTop;
      meshRef.current.visible = isVisible;
   });

   return (
      <mesh ref={meshRef} frustumCulled={false}>
         <planeGeometry args={[1, 1, 1, 1]} />
         <shaderMaterial
            ref={materialRef}
            uniforms={useMemo(
               () => ({
                  u_domXY: { value: domXY.current },
                  u_domWH: { value: domWH.current },
                  u_resolution: { value: resolution },
                  u_scrollOffset: { value: scrollOffset },
                  u_noise: { value: noiseTexture },
               }),
               [resolution, scrollOffset, noiseTexture]
            )}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            side={THREE.DoubleSide}
         />
      </mesh>
   );
};

const Scene = ({
   domElements,
   updateScroll,
   ...sharedUniforms
}: SceneProps) => {
   const { size } = useThree();

   const noise = useNoise({
      size,
      dpr: 0.1,
      scale: 0.1,
      hsv: true,
      colorBalance: true,
   });

   useFrame((state) => {
      const loop = Math.sin(state.clock.getElapsedTime()) * 0.5 + 0.5;
      updateScroll();
      noise.render(state, {
         hsv: {
            hueShift: loop,
         },
         colorBalance: {
            factor: (val) => val.set(1 + loop, loop, 1 - loop),
         },
      });
   });

   return domElements.map((element, index) => (
      <NoiseImage
         key={index}
         domElement={element}
         {...sharedUniforms}
         noiseTexture={noise.texture}
      />
   ));
};

const WebGLCanvas = () => {
   const stableScroller = useStableScroller();
   const wrapperRef = useRef<HTMLDivElement>(null);
   const resolution = useRef(new THREE.Vector2(1, 1));
   const scrollOffset = useRef(new THREE.Vector2(0, 0));

   const [domElements, setDomElements] = useState<HTMLElement[]>([]);

   useLayoutEffect(() => {
      const elements = Array.from(
         document.querySelectorAll(".image")
      ) as HTMLElement[];
      setDomElements(elements);
   }, []);

   const updateScroll = useCallback(() => {
      if (!wrapperRef.current) return;

      scrollOffset.current.set(
         window.scrollX,
         (stableScroller?.scrollTop || window.scrollY) -
            window.innerHeight * PADDING
      );

      wrapperRef.current.style.transform = `translate3d(${scrollOffset.current.x}px, ${scrollOffset.current.y}px, 0)`;
   }, [stableScroller]);

   useLayoutEffect(() => {
      const handleResize = () => {
         if (!wrapperRef.current) return;
         const vw = window.innerWidth;
         const canvasHeight = window.innerHeight * (1 + PADDING * 2);
         resolution.current.set(vw, canvasHeight);
         wrapperRef.current.style.width = `${vw}px`;
         wrapperRef.current.style.height = `${canvasHeight}px`;
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   return (
      <div ref={wrapperRef} style={WRAPPER_STYPE}>
         <Canvas camera={{ position: [0, 0, 1] }}>
            <Scene
               domElements={domElements}
               scrollOffset={scrollOffset.current}
               resolution={resolution.current}
               updateScroll={updateScroll}
            />
         </Canvas>
      </div>
   );
};

export default WebGLCanvas;
