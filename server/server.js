const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const encodeCompareRoutes = express.Router();
const PORT = 4000;
const { spawn } = require('child_process');
const bat = require.resolve('./transcode.cmd');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());


encodeCompareRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

encodeCompareRoutes.route('/process').post(function(req, res) {
    let inputFilePath = req.body.path;
    console.log('im the server processing');
    console.log(inputFilePath);

    transcode = spawn(bat, [inputFilePath])

    transcode.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    
    transcode.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    
    transcode.on('exit', function (code) {
        console.log('child process exited with code ' + code);

        // get normally encoded PSNR
        let psnrNormalFileContent;
        var psnrNormal = -1;
        try {
            psnrNormalFileContent = fs.readFileSync('psnr_normal.txt', {encoding: 'utf8'});
            console.log('=== normal PSNR:');
            psnrNormalFileContent.split(/\r?\n/)
            .forEach(function(line) {
                if (line.includes('PSNR y:')) {
                    console.log(line);
                    console.log(line.split(/\s+/)[4].split(':')[1]);
                    psnrNormal = line.split(/\s+/)[4].split(':')[1];
                }
            });
        } catch (err) {
            console.log(err);
        }

        // get filtered PSNR
        let psnrFilteredFileContent;
        var psnrFiltered = -1;
        try {
            psnrFilteredFileContent = fs.readFileSync('psnr_filtered.txt', {encoding: 'utf8'});
            console.log('=== filtered PSNR:');
            psnrFilteredFileContent.split(/\r?\n/)
            .forEach(function(line) {
                if (line.includes('PSNR y:')) {
                    console.log(line);
                    console.log(line.split(/\s+/)[4].split(':')[1]);
                    psnrFiltered = line.split(/\s+/)[4].split(':')[1];
                }
            });
        } catch (err) {
            console.log(err);
        }

        console.log('after reading files...');
        console.log(psnrNormal);
        console.log(psnrFiltered);

        // get the file sizes
        var statsNormal = fs.statSync("out_normal.h264")
        var fileSizeInBytesNormal = statsNormal.size;
        // Convert the file size to megabytes (optional)
        var fileSizeInMegabytesNormal = fileSizeInBytesNormal / (1024*1024);

        var statsFiltered = fs.statSync("out_filtered.h264")
        var fileSizeInBytesFiltered = statsFiltered.size;
        // Convert the file size to megabytes (optional)
        var fileSizeInMegabytesFiltered = fileSizeInBytesFiltered / (1024*1024);
        
        res.status(200).json({'path': inputFilePath,
                              'psnr_normal': psnrNormal,
                              'psnr_filtered': psnrFiltered,
                              'fileSize_normal': fileSizeInMegabytesNormal.toFixed(2),
                              'fileSize_filtered': fileSizeInMegabytesFiltered.toFixed(2)
                            });
    });
});

app.use('/', encodeCompareRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});