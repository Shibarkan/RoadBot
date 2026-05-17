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

// OPTIMASI: Kurangi jumlah layer bintang agar partikelnya lebih sedikit
#define NUM_LAYER 2.0 

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

// Fungsi StarLayer dengan pendaran yang lebih redup
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
      // Twinkle lebih lambat agar tidak terlalu menyala
      float twinkle = sin(uTime * 1.5 + seed * 10.0) * 0.5 + 0.5;
      // Kurangi radius pendaran bintang dasar
      float star = (0.04 * uGlowIntensity) / length(gv - offset);
      star *= smoothstep(0.6, 0.05, length(gv-offset));
      col += star * base * twinkle * fract(seed * 456.7);
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  // baseUv adalah koordinat UV asli yang berpusat di uFocal
  vec2 baseUv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  // -----------------------------------------------------------
  // LOGIKA BLACK HOLE (GRAVITATIONAL LENSING)
  // -----------------------------------------------------------
  float d = length(baseUv); // Jarak dari pusat (focal point)
  
  float horizonRadius = 0.08; 
  float lensingRadius = 0.5; 
  
  // Salinan UV untuk dimodifikasi oleh gravitasi
  vec2 rayTracedUv = baseUv;

  if (d > horizonRadius && d < lensingRadius) {
    // Hitung seberapa kuat distorsi berdasarkan jarak.
    float normalizeDist = (d - horizonRadius) / (lensingRadius - horizonRadius);
    
    // Rumus distorsi: menciptakan efek "tersedot" yang halus namun kuat di dekat horizon
    float distortion = pow(1.0 - normalizeDist, 3.0) * 0.7; // Pangkat 3 agar efek drop-off-nya cantik
    
    // Geser koordinat sampel bintang mendekati pusat lubang hitam
    rayTracedUv = baseUv - normalize(baseUv) * distortion;
  }

  // Terapkan rotasi otomatis pada koordinat yang sudah didistorsi
  float rotAngle = uTime * uRotationSpeed;
  mat2 rotMat = mat2(cos(rotAngle), -sin(rotAngle), sin(rotAngle), cos(rotAngle));
  vec2 finalUv = rotMat * rayTracedUv;

  vec3 col = vec3(0.0);

  // Render Bintang menggunakan finalUv (yang melengkung)
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(finalUv * scale + i * 123.4, i) * fade;
  }

  // -----------------------------------------------------------
  // OPTIMASI: DIPEREDUP VISUAL BLACK HOLE (Interstellar Style - Redup)
  // -----------------------------------------------------------
  
  // Gelap mutlak di inti (Event Horizon) - smoothstep dipersingkat agar batasnya tajam
  float darkness = smoothstep(horizonRadius, horizonRadius + 0.01, d);
  col *= darkness;

  // 1. Soft Outer Dust Glow (Pendaran debu luar - Merah bata redup)
  // Membuat integrasi yang halus antara galaksi dan cincin lubang hitam
  float dustGlow = exp(-6.0 * (d - horizonRadius)) * smoothstep(horizonRadius, horizonRadius + lensingRadius, d);
  vec3 dustCol = vec3(0.4, 0.1, 0.0); // Diperedup warna merah tuanya

  // 2. Swirling Accretion Disk (Cincin Gas Panas Berputar - Oranye redup)
  // Menambahkan tekstur berputar pada cincin utama
  float angle = atan(baseUv.y, baseUv.x);
  // Bikin pola pusaran berdasarkan sudut dan waktu
  float swirl = sin(angle * 10.0 - uTime * 3.0) * 0.1 + 0.9; 

  // Definisikan pita cincinnya (sedikit lebih tebal dari sebelumnya untuk estetika)
  float diskThreshold = horizonRadius + 0.15;
  float accretionBand = smoothstep(diskThreshold, horizonRadius + 0.01, d) * smoothstep(horizonRadius - 0.02, horizonRadius + 0.01, d);
  
  vec3 diskCol = vec3(0.8, 0.5, 0.1); // Diperedup warna kuning keemasannya

  // Gabungkan Glow lembut dan Disk menyala - Intensitas diturunkan signifikan
  col += dustCol * dustGlow * 0.2 * uGlowIntensity;
  col += diskCol * accretionBand * 0.5 * swirl * uGlowIntensity;

  // Perhitungan Alpha untuk transparansi
  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.15, alpha); // Membuat latar belakang lebih bersih
    gl_FragColor = vec4(col, min(alpha, 1.0));
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

export default function Galaxy({
  focal = [0.5, 0.5],
  starSpeed = 0.5,
  // Kurangi kerapatan bintang dasar
  density = 0.6, 
  hueShift = 140,
  speed = 1.0,
  // Glow Intensitas diturunkan agar lebih redup
  glowIntensity = 0.8, 
  saturation = 0.0,
  twinkleIntensity = 0.2,
  // Default kecepatan rotasi diturunkan agar efek pusaran lebih terasa "megah" lambat
  rotationSpeed = 0.02, 
  transparent = true,
  resolutionScale = 0.5, 
  ...rest
}) {
  const ctnDom = useRef(null);
  const programRef = useRef(null);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer({ alpha: transparent, premultipliedAlpha: false });
    const gl = renderer.gl;

    function resize() {
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
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      // Pelambat zoom out untuk kesan lebih sunyi
      program.uniforms.uStarSpeed.value = t * 0.00005 * starSpeed; 
      renderer.render({ scene: mesh });
    };

    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);
    resize(); 

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
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
      u.uTwinkleIntensity.value = twinkleIntensity;
      u.uRotationSpeed.value = rotationSpeed;
    }
  }, [density, hueShift, speed, glowIntensity, saturation, twinkleIntensity, rotationSpeed]);

  return <div ref={ctnDom} className="w-full h-full absolute inset-0 -z-10" {...rest} />;
}