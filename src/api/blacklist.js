import request from '@/utils/request'

export function fetchList(data) {
  // console.log(data)
  return request({
    url: '/blacklist/fetchlist',
    method: 'get',
    params: data
  })
}
export function addBlackList(data) {
  return request({
    url: '/blacklist/addblacklist',
    method: 'post',
    data
  })
}
export function deleteBlackList(data) {
  return request({
    url: '/blacklist/delete',
    method: 'post',
    data
  })
}
