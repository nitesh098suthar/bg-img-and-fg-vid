import { exec } from "child_process";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const timeAndDate = new Date().getTime();
    console.log(timeAndDate);

    const inputVideo = path.join(process.cwd(), "public", "video.mp4");
    const inputImage = path.join(process.cwd(), "public", "background.jpg");
    const outputPath = path.join(process.cwd(), "public", `${timeAndDate}.mp4`);
    // const fontPath = path.join(process.cwd(), "public", "Roboto-Regular.ttf");

    const escapePath = (filePath: string) => filePath.replace(/\\/g, "/");
    const ffmpegCommand = `ffmpeg -i "${escapePath(
      inputVideo
    )}" -i "${escapePath(
      inputImage
    )}" -filter_complex "[0]scale=200:200[bg];[1][bg]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2,drawtext=fontfile=${escapePath(
      "public/Roboto-Regular.ttf"
    )}:text='Your text here':fontcolor=black:fontsize=24:x=(w-text_w)/2:y=h-text_h-30" -c:a copy "${escapePath(
      outputPath
    )}"`;

    console.log("Executing command:", ffmpegCommand);

    const { stdout, stderr } = await execPromise(ffmpegCommand);

    if (stderr) {
      console.error("FFmpeg stderr:", stderr);
    }

    if (stdout) {
      console.log("FFmpeg stdout:", stdout);
    }

    // Check if the output file exists and has a non-zero size
    const stats = await fs.stat(outputPath);
    if (stats.size === 0) {
      throw new Error("Output file is empty");
    }

    return NextResponse.json({ output: `/${path.basename(outputPath)}` });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Failed to process video", details: (error as Error).message },
      { status: 500 }
    );
  }
}
