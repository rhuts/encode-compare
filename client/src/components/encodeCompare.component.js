import React, {Component} from 'react';
import axios from 'axios';

// Enable navigation prompt
// user should press cancel
// otherwise all the state data will be gone
window.onbeforeunload = () => true

export default class EncodeCompare extends Component {

    constructor(props) {
        super(props);

        this.onChangeInputFilePath = this.onChangeInputFilePath.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            path: '',
            psnr_normal: '',
            psnr_filtered: '',
            todo_completed: false,
            fileSize_normal: 0,
            fileSize_filtered: 0
        }
    }

    onChangeInputFilePath(e) {
        this.setState({
            path: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        console.log(`Form submitted:`);
        console.log(`Input file path submitted: ${this.state.path}`);

        axios.post('http://localhost:4000/process', {path : this.state.path})
            .then(res => {
                console.log(res.data);
                this.setState({
                    psnr_normal: res.data.psnr_normal,
                    psnr_filtered: res.data.psnr_filtered,
                    fileSize_normal: res.data.fileSize_normal,
                    fileSize_filtered: res.data.fileSize_filtered
                });
            });

        this.setState({
            psnr_normal: '',
            psnr_filtered: '',
            fileSize_normal: 0,
            fileSize_filtered: 0
        })
    }

    render() {

        // control when normally encoded video and statistics are shown
        let videoSourceNormal;
        if (this.state.psnr_normal) {
            videoSourceNormal = <div id="normal-output">
                                    <h4>Regular Encoding</h4>
                                    <video id="normal-video" width="100%" controls><source src="out_normal.mp4" type="video/mp4"/>Your browser does not support HTML video.</video>
                                    <p id="statistic">
                                        PSNR: {this.state.psnr_normal}
                                    </p>
                                    <p id="statistic">
                                        size: {this.state.fileSize_normal}MB
                                    </p>
                                </div>
        }

        // control when filtered video and statistics are shown
        let videoSourceFiltered;
        if (this.state.psnr_filtered) {
            videoSourceFiltered = <div id="filtered-output">
                                        <h4>Filtered before Encoding</h4>
                                        <video id="filtered-video" width="100%" controls><source src="out_filtered.mp4" type="video/mp4"/>Your browser does not support HTML video.</video>
                                        <p id="statistic">
                                            Filtered PSNR: {this.state.psnr_filtered}
                                        </p>
                                        <p id="statistic">
                                            Filtered size: {this.state.fileSize_filtered}MB
                                        </p>
                                    </div>
        }

        return (
            <div>
                <br></br>
                <h3>Encode Compare</h3>

                <p>
                    NOTE: reloading page cancels processing...
                </p>

                <div id="leftSpace">
                    Paste local YUV file path:
                </div>

                <form onSubmit={this.onSubmit}>
                    <div id="leftSpace">
                            <input  type="text"
                                    id="inputPath"
                                    className="form-control"
                                    value={this.state.path}
                                    onChange={this.onChangeInputFilePath}
                                    />
                    </div>

                    <div>
                        <input id="submitBtn" type="submit" value="Process" className="btn btn-primary" />
                    
                            {videoSourceNormal}
                            {videoSourceFiltered}
                    </div>
                </form>
            </div>
        )
    }
}