import React, { Component } from 'react';
import { withRouter, history } from "umi";
import { Radio } from 'antd';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { BarChartOutlined, HomeOutlined } from '@ant-design/icons';
import './index.less';
import codeData from '../../services/conpany-code.js';
import * as moment from 'moment';

class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: moment().format('hh:mm A'),
      dateTime: moment().format('YYYY/MM/DD'),
      pageTitle: '车间看板',
      showBottom: true,
      bottomVal: '/main/efficiency',
      plantId: '82',
      workshopId: '2',
      keyModule: '1'
    }
  }

  componentWillMount() {
    this.setQuaryPayload()
    // const that = this
    // that.timer = setInterval(function () {
    //   const timeObj = that.getTime()
    //   that.setState({
    //     dateTime: timeObj.dateInfo,
    //     time: timeObj.timeInfo
    //   })

    // }, 60000)

  }

  componentDidMount() {
    const showT = this.props.location.pathname === "/main/dashboard"

    if (showT) {
      const title = localStorage.getItem('title')
      this.setState({
        pageTitle: title,
      })
    }

    this.setState({
      showBottom: !showT,
      bottomVal: this.props.location.pathname
    })
  }

  getTime() {
    let temp = {
      dateInfo: moment().format('YYYY/MM/DD'),
      timeInfo: moment().format('hh:mm A')
    }
    return temp
  }

  // componentWillUnmount() {
  //   clearInterval(this.timer)
  // }

  setQuaryPayload = () => {
    const { plantId, workshopId, keyModule } = this.props.location.query;

    if (workshopId && workshopId !== undefined) {
      let title = ''
      codeData.workshopArr.map(item => {
        if (workshopId === item.workshopId) {
          title = item.workshopName
        }
      })
      this.setState({
        pageTitle: title,
        workshopId: workshopId
      })

      localStorage.setItem('localWorkshopId', workshopId)
    }

    if (plantId && plantId !== undefined) {
      this.setState({
        plantId: plantId
      })

      localStorage.setItem('localPlantId', plantId)
    }

    if (keyModule && keyModule !== undefined) {
      this.setState({
        keyModule: keyModule
      })

      localStorage.setItem('localKeyModule', keyModule)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    const { pageTitle, showBottom } = this.state;

    const title = localStorage.getItem('title')

    this.state.pageTitle = title;

    if (nextProps.location.pathname === '/main/dashboard') {
      this.state.showBottom = false;
    } else {
      this.state.showBottom = true;
    }

    this.state.bottomVal = nextProps.location.pathname

    return true;
  }

  goPage(e) {
    const { plantId, workshopId, keyModule } = this.state;
    // console.log(111, e.target.value)
    history.push(`${e.target.value}?plantId=${plantId}&workshopId=${workshopId}&keyModule=${keyModule}`);
  }

  goToPage(path) {
    history.push(path);
  }

  render() {
    const { time, dateTime, pageTitle, showBottom, bottomVal, plantId, workshopId, keyModule } = this.state

    return (
      <div className="main-layout flex-col">

        <div className="main-layout-herder flex-row">

          <div className="left-time-container flex-col">
            {/* <p>{time}</p>
            <p>{dateTime}</p> */}
          </div>

          <div className="center-title-container flex-row fill-flex">
            <div className="center-title">
              {pageTitle}
            </div>
          </div>

          <div className="right-logo-container flex-row">
            {/* {showBottom ?
              <BarChartOutlined className="go-chart-icon" onClick={() => this.goToPage('/main/dashboard')} />
              :
              <HomeOutlined className="go-chart-icon" onClick={() => this.goToPage(`/main/efficiency?plantId=${plantId}&workshopId=${workshopId}&keyModule=${keyModule}`)} />
            } */}
            <span className="logo-icon iconfont icon-uih-logo"></span>
          </div>
        </div>
        <div className="main-layout-container fill-flex">
          {this.props.children}
        </div>

        {/* <TransitionGroup className="main-layout-container fill-flex">
          <CSSTransition className="transition-container" key={this.props.location.pathname} classNames="fade" timeout={300}>
            {this.props.children}
          </CSSTransition>
        </TransitionGroup> */}

        {showBottom && <div className="bottom-menu-container flex-row">
          <Radio.Group defaultValue="/main/efficiency" value={bottomVal} buttonStyle="solid" onChange={(e) => this.goPage(e)} size="large">
            <Radio.Button value="/main/efficiency">生产效率</Radio.Button>
            <Radio.Button value="/main/schedule">生产进度</Radio.Button>
            <Radio.Button value="/main/losttime">损失工时</Radio.Button>
          </Radio.Group>
        </div>}
      </div>
    );
  }
}

export default MainLayout;
