import request from './index';

// 用户登录接口
export const loginAPI = (data) => request('user/login', 'POST', data);
// 用户注册接口
export const registerAPI = (data) => request('user/register', 'POST', data);

// 将用户名存入配置文件中
export const createConfigAPI = (data) => request('config/add', 'POST', data);
// 修改单词显示个数
export const changeWordNumAPI = (data) => request('/config/update/page_size', 'PATCH', data);
// 修改单词发音类型
export const changeWordPronunciationAPI = (data) => request('/config/update/pronunciation_type', 'PATCH', data);
// 修改单词显示类型
export const changeWordShowTypeAPI = (data) => request('/config/update/is_marked_only', 'PATCH', data);

// 从有道词典获取单词信息
export const getWordInfoFromYoudaoAPI = (data) => request('/youdao/jsonapi', 'POST', data);
// 添加单词
export const addWordAPI = (data) => request('word/addWord', 'POST', data);
// 获取所有单词
export const getAllWordsAPI = (data) => request('word/getWordsList', 'POST', data);
// 获取单词的总个数
export const getWordsCountAPI = (data) => request('word/getWordsCount', 'POST', data);
// 获取复习单词
export const getReviewWordsAPI = (data) => request('word/getReviewWords', 'POST', data);
// 获取复习单词的总个数
export const getReviewWordsCountAPI = (data) => request('word/getReviewWordsCount', 'POST', data);