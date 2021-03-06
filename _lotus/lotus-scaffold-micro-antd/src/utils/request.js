import axios from 'axios'
import { notification } from 'antd'
import { Link } from 'react-router-dom'
import proxy from '../mock/'
import MockAdapter from 'axios-mock-adapter'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  }

  const errortext = codeMessage[response.status] || response.statusText
  notification.error({
    message: `请求错误 ${response.status}: ${response.config.url}`,
    description: errortext,
  })
  // const error = new Error(errortext)
  // error.name = response.status
  // error.response = response
  // throw error
}

// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做某事，比如说 设置loading动画显示
  return config
}, error => {
  // 请求错误时做些事
  return Promise.reject(error)
})

// 拦截器,response之后
axios.interceptors.response.use(function (response) {
  return checkStatus(response)
}, function (e) {
  checkStatus(e.response)
  return Promise.reject(e)
})

var mock = new MockAdapter(axios)

Object.keys(proxy).forEach((item) => {
  let result = item.split(':')
  let method = result[0].toUpperCase()
  let url = result[1]
  switch (method) {
    case 'GET':
      mock.onGet(url).reply(200, proxy[item].body || proxy[item])
      break
    case 'POST':
      mock.onPost(url, proxy[item].params).reply(200, proxy[item].body || proxy[item])
      break
    case 'DELETE':
      mock.onDelete(url, proxy[item].params).reply(200, proxy[item].body || proxy[item])
      break
  }
})

export default axios
export const post = axios.post
export const put = axios.put
export const get = axios.get
export const del = (url, params) => {
  return axios.delete(url, { params })
}
