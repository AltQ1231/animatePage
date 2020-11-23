import { connect } from 'umi';
import React, { Component } from 'react';
import { Menu, Dropdown, Button, Carousel, Switch, Empty, Spin } from 'antd';
import mockData from './datas.js';
import codeData from '../../services/conpany-code.js';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from 'bizcharts';
import DataSet from "@antv/data-set";
import './index.less';

function getFillAttrs(cfg) {
  const attrs = Util.mix(
    {
      fill: cfg.color,
      fillOpacity: cfg.opacity
    }
  );
  return attrs;
}

function getRectPath(points) {
  const path = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    if (point) {
      const action = i === 0 ? "M" : "L";
      path.push([action, point.x, point.y + 0.004]);
    }
  }
  const first = points[0];
  path.push(["L", first.x, first.y + 0.004]);
  path.push(["z"]);
  return path;
}

@connect(({ efficiency, loading }) => ({
  ...efficiency, loading
}))

class ProductionEfficiency extends Component {

  constructor(props) {
    super(props)
    this.state = {
      leftSelectKey: '0',
      rightSelectKey: '0',
      leftShowLabel: true,
      rightShowLabel: true,
      selectArrs: [
        'L1 磁体系统 78001330',
        'L2 磁体系统 78001330',
        'L3 磁体系统 78001330',
        'Liuhe 1.5T 磁体连线物料 78004182',
        'Liuhe 1.5T 磁体连线物料 78004182'
      ],
      leftData: [],
      rightData: [],
      plantId: '82',
      workshopId: '2'
    }
  }

  componentWillMount() {
    this.setQuaryPayload()
  }

  componentDidMount() {
    this.getPageData()
    this.timer = setInterval(() => this.getPageData(), 300000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    // console.log('clear', this.timer)
  }

  setQuaryPayload = () => {
    const { plantId, workshopId } = this.props.location.query;
    // console.log(this.props.location, plantId, workshopId, keyModule, codeData)

    if (plantId && plantId !== undefined) {
      this.setState({
        plantId: plantId
      })
    }

    if (workshopId && workshopId !== undefined) {
      this.setState({
        workshopId: workshopId
      })
    }
  }

  getPageData = () => {
    const { plantId, workshopId } = this.state
    const { dispatch } = this.props;
    const that = this

    // 左边数据
    dispatch({
      type: 'efficiency/getEfficiencyPageData',
      payload: {
        plantId: plantId,
        workshopId: workshopId,
        keyModule: 1
      },
      callback: res => {
        // console.log('res ', res)
        if (res.success) {
          that.setState({
            leftData: res.rows
          })
          // clearInterval(that.timer)
        } else {
          console.log('获取数据错误')
          // that.setState({
          //   loading: false,
          //   resVal: '打包失败，请重新上传打包！'
          // })
        }
      },
    });

    // 右边数据
    dispatch({
      type: 'efficiency/getEfficiencyPageData',
      payload: {
        plantId: plantId,
        workshopId: workshopId,
        keyModule: 2
      },
      callback: res => {
        // console.log('res ', res)
        if (res.success) {
          that.setState({
            rightData: res.rows
          })
          // clearInterval(that.timer)
        } else {
          console.log('获取数据错误')
          // that.setState({
          //   loading: false,
          //   resVal: '打包失败，请重新上传打包！'
          // })
        }
      },
    });
  }

  handleLeftSwitch(val, e) {
    // console.log('left switch', val)

    this.setState({
      leftShowLabel: val
    })
  }


  handleRightSwitch(val, e) {
    // console.log('right switch', val)
    this.setState({
      rightShowLabel: val
    })
  }

  handleLeftClick(e) {

    this.setState({
      leftSelectKey: e.key
    })
  }

  handleRightClick(e) {

    this.setState({
      rightSelectKey: e.key
    })
  }

  handleLeftChange(from, to) {
    var page = to / 2
    // console.log(page)
    // this.rightSlider.goTo(Math.ceil(page))
  }

  handleRightChange(from, to) {
    // console.log(from, to)
    // this.leftSlider.goTo(to * 2)
  }

  render() {
    const { leftSelectKey, selectArrs, rightSelectKey, leftData, rightData, leftShowLabel, rightShowLabel } = this.state
    // console.log(this.props.loading)

    const leftMenu = (
      <Menu selectedKeys={[leftSelectKey]} onClick={(e) => this.handleLeftClick(e)}>
        {
          selectArrs.map((item, index) => <Menu.Item key={index}>
            {item}
          </Menu.Item>)
        }
      </Menu>
    );

    const rightMenu = (
      <Menu selectedKeys={[rightSelectKey]} onClick={(e) => this.handleRightClick(e)}>
        {
          selectArrs.map((item, index) => <Menu.Item key={index}>
            {item}
          </Menu.Item>)
        }
      </Menu>
    );

    // 顶边带圆角
    Shape.registerShape("interval", "top", {
      draw(cfg, container) {
        const attrs = getFillAttrs(cfg);
        let path = getRectPath(cfg.points);
        path = this.parsePath(path); // 将 0 - 1 的值转换为画布坐标

        const radius = (path[2][1] - path[1][1]) / 4;
        const temp = [];
        if (path[1][2] < path[0][2]) {
          temp.push(["M", path[0][1], path[0][2]]);
          temp.push(["L", path[1][1], path[1][2] + radius]);
          temp.push([
            "A",
            radius,
            radius,
            90,
            0,
            1,
            path[1][1] + radius,
            path[1][2]
          ]);
          temp.push(["L", path[2][1] - radius, path[2][2]]);
          temp.push([
            "A",
            radius,
            radius,
            90,
            0,
            1,
            path[2][1],
            path[2][2] + radius
          ]);
          temp.push(["L", path[3][1], path[3][2]]);
          temp.push(["Z"]);

        } else if (path[1][2] == path[0][2]) {
          temp.push(["M", path[0][1], path[0][2]]);
          temp.push(["L", path[1][1], path[1][2]]);
          temp.push(["L", path[2][1], path[2][2]]);
          temp.push(["L", path[3][1], path[3][2]]);
          temp.push(["Z"]);
        } else {

          temp.push(["M", path[0][1], path[0][2]]);
          temp.push(["L", path[1][1], path[1][2] - radius]);
          temp.push([
            "A",
            radius,
            radius,
            90,
            0,
            0,
            path[1][1] + radius,
            path[1][2]
          ]);
          temp.push(["L", path[2][1] - radius, path[2][2]]);
          temp.push([
            "A",
            radius,
            radius,
            90,
            0,
            0,
            path[2][1],
            path[2][2] - radius
          ]);
          temp.push(["L", path[3][1], path[3][2]]);
          temp.push(["Z"]);

        }
        return container.addShape("path", {
          attrs: Util.mix(attrs, {
            path: temp
          })
        });
      }
    });

    const cols = {
      value: {
        type: 'linear',
        min: 0, // 定义数值范围的最小值
      }
    };

    return (
      <div className="production-efficiency-page flex-row">
        <div className="total-chart-container flex-col fill-flex">

          <div className="carousel-title-container fill-flex flex-col">
            <div className="common-title">整机物料</div>
            <div className="fill-flex bottom-carousel-container">
              {
                (leftData && leftData.length > 0) ?
                  <Carousel
                    dotPosition="top"
                    // autoplay
                    speed={2000}
                    autoplaySpeed={5000}
                    draggable={true}
                    pauseOnHover={true}
                    slidesToShow={2}
                    slidesToScroll={2}
                    beforeChange={(from, to) => this.handleLeftChange(from, to)}
                  // ref={el => (this.leftSlider = el)}
                  >

                    {
                      leftData.map((item, index) =>
                        <div className="custom-carousel-content" key={index}>
                          <div className="carousel-content-container flex-col">
                            <div className="part-title">{item.mainItemCode}</div>

                            <div className="fill-flex flex-col bottom-chart">

                              <div className="chart-title-container flex-row">
                                <label className="chart-title">生产效率</label>
                              </div>

                              <div className="fill-flex common-chart">
                                <Chart height={210} data={item.dataSet.module} scale={cols} forceFit padding="auto">
                                  <Axis
                                    name="serialNumber"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      }
                                    }}
                                    tickLine={null}
                                    line={{
                                      lineWidth: 1,
                                      stroke: 'rgba(255,255,255,0.2)'
                                    }} />
                                  <Axis
                                    name="averageEfficiency"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        var temp = `${text * 100}%`
                                        if (text === 0 || text === '0') {
                                          temp = text;
                                        }
                                        return temp;
                                      }
                                    }}
                                    grid={{
                                      lineStyle: {
                                        lineWidth: 1,
                                        stroke: 'rgba(255,255,255,0.1)'
                                      }
                                    }} />
                                  <Tooltip />
                                  <Geom
                                    size={10}
                                    type="interval"
                                    color="#4586FF"
                                    position="serialNumber*averageEfficiency"
                                    shape='top'
                                    tooltip={[
                                      "serialNumber*averageEfficiency",
                                      (serialNumber, averageEfficiency) => {
                                        var val = (Number(averageEfficiency) * 100).toFixed(2)
                                        var temp = val + '%'
                                        if (averageEfficiency === 0 || averageEfficiency === '0') {
                                          temp = averageEfficiency;
                                        }
                                        return {
                                          name: serialNumber,
                                          value: temp
                                        };
                                      }
                                    ]}
                                  >
                                    {
                                      leftShowLabel &&
                                      <Label
                                        content="averageEfficiency"
                                        position="top"
                                        offset={12}
                                        textStyle={
                                          {
                                            fill: '#99BBFF',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                          }
                                        }
                                        formatter={(text, item, index) => {
                                          var val = (Number(text) * 100).toFixed(2)
                                          var temp = val + '%'
                                          if (text === 0 || text === '0') {
                                            temp = text;
                                          }
                                          return temp;
                                        }}
                                      />
                                    }
                                  </Geom>
                                </Chart>
                              </div>

                              <div className="chart-title-container flex-row">
                                <label className="chart-title">周平均效率</label>
                              </div>

                              <div className="fill-flex common-chart">
                                <Chart height={210} data={item.dataSet.week} scale={cols} forceFit padding="auto">
                                  <Axis
                                    name="ofWeekNum"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        return 'W' + text;
                                      }
                                    }}
                                    tickLine={null}
                                    line={{
                                      lineWidth: 1,
                                      stroke: 'rgba(255,255,255,0.2)'
                                    }} />
                                  <Axis
                                    name="averageEfficiency"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        var temp = `${text}%`
                                        if (text === 0 || text === '0') {
                                          temp = text;
                                        }
                                        return temp;
                                      }
                                    }}
                                    grid={{
                                      lineStyle: {
                                        lineWidth: 1,
                                        stroke: 'rgba(255,255,255,0.1)'
                                      }
                                    }} />
                                  <Tooltip />
                                  <Geom
                                    size={10}
                                    type="interval"
                                    color="#01ECD5"
                                    position="ofWeekNum*averageEfficiency"
                                    shape='top'
                                    tooltip={[
                                      "ofWeekNum*averageEfficiency",
                                      (ofWeekNum, averageEfficiency) => {
                                        var val = (Number(averageEfficiency) * 100).toFixed(2)
                                        var temp = val + '%'
                                        if (averageEfficiency === 0 || averageEfficiency === '0') {
                                          temp = averageEfficiency;
                                        }
                                        return {
                                          name: 'W' + ofWeekNum,
                                          value: temp
                                        };
                                      }
                                    ]}
                                  >
                                    {
                                      leftShowLabel &&
                                      <Label
                                        content="averageEfficiency"
                                        position="top"
                                        offset={12}
                                        textStyle={
                                          {
                                            fill: '#01ECD5',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                          }
                                        }
                                        formatter={(text, item, index) => {
                                          var val = (Number(text) * 100).toFixed(2)
                                          var temp = val + '%'
                                          if (text === 0 || text === '0') {
                                            temp = text;
                                          }
                                          return temp;
                                        }}
                                      />
                                    }
                                  </Geom>
                                  <Geom
                                    type="area"
                                    position={"ofWeekNum*averageEfficiency"}
                                    tooltip={
                                      {
                                        showTitle: false
                                      }
                                    }
                                    color="l (90) 0:rgba(1, 236, 213, 0.3) 1:rgba(1, 236, 213, 0.05)"
                                  />
                                </Chart>
                              </div>

                              <div className="chart-title-container flex-row">
                                <label className="chart-title">月平均效率</label>
                              </div>

                              <div className="fill-flex common-chart">
                                <Chart height={210} data={item.dataSet.month} scale={cols} forceFit padding="auto">
                                  <Axis
                                    name="ofMonth"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        return (Number(text) + 1) + '月';
                                      }
                                    }}
                                    tickLine={null}
                                    line={{
                                      lineWidth: 1,
                                      stroke: 'rgba(255,255,255,0.2)'
                                    }} />
                                  <Axis
                                    name="averageEfficiency"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        var temp = `${text}%`
                                        if (text === 0 || text === '0') {
                                          temp = text;
                                        }
                                        return temp;
                                      }
                                    }}
                                    grid={{
                                      lineStyle: {
                                        lineWidth: 1,
                                        stroke: 'rgba(255,255,255,0.1)'
                                      }
                                    }} />
                                  <Tooltip />
                                  <Geom
                                    size={10}
                                    type="interval"
                                    color="#01ECD5"
                                    position="ofMonth*averageEfficiency"
                                    shape='top'
                                    tooltip={[
                                      "ofMonth*averageEfficiency",
                                      (ofMonth, averageEfficiency) => {
                                        var val = (Number(averageEfficiency) * 100).toFixed(2)
                                        var temp = val + '%'
                                        if (averageEfficiency === 0 || averageEfficiency === '0') {
                                          temp = averageEfficiency;
                                        }
                                        return {
                                          name: (Number(ofMonth) + 1) + '月',
                                          value: temp
                                        };
                                      }
                                    ]}
                                  >
                                    {
                                      leftShowLabel &&
                                      <Label
                                        content="averageEfficiency"
                                        position="top"
                                        offset={12}
                                        textStyle={
                                          {
                                            fill: '#01ECD5',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                          }
                                        }
                                        formatter={(text, item, index) => {
                                          var val = (Number(text) * 100).toFixed(2)
                                          var temp = val + '%'
                                          if (text === 0 || text === '0') {
                                            temp = text;
                                          }
                                          return temp;
                                        }}
                                      />
                                    }
                                  </Geom>
                                  <Geom
                                    type="area"
                                    position={"ofMonth*averageEfficiency"}
                                    tooltip={
                                      {
                                        showTitle: false
                                      }
                                    }
                                    color="l (90) 0:rgba(1, 236, 213, 0.3) 1:rgba(1, 236, 213, 0.05)"
                                  />
                                </Chart>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }

                  </Carousel>
                  : <div className="no-data-container">
                    {
                      this.props.loading.global ? <Spin /> : <Empty image={require('../../../public/empty.svg')} />
                    }
                  </div>
              }
            </div>
          </div>

          <div className="common-bottom-select flex-row">
            {/* <div className="left-select">
              <Dropdown overlay={leftMenu} placement="topLeft" trigger={['click']}>
                <div className="common-select-container flex-row">
                  <p className="select-val fill-flex">{selectArrs[leftSelectKey]}</p>
                  <span className="select-icon iconfont icon-arrow"></span>
                </div>
              </Dropdown>
            </div> */}
            <div className="show-data-contianer flex-row">
              <span className="show-text">显示数据</span>
              <Switch checked={leftShowLabel} defaultChecked onChange={(val, e) => this.handleLeftSwitch(val, e)} />
            </div>
          </div>
        </div>
        <div className="part-chart-container flex-col">

          <div className="carousel-title-container fill-flex flex-col">
            <div className="common-title part-title">部件物料</div>
            <div className="fill-flex bottom-carousel-container">
              {
                (rightData && rightData.length > 0) ?
                  <Carousel
                    dotPosition="top"
                    speed={2000}
                    draggable={true}
                    pauseOnHover={true}
                    autoplaySpeed={5000}
                    beforeChange={(from, to) => this.handleRightChange(from, to)}
                  // ref={el => (this.rightSlider = el)}
                  >

                    {
                      rightData.map((item, index) =>
                        <div className="custom-carousel-content" key={index}>
                          <div className="carousel-content-container flex-col">
                            <div className="part-title">{item.mainItemCode}</div>
                            <div className="fill-flex flex-col bottom-chart">

                              <div className="chart-title-container flex-row">
                                <label className="chart-title">生产效率</label>
                              </div>

                              <div className="fill-flex common-chart">
                                <Chart height={210} data={item.dataSet.module} scale={cols} forceFit padding="auto">
                                  <Axis
                                    name="serialNumber"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      }
                                    }}
                                    tickLine={null}
                                    line={{
                                      lineWidth: 1,
                                      stroke: 'rgba(255,255,255,0.2)'
                                    }} />
                                  <Axis
                                    name="averageEfficiency"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        var temp = `${text * 100}%`
                                        if (text === 0 || text === '0') {
                                          temp = text;
                                        }
                                        return temp;
                                      }
                                    }}
                                    grid={{
                                      lineStyle: {
                                        lineWidth: 1,
                                        stroke: 'rgba(255,255,255,0.1)'
                                      }
                                    }} />
                                  <Tooltip />
                                  <Geom
                                    size={10}
                                    type="interval"
                                    color="#4586FF"
                                    position="serialNumber*averageEfficiency"
                                    shape='top'
                                    tooltip={[
                                      "serialNumber*averageEfficiency",
                                      (serialNumber, averageEfficiency) => {
                                        var val = (Number(averageEfficiency) * 100).toFixed(2)
                                        var temp = val + '%'
                                        if (averageEfficiency === 0 || averageEfficiency === '0') {
                                          temp = averageEfficiency;
                                        }
                                        return {
                                          name: serialNumber,
                                          value: temp
                                        };
                                      }
                                    ]}
                                  >
                                    {
                                      rightShowLabel &&
                                      <Label
                                        content="averageEfficiency"
                                        position="top"
                                        offset={12}
                                        textStyle={
                                          {
                                            fill: '#99BBFF',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                          }
                                        }
                                        formatter={(text, item, index) => {
                                          var val = (Number(text) * 100).toFixed(2)
                                          var temp = val + '%'
                                          if (text === 0 || text === '0') {
                                            temp = text;
                                          }
                                          return temp;
                                        }}
                                      />
                                    }
                                  </Geom>
                                </Chart>
                              </div>

                              <div className="chart-title-container flex-row">
                                <label className="chart-title">周平均效率</label>
                              </div>

                              <div className="fill-flex common-chart">
                                <Chart height={210} data={item.dataSet.week} scale={cols} forceFit padding="auto">
                                  <Axis
                                    name="ofWeekNum"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        return 'W' + text;
                                      }
                                    }}
                                    tickLine={null}
                                    line={{
                                      lineWidth: 1,
                                      stroke: 'rgba(255,255,255,0.2)'
                                    }} />
                                  <Axis
                                    name="averageEfficiency"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        var temp = `${text}%`
                                        if (text === 0 || text === '0') {
                                          temp = text;
                                        }
                                        return temp;
                                      }
                                    }}
                                    grid={{
                                      lineStyle: {
                                        lineWidth: 1,
                                        stroke: 'rgba(255,255,255,0.1)'
                                      }
                                    }} />
                                  <Tooltip />
                                  <Geom
                                    size={10}
                                    type="interval"
                                    color="#01ECD5"
                                    position="ofWeekNum*averageEfficiency"
                                    shape='top'
                                    tooltip={[
                                      "ofWeekNum*averageEfficiency",
                                      (ofWeekNum, averageEfficiency) => {
                                        var val = (Number(averageEfficiency) * 100).toFixed(2)
                                        var temp = val + '%'
                                        if (averageEfficiency === 0 || averageEfficiency === '0') {
                                          temp = averageEfficiency;
                                        }
                                        return {
                                          name: 'W' + ofWeekNum,
                                          value: temp
                                        };
                                      }
                                    ]}
                                  >
                                    {
                                      rightShowLabel &&
                                      <Label
                                        content="averageEfficiency"
                                        position="top"
                                        offset={12}
                                        textStyle={
                                          {
                                            fill: '#01ECD5',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                          }
                                        }
                                        formatter={(text, item, index) => {
                                          var val = (Number(text) * 100).toFixed(2)
                                          var temp = val + '%'
                                          if (text === 0 || text === '0') {
                                            temp = text;
                                          }
                                          return temp;
                                        }}
                                      />
                                    }
                                  </Geom>
                                  <Geom
                                    type="area"
                                    position={"ofWeekNum*averageEfficiency"}
                                    tooltip={
                                      {
                                        showTitle: false
                                      }
                                    }
                                    color="l (90) 0:rgba(1, 236, 213, 0.3) 1:rgba(1, 236, 213, 0.05)"
                                  />
                                </Chart>
                              </div>

                              <div className="chart-title-container flex-row">
                                <label className="chart-title">月平均效率</label>
                              </div>

                              <div className="fill-flex common-chart">
                                <Chart height={210} data={item.dataSet.month} scale={cols} forceFit padding="auto">
                                  <Axis
                                    name="ofMonth"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        return (Number(text) + 1) + '月';
                                      }
                                    }}
                                    tickLine={null}
                                    line={{
                                      lineWidth: 1,
                                      stroke: 'rgba(255,255,255,0.2)'
                                    }} />
                                  <Axis
                                    name="averageEfficiency"
                                    label={{
                                      offset: 12,
                                      textStyle: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                      },
                                      formatter(text, item, index) {
                                        var temp = `${text}%`
                                        if (text === 0 || text === '0') {
                                          temp = text;
                                        }
                                        return temp;
                                      }
                                    }}
                                    grid={{
                                      lineStyle: {
                                        lineWidth: 1,
                                        stroke: 'rgba(255,255,255,0.1)'
                                      }
                                    }} />
                                  <Tooltip />
                                  <Geom
                                    size={10}
                                    type="interval"
                                    color="#01ECD5"
                                    position="ofMonth*averageEfficiency"
                                    shape='top'
                                    tooltip={[
                                      "ofMonth*averageEfficiency",
                                      (ofMonth, averageEfficiency) => {
                                        var val = (Number(averageEfficiency) * 100).toFixed(2)
                                        var temp = val + '%'
                                        if (averageEfficiency === 0 || averageEfficiency === '0') {
                                          temp = averageEfficiency;
                                        }
                                        return {
                                          name: (Number(ofMonth) + 1) + '月',
                                          value: temp
                                        };
                                      }
                                    ]}
                                  >
                                    {
                                      rightShowLabel &&
                                      <Label
                                        content="averageEfficiency"
                                        position="top"
                                        offset={12}
                                        textStyle={
                                          {
                                            fill: '#01ECD5',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                          }
                                        }
                                        formatter={(text, item, index) => {
                                          var val = (Number(text) * 100).toFixed(2)
                                          var temp = val + '%'
                                          if (text === 0 || text === '0') {
                                            temp = text;
                                          }
                                          return temp;
                                        }}
                                      />
                                    }
                                  </Geom>
                                  <Geom
                                    type="area"
                                    position={"ofMonth*averageEfficiency"}
                                    tooltip={
                                      {
                                        showTitle: false
                                      }
                                    }
                                    color="l (90) 0:rgba(1, 236, 213, 0.3) 1:rgba(1, 236, 213, 0.05)"
                                  />
                                </Chart>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </Carousel>
                  : <div className="no-data-container">
                    {
                      this.props.loading.global ? <Spin /> : <Empty image={require('../../../public/empty.svg')} />
                    }
                  </div>
              }
            </div>
          </div>

          <div className="common-bottom-select flex-row">
            {/* <div className="left-select">
              <Dropdown overlay={rightMenu} placement="topLeft" trigger={['click']}>
                <div className="common-select-container flex-row">
                  <p className="select-val fill-flex">{selectArrs[rightSelectKey]}</p>
                  <span className="select-icon iconfont icon-arrow"></span>
                </div>
              </Dropdown>
            </div> */}
            <div className="show-data-contianer flex-row">
              <span className="show-text">显示数据</span>
              <Switch checked={rightShowLabel} defaultChecked onChange={(val, e) => this.handleRightSwitch(val, e)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductionEfficiency;

// export default connect(({ efficiency }) => ({
//   efficiency
// }))(ProductionEfficiency);

