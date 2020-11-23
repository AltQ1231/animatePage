import {
  getEfficiencyData
} from '@/services/base.js';

export default {
  namespace: 'efficiency',
  state: [
    { name: 'dva', id: 'dva' },
    { name: 'antd', id: 'antd' },
  ],
  effects: {
    *getEfficiencyData1({ callback }, { call, put, select }) {
      const response = yield call(getCheckPackage);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getEfficiencyPageData({ payload, callback }, { call, put }) {
      const response = yield call(getEfficiencyData, payload);
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
