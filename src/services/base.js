/**
 * 基础公共接口
 */
import request from './request';

export async function getCheckPackage() {
  // console.log('start request')
  return request('/checkPackage');
}


// 生产效率
export async function getEfficiencyData(params) {
  return request('/efficiency/data', { params });
}

// 生产进度
export async function getScheduleOverviewData(params) {
  return request('/progress/overview', { params });
}

export async function getScheduleChartsData(params) {
  return request('/progress/charts', { params });
}

export async function getScheduleDetailData(params) {
  return request('/progress/detail', { params });
}

// 损失工时
export async function getLostTimeData(params) {
  return request('/hour/loss/data', { params });
}