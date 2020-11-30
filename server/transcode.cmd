set IN_PATH=%1
echo %IN_PATH%

@echo off

set FRAMES=200
set WIDTH=3840
set HEIGHT=2160

rem INPUT to BAT is ORIGINAL video file path

rem Run transcode normally
bin\TranscodeHW.exe -input %IN_PATH% -output out_normal.h264 -width %WIDTH% -height %HEIGHT% -usage transcoding -qualitypreset speed -RateControlMethod cqp -targetBitrate 5000000 -FRAMES %FRAMES% -engine dx11 -windowmode false -threadcount 1 -BPicturesPattern 0 -IDRPeriod 20 -QPI 30 -QPP 30 -Codec h264 -EnablePreEncodeFilter false

rem Run transcode with filter
bin\TranscodeHW.exe -input %IN_PATH% -output out_filtered.h264 -width %WIDTH% -height %HEIGHT% -usage transcoding -qualitypreset speed -RateControlMethod cqp -targetBitrate 5000000 -FRAMES %FRAMES% -engine dx11 -windowmode false -threadcount 1 -BPicturesPattern 0 -IDRPeriod 20 -QPI 30 -QPP 30 -Codec h264 -EnablePreEncodeFilter true -PPEngineType opencl -PPAdaptiveFilterStrength 4 -PPAdaptiveFilterSensitivity 4

rem decode both transcoded files
bin\ffmpeg.exe -y -i out_normal.h264 out_normal.yuv
bin\ffmpeg.exe -y -i out_filtered.h264 out_filtered.yuv

rem PSNR on normal output into file returns value in file
bin\ffmpeg.exe -s:v %WIDTH%x%HEIGHT% -i out_normal.yuv -s:v %WIDTH%x%HEIGHT% -i %IN_PATH% -lavfi "psnr" -frames:v %FRAMES% -f null NUL 2> psnr_normal.txt

rem PSNR on filtered output into file returns value in file
bin\ffmpeg.exe -s:v %WIDTH%x%HEIGHT% -i out_filtered.yuv -s:v %WIDTH%x%HEIGHT% -i %IN_PATH% -lavfi "psnr" -frames:v %FRAMES% -f null NUL 2> psnr_filtered.txt

rem convert and copy normal and filtered videos to play in browser
bin\ffmpeg.exe -y -f h264 -i out_normal.h264 -c:v copy ..\client\public\out_normal.mp4
bin\ffmpeg.exe -y -f h264 -i out_filtered.h264 -c:v copy ..\client\public\out_filtered.mp4