<script setup lang="ts">
import Button from "../ui/button/Button.vue";
import Slider from "../ui/slider/Slider.vue";

const props = defineProps<{
  frameUrl: string;
  title: string;
}>();

const container = ref<HTMLDivElement | null>(null);
const imageEl = ref<HTMLImageElement | null>(null);

const userImage = ref<string | null>(null);
const isDragging = ref(false);
const imagePosition = ref({ x: 0, y: 0 });
const imageScale = ref(1);
let startX = 0;
let startY = 0;
let initialX = 0;
let initialY = 0;
let initialPinchDistance = 0;
let initialPinchScale = 1;

const frameSize = ref({ width: 0, height: 0 });
const isLocked = ref(false);

watch(
  () => props.frameUrl,
  (url) => {
    if (!url) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      frameSize.value = { width: img.width, height: img.height };
    };
    img.src = url;
  },
  { immediate: true }
);

const containerStyle = computed(() => {
  const isPortrait = frameSize.value.height > frameSize.value.width;
  return {
    // Use a square aspect ratio fallback while the image is loading
    aspectRatio:
      frameSize.value.width > 0
        ? `${frameSize.value.width} / ${frameSize.value.height}`
        : "1 / 1",
    width: "100%",
    // Default to 350px width if frame size isn't known yet
    maxWidth: isPortrait || frameSize.value.width === 0 ? "350px" : "500px",
    maxHeight: "65vh",
    margin: "0 auto",
  };
});

const sliderValue = computed({
  get: () => [imageScale.value],
  set: (val) => {
    if (val && val[0] !== undefined) {
      imageScale.value = val[0];
    }
  },
});

function startDrag(e: MouseEvent | TouchEvent) {
  // Only handle left click for mouse
  if (e instanceof MouseEvent && e.button !== 0) return;

  isDragging.value = true;

  if ("touches" in e) {
    const touch1 = e.touches[0];
    if (!touch1) return;

    if (e.touches.length === 2) {
      const touch2 = e.touches[1];
      if (touch2) {
        initialPinchDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        initialPinchScale = imageScale.value;
      }
    }
    startX = touch1.clientX;
    startY = touch1.clientY;
  } else {
    startX = (e as MouseEvent).clientX;
    startY = (e as MouseEvent).clientY;
    // Prevent default for mouse to avoid selection/drag ghosting
    e.preventDefault();
  }

  initialX = imagePosition.value.x;
  initialY = imagePosition.value.y;
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return;

  if ("touches" in e) {
    // Handle pinch to zoom
    if (e.touches.length === 2 && initialPinchDistance > 0) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (touch1 && touch2) {
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        const factor = currentDistance / initialPinchDistance;
        imageScale.value = Math.max(0.1, Math.min(5, initialPinchScale * factor));
        return;
      }
    }

    // Handle single touch pan
    const touch = e.touches[0];
    if (touch) {
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      imagePosition.value = {
        x: initialX + dx,
        y: initialY + dy,
      };
    }
  } else {
    const mouseEvent = e as MouseEvent;
    const dx = mouseEvent.clientX - startX;
    const dy = mouseEvent.clientY - startY;

    imagePosition.value = {
      x: initialX + dx,
      y: initialY + dy,
    };
  }
}

function endDrag() {
  isDragging.value = false;
  initialPinchDistance = 0;
}

function handleWheel(e: WheelEvent) {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  const newScale = Math.max(0.1, Math.min(5, imageScale.value + delta));
  imageScale.value = newScale;
}

function uploadImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    userImage.value = reader.result as string;
    // Reset position when new image is uploaded
    imagePosition.value = { x: 0, y: 0 };
    imageScale.value = 1;
  };

  reader.readAsDataURL(file);
}

function downloadImage() {
  if (!userImage.value || !props.frameUrl || !imageEl.value || !container.value)
    return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const frame = new Image();
  const img = new Image();

  // Set crossOrigin to handle CORS images
  img.crossOrigin = "anonymous";
  frame.crossOrigin = "anonymous";

  frame.onload = () => {
    const canvasWidth = frame.width;
    const canvasHeight = frame.height;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    img.onload = () => {
      const imageRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth: number;
      let drawHeight: number;

      // object-contain logic
      if (imageRatio > canvasRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imageRatio;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imageRatio;
      }

      // Apply user scale (zoom)
      drawWidth *= imageScale.value;
      drawHeight *= imageScale.value;

      // Center the image
      let x = (canvasWidth - drawWidth) / 2;
      let y = (canvasHeight - drawHeight) / 2;

      // Apply user position offset
      // renderedWidth is the current DOM width of the container
      const renderedWidth = container.value!.offsetWidth;
      const displayToCanvasScale = canvasWidth / renderedWidth;

      x += imagePosition.value.x * displayToCanvasScale;
      y += imagePosition.value.y * displayToCanvasScale;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      ctx.drawImage(frame, 0, 0, canvasWidth, canvasHeight);

      // Download
      const link = document.createElement("a");
      link.download = `twibbon-${props.title}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = userImage.value!;
  };

  frame.onerror = () => {
    console.error("Failed to load frame image");
  };

  img.onerror = () => {
    console.error("Failed to load user image");
  };

  // Start loading by setting frame source first
  frame.src = props.frameUrl;
}
</script>

<template>
  <div class="flex flex-col items-center gap-8 w-full">
    <!-- Upload Section -->
    <div class="w-full max-w-md">
      <label class="block text-sm font-medium text-foreground mb-2">
        Upload Foto Anda
      </label>
      <div
        class="relative border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
        <input type="file" accept="image/*" @change="uploadImage"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div v-if="!userImage" class="flex flex-col items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-muted-foreground" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-foreground">
              Klik untuk upload foto
            </p>
            <p class="text-xs text-muted-foreground mt-1">
              PNG, JPG hingga 5MB
            </p>
          </div>
        </div>
        <div v-else class="flex items-center justify-between">
          <span class="text-sm text-foreground">Foto berhasil diupload</span>
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div class="relative">
      <div v-if="props.frameUrl" ref="container" :style="containerStyle"
        class="relative bg-white overflow-hidden rounded-2xl border-4 border-card shadow-lg bg-gradient-to-br from-muted to-muted/50">
        <!-- Invisible spacer: gives the container its natural height from the frame's aspect ratio -->
        <!-- <img v-if="props.frameUrl" :src="props.frameUrl" class="w-full h-auto invisible" aria-hidden="true" /> -->

        <img v-if="userImage" ref="imageEl" :src="userImage"
          class="absolute inset-0 w-full h-full object-contain cursor-grab" :class="{
            'cursor-grabbing': isDragging,
            'touch-none': !isLocked,
            'pointer-events-none': isLocked
          }" :style="{
            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
            transformOrigin: 'center center',
          }" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag"
          @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag" @touchcancel="endDrag" @wheel="handleWheel" />

        <img v-if="props.frameUrl" :src="props.frameUrl"
          class="pointer-events-none absolute inset-0 w-full h-full object-contain z-10" />

        <button v-if="userImage" @click.stop="userImage = null"
          class="absolute top-2 right-2 z-20 text-xs bg-background/80 backdrop-blur px-2 py-1 rounded-md text-destructive hover:text-destructive/80 shadow">
          Hapus
        </button>

        <div v-if="!userImage" class="absolute inset-0 flex items-center justify-center">
          <p class="text-sm text-muted-foreground">Upload foto untuk mulai</p>
        </div>
      </div>

      <!-- Zoom Controls (below container) -->
      <div v-if="userImage"
        class="flex items-center justify-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md mt-3 mx-auto w-fit">
        <!-- Mobile Zoom Slider -->
        <div v-if="userImage" class="w-full max-w-xs px-4 -mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-muted-foreground">Zoom Level</span>
            <span class="text-xs font-mono text-muted-foreground">{{ Math.round(imageScale * 100) }}%</span>
          </div>
          <Slider v-model="sliderValue" :min="0.1" :max="5" :step="0.01" />
        </div>
        <button @click="imageScale = Math.max(0.1, imageScale - 0.2)"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          title="Zoom Out">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <button @click="imageScale = Math.min(5, imageScale + 0.2)"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          title="Zoom In">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button @click="
          imageScale = 1;
        imagePosition = { x: 0, y: 0 };
        " class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors" title="Reset">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <div class="w-px h-6 bg-muted mx-1" />
        <button @click="isLocked = !isLocked"
          class="w-10 h-8 flex items-center justify-center rounded-md transition-colors"
          :class="isLocked ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
          :title="isLocked ? 'Buka Kunci' : 'Kunci Posisi'">
          <svg v-if="isLocked" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Download Button -->
    <Button v-if="userImage" @click="downloadImage" class="w-full max-w-xs" size="lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download Twibbon
    </Button>

    <!-- Tips -->
    <div v-if="userImage" class="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 max-w-md">
      <p class="font-medium text-foreground mb-1">💡 Tips:</p>
      <p>Geser mouse wheel untuk zoom, drag foto untuk posisi.</p>
    </div>
  </div>
</template>
