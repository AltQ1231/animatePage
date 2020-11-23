import { connect } from 'umi';
import React, { Component } from 'react';
import { Dropdown, Menu, Anchor, Modal, Empty, Spin } from 'antd';
import mockData from './sdata.js';
import './index.less';
const { Link } = Anchor;

import makingSvg from '../../../public/making.svg';
import comMakingSvg from '../../../public/complete-making.svg';
import waitMakingSvg from '../../../public/waiting-making.svg';


@connect(({ schedule, loading }) => ({
  ...schedule, loading
}))
class ProductionSchedule extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectKey: "0",
      selectArrs: [
        '全部',
        '正常',
        '异常',
      ],
      datas: [],
      modalVisible: false,
      modalData: [],
      leftOverData: [],
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
    console.log('clear', this.timer)
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

  getPageData = (key) => {
    const { plantId, workshopId, keyModule, selectKey } = this.state
    const { dispatch } = this.props;
    const that = this

    let payloadT = {
      plantId: plantId,
      workshopId: workshopId,
      keyModule: keyModule,
      version: 'v2',
      sortFlag: 1
    }

    if (key && key === '1') {
      payloadT.timeOut = 'false'
    }

    if (key && key === '2') {
      payloadT.timeOut = 'true'
    }

    // console.log('参数', selectKey, key, payloadT)

    // 左边数据
    dispatch({
      type: 'schedule/getPageOverviewData',
      payload: payloadT,
      callback: res => {
        // console.log('左 res ', res)
        if (res.success) {
          that.setState({
            leftOverData: res.rows
          })
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
      type: 'schedule/getPageChartsData',
      payload: payloadT,
      callback: res => {
        // console.log('右 res ', res)
        if (res.success) {
          var tempData = res.rows
          if (tempData && tempData.length > 0) {
            tempData.map(item => {
              if (item.details && item.details.length > 0) {
                item.details = that.handeDetails(item.details.sort(that.objSort('productionStatus')))
              }
            })
            that.setState({
              datas: tempData
            })
          }
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

  handeDetails(data) {
    var temp = []
    data.map(itm => {
      // console.log(itm)
      if (itm.productionStatus === 1) {
        temp.unshift(itm)
      } else {
        temp.push(itm)
      }
    })
    return temp
  }

  objSort(prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  handleLeftClick(e) {

    this.setState({
      selectKey: e.key
    })

    this.getPageData(e.key)
  }

  handleProgress(comNum, unNum) {
    var sum = Number(comNum) + Number(unNum)
    var per = (unNum / sum) * 100

    // console.log(comNum, unNum, per)

    var temp = per * 392
    // console.log(num, temp, temp.toFixed(2))

    if (temp <= 0) {
      temp = 1
    }
    return temp.toFixed(2)
  }

  showModal = (key, i) => {
    // console.log(this.state.datas[key],this.state.datas[key].details[i])
    const { plantId, workshopId } = this.state
    const { dispatch } = this.props;
    const that = this

    const selectItm = this.state.datas[key].details[i]

    var workOrderNumT = selectItm.workOrderNum
    var serialNumberT = selectItm.serialNumber
    // console.log('选择', selectItm, '工单号', workOrderNumT, '序列号', serialNumberT)
    // 弹窗数据
    dispatch({
      type: 'schedule/getPageDetailData',
      payload: {
        plantId: plantId,
        workshopId: workshopId,
        workOrderNum: workOrderNumT,
        serialNumber: serialNumberT
      },
      callback: res => {
        // console.log('detail res', res)
        if (res.success) {
          that.setState({
            modalVisible: true,
            modalData: res.rows
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

  };

  handleTime(standard, actual) {
    var temp = '--'
    if (actual && actual > 0) {
      const time = actual - standard
      temp = (time.toFixed(2)) + ' h'
    }

    return temp
  }

  handleOk = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  clearModalData = () => {
    this.setState({
      modalData: []
    });
  }

  getProduceNum = (data) => {
    var temp = 0
    data.map(itm => {
      if (itm.status === 1) {
        temp++
      }
    })
    return temp
  }

  getWaitingNum = (data) => {
    var temp = 0
    data.map(itm => {
      if (itm.status === 2) {
        temp++
      }
    })
    return temp
  }

  getCompleteNum = (data) => {
    var temp = 0
    data.map(itm => {
      if (itm.status === 3) {
        temp++
      }
    })
    return temp
  }

  generateArr(num) {
    var temp = []
    for (let i = 0; i < num; i++) {
      temp.push(i)
    }
    return temp
  }

  renderProduceitem = (data, uKey) => {
    const temp = this.generateArr(data.quantityScheduled)
    // var temp = []
    // arrs.map(itm => {
    //   if (itm.status === 1) {
    //     temp.unshift(itm)
    //   } else {
    //     temp.push(itm)
    //   }
    // })
    return temp.map((itm, index) =>
      <div className={`thumbnail-item ${index < data.quantityProcessing && 'production-item'}`} key={`produce${data.mainItemCode}${uKey}${index}`}></div>
    )
  }

  renderWaitingitem = (data, uKey) => {
    const temp = this.generateArr(data.quantityScheduled)
    // var temp = []
    // data.map(itm => {
    //   if (itm.status === 2) {
    //     temp.unshift(itm)
    //   } else {
    //     temp.push(itm)
    //   }
    // })
    return temp.map((itm, index) =>
      <div className={`thumbnail-item ${index < data.quantityWaiting && 'waiting-item'}`} key={`produce${data.mainItemCode}${uKey}${index}`}></div>
    )
  }

  renderCompleteitem = (data, uKey) => {
    const temp = this.generateArr(data.quantityScheduled)
    // var temp = []
    // data.map(itm => {
    //   if (itm.status === 3) {
    //     temp.unshift(itm)
    //   } else {
    //     temp.push(itm)
    //   }
    // })
    return temp.map((itm, index) =>
      <div className={`thumbnail-item ${index < data.quantityCompleted && 'complete-item'}`} key={`produce${data.mainItemCode}${uKey}${index}`}></div>
    )
  }

  handleImgSrc(status) {
    let src = waitMakingSvg
    if (status == 1) {
      src = makingSvg
    } else if (status == 2) {
      src = comMakingSvg
    }
    return src
  }


  render() {
    const { selectKey, selectArrs, datas, modalVisible, modalData, leftOverData } = this.state

    const menus = (
      <Menu selectedKeys={[selectKey]} onClick={(e) => this.handleLeftClick(e)}>
        {
          selectArrs.map((item, index) => <Menu.Item key={index}>
            {item}
          </Menu.Item>)
        }
      </Menu>
    );

    const customLink = (data, uKey) =>
      <div className="common-thumbnail" key={data.id}>
        <p className="thumbnail-title">{data.mainItemCode}</p>
        <div className="thumbnail-item-container flex-row">
          <div className="fill-flex common-legned-container flex-col">
            <div className="common-legend-title">在制中</div>
            <div className="bottom-content-container flex-row">
              <div className="legend-container flex-row">
                {this.renderProduceitem(data, uKey)}
              </div>
              <div className="right-text fill-flex">
                {/* {this.getProduceNum(data.parts)} */}
                {data.quantityProcessing}
              </div>
            </div>
          </div>
          <div className="fill-flex common-legned-container flex-col">
            <div className="common-legend-title">待生产</div>
            <div className="bottom-content-container flex-row">
              <div className="legend-container flex-row">
                {this.renderWaitingitem(data, uKey)}
              </div>
              <div className="right-text fill-flex">
                {/* {this.getWaitingNum(data.parts)} */}
                {data.quantityWaiting}
              </div>
            </div>
          </div>
          <div className="fill-flex common-legned-container flex-col">
            <div className="common-legend-title">已完成</div>
            <div className="bottom-content-container flex-row">
              <div className="legend-container flex-row">
                {this.renderCompleteitem(data, uKey)}
              </div>
              <div className="right-text fill-flex">
                {/* {this.getCompleteNum(data.parts)} */}
                {data.quantityCompleted}
              </div>
            </div>
          </div>
        </div>
      </div>

    return (
      <div className="production-schedule-page flex-row">
        <div className="left-thumbnail-container flex-col">
          <div className="top-thumbnail-container fill-flex">
            {
              (leftOverData && leftOverData.length > 0) ?
                <Anchor affix={false} getContainer={() => document.getElementById('rightContent')}>
                  {
                    leftOverData.map((item, index) =>
                      <Link key={`leftO${index}`} href={`#${item.mainItemCode}`} title={customLink(item, index)} />
                    )
                  }
                </Anchor>
                : <div className="no-data-container">
                  {
                    this.props.loading.global ? <Spin /> : <Empty image={require('../../../public/empty.svg')} />
                  }
                </div>
            }
          </div>
          <div className="common-bottom-select">
            <Dropdown overlay={menus} placement="topLeft" trigger={['click']}>
              <div className="common-select-container flex-row">
                <p className="select-val fill-flex">{selectArrs[selectKey]}</p>
                <span className="select-icon iconfont icon-arrow"></span>
              </div>
            </Dropdown>
          </div>
        </div>

        <div className="part-content-container flex-col fill-flex" id="rightContent" ref={el => (this.rightContent = el)}>
          {
            (datas && datas.length > 0) ? <>

              {
                datas.map((item, index) =>
                  <div className="common-card-container" key={`card${item.itemCode}`} id={item.itemCode}>
                    <p className="card-title">{item.itemCode}</p>
                    <div className="card-item-container flex-row">
                      {
                        item.details.map((itm, i) =>
                          <div
                            className={`common-card-item ${itm.productionStatus == 0 ? 'waiting-card' : ''} ${itm.productionStatus == 2 ? 'completed-card' : ''}`}
                            key={`itm${itm.itemCode}${i}`}
                            onClick={() => this.showModal(index, i)}>
                            <div className="bg-progress-container">
                              {
                                itm.productionStatus == 1 &&
                                <svg width="250px" height="250px" viewBox="0 0 250 250">
                                  <defs>
                                    <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="#45D2FF" />
                                      <stop offset="100%" stopColor="#4586FF" />
                                    </linearGradient>
                                  </defs>
                                  <g id="icon/面板进度条svg" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <path d="M242,0 L8,0 C3.581722,0 0,3.581722 0,8 L0,242 C0,246.418278 3.581722,250 8,250 L242,250 C246.418278,250 250,246.418278 250,242 L250,8 C250,3.581722 246.418278,0 242,0 Z M8,2 L242,2 C245.313708,2 248,4.6862915 248,8 L248,242 C248,245.313708 245.313708,248 242,248 L8,248 C4.6862915,248 2,245.313708 2,242 L2,8 C2,4.6862915 4.6862915,2 8,2 Z" id="路径-6" fillOpacity="0.1" fill="#FFFFFF" fillRule="nonzero"></path>
                                    <path d="M125,1 L242,1 C245.865993,1 249,4.13400675 249,8 L249,242 C249,245.865993 245.865993,249 242,249 L8,249 C4.13400675,249 1,245.865993 1,242 L1,8 C1,4.13400675 4.13400675,1 8,1 L125,1 L125,1 Z" id="Path6" strokeDasharray={`${this.handleProgress(itm.sumOfUnfinishedStandardHours, itm.sumOfFinishedStandardHours)}% 392%`} strokeWidth="2px" stroke="url(#linear)" fill="none"></path>
                                  </g>
                                </svg>
                              }
                            </div>
                            <div className="card-content-container flex-col">
                              <div className="fill-flex top-status-cotnainer flex-col">
                                {
                                  itm.productionStatus == 1 &&
                                  <div className="status-text flex-row">
                                    <img className="produce-img" src={require('../../../public/making.svg')} />
                                磁体连接
                              </div>
                                }
                                {
                                  itm.productionStatus == 0 &&
                                  <img className="waiting-img" src={require('../../../public/waiting.png')} />
                                }
                                {
                                  itm.productionStatus == 2 &&
                                  <img className="complete-img" src={require('../../../public/completed.svg')} />
                                }
                              </div>
                              <div className="fill-flex center-info-cotnainer flex-col">
                                <p className="part-name">{itm.workOrderNum}</p>
                                <p className="part-id">{itm.serialNumber}</p>
                              </div>
                              <div className="fill-flex bottom-time-cotnainer flex-col">
                                <p className="time-text flex-row"><img className="clock-img" src={require('../../../public/clock.svg')} />开始生产时间</p>
                                <p className="end-time">{itm.startTime}</p>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                )
              }
            </>
              : <div className="no-data-container">
                {
                  this.props.loading.global ? <Spin /> : <Empty image={require('../../../public/empty.svg')} />
                }
              </div>
          }

        </div>

        <Modal
          centered
          closeIcon={<span className="iconfont icon-close"></span>}
          title={(modalData[0] && modalData[0].workOrderNum) ? modalData[0].workOrderNum : '部件'}
          visible={modalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
          afterClose={() => this.clearModalData()}
          footer={null}
          destroyOnClose
          width="1200px"
          bodyStyle={{ padding: '30px', height: '680px' }}
        >
          <div className="modal-content-container flex-col">
            <p className="modal-common-title flex-row">基本信息</p>
            <div className="part-info-container flex-row">
              <div className="basic-info-item">
                <p className="label">工单号</p>
                <p className="value">{(modalData[0] && modalData[0].workOrderNum) ? modalData[0].workOrderNum : '--'}</p>
              </div>
              <div className="basic-info-item">
                <p className="label">物料号</p>
                <p className="value">{(modalData[0] && modalData[0].itemCode) ? modalData[0].itemCode : '--'}</p>
              </div>
              <div className="basic-info-item">
                <p className="label">计划开始时间</p>
                <p className="value">{(modalData[0] && modalData[0].startTime) ? modalData[0].startTime : '--'}</p>
              </div>
              <div className="basic-info-item">
                <p className="label">计划完工时间</p>
                <p className="value">{(modalData[0] && modalData[0].endTime) ? modalData[0].endTime : '--'}</p>
              </div>
              <div className="basic-info-item">
                <p className="label">序列号</p>
                <p className="value">{(modalData[0] && modalData[0].serialNumber) ? modalData[0].serialNumber : '--'}</p>
              </div>
              <div className="basic-info-item">
                <p className="label">物料描述</p>
                <p className="value">{(modalData[0] && modalData[0].itemDesc) ? modalData[0].itemDesc : '--'}</p>
              </div>
              <div className="basic-info-item">
                <p className="label">实际开始时间</p>
                <p className="value">{(modalData[0] && modalData[0].actualStartTime) ? modalData[0].actualStartTime : '--'}</p>
              </div>
              <div className="basic-info-item">
                <p className="label">实际完工时间</p>
                <p className="value">{(modalData[0] && modalData[0].actualEndTime) ? modalData[0].actualEndTime : '--'}</p>
              </div>
            </div>
            <p className="modal-common-title flex-row">工序进度</p>
            <div className="fill-flex bottom-table-contianer">
              <div className="custom-table-container flex-row">
                <div className="common-col-item flex-col first-col">
                  <div className="label-row"></div>
                  <div className="dot-row flex-row"></div>
                  <div className="standard-row">标准工时</div>
                  <div className="actual-row">实际工时</div>
                  <div className="overtime-row">超时时间</div>
                </div>
                {
                  (modalData && modalData.length > 0) ? <>
                    {
                      modalData.map((item, index) =>
                        <div className="common-col-item flex-col fill-flex" key={`mdetil${index}`}>
                          <div className="label-row">{item.mesOperationSeqNum}{item.mesOperationSeqDesc}</div>
                          <div className="dot-row flex-row"><img className="dot-img" src={this.handleImgSrc(item.productionStatus)} /></div>
                          <div className="standard-row">{item.mesStandardHours ? `${item.mesStandardHours} h` : '--'}</div>
                          <div className="actual-row">{item.mesActualHours ? `${item.mesActualHours} h` : '--'}</div>
                          <div className="overtime-row">{this.handleTime(item.mesStandardHours, item.mesActualHours)}</div>
                        </div>
                      )}
                  </>
                    :
                    <div className="common-col-item flex-col fill-flex">
                      <div className="label-row"></div>
                      <div className="dot-row flex-row"><div className="center-dot"></div></div>
                      <div className="standard-row">--</div>
                      <div className="actual-row">--</div>
                      <div className="overtime-row">--</div>
                    </div>
                }
              </div>
            </div>
          </div>
        </Modal>
      </div >
    );
  }
}

export default ProductionSchedule;

