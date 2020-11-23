import {
  getLostTimeData
} from '@/services/base.js';

export default {
  namespace: 'losttime',
  state: [
  ],
  effects: {
    *getLostTimePageData({ payload, callback }, { call, put }) {
      const response = yield call(getLostTimeData, payload);
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
