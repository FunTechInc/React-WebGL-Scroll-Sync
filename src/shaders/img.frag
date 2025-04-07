precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_scrollOffset;
uniform sampler2D u_noise;

varying vec2 v_uv;

void main() {
	vec2 uv = v_uv;
	vec4 noise = texture2D(u_noise, uv);
	gl_FragColor = noise;
} 