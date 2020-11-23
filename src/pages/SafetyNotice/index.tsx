import React, { Component } from 'react';
import { Spin } from 'antd';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './index.less';
import * as moment from 'moment';

class SafetyNotice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      time: moment().format('hh:mm A'),
      dateTime: moment().format('YYYY/MM/DD'),
    }
  }

  componentDidMount() {
    const that = this
    this.timer = setInterval(function () {
      const timeObj = that.getTime()
      that.setState({
        dateInfo: timeObj.dateInfo,
        timeInfo: timeObj.timeInfo
      })

    }, 60000)
  }

  getTime() {
    let temp = {
      dateInfo: moment().format('YYYY/MM/DD'),
      timeInfo: moment().format('hh:mm A')
    }
    return temp
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { time, dateTime } = this.state

    return (
      <div className="safety-notice-page">
        <div className="safety-top-header">

          <div className="safety-layout-herder flex-row">

            <div className="left-time-container flex-col">
              <p>{time}</p>
              <p>{dateTime}</p>
            </div>

            <div className="center-title-container flex-row fill-flex">
              <div className="center-title">
                安全告知
              </div>
            </div>

            <div className="right-logo-container flex-row">
              <span className="logo-icon iconfont icon-uih-logo"></span>
            </div>
          </div>
        </div>

        <img className="notice-page-img" src={require('../../../public/factory.png')} />

        <div className="legend-container flex-col">
          <div className="legend-col flex-row">
            <div className="legend-row flex-row">
              <div className="left-img-container flex-row">
                <img className="route-img" src={require('../../../public/route-direction.png')} />
              </div>
              <p className="fill-flex right-text">路线方向</p>
            </div>
          </div>
          <div className="legend-col flex-row">
            <div className="legend-row flex-row">
              <div className="left-img-container flex-row">
                <img className="warning-img" src={require('../../../public/warning.png')} />
              </div>
              <p className="fill-flex right-text">警告标识</p>
            </div>
          </div>
          <div className="legend-col flex-row">
            <div className="legend-row flex-row">
              <div className="left-img-container flex-row">
                <img className="no-burning-img" src={require('../../../public/no-burning.png')} />
              </div>
              <p className="fill-flex right-text">禁止烟火</p>
            </div>
            <div className="legend-row flex-row">
              <div className="left-img-container flex-row">
                <img className="forbidden-img" src={require('../../../public/forbidden.png')} />
              </div>
              <p className="fill-flex right-text">禁止XX</p>
            </div>
          </div>
          <div className="legend-col flex-row">
            <div className="legend-row flex-row">
              <div className="left-img-container flex-row">
                <img className="medical-img" src={require('../../../public/emergency-medical-station.png')} />
              </div>
              <p className="fill-flex right-text">紧急医疗站</p>
            </div>
            <div className="legend-row flex-row">
              <div className="left-img-container flex-row">
                <img className="phone-img" src={require('../../../public/120.png')} />
              </div>
              <p className="fill-flex right-text">应急电话</p>
            </div>
            <div className="legend-row flex-row">
              <div className="left-img-container flex-row">
                <img className="exit-img" src={require('../../../public/emergency-exit.png')} />
              </div>
              <p className="fill-flex right-text">紧急出口</p>
            </div>
            <div className="legend-row flex-row">
              <div className="left-img-container flex-row">
                <img className="assembly-img" src={require('../../../public/emergency-assembly-point.png')} />
              </div>
              <p className="fill-flex right-text">紧急集合点</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SafetyNotice;

