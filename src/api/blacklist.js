import request from '@/utils/request'

export function fetchList(data) {
  console.log(data)
  return request({
    url: '/blacklist/fetchlist',
    method: 'get',
    params: data
  })
}
