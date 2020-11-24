import React, { Component } from 'react';
import './index.less';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dotArrs: [], //  发光点数
      looptime: 18, //  转一圈的时间
    };
  }

  componentDidMount() {
    let arr = [];
    for (var i = 1; i < 71; i++) {
      arr.push(i);
    }
    this.setState({
      dotArrs: arr,
    });
  }

  handleTime(num) {
    const { dotArrs, looptime } = this.state;

    const avatime = (looptime * 2) / dotArrs.length;

    var time = -(looptime / 2);

    if (num > 1) {
      time = -(looptime / 2) - (num - 1) * avatime;
    } else {
      time = -(looptime / 2);
    }
    // console.log(time)
    return time;
  }

  handleSecondTime(num) {
    const { dotArrs, looptime } = this.state;

    const avatime = (looptime * 2) / dotArrs.length;

    var time = 0;
    if (num > 1) {
      time = 0 - (num - 1) * avatime;
    } else {
      time = 0;
    }
    // console.log(time)
    return time;
  }

  generateRandom(index) {
    const temp = Math.floor(Math.random() * 10);
    let num = 0;

    if (temp >= 5) {
      num = temp;
    } else {
      num = -temp;
    }

    return num;
  }

  generateSizeRandom() {
    const temp = Math.floor(Math.random() * 12);
    let num = 5;

    if (temp <= 4) {
      num = 6;
    } else if (4 < temp <= 8) {
      num = 5;
    } else {
      num = 4;
    }

    return num;
  }

  render() {
    const { dotArrs, looptime } = this.state;

    return (
      <div className="main-page-container flex-col">
        <div className="top-banner-container">
          <img
            className="bg-img-background"
            src={require('../../../public/bg.png')}
          ></img>
          <div className="center-banner-container flex-row">
            <img
              className="bg-img"
              src={require('../../../public/bg.png')}
            ></img>
            <div className="loop-circle-container">
              {dotArrs.map((item, index) => {
                const size = this.generateSizeRandom();
                return (
                  <div
                    key={item}
                    className="circle"
                    style={{
                      animation: `animX ${looptime}s cubic-bezier(0.36, 0, 0.64, 1) ${this.handleTime(
                        index + 1,
                        looptime,
                      )}s infinite alternate,
                                        animY ${looptime}s cubic-bezier(0.36, 0, 0.64, 1) ${this.handleSecondTime(
                        index + 1,
                        looptime,
                      )}s infinite alternate,
                                        scale ${looptime *
                                          2}s cubic-bezier(0.36, 0, 0.64, 1) ${this.handleSecondTime(
                        index + 1,
                        looptime,
                      )}s infinite alternate`,
                      marginTop: `${this.generateRandom(index)}px`,
                      marginLeft: `${this.generateRandom(index)}px`,
                      width: `${size}px`,
                      height: `${size}px`,
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="fill-flex bottom-container">content</div>
      </div>
    );
  }
}

export default HomePage;
