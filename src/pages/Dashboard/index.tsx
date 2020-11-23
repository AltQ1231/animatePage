import React, { Component } from 'react';
import { Progress, Table } from 'antd';
import './index.less';
import titleIcon from '../../../public/title.svg';
import mockData from './mockData.js';
import Socket from '../../services/websocket.js';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: mockData.dataArr,
      tableData: this.handleTableData(mockData.dataArr),
      selectId: null,
      topData: {
        totalNum: 40, // 设备总数
        runNum: 24, // 设备运行数量
        offlineNum: 16, // 关机数量
        faultNum: 0, // 故障设备数量
        openPercent: 60 // 开机率
      },
      selectRow: {}
    };
  }

  componentDidMount() {
    // websocket 处理
    // let url = "";//服务端连接的url
    // //    判断专家是否登录
    // this.socket = new Socket({
    //   socketUrl: 'ws://10.6.10.22:9832/websocket',
    //   timeout: 5000,
    //   socketMessage: (receive) => {
    //     console.log('返回数据', receive);  //后端返回的数据，渲染页面
    //   },
    //   socketClose: (msg) => {
    //     console.log('关闭连接', msg);
    //   },
    //   socketError: () => {
    //     console.log(this.state.taskStage + '连接建立失败');
    //   },
    //   socketOpen: () => {
    //     console.log('连接建立成功');
    //     // 心跳机制 定时向后端发数据
    //     this.taskRemindInterval = setInterval(() => {
    //       this.socket.sendMessage({ "msgType": 0 })
    //     }, 3000000)
    //   }
    // });
    // // 重试创建socket连接
    // try {
    //   this.socket.connection();
    // } catch (e) {
    //   // 捕获异常，防止js error
    //   // donothing
    //   console.log('捕获错误', e)
    // }
  }

  componentWillUnmount() {
  }

  handleTableData = (data) => {
    var temp = []

    data.map(item => {
      if (item.equipments && item.equipments.length > 0) {
        item.equipments.map(itm => {
          temp.push(itm)
        })
      }
    })

    // console.log(temp)

    return temp
  }

  handleNum = (key) => {
    var temp = '0' + (key + 1)

    if (key >= 9) {
      temp = key + 1
    }
    return temp
  }

  setRowClassName = (key) => {
    return key === this.state.selectId ? 'common-tr selected-tr' : 'common-tr';
  }

  selectRow = (key, record) => {
    // console.log('select', key)
    this.setState({
      selectId: key,
      selectRow: record
    })
  }

  render() {
    const { chartData, tableData, selectRow, topData } = this.state

    const columns = [
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 170,
        ellipsis: true,
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 225,
        ellipsis: true,
      },
      {
        title: '设备号',
        dataIndex: 'equipmentId',
        key: 'equipmentId',
        width: 140,
        ellipsis: true,
      },
      {
        title: '设备负责人',
        dataIndex: 'chargePerson',
        key: 'chargePerson',
        ellipsis: true,
      },
      {
        title: '设备状态',
        key: 'status',
        width: 100,
        render: text => {
          return <div className={`status-item ${text.status === 2 ? 'online-item' : ''} ${text.status === 3 ? 'error-item' : ''}`}></div>
        },
      }
    ];

    return (
      <div className="dashboard-page flex-col">
        <div className="top-info-bar flex-row">
          <div className="fill-flex common-info-item flex-row">
            <div className="left-text">
              <p className="title">设备总数</p>
              <p className="eng-text">Total equipment</p>
            </div>
            <div className="num-val fill-flex">{topData.totalNum}</div>
            <div className="unit-container">台</div>
          </div>

          <div className="fill-flex common-info-item flex-row">
            <div className="left-text">
              <p className="title">设备运行数量</p>
              <p className="eng-text">Number of operating equipment</p>
            </div>
            <div className="num-val fill-flex">{topData.runNum}</div>
            <div className="unit-container">台</div>
          </div>

          <div className="fill-flex common-info-item flex-row">
            <div className="left-text">
              <p className="title">关机数量</p>
              <p className="eng-text">Number of shutdowns</p>
            </div>
            <div className="num-val fill-flex">{topData.offlineNum}</div>
            <div className="unit-container">台</div>
          </div>

          <div className="fill-flex common-info-item flex-row">
            <div className="left-text">
              <p className="title">故障设备数量</p>
              <p className="eng-text">Number of faulty equipment</p>
            </div>
            <div className="num-val fill-flex">{topData.faultNum}</div>
            <div className="unit-container">台</div>
          </div>

          <div className="fill-flex common-info-item flex-row">
            <div className="left-text">
              <p className="title">开机率</p>
              <p className="eng-text">Boot rate</p>
            </div>
            <div className="num-val fill-flex">{topData.openPercent}</div>
            <div className="unit-container">%</div>
          </div>
        </div>

        <div className="center-chart-table flex-row">
          <div className="left-chart-container common-card-container flex-col">
            <div className="common-card-title flex-row">
              <img className="title-img" src={titleIcon} />
              设备开机率
            </div>
            <div className="fill-flex content-container">
              {
                chartData.map(item =>
                  <div className="common-equipment-item flex-row" key={`item${item.key}`}>
                    <div className="equipment-name">{item.name}</div>
                    <div className="fill-flex center-percent-container">
                      <Progress
                        strokeColor={{
                          '0%': '#4586FF',
                          '100%': '#01ECD5',
                        }}
                        percent={item.percent}
                        showInfo={false}
                        strokeLinecap="square"
                        trailColor="rgba(255,255,255,0.2)"
                        strokeWidth="4px"
                      />
                    </div>
                    <div className="percent-val">
                      {item.percent}%
                    </div>
                    <div className="right-device-thumbnail flex-row">
                      {
                        item.equipments.map((itm, i) =>
                          <div className={`common-thumbnail ${itm.status === 2 && 'online-device'} ${itm.status === 3 && 'error-device'}`} key={`chart${itm.equipmentId}`}>{this.handleNum(i)}</div>
                        )
                      }
                    </div>
                  </div>
                )
              }

            </div>
          </div>

          <div className="right-table-info common-card-container flex-col fill-flex">
            <div className="common-card-title flex-row">
              <img className="title-img" src={titleIcon} />
              设备列表
            </div>
            <div className="fill-flex content-container">
              <Table
                rowKey={(record, index) => index}
                columns={columns}
                pagination={false}
                dataSource={tableData}
                onRow={(record, index) => {
                  return {
                    onClick: event => this.selectRow(index, record), // 点击行
                  };
                }}
                rowClassName={(record, index) => this.setRowClassName(index)}
              />
            </div>
          </div>
        </div>

        <div className="fill-flex bottom-detail-modal flex-row">


          <div className="left-modal-container fill-flex flex-row">

            {/* white 表示在线  red 表示故障  gray 表示离线  替换img 或者 使用video 替换源 */}
            <div className="center-content">
              
              <img className="common-img waste-gas-1" src={require("../../../public/waste-gas-white.png")} />
              <div className="waste-gas-text">废弃处理装置位于5层</div>

              <img className="common-img oven-1" src={require("../../../public/oven-white.png")} />
              <img className="common-img oven-2" src={require("../../../public/oven-red.png")} />
              <img className="common-img oven-3" src={require("../../../public/oven-gray.png")} />
              <img className="common-img oven-4" src={require("../../../public/oven-white.png")} />
              <img className="common-img oven-5" src={require("../../../public/oven-white.png")} />
              <img className="common-img oven-6" src={require("../../../public/oven-white.png")} />
              <img className="common-img oven-7" src={require("../../../public/oven-white.png")} />
              <img className="common-img oven-8" src={require("../../../public/oven-white.png")} />
              <img className="common-img oven-9" src={require("../../../public/oven-white.png")} />
              <img className="common-img oven-10" src={require("../../../public/oven-white.png")} />
              <img className="common-img oven-11" src={require("../../../public/oven-white.png")} />

              <img className="common-img winding-1" src={require("../../../public/winding-machine-gray.png")} />
              <video className="common-video winding-2" autoPlay src={require('../../../public/winding-machine-red.mp4').default} loop muted></video>
              <video className="common-video winding-3" autoPlay src={require('../../../public/winding-machine-white.mp4').default} loop muted></video>

              <img className="common-img hydraulic-1" src={require("../../../public/hydraulic-pressure-white.png")} />
              <img className="common-img hydraulic-2" src={require("../../../public/hydraulic-pressure-red.png")} />

              <img className="common-img rollers-1" src={require("../../../public/four-rollers-white.png")} />
              <img className="common-img rollers-2" src={require("../../../public/four-rollers-red.png")} />

              <img className="common-img hot-press-1" src={require("../../../public/hot-press-white.png")} />

              <img className="common-img refractometer-1" src={require("../../../public/refractometer-white.png")} />

              <img className="common-img molecular-1" src={require("../../../public/molecular-pump-white.png")} />
              <img className="common-img molecular-2" src={require("../../../public/molecular-pump-red.png")} />
              <img className="common-img molecular-3" src={require("../../../public/molecular-pump-gray.png")} />
              <img className="common-img molecular-4" src={require("../../../public/molecular-pump-white.png")} />
              <img className="common-img molecular-5" src={require("../../../public/molecular-pump-white.png")} />
              <img className="common-img molecular-6" src={require("../../../public/molecular-pump-white.png")} />
              <img className="common-img molecular-7" src={require("../../../public/molecular-pump-white.png")} />
              <img className="common-img molecular-8" src={require("../../../public/molecular-pump-white.png")} />

              <img className="common-img roots-1" src={require("../../../public/roots-white.png")} />
              <img className="common-img roots-2" src={require("../../../public/roots-white.png")} />

              <img className="common-img magnet-1" src={require("../../../public/magnet-white.png")} />
              <img className="common-img magnet-2" src={require("../../../public/magnet-red.png")} />
              <img className="common-img magnet-3" src={require("../../../public/magnet-gray.png")} />
              <img className="common-img magnet-4" src={require("../../../public/magnet-white.png")} />
              <img className="common-img magnet-5" src={require("../../../public/magnet-white.png")} />
              <img className="common-img magnet-6" src={require("../../../public/magnet-white.png")} />
              <img className="common-img magnet-7" src={require("../../../public/magnet-white.png")} />
              <img className="common-img magnet-8" src={require("../../../public/magnet-white.png")} />
              <img className="common-img magnet-9" src={require("../../../public/magnet-white.png")} />
              <img className="common-img magnet-10" src={require("../../../public/magnet-white.png")} />

            </div>
            {/* <video className="video-style" autoPlay src={require('../../../public/video/121.mp4').default} loop muted></video> */}
          </div>


          <div className="right-detail-container common-card-container flex-col">
            <div className="common-card-title flex-row">
              <img className="title-img" src={titleIcon} />
              设备详细信息
            </div>
            <div className="fill-flex content-container">
              <div className="common-detail-item flex-row">
                <p className="detail-title">
                  设备名称
                  </p>
                <p className="fill-flex detail-val">
                  {selectRow.equipmentName}
                </p>
              </div>
              <div className="common-detail-item flex-row">
                <p className="detail-title">
                  故障信息
                  </p>
                <p className="fill-flex detail-val">
                  {selectRow.faultInfo}
                </p>
              </div>
              <div className="common-detail-item flex-row">
                <p className="detail-title">
                  设备编号
                  </p>
                <p className="fill-flex detail-val">
                  {selectRow.equipmentNo}
                </p>
              </div>
              <div className="common-detail-item flex-row">
                <p className="detail-title">
                  设备号
                  </p>
                <p className="fill-flex detail-val">
                  {selectRow.equipmentId}
                </p>
              </div>
              <div className="common-detail-item flex-row">
                <p className="detail-title">
                  设备负责人
                  </p>
                <p className="fill-flex detail-val">
                  {selectRow.chargePerson}
                </p>
              </div>
              <div className="common-detail-item flex-row">
                <p className="detail-title">
                  联系电话
                  </p>
                <p className="fill-flex detail-val">
                  {selectRow.phoneNum}
                </p>
              </div>
              <div className="common-detail-item flex-row">
                <p className="detail-title">
                  放置位置
                  </p>
                <p className="fill-flex detail-val">
                  {selectRow.position}
                </p>
              </div>
              <div className="common-detail-item flex-row"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
