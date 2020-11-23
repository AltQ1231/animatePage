import {
  getScheduleOverviewData,
  getScheduleChartsData,
  getScheduleDetailData
} from '@/services/base.js';

export default {
  namespace: 'schedule',
  state: [
  ],
  effects: {
    *getPageOverviewData({ payload, callback }, { call, put }) {
      const response = yield call(getScheduleOverviewData, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getPageChartsData({ payload, callback }, { call, put }) {
      const response = yield call(getScheduleChartsData, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getPageDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getScheduleDetailData, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },
  reducers: {
    checkPackage(state, { payload = [] }) {
      console.log('home checkPackage', state, payload)
      return { ...state, payload }
    },
  },
};
