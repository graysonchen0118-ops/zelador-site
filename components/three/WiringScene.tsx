"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { img, PH } from "@/lib/photos";

// A Home da Cumaru desmontada em camadas, cada seção ligada por fios de cobre ao quadro de classes.
// Os fios soltos são as classes sem uso ou repetidas: somem à medida que o quadro é limpo.

type Props = { loose: number; focus?: "page" | "panel" };

const MAX_LOOSE = 18;

export default function WiringScene({ loose, focus = "page" }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const looseRef = useRef(loose);
  looseRef.current = loose;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const W = () => mount.clientWidth || 800;
    const H = () => mount.clientHeight || 400;
    const small = () => W() < 768;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small() ? 1.5 : 2));
    renderer.setSize(W(), H());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !small();
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x121d26, 14, 30);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(34, W() / H(), 0.1, 100);

    const disposables: { dispose: () => void }[] = [envTex, pmrem];
    const track = <T extends { dispose: () => void }>(x: T) => {
      disposables.push(x);
      return x;
    };

    // ---------- luz ----------
    scene.add(new THREE.AmbientLight(0xfff1e6, 0.35));
    const key = new THREE.DirectionalLight(0xffe2c8, 2.1);
    key.position.set(5, 7, 8);
    key.castShadow = !small();
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 8;
    key.shadow.camera.bottom = -8;
    key.shadow.radius = 4;
    scene.add(key);
    const rim = new THREE.PointLight(0xd98a5b, 18, 18);
    rim.position.set(-4, -1, 4);
    scene.add(rim);

    // ---------- materiais ----------
    const paper = track(new THREE.MeshPhysicalMaterial({ color: 0xf4efe7, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4 }));
    const ink = track(new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.7 }));
    const inkSoft = track(new THREE.MeshStandardMaterial({ color: 0xb9ada0, roughness: 0.8 }));
    const darkSlab = track(new THREE.MeshPhysicalMaterial({ color: 0x241e19, roughness: 0.5, clearcoat: 0.4 }));
    const copperSlab = track(new THREE.MeshPhysicalMaterial({ color: 0xa5502c, roughness: 0.35, metalness: 0.2, clearcoat: 0.6 }));
    const copper = track(new THREE.MeshStandardMaterial({ color: 0xc8764a, metalness: 0.85, roughness: 0.28 }));
    const metal = track(new THREE.MeshStandardMaterial({ color: 0x24333e, metalness: 0.65, roughness: 0.35 }));
    const breakerOk = track(new THREE.MeshPhysicalMaterial({ color: 0xe9e2d6, roughness: 0.4, clearcoat: 0.5 }));

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const photo = (id: string, w: number, h: number) => {
      const t = loader.load(img(id, w, h));
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return track(t);
    };

    // ---------- a página em camadas ----------
    const root = new THREE.Group();
    scene.add(root);
    const page = new THREE.Group();
    root.add(page);

    const PW = 4.2;
    type Sec = { name: string; h: number; mat: THREE.Material; build?: (g: THREE.Group, h: number) => void };
    const lines = (g: THREE.Group, h: number, mat: THREE.Material, rows: number[], x0 = -PW / 2 + 0.35) => {
      rows.forEach((w, i) => {
        const m = new THREE.Mesh(track(new THREE.BoxGeometry(w, 0.07, 0.03)), mat);
        m.position.set(x0 + w / 2, h / 2 - 0.3 - i * 0.16, 0.06);
        g.add(m);
      });
    };
    const sections: Sec[] = [
      {
        name: "menu",
        h: 0.36,
        mat: paper,
        build: (g) => {
          const logo = new THREE.Mesh(track(new THREE.BoxGeometry(0.6, 0.1, 0.03)), ink);
          logo.position.set(-PW / 2 + 0.55, 0, 0.06);
          g.add(logo);
          [0, 1, 2, 3].forEach((i) => {
            const l = new THREE.Mesh(track(new THREE.BoxGeometry(0.32, 0.06, 0.03)), inkSoft);
            l.position.set(0.1 + i * 0.42, 0, 0.06);
            g.add(l);
          });
        },
      },
      {
        name: "abertura",
        h: 1.75,
        mat: paper,
        build: (g, h) => {
          const p = new THREE.Mesh(track(new THREE.PlaneGeometry(PW - 0.12, h - 0.12)), track(new THREE.MeshStandardMaterial({ map: photo(PH.forroMadeira, 900, 380), roughness: 0.6 })));
          p.position.z = 0.046;
          g.add(p);
          const t = new THREE.Mesh(track(new THREE.BoxGeometry(2.2, 0.16, 0.03)), track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })));
          t.position.set(-PW / 2 + 1.4, -h / 2 + 0.55, 0.08);
          g.add(t);
          const b = new THREE.Mesh(track(new THREE.BoxGeometry(0.8, 0.18, 0.05)), copperSlab);
          b.position.set(-PW / 2 + 0.7, -h / 2 + 0.28, 0.08);
          g.add(b);
        },
      },
      { name: "faixa", h: 0.32, mat: copperSlab },
      {
        name: "projetos",
        h: 1.35,
        mat: paper,
        build: (g, h) => {
          lines(g, h, ink, [1.1]);
          const ids = [PH.salaMata, PH.varandaJantar, PH.salaLaranja];
          ids.forEach((id, i) => {
            const tile = new THREE.Mesh(track(new THREE.BoxGeometry(1.14, 0.78, 0.05)), [
              paper,
              paper,
              paper,
              paper,
              track(new THREE.MeshStandardMaterial({ map: photo(id, 320, 220), roughness: 0.6 })),
              paper,
            ]);
            tile.position.set(-PW / 2 + 0.72 + i * 1.38, -0.12, 0.08);
            tile.castShadow = !small();
            g.add(tile);
          });
        },
      },
      {
        name: "depoimentos",
        h: 0.95,
        mat: darkSlab,
        build: (g, h) => {
          [0, 1, 2].forEach((i) => {
            const q = new THREE.Mesh(track(new THREE.BoxGeometry(1.15, 0.55, 0.04)), track(new THREE.MeshStandardMaterial({ color: 0x3a3029, roughness: 0.6 })));
            q.position.set(-PW / 2 + 0.72 + i * 1.38, -0.05, 0.06);
            g.add(q);
          });
          lines(g, h, inkSoft, [0.9]);
        },
      },
      {
        name: "rodapé",
        h: 0.6,
        mat: darkSlab,
        build: (g, h) => lines(g, h, inkSoft, [0.7, 0.5, 0.6]),
      },
    ];

    const slabs: { g: THREE.Group; baseZ: number; baseY: number; h: number }[] = [];
    let y = 2.55;
    sections.forEach((s, i) => {
      const g = new THREE.Group();
      const slab = new THREE.Mesh(track(new THREE.BoxGeometry(PW, s.h, 0.08)), s.mat);
      slab.castShadow = !small();
      slab.receiveShadow = !small();
      g.add(slab);
      s.build?.(g, s.h);
      const cy = y - s.h / 2;
      const z = i * 0.42;
      g.position.set(0, cy, z);
      page.add(g);
      slabs.push({ g, baseZ: z, baseY: cy, h: s.h });
      y -= s.h + 0.16;
    });

    // ---------- o quadro de classes ----------
    const panel = new THREE.Group();
    panel.position.set(4.1, 0.1, 0.9);
    panel.rotation.y = -0.35;
    root.add(panel);
    const box = new THREE.Mesh(track(new THREE.BoxGeometry(1.7, 3.1, 0.3)), metal);
    box.castShadow = !small();
    panel.add(box);
    const door = new THREE.Mesh(track(new THREE.BoxGeometry(1.5, 2.9, 0.02)), track(new THREE.MeshStandardMaterial({ color: 0x1b2730, metalness: 0.5, roughness: 0.5 })));
    door.position.z = 0.16;
    panel.add(door);

    const breakers: { m: THREE.Mesh; mat: THREE.MeshStandardMaterial; pos: THREE.Vector3; bad: boolean }[] = [];
    const geoBreaker = track(new THREE.BoxGeometry(0.34, 0.26, 0.14));
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 3; c++) {
        const bad = (r * 3 + c) % 4 === 1;
        const mat = bad
          ? track(new THREE.MeshStandardMaterial({ color: 0xc48419, emissive: 0xc48419, emissiveIntensity: 0.6, roughness: 0.4 }))
          : (breakerOk as unknown as THREE.MeshStandardMaterial);
        const m = new THREE.Mesh(geoBreaker, mat);
        m.position.set(-0.46 + c * 0.46, 1.2 - r * 0.4, 0.22);
        panel.add(m);
        const pos = new THREE.Vector3();
        breakers.push({ m, mat, pos, bad });
      }
    }
    root.updateMatrixWorld(true);
    breakers.forEach((b) => b.m.getWorldPosition(b.pos));

    // ---------- fios ----------
    const toRoot = (v: THREE.Vector3) => root.worldToLocal(v.clone());
    const slabEdge = (i: number, t: number) => {
      const s = slabs[i];
      const v = new THREE.Vector3(PW / 2, s.baseY + (t - 0.5) * s.h * 0.8, s.baseZ);
      return v;
    };
    const tube = (pts: THREE.Vector3[], mat: THREE.Material, r = 0.02) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const m = new THREE.Mesh(track(new THREE.TubeGeometry(curve, 48, r, 6, false)), mat);
      root.add(m);
      return m;
    };

    // fios ligados: cada seção a um disjuntor com etiqueta
    const okBreakers = breakers.filter((b) => !b.bad);
    for (let i = 0; i < 11; i++) {
      const si = i % slabs.length;
      const a = slabEdge(si, 0.25 + ((i * 37) % 50) / 100);
      const b = toRoot(okBreakers[(i * 5) % okBreakers.length].pos);
      const mid = a.clone().lerp(b, 0.5);
      mid.y -= 0.5 + (i % 3) * 0.2;
      mid.z += 0.4;
      tube([a, a.clone().add(new THREE.Vector3(0.4, 0, 0)), mid, b.clone().add(new THREE.Vector3(-0.3, 0, 0)), b], copper, 0.018);
    }

    // fios soltos: classes sem uso ou repetidas
    const looseWires: { mesh: THREE.Mesh; spark: THREE.Mesh; mat: THREE.MeshStandardMaterial; o: number; phase: number }[] = [];
    const sparkGeo = track(new THREE.SphereGeometry(0.05, 12, 12));
    for (let i = 0; i < MAX_LOOSE; i++) {
      const si = (i * 7) % slabs.length;
      const a = slabEdge(si, ((i * 53) % 90) / 100 + 0.05);
      const len = 0.9 + ((i * 31) % 10) / 10;
      const end = a.clone().add(new THREE.Vector3(len * 0.9, -0.6 - ((i * 13) % 7) / 10, 0.5 + ((i * 17) % 9) / 10));
      const mid = a.clone().lerp(end, 0.5);
      mid.y -= 0.35;
      const mat = track(
        new THREE.MeshStandardMaterial({ color: 0xc48419, emissive: 0xe0962a, emissiveIntensity: 0.7, metalness: 0.5, roughness: 0.35, transparent: true, opacity: 1 }),
      );
      const mesh = tube([a, a.clone().add(new THREE.Vector3(0.3, 0.05, 0)), mid, end], mat, 0.016);
      const spark = new THREE.Mesh(sparkGeo, mat);
      spark.position.copy(end);
      root.add(spark);
      looseWires.push({ mesh, spark, mat, o: 1, phase: i * 0.7 });
    }

    // ---------- pulso ----------
    const rings: { m: THREE.Mesh; mat: THREE.MeshBasicMaterial; t: number }[] = [];
    const ringGeo = track(new THREE.TorusGeometry(1, 0.02, 8, 64));
    const onPulse = (e: Event) => {
      const kind = (e as CustomEvent).detail as string;
      const color = kind === "publicar" ? 0x6ad4a0 : kind === "aviso" ? 0xe0962a : 0xd98a5b;
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const m = new THREE.Mesh(ringGeo, mat);
      m.position.copy(panel.position);
      m.position.z += 0.3;
      root.add(m);
      rings.push({ m, mat, t: 0 });
      breakers.forEach((b) => b.m.scale.setScalar(1.25));
    };
    window.addEventListener("zelador:pulso", onPulse);

    // ---------- câmera e enquadramento ----------
    const frame = () => {
      const w = W();
      const h = H();
      camera.aspect = w / h;
      camera.position.set(0, 0.6, 13.5);
      if (window.innerWidth < 900) {
        // empilhado: a cena ocupa a faixa de baixo do cartão, centralizada
        const visW = 2 * 13.5 * Math.tan(THREE.MathUtils.degToRad(17)) * camera.aspect;
        const s = Math.min(0.78, visW / 10.4);
        root.scale.setScalar(s);
        root.position.set(-1.35 * s, 0.75 * s, 0);
      } else if (focus === "panel") {
        root.scale.setScalar(0.74);
        root.position.set(w > 1000 ? 3.2 : 2.6, -0.1, 0);
      } else {
        root.position.set(w > 1000 ? 1.9 : 1.2, -0.2, 0);
        root.scale.setScalar(w > 1000 ? 0.86 : 0.74);
      }
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    frame();
    const ro = new ResizeObserver(frame);
    ro.observe(mount);

    // ---------- ponteiro, visibilidade ----------
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let onScreen = true;
    const io = new IntersectionObserver(([en]) => (onScreen = en.isIntersecting), { threshold: 0 });
    io.observe(mount);
    let tabVisible = document.visibilityState === "visible";
    const onVis = () => (tabVisible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    let raf = 0;
    let frames = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!onScreen || !tabVisible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      frames += 1;
      (window as unknown as { __zeladorFrames?: number }).__zeladorFrames = frames;

      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      const sway = reduce ? 0 : Math.sin(t * 0.25) * 0.08;
      root.rotation.y = -0.5 + cur.x * 0.18 + sway;
      root.rotation.x = 0.1 + cur.y * 0.08;

      slabs.forEach((s, i) => {
        const f = reduce ? 0 : Math.sin(t * 0.8 + i * 0.9) * 0.05;
        s.g.position.z = s.baseZ + f;
      });

      const want = Math.max(0, Math.min(MAX_LOOSE, looseRef.current));
      looseWires.forEach((w, i) => {
        const target = i < want ? 1 : 0;
        w.o += (target - w.o) * Math.min(1, dt * 3);
        w.mat.opacity = w.o;
        w.mat.emissiveIntensity = 0.45 + (reduce ? 0.2 : (Math.sin(t * 3 + w.phase) + 1) * 0.35);
        const visible = w.o > 0.02;
        w.mesh.visible = visible;
        w.spark.visible = visible;
        w.spark.scale.setScalar(0.6 + w.o * (reduce ? 0.6 : 0.6 + Math.sin(t * 5 + w.phase) * 0.3));
      });

      // os disjuntores problemáticos ficam em ordem quando não há fio solto
      const clean = want === 0;
      breakers.forEach((b) => {
        b.m.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
        if (b.bad) {
          b.mat.emissiveIntensity += ((clean ? 0 : 0.6) - b.mat.emissiveIntensity) * 0.05;
          b.mat.color.lerp(new THREE.Color(clean ? 0x2f8a5b : 0xc48419), 0.05);
        }
      });

      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.t += dt;
        const s = 0.4 + r.t * 3.2;
        r.m.scale.setScalar(s);
        r.mat.opacity = Math.max(0, 0.9 - r.t * 0.9);
        if (r.t > 1) {
          root.remove(r.m);
          r.mat.dispose();
          rings.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("zelador:pulso", onPulse);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      ro.disconnect();
      rings.forEach((r) => r.mat.dispose());
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [focus]);

  return <div ref={mountRef} className="hero-scene" aria-hidden="true" />;
}
