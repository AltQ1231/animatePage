import { connect } from 'umi';
import React, { Component } from 'react';
import { Switch, Empty, Spin } from 'antd';
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
import mockData from './mockData.js';


@connect(({ losttime, loading }) => ({
  ...losttime, loading
}))

class LostTime extends Component {

  constructor(props) {
    super(props)
    this.state = {
      datas: [],
      showLabel: true,
      plantId: '82',
      workshopId: '2',
      keyModule: '1'
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
    const { plantId, workshopId, keyModule } = this.props.location.query;
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

    if (keyModule && keyModule !== undefined) {
      this.setState({
        keyModule: keyModule
      })
    }
  }

  getPageData = () => {
    const { plantId, workshopId, keyModule } = this.state
    const { dispatch } = this.props;
    const that = this

    // 获取数据
    dispatch({
      type: 'losttime/getLostTimePageData',
      payload: {
        plantId: plantId,
        workshopId: workshopId,
        keyModule: keyModule,
        barFlag: 'Y'
      },
      callback: res => {
        // console.log('res ', res)
        if (res.success) {
          that.setState({
            datas: res.rows
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


  handleChange(val, e) {
    this.setState({
      showLabel: val
    })
  }

  render() {
    const { datas, showLabel } = this.state
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

    // 顶边带圆角

    Shape.registerShape("interval", "right", {
      draw(cfg, container) {
        const attrs = getFillAttrs(cfg);
        let path = getRectPath(cfg.points);
        path = this.parsePath(path); // 将 0 - 1 的值转换为画布坐标

        const radius = (path[1][2] - path[2][2]) / 2;

        const temp = [];
        temp.push(["M", path[0][1], path[0][2]]);
        temp.push(["L", path[1][1] + radius, path[1][2]]);
        temp.push([
          "A",
          radius,
          radius,
          90,
          1,
          0,
          path[1][1],
          path[1][2] - radius
        ]);
        temp.push([
          "A",
          radius,
          radius,
          90,
          1,
          0,
          path[2][1] + radius,
          path[2][2]
        ]);
        temp.push(["L", path[2][1], path[2][2]] + radius);
        temp.push(["L", path[3][1], path[3][2]]);
        temp.push(["Z"]);
        return container.addShape("path", {
          attrs: Util.mix(attrs, {
            path: temp
          })
        });
      }
    });

    // 底边带圆角

    Shape.registerShape("interval", "bottom", {
      draw(cfg, container) {
        const attrs = getFillAttrs(cfg);
        let path = getRectPath(cfg.points);
        path = this.parsePath(path);
        const radius = (path[2][1] - path[1][1]) / 2;
        const temp = [];
        temp.push(["M", path[0][1] + radius, path[0][2]]);
        temp.push([
          "A",
          radius,
          radius,
          90,
          0,
          1,
          path[0][1],
          path[0][2] - radius
        ]);
        temp.push(["L", path[1][1], path[1][2]]);
        temp.push(["L", path[2][1], path[2][2]]);
        temp.push(["L", path[3][1], path[3][2] - radius]);
        temp.push([
          "A",
          radius,
          radius,
          90,
          0,
          1,
          path[3][1] - radius,
          path[3][2]
        ]);
        temp.push(["Z"]);
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
        range: [0, 0.94],
        alias: 'h',
        min: 0, // 定义数值范围的最小值
        // tickInterval: 500, // 用于指定坐标轴各个标度点的间距，是原始数据之间的间距差值，tickCount 和 tickInterval 不可以同时声明。
        tickCount: 7, // 定义坐标轴刻度线的条数，默认为 5
      }
    };


    function handleData(data) {

      if (data && data.length > 0) {
        data.map(item => {
          item.tempTotal = 0
        })
      }
      const ds = new DataSet();
      const chartdata = ds.createView().source(data);
      chartdata.transform({
        type: "fold",
        fields: ["hourLoss", "standardHours", "tempTotal"],
        // 展开字段集
        key: "timeKey",
        // key字段
        value: "value",
        // value字段
        retains: ["serialNumber", 'actualHours'] // 保留字段集，默认为除fields以外的所有字段
      });
      return chartdata
    }

    const COLORS = ["#4586FF", "#01ECD5", 'rgba(255, 255, 255, 0.25)'];

    return (
      <div className="lost-time-page flex-col">
        <div className="top-chart-container fill-flex">
          {
            (datas && datas.length > 0) ?
              <div className="chart-content-container flex-row">
                {
                  datas.map(item =>
                    <div className="time-chart-container flex-col" key={item.mainItemCode}>
                      <p className="time-title">{item.mainItemCode}</p>
                      <div className="chart-title-container flex-row">
                        <label className="chart-title">损失工时/H</label>
                      </div>
                      <div className="fill-flex bottom-chart-container">
                        <Chart scale={cols} width={600} height={320} padding="auto" data={handleData(item.voData)} forceFit>
                          <Legend visible={false} />
                          <Coord transpose />
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
                            }}
                          />
                          <Axis
                            name="value"
                            title={{
                              offset: 13,
                              position: 'end',
                              textStyle: {
                                fontSize: 12,
                                fill: 'rgba(255,255,255,0.5)',
                                rotate: 0
                              }
                            }}
                            label={{
                              offset: 12,
                              textStyle: {
                                fill: 'rgba(255,255,255,0.5)',
                                fontSize: 12
                              }
                            }}
                            grid={{
                              lineStyle: {
                                lineWidth: 1,
                                stroke: 'rgba(255,255,255,0.1)'
                              }
                            }}
                          />
                          <Tooltip />
                          <Geom
                            type="intervalStack"
                            position="serialNumber*value"
                            size={4}
                            color={["timeKey", COLORS]}
                            shape={[
                              "timeKey",
                              function (val) {
                                // console.log(val)
                                if (val === "standardHours") {
                                  // 底部圆角
                                  return "right";
                                } else {
                                  return; // 其他默认
                                }
                              }
                            ]}
                            tooltip={[
                              "timeKey*value*actualHours",
                              (timeKey, value, total) => {
                                var temp = value
                                var nameT = '标准工时'
                                if (timeKey === "tempTotal") {
                                  temp = total,
                                    nameT = '实际工时'
                                }

                                if (timeKey === "hourLoss") {
                                  nameT = '损失工时'
                                }
                                return {
                                  name: nameT,
                                  value: temp
                                };
                              }
                            ]}
                          >
                            {showLabel &&
                              <Label
                                content="value"
                                position="bottom"
                                htmlTemplate={(text, item) => {
                                  const isLost = item.point.timeKey === "hourLoss";
                                  const color = isLost ? '#99BBFF' : COLORS[1];
                                  var node = `<div class="lost-node" style="
                              color:${color}">${text}</div>`

                                  if (item.point.timeKey === "tempTotal") {
                                    node = `<div class="real-node">${item.point.actualHours}</div>`
                                  }

                                  if (item.point.timeKey === "standardHours") {
                                    node = `<div class="standard-node" style="
                                color:${color}">${text}</div>`
                                  }

                                  return node;
                                }}
                              />
                            }
                          </Geom>
                        </Chart>
                      </div>
                    </div>
                  )
                }
              </div>
              : <div className="no-data-container">
                {
                  this.props.loading.global ? <Spin /> : <Empty image={require('../../../public/empty.svg')} />
                }
              </div>
          }
        </div>
        <div className="bottom-legend-container flex-row">
          <div className="common-legend lost-legend flex-row">损失工时</div>
          <div className="common-legend standard-legend flex-row">标准工时</div>
          <div className="common-legend real-legend flex-row">实际工时</div>
          <div className="show-data-contianer flex-row">
            <span className="show-text">显示数据</span>
            <Switch checked={showLabel} defaultChecked onChange={(val, e) => this.handleChange(val, e)} />
          </div>
        </div>
      </div>
    );
  }
}

export default LostTime;

