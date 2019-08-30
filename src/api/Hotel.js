import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/Hotel',
    method: 'post',
    data
  })
}

export function del(poiid) {
  return request({
    url: 'api/Hotel/' + poiid,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/Hotel',
    method: 'put',
    data
  })
}
