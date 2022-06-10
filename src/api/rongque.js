import request from '@/utils/request'

// TODO 根据后端修改路径
export function fetchProgress(data) {
  return request({
    url: '/application/getprogress',
    method: 'get',
    params: data
  })
}
export function fetchBusinessList(data) {
  return request({
    url: '/business/fetchlist',
    method: 'get',
    params: data
  })
}
export function getApplicatonExist(data) {
  return request({
    url: '/examination/select',
    method: 'get',
    params: data
  })
}
export function getApplicatonFileExist(data) {
  return request({
    url: '/application/select',
    method: 'get',
    params: data
  })
}
export function getCompanyInfo(data) {
  return request({
    url: '/application/getInfo',
    method: 'get',
    params: data
  })
}

export function getMainFile(data) {
  return request({
    url: '/application/getMainFile',
    method: 'get',
    params: data
  })
}

export function getAllFile(data) {
  return request({
    url: '/application/getAllFile',
    method: 'get',
    params: data
  })
}
export function getSecondFile(data) {
  return request({
    url: '/application/getSecondFile',
    method: 'get',
    params: data
  })
}
export function getBusinessCredit(data) {
  return request({
    url: '/business/getmincredit',
    method: 'get',
    params: data
  })
}
export function fetchExaminationList(data) {
  return request({
    url: '/examination/fetchlist',
    method: 'get',
    params: data
  })
}
export function updateExaminate(data) {
  return request({
    url: '/examination/updateExaminate',
    method: 'post',
    data
  })
}
export function materialDownload(data) {
  return request({
    url: '/examination/download',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
export function getMaterialFile(data) {
  return request({
    url: '/material/download',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
export function examinationDownload(data) {
  return request({
    url: '/examination/download',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
