<script setup lang="ts">
import Button from "../ui/button/Button.vue";

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

function startDrag(e: MouseEvent) {
  e.preventDefault();
  isDragging.value = true;
  startX = e.clientX;
  startY = e.clientY;
  initialX = imagePosition.value.x;
  initialY = imagePosition.value.y;
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  imagePosition.value = {
    x: initialX + dx,
    y: initialY + dy,
  };
}

function endDrag() {
  isDragging.value = false;
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
  if (!userImage.value || !props.frameUrl || !imageEl.value) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const size = 1080;
  canvas.width = size;
  canvas.height = size;

  const img = new Image();
  const frame = new Image();

  // Set crossOrigin to handle CORS images
  img.crossOrigin = "anonymous";
  frame.crossOrigin = "anonymous";

  // Get actual rendered dimensions from DOM
  const renderedWidth = imageEl.value.offsetWidth;
  const renderedHeight = imageEl.value.offsetHeight;

  img.onload = () => {
    // Calculate scale to fit image in canvas (same as CSS object-contain)
    const containerRatio = size / size; // square canvas
    const imageRatio = img.width / img.height;

    let drawWidth: number;
    let drawHeight: number;

    if (imageRatio > containerRatio) {
      drawWidth = size;
      drawHeight = size / imageRatio;
    } else {
      drawHeight = size;
      drawWidth = size * imageRatio;
    }

    // Apply user scale (zoom)
    drawWidth *= imageScale.value;
    drawHeight *= imageScale.value;

    // Center the image
    let x = (size - drawWidth) / 2;
    let y = (size - drawHeight) / 2;

    // Apply user position offset (convert from display pixels to canvas scale)
    const displayToCanvasScale = size / renderedWidth;
    x += imagePosition.value.x * displayToCanvasScale;
    y += imagePosition.value.y * displayToCanvasScale;

    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    // Now load and draw frame
    frame.src = props.frameUrl;
  };

  frame.onload = () => {
    // Draw frame on top
    ctx.drawImage(frame, 0, 0, size, size);

    // Download
    const link = document.createElement("a");
    link.download = `twibbon-${props.title}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  frame.onerror = () => {
    console.error("Failed to load frame image");
  };

  img.onerror = () => {
    console.error("Failed to load user image");
  };

  // Start loading
  img.src = userImage.value;
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
        class="relative border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept="image/*"
          @change="uploadImage"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div v-if="!userImage" class="flex flex-col items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
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
      <div
        ref="container"
        class="relative bg-white w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] overflow-hidden rounded-2xl border-4 border-card shadow-lg bg-gradient-to-br from-muted to-muted/50"
      >
        <img
          v-if="userImage"
          ref="imageEl"
          :src="userImage"
          class="absolute inset-0 w-full h-full object-contain cursor-grab"
          :class="{ 'cursor-grabbing': isDragging }"
          :style="{
            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
            transformOrigin: 'center center',
          }"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @wheel="handleWheel"
        />

        <img
          v-if="props.frameUrl"
          :src="props.frameUrl"
          class="pointer-events-none absolute inset-0 w-full h-full object-contain z-10"
        />

        <button
          v-if="userImage"
          @click.stop="userImage = null"
          class="absolute top-2 right-2 z-20 text-xs bg-background/80 backdrop-blur px-2 py-1 rounded-md text-destructive hover:text-destructive/80 shadow"
        >
          Hapus
        </button>

        <div
          v-if="!userImage"
          class="absolute inset-0 flex items-center justify-center"
        >
          <p class="text-sm text-muted-foreground">Upload foto untuk mulai</p>
        </div>
      </div>

      <!-- Zoom Controls -->
      <div
        v-if="userImage"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md"
      >
        <button
          @click="imageScale = Math.max(0.1, imageScale - 0.2)"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          title="Zoom Out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>
        <button
          @click="imageScale = Math.min(5, imageScale + 0.2)"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          title="Zoom In"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <button
          @click="
            imageScale = 1;
            imagePosition = { x: 0, y: 0 };
          "
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          title="Reset"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Download Button -->
    <Button
      v-if="userImage"
      @click="downloadImage"
      class="w-full max-w-xs"
      size="lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Download Twibbon
    </Button>

    <!-- Tips -->
    <div
      v-if="userImage"
      class="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 max-w-md"
    >
      <p class="font-medium text-foreground mb-1">💡 Tips:</p>
      <p>Geser mouse wheel untuk zoom, drag foto untuk posisi.</p>
    </div>
  </div>
</template>
