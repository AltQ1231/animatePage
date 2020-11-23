import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import './index.less';
import zhCN from 'antd/es/locale/zh_CN';

const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <p>Data Not Found</p>
  </div>
);

class BasicLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <ConfigProvider locale={zhCN} renderEmpty={customizeRenderEmpty}>
        <div className="basic-layout" >
          {this.props.children}
        </div>
      </ConfigProvider>
    );
  }
}
export default BasicLayout;
