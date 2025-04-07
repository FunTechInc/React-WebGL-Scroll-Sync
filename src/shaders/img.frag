precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_scrollOffset;
uniform vec2 u_domXY;
uniform vec2 u_domWH;

varying vec2 v_uv;

void main() {
    vec2 uv = v_uv;
    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453123);
    vec3 color = vec3(noise);
    gl_FragColor = vec4(color, 1.0);
} 