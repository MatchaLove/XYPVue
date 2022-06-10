import request from '@/utils/request'

export function fetchCredit(data) {
  // console.log(data)
  return request({
    url: '/credit/creditInquiry',
    method: 'get',
    params: data
  })
}
export function confirmsubmit(data) {
  return request({
    url: '/confirmation/submit',
    method: 'post',
    data
  })
}
export function fetchCreditLineList(data) {
  return request({
    url: '/creditGrading/fetchlist',
    method: 'get',
    params: data
  })
}
export function creditGrading(data) {
  return request({
    url: '/creditGrading/updatecredit',
    method: 'post',
    data
  })
}
export function confirmationDownload(data) {
  return request({
    url: '/creditGrading/download',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
export function getData(data) {
  return request({
    url: '/creditGrading/getdata',
    method: 'get',
    params: data
  })
}
export function deleteEvaluation(data) {
  return request({
    url: '/creditGrading/delete',
    method: 'get',
    params: data
  })
}

