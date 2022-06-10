import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}

export function signUp(data) {
  return request({
    url: '/user/signup',
    method: 'post',
    data
  })
}
export function fetchUserList(data) {
  return request({
    url: '/user/fetchlist',
    method: 'get',
    params: data
  })
}
export function updateUser(data) {
  return request({
    url: '/user/updateuser',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/user/adduser',
    method: 'post',
    data
  })
}
export function getCompanyDetails(data) {
  return request({
    url: '/user/getcompany',
    method: 'get',
    params: data
  })
}
export function qualiDownload(data) {
  return request({
    url: '/user/download',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
