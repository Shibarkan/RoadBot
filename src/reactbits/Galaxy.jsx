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

#define NUM_LAYER 12.0

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

// ========================================================
// 1. FUNGSI HUJAN METEOR (PARTIKEL BESAR BERJATUHAN)
// ========================================================
vec3 MeteorShower(vec2 uv, float t) {
    vec3 col = vec3(0.0);
    // Bikin 10 meteor sekaligus biar rame
    for(float i = 0.0; i < 10.0; i++) { 
        float speed = 3.0 + Hash21(vec2(i, 1.0)) * 4.0; 
        float tMod = mod(t * speed + i * 7.3, 4.0);
        
        if (tMod < 1.5) {
            float p = tMod / 1.5;
            // Kordinat awal (atas) dan akhir (bawah)
            vec2 start = vec2(Hash21(vec2(i, 2.0)) * 8.0 - 4.0, 2.5 + Hash21(vec2(i, 3.0)));
            vec2 end = start - vec2(2.0, 5.0); // Jatuh miring ke kiri bawah
            vec2 pos = mix(start, end, p);
            
            float d = length(uv - pos);
            // Bikin meteornya super terang (Glow 0.1)
            col += vec3(0.7, 0.9, 1.0) * (0.1 * uGlowIntensity / d) * smoothstep(0.7, 0.0, d);
        }
    }
    return col;
}

// ========================================================
// 2. FUNGSI LAUTAN BINTANG (PARTIKEL KECIL)
// ========================================================
vec3 StarLayer(vec2 uv, float seedOffset) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);
  
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      float seed = Hash21(id + offset + seedOffset);
      float hue = fract(uHueShift / 360.0 + seed * 0.4); 
      vec3 base = hsv2rgb(vec3(hue, uSaturation, 1.0));
      
      // Bintang berkedip cepat
      float twinkle = sin(uTime * 8.0 + seed * 10.0) * 0.5 + 0.5;
      
      // Ukuran Glow bintang diperbesar (dari 0.04 jadi 0.15)
      float star = (0.15 * uGlowIntensity) / length(gv - offset);
      star *= smoothstep(0.8, 0.05, length(gv-offset));
      
      col += star * base * twinkle * fract(seed * 456.7);
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 baseUv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  float d = length(baseUv);
  
  // Black Hole Pulsation
  float pulse = sin(uTime * 2.5) * 0.008 + sin(uTime * 10.0) * 0.002;
  float horizon = 0.12 + pulse; 
  
  vec2 uv = baseUv;
  
  // Gravitational Lensing (Black hole melengkungkan cahaya)
  if (d > horizon) {
      float distortion = (horizon * 0.6) / (d - horizon + 0.04);
      uv += normalize(baseUv) * distortion * -0.25; 
  }

  // Rotasi galaksi
  float rot = uTime * uRotationSpeed;
  uv *= mat2(cos(rot), -sin(rot), sin(rot), cos(rot));

  vec3 finalCol = vec3(0.0);

  // ========================================================
  // 3. LOGIKA BINTANG BERJALAN / BERJATUHAN TERUS MENERUS
  // ========================================================
  // Menggerakkan kordinat ke arah bawah secara terus menerus seiring waktu
  vec2 fallOffset = vec2(0.3, 1.5) * uTime * 0.4; 

  // Render Grid Bintang
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed);
    
    // Skala dirapatkan biar jumlah partikel membludak
    float scale = mix(25.0 * uDensity, 2.0 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.7, depth);
    
    // Terapkan pergerakan "jatuh" ke koordinat bintang
    vec2 starUv = uv + fallOffset * (depth + 0.5);
    
    finalCol += StarLayer(starUv * scale + i * 123.4, i) * fade;
  }

  // Panggil hujan meteor
  finalCol += MeteorShower(baseUv, uTime);

  // ========================================================
  // 4. EFEK CAHAYA BLACK HOLE
  // ========================================================
  float angle = atan(baseUv.y, baseUv.x);
  float noise = sin(angle * 5.0 + uTime * 2.0) * 0.1 + 0.9;
  
  float darkness = smoothstep(horizon, horizon + 0.03, d);
  finalCol *= darkness;
  
  float accretion = smoothstep(horizon + 0.14, horizon, d) * smoothstep(horizon - 0.05, horizon, d);
  vec3 diskColor = vec3(0.3, 0.6, 1.0); 
  finalCol += diskColor * accretion * 0.8 * noise * uGlowIntensity;
  
  float outerGlow = exp(-8.0 * (d - horizon)) * smoothstep(horizon, horizon + 0.5, d);
  finalCol += vec3(0.1, 0.2, 0.5) * outerGlow * 0.5 * uGlowIntensity;

  // Render
  gl_FragColor = vec4(finalCol, uTransparent ? min(length(finalCol) * 2.2, 1.0) : 1.0);
}
`;

export default function Galaxy({
  focal = [0.5, 0.5],
  starSpeed = 0.8,      // <-- Dipercepat biar terasa efek melesatnya
  density = 2.5,        // <-- Density maksimal biar bintangnya ribuan
  hueShift = 210,
  speed = 1.0,
  glowIntensity = 2.5,  // <-- Glow dinaikkan drastis biar terang menyala
  saturation = 0.8,
  rotationSpeed = 0.03,
  transparent = true,
  resolutionScale = 0.8, // <-- Kualitas resolusi dinaikkan agar partikel kecil tetap tajam
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
      
      // StarSpeed kita kombinasikan dengan waktu biar efek zoom/warp-nya jalan
      program.uniforms.uStarSpeed.value = t * 0.0002 * starSpeed; 
      
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
