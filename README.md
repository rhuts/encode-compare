# encode-compare
Demonstrates comparison of encoding with different methods using a simple web UI.

## Description

This tool demonstrates a comparison between performing regular encoding using **AMD's** public **AMF SDK API** against first processing it with **AMD's Pre-Processing** component which is part of **AMF SDK**. The encoding method can be changed by modifying the script `transcode.cmd`.

<img src="screenshot.png" width="50%" title="screenshot">

## Getting Started

### Dependencies
This project has the following dependencies:  
- **AMD's AMF SDK 1.4.18** https://github.com/GPUOpen-LibrariesAndSDKs/AMF
- **FFMPEG** https://ffmpeg.org/  

Grab them and drop them into the `/server/bin` directory

1. Build the TranscodeHW.exe sample from https://github.com/GPUOpen-LibrariesAndSDKs/AMF
2. Download or build FFMPEG from https://ffmpeg.org/

### Run back end
1. `cd server`

2. `npm install`

3. `nodemon server`

### Run front end
1. `cd client`

2. `npm install`

3. `npm start`

### Run a comparison
1. In the new web browser that opens up (http://localhost:3000/)

2. Paste a local file path to a YUV file

3. Click the Process button and do NOT reload the page
