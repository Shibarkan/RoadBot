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

#define NUM_LAYER 4.0

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

// ☄️ MULTIPLE COMETS (Lebih Terang & Beragam)
vec3 Comets(vec2 uv, float t) {
    vec3 col = vec3(0.0);
    
    // Komet 1: Cepat & Biru
    float t1 = mod(t * 0.8, 12.0);
    if (t1 < 3.0) {
        float p = t1 / 3.0;
        vec2 pos = mix(vec2(-1.5, 0.8), vec2(1.5, -0.5), p);
        float d = length(uv - pos);
        col += vec3(0.4, 0.7, 1.0) * (0.05 * uGlowIntensity / d) * smoothstep(0.5, 0.0, d);
    }

    // Komet 2: Lambat & Putih (Lintasan Berbeda)
    float t2 = mod(t * 0.5 + 5.0, 15.0);
    if (t2 < 4.0) {
        float p = t2 / 4.0;
        vec2 pos = mix(vec2(1.5, 0.5), vec2(-1.5, 0.2), p);
        float d = length(uv - pos);
        col += vec3(0.9, 0.9, 1.0) * (0.04 * uGlowIntensity / d) * smoothstep(0.4, 0.0, d);
    }

    return col;
}

// ✨ BRIGHT STAR LAYER
vec3 StarLayer(vec2 uv, float seedOffset) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      float seed = Hash21(id + offset + seedOffset);
      
      float hue = fract(uHueShift / 360.0 + seed * 0.4); 
      vec3 base = hsv2rgb(vec3(hue, uSaturation, 1.0)); // Saturation Full
      
      float twinkle = sin(uTime * 3.0 + seed * 10.0) * 0.5 + 0.5;
      // Meningkatkan kecerahan partikel
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

  // 🕳️ BLACK HOLE DISTORTION
  float d = length(baseUv);
  vec2 uv = baseUv;
  float horizon = 0.12; 
  
  if (d > horizon) {
      float distortion = (horizon * 0.4) / (d - horizon + 0.08);
      uv += normalize(baseUv) * distortion * -0.15; 
  }

  float rot = uTime * uRotationSpeed;
  uv *= mat2(cos(rot), -sin(rot), sin(rot), cos(rot));

  vec3 finalCol = vec3(0.0);

  // Render Bintang (Multi-Color & High Brightness)
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed);
    float scale = mix(14.0 * uDensity, 1.2 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.7, depth);
    finalCol += StarLayer(uv * scale + i * 123.4, i) * fade;
  }

  // Tambahkan Komet
  finalCol += Comets(baseUv, uTime);

  // 🌑 EVENT HORIZON & ACCRETION DISK
  float darkness = smoothstep(horizon, horizon + 0.04, d);
  finalCol *= darkness;
  
  float accretion = smoothstep(horizon + 0.12, horizon, d) * smoothstep(horizon - 0.02, horizon, d);
  finalCol += vec3(0.3, 0.6, 1.0) * accretion * 0.6; // Glow disk biru terang

  gl_FragColor = vec4(finalCol, uTransparent ? min(length(finalCol) * 2.2, 1.0) : 1.0);
}
`;

export default function Galaxy({
  focal = [0.5, 0.5],
  starSpeed = 0.4,
  density = 0.9,
  hueShift = 210,
  speed = 1.0,
  glowIntensity = 1.2, // Default ditingkatkan agar lebih terang
  saturation = 0.8,
  rotationSpeed = 0.03,
  transparent = true,
  resolutionScale = 0.6, // Resolusi sedikit dinaikkan agar partikel lebih tajam
  ...rest
}) {
  const ctnDom = useRef(null);
  const programRef = useRef(null);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer({ alpha: transparent, premultipliedAlpha: false, powerPreference: "high-performance" });
    const gl = renderer.gl;

    function resize() {
      renderer.setSize(ctn.offsetWidth * resolutionScale, ctn.offsetHeight * resolutionScale);
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      if (programRef.current) {
        programRef.current.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
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
  }, []);

  return <div ref={ctnDom} className="w-full h-full absolute inset-0 -z-10" {...rest} />;
}