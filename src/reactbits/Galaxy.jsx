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

const fragmentShader = `
precision mediump float; 

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform float uRotationSpeed;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 3.0 

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 StarLayer(vec2 uv, float seedOffset) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      float seed = Hash21(id + offset + seedOffset);
      float hue = fract(seed * 777.7 + uHueShift / 360.0); 
      vec3 base = hsv2rgb(vec3(hue, uSaturation, 1.0));
      float twinkle = sin(uTime * 3.0 + seed * 10.0) * 0.5 + 0.5;
      float star = (0.06 * uGlowIntensity) / length(gv - offset);
      star *= smoothstep(0.6, 0.05, length(gv-offset));
      col += star * base * twinkle * fract(seed * 456.7);
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 baseUv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  float d = length(baseUv); 
  
  // UKURAN DIPERKECIL & CANTIK (0.08)
  float horizonRadius = 0.08; 
  float lensingRadius = 0.5; 
  
  vec2 rayTracedUv = baseUv;

  if (d > horizonRadius && d < lensingRadius) {
    float normalizeDist = (d - horizonRadius) / (lensingRadius - horizonRadius);
    float distortion = pow(1.0 - normalizeDist, 3.0) * 0.7; 
    rayTracedUv = baseUv - normalize(baseUv) * distortion;
  }

  float rotAngle = uTime * uRotationSpeed;
  mat2 rotMat = mat2(cos(rotAngle), -sin(rotAngle), sin(rotAngle), cos(rotAngle));
  vec2 finalUv = rotMat * rayTracedUv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(finalUv * scale + i * 123.4, i) * fade;
  }

  // EVENT HORIZON (Hitam)
  float darkness = smoothstep(horizonRadius, horizonRadius + 0.01, d);
  col *= darkness;

  // DUST GLOW & ACCRETION DISK (Warna Interstellar)
  float dustGlow = exp(-4.0 * (d - horizonRadius)) * smoothstep(horizonRadius, horizonRadius + lensingRadius, d);
  vec3 dustCol = vec3(0.6, 0.2, 0.0); 

  float angle = atan(baseUv.y, baseUv.x);
  float swirl = sin(angle * 10.0 - uTime * 3.0) * 0.1 + 0.9; 

  float diskThreshold = horizonRadius + 0.15;
  float accretionBand = smoothstep(diskThreshold, horizonRadius + 0.01, d) * smoothstep(horizonRadius - 0.02, horizonRadius + 0.01, d);
  vec3 diskCol = vec3(1.0, 0.7, 0.1); 

  col += dustCol * dustGlow * 0.4 * uGlowIntensity;
  col += diskCol * accretionBand * 0.9 * swirl * uGlowIntensity;

  // ========================================================
  // PERBAIKAN MUTLAK ALPHA: ANTI BOCOR DI TENGAH
  // ========================================================
  if (uTransparent) {
    float baseAlpha = length(col);
    baseAlpha = smoothstep(0.0, 0.15, baseAlpha); 
    
    // Paksa Alpha = 1.0 jika koordinat berada di dalam Black Hole
    float isInsideBlackHole = 1.0 - smoothstep(horizonRadius - 0.005, horizonRadius + 0.005, d);
    
    // Gabungkan: transparan di luar, TAPI hitam pekat solid di dalam
    float finalAlpha = max(baseAlpha, isInsideBlackHole);
    
    gl_FragColor = vec4(col, min(finalAlpha, 1.0));
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

export default function Galaxy({
  focal = [0.5, 0.5],
  starSpeed = 0.5,
  density = 1.5,
  hueShift = 140,
  speed = 1.0,
  glowIntensity = 1.3, 
  saturation = 0.0,
  twinkleIntensity = 0.3,
  rotationSpeed = -0.15, 
  transparent = true,
  resolutionScale = 0.6, 
  ...rest
}) {
  const ctnDom = useRef(null);
  const programRef = useRef(null);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    
    // Gunakan try-catch agar tidak error saat render ulang beruntun
    let renderer;
    try {
      renderer = new Renderer({ alpha: transparent, premultipliedAlpha: false });
    } catch (e) {
      return;
    }
    
    const gl = renderer.gl;

    function resize() {
      if(!ctn || !renderer) return;
      renderer.setSize(ctn.offsetWidth * resolutionScale, ctn.offsetHeight * resolutionScale);
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      if (programRef.current) {
        programRef.current.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
      }
    }
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(1, 1, 1) },
        uFocal: { value: new Float32Array(focal) },
        uStarSpeed: { value: 0 },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uTransparent: { value: transparent }
      }
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    let animateId;
    
    const update = (t) => {
      if(!program || gl.isContextLost()) return;
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uStarSpeed.value = t * 0.0001 * starSpeed; 
      renderer.render({ scene: mesh });
    };

    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);
    resize(); 

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      try {
        if(gl && gl.canvas && gl.canvas.parentElement === ctn) {
          ctn.removeChild(gl.canvas);
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      } catch(e) {}
    };
  }, []); 

  useEffect(() => {
    if (programRef.current) {
      const u = programRef.current.uniforms;
      u.uDensity.value = density;
      u.uHueShift.value = hueShift;
      u.uSpeed.value = speed;
      u.uGlowIntensity.value = glowIntensity;
      u.uSaturation.value = saturation;
      u.uRotationSpeed.value = rotationSpeed;
    }
  }, [density, hueShift, speed, glowIntensity, saturation, rotationSpeed]);

  return <div ref={ctnDom} className="w-full h-full absolute inset-0 -z-10" {...rest} />;
}