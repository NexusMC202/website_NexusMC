"use client";

import { useEffect, useRef } from "react";

type SkinModel = "default" | "slim";

export function SkinViewer3D({ skinUrl, model, nick }: { skinUrl: string; model: SkinModel; nick: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    void import("skinview3d").then(({ SkinViewer, WalkingAnimation }) => {
      if (disposed) return;
      const size = canvas.parentElement?.getBoundingClientRect();
      const viewer = new SkinViewer({
        canvas,
        width: Math.max(260, Math.floor(size?.width ?? 360)),
        height: Math.max(390, Math.floor(size?.height ?? 500)),
        skin: skinUrl,
        model,
        enableControls: true,
        animation: new WalkingAnimation(),
        background: 0x09111f,
        fov: 46,
        zoom: 0.78,
        pixelRatio: "match-device",
      });
      viewer.autoRotate = true;
      viewer.autoRotateSpeed = 0.45;
      viewer.controls.enablePan = false;
      viewer.controls.enableZoom = true;
      viewer.controls.enableRotate = true;
      viewer.globalLight.intensity = 2.2;
      viewer.cameraLight.intensity = 0.7;
      viewer.nameTag = nick;
      if (viewer.animation) viewer.animation.speed = 0.65;

      const observer = new ResizeObserver(entries => {
        const box = entries[0]?.contentRect;
        if (box) viewer.setSize(Math.max(260, Math.floor(box.width)), Math.max(390, Math.floor(box.height)));
      });
      if (canvas.parentElement) observer.observe(canvas.parentElement);
      cleanup = () => { observer.disconnect(); viewer.dispose(); };
    });

    return () => { disposed = true; cleanup(); };
  }, [skinUrl, model, nick]);

  return <div className="skin-viewer-wrap">
    <canvas ref={canvasRef} aria-label={`Вращаемая 3D-модель скина ${nick}`} />
    <span>ЗАЖМИТЕ И ВРАЩАЙТЕ · КОЛЕСО — МАСШТАБ</span>
  </div>;
}
