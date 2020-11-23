import React, { Component } from 'react';
import './index.less';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectId: null,
            dotArrs: []
        };
    }

    componentDidMount() {
        let arr = []
        for (var i = 1; i < 61; i++) {
            arr.push(i)
        }
        this.setState({
            dotArrs: arr
        })
    }

    handleTime(num) {
        var time = -15
        if (num > 1) {
            time = -15 - ((num - 1) * 1)
        } else {
            time = -15
        }
        console.log(time)
        return time
    }

    handleSecondTime(num) {
        var time = 0
        if (num > 1) {
            time = 0 - ((num - 1) * 1)
        } else {
            time = 0
        }
        console.log(time)
        return time
    }

    render() {
        const { dotArrs } = this.state

        return (
            <div className="main-page-container flex-col">
                <div className="top-banner-container">
                    <div className="center-banner-container flex-row">
                        <div className="loop-circle-container">
                            {
                                dotArrs.map((item, index) => {
                                    return <div key={item} className="circle" style={{
                                        animation: `animX 30s cubic-bezier(0.36, 0, 0.64, 1) ${this.handleTime(index + 1)}s infinite alternate,
                                        animY 30s cubic-bezier(0.36, 0, 0.64, 1) ${this.handleSecondTime(index + 1)}s infinite alternate,
                                        scale 60s cubic-bezier(0.36, 0, 0.64, 1) ${this.handleSecondTime(index + 1)}s infinite alternate`}}></div>
                                    // return <div key={index} className="circle" style={{ height: `${index * 1.1}px` }}></div>
                                })
                            }


                            {/* <div className="circle circle1"></div>
                            <div className="circle circle2"></div>
                            <div className="circle circle3"></div>
                            <div className="circle circle4"></div>
                            <div className="circle circle5"></div>
                            <div className="circle circle6"></div>
                            <div className="circle circle7"></div>
                            <div className="circle circle8"></div>
                            <div className="circle circle9"></div>
                            <div className="circle circle10"></div>
                            <div className="circle circle11"></div>
                            <div className="circle circle12"></div>
                            <div className="circle circle13"></div>
                            <div className="circle circle14"></div>
                            <div className="circle circle15"></div> */}
                        </div>
                        {/* <div className="ellips-container">

                            <div className="ellips">
                                {
                                    dotArrs.map((item, index) => {
                                        return <div key={item} className="dot" style={{
                                            animation: `move 60s linear infinite ${index * 0.5}s`
                                        }}></div>
                                    })
                                }
                            </div>
                        </div> */}
                        {/* <div className="ellips-container">

                            <div className="ellips">
                                {
                                    dotArrs.map((item, index) => {
                                        return <div key={item} className="dot" style={{
                                            transform: `translate(500*cos(360deg/60*${index}), 250*sin(360deg/60*${index}))`,
                                            animation: `move 20s linear infinite ${index * 0.5}s`
                                        }}></div>
                                    })
                                }
                            </div>
                        </div> */}

                    </div>
                </div>

                <div className="fill-flex bottom-container">
                    content
        </div>
            </div >
        );
    }
}

export default HomePage;
