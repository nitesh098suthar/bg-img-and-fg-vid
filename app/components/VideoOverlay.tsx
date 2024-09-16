"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function VideoOverlay() {
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleProcessVideo = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/process-video", { method: "POST" });
      const data = await response.json();
      if (data.output) {
        setDownloadUrl(data.output);
      }
    } catch (error) {
      console.error("Error processing video:", error);
    }
    setProcessing(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Video Overlay Processor</h1>
      <div className="mb-4">
        <Image
          height={200}
          width={200}
          src="/background.jpg"
          alt="Background"
          className="w-full max-w-2xl"
        />
      </div>
      <div className="mb-4">
        <video src="/video.mp4" controls className="w-full max-w-2xl" />
      </div>
      <button
        onClick={handleProcessVideo}
        disabled={processing}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {processing ? "Processing..." : "Create Overlay Video"}
      </button>
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="overlay-video.mp4"
          className="mt-4 text-blue-500 underline"
        >
          Download Processed Video
        </a>
      )}
    </div>
  );
}
