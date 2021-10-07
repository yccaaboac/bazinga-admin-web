import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: '/api/errorLog/' + id,
    method: 'get'
  })
}

export function delAllError() {
  return request({
    url: '/api/errorLog',
    method: 'delete'
  })
}

export function delAllInfo() {
  return request({
    url: '/api/operationLog',
    method: 'delete'
  })
}
