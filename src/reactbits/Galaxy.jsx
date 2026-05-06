import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

// Pakai mediump agar lebih ringan di GPU HP/Laptop standar
const fragmentShader = `
precision mediump float; 

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 2.0
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      float seed = Hash21(id + offset);
      float size = fract(seed * 345.32);
      
      vec3 base = hsv2rgb(vec3(fract(seed + uHueShift / 360.0), uSaturation, 1.0));
      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed * 0.1), tris(seed * 38.0 + uTime * uSpeed * 0.03)) - 0.5;

      float star = Star(gv - offset - pad, 0.0);
      star *= mix(1.0, tris(uTime * uSpeed + seed * 6.28), uTwinkleIntensity);
      col += star * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  // Auto Rotation
  float rot = uTime * uRotationSpeed;
  uv *= mat2(cos(rot), -sin(rot), sin(rot), cos(rot));

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed);
    float scale = mix(15.0 * uDensity, 0.5 * uDensity, depth);
    col += StarLayer(uv * scale + i * 453.3) * depth;
  }

  gl_FragColor = vec4(col, uTransparent ? min(length(col), 1.0) : 1.0);
}
`;

export default function Galaxy({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  speed = 1.0,
  mouseInteraction = false, // Matikan jika tidak perlu banget
  glowIntensity = 0.3,
  saturation = 0.5,
  rotationSpeed = 0.05,
  transparent = true,
  resolutionScale = 0.5, // Rahasia kencang: Render di 50% resolusi asli
  ...rest
}) {
  const ctnDom = useRef(null);
  const programRef = useRef(null);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    
    // Renderer dengan powerPreference untuk memaksa GPU high-performance jika ada
    const renderer = new Renderer({
      alpha: transparent,
      premultipliedAlpha: false,
      powerPreference: "high-performance"
    });
    const gl = renderer.gl;

    function resize() {
      // Kita kecilkan ukuran canvas aslinya, tapi ditarik CSS
      renderer.setSize(ctn.offsetWidth * resolutionScale, ctn.offsetHeight * resolutionScale);
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      if (programRef.current) {
        programRef.current.uniforms.uResolution.value = new Color(
          gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height
        );
      }
    }

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(1, 1, 1) },
        uFocal: { value: new Float32Array(focal) },
        uRotation: { value: new Float32Array(rotation) },
        uStarSpeed: { value: 0 },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uRotationSpeed: { value: rotationSpeed },
        uTransparent: { value: transparent }
      }
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    let animateId;

    const update = (t) => {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uStarSpeed.value = t * 0.0001 * starSpeed;
      renderer.render({ scene: mesh });
    };

    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);
    window.addEventListener('resize', resize);
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []); // Kosongkan agar tidak restart terus menerus

  return <div ref={ctnDom} className="w-full h-full absolute inset-0" {...rest} />;
}