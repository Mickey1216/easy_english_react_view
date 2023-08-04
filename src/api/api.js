import request from './index';

// 用户登录接口
export const loginAPI = (data) => request('user/login', 'POST', data);

// 用户注册接口
export const registerAPI = (data) => request('user/register', 'POST', data);

// 将用户名存入配置文件中
export const createConfigAPI = (data) => request('config/add', 'POST', data);

// 从有道词典获取单词信息
export const getWordInfoFromYoudaoAPI = (data) => request('/youdao/jsonapi', 'POST', data);

// 添加单词
export const addWordAPI = (data) => request('word/add', 'POST', data);

// 获取所有单词
export const getAllWordsAPI = (data) => request('word/getAll', 'POST', data);