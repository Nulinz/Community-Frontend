import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Check, RotateCcw, ZoomIn, ZoomOut, Crop, Move } from "lucide-react";
import { toast } from "react-toastify";

/**
 * ImageCropperModal
 *
 * A reusable, layout-based image cropper modal built with native HTML5 Canvas
 * and zero external dependencies.
 *
 * Responsibilities:
 * - Allows users to frame and crop any selected image with a fixed aspect ratio (e.g., 1:1 for 512x512 logos).
 * - Provides an interactive, movable crop box with drag-to-position (mouse and touch) and size scaling.
 * - Displays a live preview of the cropped output matching the required target dimensions.
 * - Exports a real, high-quality File object (512x512 px) that seamlessly feeds into FormLayout and FormData.
 */
const ImageCropperModal = ({
  isOpen,
  onClose,
  imageFile,
  targetDimensions = { width: 512, height: 512 },
  aspectRatio = 1,
  title = "Crop & Frame Image",
  description = "Move and scale the crop box to frame your image.",
  onCropComplete,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, size: 0 });
  const [boxScale, setBoxScale] = useState(1); // 0.3 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [livePreviewUrl, setLivePreviewUrl] = useState(null);

  const containerRef = useRef(null);
  const imageElementRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, boxX: 0, boxY: 0, boxSize: 0 });

  const targetW = targetDimensions?.width || 512;
  const targetH = targetDimensions?.height || 512;
  const targetAspect = aspectRatio || (targetW / targetH) || 1;

  // ── Load and Prepare Source Image ─────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !imageFile) {
      setImageSrc(null);
      setImageLoaded(false);
      setLivePreviewUrl(null);
      return;
    }

    let objectUrl = null;
    if (typeof imageFile === "string") {
      setImageSrc(imageFile);
    } else if (imageFile instanceof Blob) {
      objectUrl = URL.createObjectURL(imageFile);
      setImageSrc(objectUrl);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isOpen, imageFile]);

  // ── Initialize Dimensions on Image Load ─────────────────────────────────
  const handleImageLoad = (e) => {
    const img = e.target;
    const natW = img.naturalWidth || 1;
    const natH = img.naturalHeight || 1;
    setNaturalSize({ width: natW, height: natH });

    updateLayoutDimensions(natW, natH);
    setImageLoaded(true);
  };

  const updateLayoutDimensions = useCallback((natW, natH) => {
    if (!containerRef.current) return;

    // Available container bounding box
    const maxContainerW = containerRef.current.clientWidth || 460;
    const maxContainerH = Math.min(window.innerHeight * 0.45, 380);

    const imgAspect = natW / natH;
    let dispW, dispH;

    if (imgAspect > maxContainerW / maxContainerH) {
      dispW = maxContainerW;
      dispH = maxContainerW / imgAspect;
    } else {
      dispH = maxContainerH;
      dispW = maxContainerH * imgAspect;
    }

    setDisplaySize({ width: dispW, height: dispH });

    // Initial crop box: Largest box matching targetAspect that fits inside dispW, dispH
    const maxBoxSize = Math.min(dispW, dispH * targetAspect);
    const initialSize = maxBoxSize * 0.9;
    const initialW = initialSize;
    const initialH = initialSize / targetAspect;

    const initialX = Math.max(0, (dispW - initialW) / 2);
    const initialY = Math.max(0, (dispH - initialH) / 2);

    setCropBox({
      x: Math.round(initialX),
      y: Math.round(initialY),
      size: Math.round(initialSize),
    });
    setBoxScale(0.9);
  }, [targetAspect]);

  // Recalculate if window resizes while open
  useEffect(() => {
    if (!isOpen || !imageLoaded || !naturalSize.width) return;

    const onResize = () => {
      updateLayoutDimensions(naturalSize.width, naturalSize.height);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen, imageLoaded, naturalSize, updateLayoutDimensions]);

  // ── Live Thumbnail Preview Generator ──────────────────────────────────────
  const updateLivePreview = useCallback(() => {
    if (!imageElementRef.current || !imageLoaded || !displaySize.width || !displaySize.height) return;

    const canvas = previewCanvasRef.current || document.createElement("canvas");
    previewCanvasRef.current = canvas;
    canvas.width = 120;
    canvas.height = Math.round(120 / targetAspect);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = naturalSize.width / displaySize.width;
    const scaleY = naturalSize.height / displaySize.height;

    const boxW = cropBox.size;
    const boxH = cropBox.size / targetAspect;

    const sx = Math.max(0, cropBox.x * scaleX);
    const sy = Math.max(0, cropBox.y * scaleY);
    const sw = Math.min(naturalSize.width - sx, boxW * scaleX);
    const sh = Math.min(naturalSize.height - sy, boxH * scaleY);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    try {
      ctx.drawImage(imageElementRef.current, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      setLivePreviewUrl(canvas.toDataURL("image/png"));
    } catch (_err) {
      // In case image hasn't fully rendered to DOM canvas yet
    }
  }, [cropBox, displaySize, imageLoaded, naturalSize, targetAspect]);

  useEffect(() => {
    if (imageLoaded) {
      updateLivePreview();
    }
  }, [cropBox, imageLoaded, updateLivePreview]);

  // ── Drag & Move Crop Box ───────────────────────────────────────────────────
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxSize: cropBox.size,
    };

    setIsDragging(true);
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxSize: cropBox.size,
    };

    setIsResizing(true);
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStartRef.current.mouseX;
      const deltaY = clientY - dragStartRef.current.mouseY;

      if (isDragging) {
        const boxW = cropBox.size;
        const boxH = cropBox.size / targetAspect;

        const maxX = Math.max(0, displaySize.width - boxW);
        const maxY = Math.max(0, displaySize.height - boxH);

        const nextX = Math.round(Math.min(maxX, Math.max(0, dragStartRef.current.boxX + deltaX)));
        const nextY = Math.round(Math.min(maxY, Math.max(0, dragStartRef.current.boxY + deltaY)));

        setCropBox((prev) => ({ ...prev, x: nextX, y: nextY }));
      } else if (isResizing) {
        // Uniform resize maintaining target aspect ratio
        const maxAvailableW = displaySize.width - dragStartRef.current.boxX;
        const maxAvailableH = (displaySize.height - dragStartRef.current.boxY) * targetAspect;
        const maxSize = Math.min(maxAvailableW, maxAvailableH);
        const minSize = 60; // minimum touchable size

        const proposedSize = dragStartRef.current.boxSize + deltaX;
        const nextSize = Math.round(Math.min(maxSize, Math.max(minSize, proposedSize)));

        setCropBox((prev) => ({ ...prev, size: nextSize }));
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, isResizing, cropBox.size, displaySize, targetAspect]);

  // ── Scale Slider Handler ──────────────────────────────────────────────────
  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setBoxScale(newScale);

    const maxBoxSize = Math.min(displaySize.width, displaySize.height * targetAspect);
    const nextSize = Math.round(Math.max(60, maxBoxSize * newScale));

    const boxH = nextSize / targetAspect;
    const maxX = Math.max(0, displaySize.width - nextSize);
    const maxY = Math.max(0, displaySize.height - boxH);

    // Keep center position when scaling
    const centerX = cropBox.x + cropBox.size / 2;
    const centerY = cropBox.y + (cropBox.size / targetAspect) / 2;

    const nextX = Math.round(Math.min(maxX, Math.max(0, centerX - nextSize / 2)));
    const nextY = Math.round(Math.min(maxY, Math.max(0, centerY - boxH / 2)));

    setCropBox({
      x: nextX,
      y: nextY,
      size: nextSize,
    });
  };

  // ── Reset to Centered Fit ─────────────────────────────────────────────────
  const handleReset = () => {
    if (!displaySize.width || !displaySize.height) return;
    const maxBoxSize = Math.min(displaySize.width, displaySize.height * targetAspect);
    const initialSize = Math.round(maxBoxSize * 0.9);
    const initialW = initialSize;
    const initialH = initialSize / targetAspect;

    setCropBox({
      x: Math.round(Math.max(0, (displaySize.width - initialW) / 2)),
      y: Math.round(Math.max(0, (displaySize.height - initialH) / 2)),
      size: initialSize,
    });
    setBoxScale(0.9);
  };

  // ── Execute Crop and Export File ──────────────────────────────────────────
  const handleApplyCrop = () => {
    if (!imageElementRef.current || !naturalSize.width || !naturalSize.height) {
      toast.error("Image is not ready to crop.");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Canvas context initialization failed.");
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const scaleX = naturalSize.width / displaySize.width;
      const scaleY = naturalSize.height / displaySize.height;

      const boxW = cropBox.size;
      const boxH = cropBox.size / targetAspect;

      const sx = Math.max(0, Math.round(cropBox.x * scaleX));
      const sy = Math.max(0, Math.round(cropBox.y * scaleY));
      const sw = Math.min(naturalSize.width - sx, Math.round(boxW * scaleX));
      const sh = Math.min(naturalSize.height - sy, Math.round(boxH * scaleY));

      ctx.drawImage(
        imageElementRef.current,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        targetW,
        targetH
      );

      const mimeType = imageFile?.type?.startsWith("image/") ? imageFile.type : "image/png";
      const baseName = imageFile?.name?.replace(/\.[^/.]+$/, "") || "cropped-logo";
      const extension = mimeType === "image/jpeg" ? "jpg" : "png";
      const outputFileName = `${baseName}_${targetW}x${targetH}.${extension}`;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error("Failed to generate cropped image file.");
            return;
          }

          const croppedFile = new File([blob], outputFileName, {
            type: mimeType,
            lastModified: Date.now(),
          });

          onCropComplete(croppedFile);
          onClose();
        },
        mimeType,
        0.95
      );
    } catch (err) {
      console.error("Cropping error:", err);
      toast.error("An error occurred while cropping the image.");
    }
  };

  if (!isOpen) return null;

  const currentBoxW = cropBox.size;
  const currentBoxH = Math.round(cropBox.size / targetAspect);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cropper-modal-title"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
              <Crop size={18} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 id="cropper-modal-title" className="text-base font-bold text-gray-900 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Main Cropper Workspace ── */}
        <div className="p-4 sm:p-5 bg-gray-900 flex flex-col items-center justify-center overflow-hidden select-none relative">
          <div
            ref={containerRef}
            className="relative flex items-center justify-center w-full max-w-full overflow-hidden rounded-lg bg-black/40"
            style={{
              height: displaySize.height ? `${displaySize.height}px` : "320px",
              width: displaySize.width ? `${displaySize.width}px` : "100%",
            }}
          >
            {imageSrc && (
              <img
                ref={imageElementRef}
                src={imageSrc}
                alt="Source to crop"
                onLoad={handleImageLoad}
                draggable={false}
                className="block pointer-events-none select-none max-w-none"
                style={{
                  width: `${displaySize.width}px`,
                  height: `${displaySize.height}px`,
                }}
              />
            )}

            {imageLoaded && displaySize.width > 0 && (
              <>
                {/* ── Dark Backdrop Overlays (Masking non-cropped areas) ── */}
                {/* Top mask */}
                <div
                  className="absolute bg-black/65 pointer-events-none transition-none"
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${cropBox.y}px`,
                  }}
                />
                {/* Bottom mask */}
                <div
                  className="absolute bg-black/65 pointer-events-none transition-none"
                  style={{
                    top: `${cropBox.y + currentBoxH}px`,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                {/* Left mask */}
                <div
                  className="absolute bg-black/65 pointer-events-none transition-none"
                  style={{
                    top: `${cropBox.y}px`,
                    left: 0,
                    width: `${cropBox.x}px`,
                    height: `${currentBoxH}px`,
                  }}
                />
                {/* Right mask */}
                <div
                  className="absolute bg-black/65 pointer-events-none transition-none"
                  style={{
                    top: `${cropBox.y}px`,
                    left: `${cropBox.x + currentBoxW}px`,
                    right: 0,
                    height: `${currentBoxH}px`,
                  }}
                />

                {/* ── Interactive Crop Box ── */}
                <div
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                  className={`absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] cursor-move select-none ${
                    isDragging ? "ring-2 ring-blue-400" : ""
                  }`}
                  style={{
                    left: `${cropBox.x}px`,
                    top: `${cropBox.y}px`,
                    width: `${currentBoxW}px`,
                    height: `${currentBoxH}px`,
                  }}
                >
                  {/* Rule-of-thirds grid */}
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>

                  {/* Corner Visual Indicators */}
                  <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border border-gray-400 rounded-xs shadow-xs pointer-events-none" />
                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border border-gray-400 rounded-xs shadow-xs pointer-events-none" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border border-gray-400 rounded-xs shadow-xs pointer-events-none" />

                  {/* Bottom-right interactive corner handle for resizing */}
                  <div
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                    className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-blue-600 rounded-xs shadow-md cursor-nwse-resize flex items-center justify-center"
                    title="Drag to resize crop area"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  </div>

                  {/* Center Drag Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 hover:opacity-100 transition">
                    <div className="bg-black/50 text-white rounded-full p-1.5 backdrop-blur-xs">
                      <Move size={14} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Toolbar: Zoom/Scale Slider & Live Preview ── */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Zoom/Scale Control */}
          <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
            <ZoomOut size={16} className="text-gray-400 shrink-0" />
            <input
              type="range"
              min="0.25"
              max="1"
              step="0.01"
              value={boxScale}
              onChange={handleScaleChange}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              title="Scale crop box size"
            />
            <ZoomIn size={16} className="text-gray-400 shrink-0" />
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition text-xs flex items-center gap-1 shrink-0 ml-1 cursor-pointer"
              title="Reset crop position"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Target Dimensions Chip & Mini Live Preview */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                {targetW} × {targetH} px
              </span>
            </div>
            {livePreviewUrl && (
              <div
                className="h-10 rounded-lg border border-gray-300 bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center p-0.5"
                style={{ width: `${Math.min(90, Math.max(40, Math.round(40 * targetAspect)))}px` }}
                title="Live preview output"
              >
                <img
                  src={livePreviewUrl}
                  alt="Live Crop Preview"
                  className="w-full h-full object-cover rounded-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Modal Footer Actions ── */}
        <div className="px-5 py-3.5 bg-white flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#171717] hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer shadow-sm"
          >
            <Check size={16} />
            Crop & Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
