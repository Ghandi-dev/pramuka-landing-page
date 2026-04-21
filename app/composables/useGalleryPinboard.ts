import { ref, type Ref } from "vue";
import Panzoom from "@panzoom/panzoom";
import type { GalleryItem } from "~/services/galleryService";
import { useGalleryService } from "~/services/galleryService";

export const useGalleryPinboard = (data: Ref<GalleryItem[]>) => {
  const { updatePosition } = useGalleryService();

  const pinboardCanvas = ref<HTMLElement | null>(null);
  const pinboardWrapper = ref<HTMLElement | null>(null);
  let panzoomInstance: ReturnType<typeof Panzoom> | null = null;

  const dragTarget = ref<string | null>(null);
  const dragStart = ref({ x: 0, y: 0, origX: 0, origY: 0 });
  const edgeHit = ref({ top: false, right: false, bottom: false, left: false });
  let edgeHitTimeout: ReturnType<typeof setTimeout> | null = null;

  const initPinboard = () => {
    if (!import.meta.client) return
    if (!pinboardCanvas.value || !pinboardWrapper.value) return;
    if (panzoomInstance) return;

    const wrapperRect = pinboardWrapper.value.getBoundingClientRect();

    // Visual delta to center the 8000x4500 canvas
    const dx = (wrapperRect.width - 8000) / 2;
    const dy = (wrapperRect.height - 4500) / 2;

    const startScale = 0.8;

    // Divide by startScale to compensate for CSS transform-origin scale reductions
    const startX = dx / startScale;
    const startY = dy / startScale;

    panzoomInstance = Panzoom(pinboardCanvas.value, {
      maxScale: 3,
      minScale: 0.1,
      startScale: startScale,
      startX: startX,
      startY: startY,
      contain: "outside",
      cursor: "grab",
    });

    pinboardWrapper.value.addEventListener(
      "wheel",
      panzoomInstance.zoomWithWheel,
    );

    pinboardCanvas.value.addEventListener("panzoompan", () => {
      if (!pinboardWrapper.value || !pinboardCanvas.value) return;

      const wrapperRect = pinboardWrapper.value.getBoundingClientRect();
      const canvasRect = pinboardCanvas.value.getBoundingClientRect();

      const threshold = 3; // 3px margin of error due to subpixel rendering
      edgeHit.value = {
        top: canvasRect.top >= wrapperRect.top - threshold,
        right: canvasRect.right <= wrapperRect.right + threshold,
        bottom: canvasRect.bottom <= wrapperRect.bottom + threshold,
        left: canvasRect.left >= wrapperRect.left - threshold,
      };

      if (edgeHitTimeout) clearTimeout(edgeHitTimeout);
    });

    pinboardCanvas.value.addEventListener("panzoomend", () => {
      if (edgeHitTimeout) clearTimeout(edgeHitTimeout);
      edgeHitTimeout = setTimeout(() => {
        edgeHit.value = {
          top: false,
          right: false,
          bottom: false,
          left: false,
        };
      }, 500);
    });
  };

  const onPinPointerDown = (e: PointerEvent, item: GalleryItem) => {
    e.stopPropagation();
    e.preventDefault();
    if (panzoomInstance) panzoomInstance.setOptions({ disablePan: true });

    dragTarget.value = item.id;
    const scale = panzoomInstance?.getScale() || 1;
    dragStart.value = {
      x: e.clientX,
      y: e.clientY,
      origX: item.x,
      origY: item.y,
    };

    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);

    const onMove = (me: PointerEvent) => {
      const scale = panzoomInstance?.getScale() || 1;
      const dx = (me.clientX - dragStart.value.x) / scale;
      const dy = (me.clientY - dragStart.value.y) / scale;

      if (el) {
        el.style.left = `${Math.round(dragStart.value.origX + dx)}px`;
        el.style.top = `${Math.round(dragStart.value.origY + dy)}px`;
      }
    };

    const onUp = async (me: PointerEvent) => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.releasePointerCapture(me.pointerId);

      if (panzoomInstance) panzoomInstance.setOptions({ disablePan: false });

      const scale = panzoomInstance?.getScale() || 1;
      const dx = (me.clientX - dragStart.value.x) / scale;
      const dy = (me.clientY - dragStart.value.y) / scale;

      const target = data.value.find(
        (d: GalleryItem) => d.id === dragTarget.value,
      );
      if (target) {
        target.x = Math.round(dragStart.value.origX + dx);
        target.y = Math.round(dragStart.value.origY + dy);
        try {
          await updatePosition(target.id, target.x, target.y);
        } catch (err) {
          console.error("Failed to save position", err);
        }
      }
      dragTarget.value = null;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  };

  return {
    pinboardCanvas,
    pinboardWrapper,
    edgeHit,
    initPinboard,
    onPinPointerDown,
  };
};
