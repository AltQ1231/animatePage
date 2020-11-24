/**
 * 基础公共接口
 */
import request from './request';

export async function getCheckPackage() {
  // console.log('start request')
  return request('/checkPackage');
}
