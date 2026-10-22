"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Fundo do painel inteiro: as páginas do site flutuando em profundidade, como folhas de projeto
// numa prancheta, com fios de cobre finos entre elas. Mexe com o ponteiro e com a rolagem.

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export default function DepthField() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const small = W() < 768;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(small ? Math.min(window.devicePixelRatio, 1.5) : 0.8);
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf4efe7, 18, 46);
    const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 100);
    camera.position.set(0, 0, 22);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => {
      disposables.push(x);
      return x;
    };

    const group = new THREE.Group();
    scene.add(group);

    const sheetMat = track(new THREE.MeshBasicMaterial({ color: 0xfffdf9, transparent: true, opacity: 0.62, depthWrite: false }));
    const edgeMat = track(new THREE.LineBasicMaterial({ color: 0xc8764a, transparent: true, opacity: 0.28 }));
    const barMat = track(new THREE.MeshBasicMaterial({ color: 0xd9cfc0, transparent: true, opacity: 0.7, depthWrite: false }));
    const photoMat = track(new THREE.MeshBasicMaterial({ color: 0xe8d6c7, transparent: true, opacity: 0.7, depthWrite: false }));

    const COUNT = small ? 9 : 16;
    type Sheet = { g: THREE.Group; base: THREE.Vector3; speed: number; spin: number };
    const sheets: Sheet[] = [];
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < COUNT; i++) {
      const w = 3 + rnd() * 2.6;
      const h = w * (1.25 + rnd() * 0.4);
      const g = new THREE.Group();
      const shape = roundedRect(w, h, 0.25);
      const fill = new THREE.Mesh(track(new THREE.ShapeGeometry(shape)), sheetMat);
      g.add(fill);
      const edge = new THREE.LineLoop(track(new THREE.BufferGeometry().setFromPoints(shape.getPoints(24))), edgeMat);
      g.add(edge);
      // um "bloco de foto" e linhas de texto, como uma página de site
      const ph = new THREE.Mesh(track(new THREE.PlaneGeometry(w - 0.6, h * 0.34)), photoMat);
      ph.position.set(0, h / 2 - 0.3 - h * 0.17, 0.01);
      g.add(ph);
      for (let l = 0; l < 4; l++) {
        const bw = (w - 0.6) * (0.4 + rnd() * 0.55);
        const bar = new THREE.Mesh(track(new THREE.PlaneGeometry(bw, 0.12)), barMat);
        bar.position.set(-(w - 0.6) / 2 + bw / 2, h / 2 - h * 0.42 - 0.5 - l * 0.32, 0.01);
        g.add(bar);
      }
      const base = new THREE.Vector3((rnd() - 0.5) * 46, (rnd() - 0.5) * 34, -6 - rnd() * 26);
      g.position.copy(base);
      g.rotation.set((rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.9, (rnd() - 0.5) * 0.3);
      group.add(g);
      sheets.push({ g, base, speed: 0.2 + rnd() * 0.35, spin: (rnd() - 0.5) * 0.08 });
    }

    // fios de cobre entre as folhas
    const wireMat = track(new THREE.LineBasicMaterial({ color: 0xb5603a, transparent: true, opacity: 0.22 }));
    for (let i = 0; i < (small ? 5 : 9); i++) {
      const a = sheets[i % sheets.length].base;
      const b = sheets[(i * 3 + 2) % sheets.length].base;
      const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, -4 - rnd() * 3, 2));
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const line = new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40))), wireMat);
      group.add(line);
    }

    // pulso quando algo muda no site
    const rings: { m: THREE.LineLoop; mat: THREE.LineBasicMaterial; t: number }[] = [];
    const ringGeo = track(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, 1, 1).getPoints(64).map((p) => new THREE.Vector3(p.x, p.y, 0))));
    const onPulse = (e: Event) => {
      const kind = (e as CustomEvent).detail as string;
      const mat = new THREE.LineBasicMaterial({ color: kind === "publicar" ? 0x2f8a5b : kind === "aviso" ? 0xc48419 : 0xb5603a, transparent: true, opacity: 0.6 });
      const m = new THREE.LineLoop(ringGeo, mat);
      m.position.set(camera.position.x * 0.5, camera.position.y, 4);
      scene.add(m);
      rings.push({ m, mat, t: 0 });
      sheets.forEach((s) => (s.g.position.z += 1.4));
    };
    window.addEventListener("zelador:pulso", onPulse);

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let scroll = 0;
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / W() - 0.5) * 2;
      target.y = (e.clientY / H() - 0.5) * 2;
    };
    const onScroll = () => (scroll = window.scrollY || 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };
    window.addEventListener("resize", onResize);
    let tabVisible = document.visibilityState === "visible";
    const onVis = () => (tabVisible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!tabVisible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      cur.x += (target.x - cur.x) * 0.04;
      cur.y += (target.y - cur.y) * 0.04;
      camera.position.x = cur.x * 1.6;
      camera.position.y = -scroll * 0.006 - cur.y * 1.0;
      camera.lookAt(0, camera.position.y * 0.6, 0);
      sheets.forEach((s, i) => {
        const drift = reduce ? 0 : Math.sin(t * s.speed + i) * 0.5;
        s.g.position.y = s.base.y + drift + scroll * 0.002 * (1 + (s.base.z + 32) / 20);
        s.g.position.z += (s.base.z - s.g.position.z) * 0.04;
        if (!reduce) s.g.rotation.z += s.spin * dt;
      });
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.t += dt;
        r.m.scale.setScalar(1 + r.t * 14);
        r.mat.opacity = Math.max(0, 0.6 - r.t * 0.5);
        if (r.t > 1.2) {
          scene.remove(r.m);
          r.mat.dispose();
          rings.splice(i, 1);
        }
      }
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("zelador:pulso", onPulse);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      rings.forEach((r) => r.mat.dispose());
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="bg-canvas" aria-hidden="true" />;
}
