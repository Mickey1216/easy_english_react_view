import React, { useEffect, useState } from "react";
import { Button, Upload, message, Table } from "antd";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import "./MyWords.css";
import WordDialog from "../components/WordDialog";
import { getAllWordsAPI } from "../api/api";

// 将图片转为base64编码
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

// 头像上传之前的检查
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("只能上传JPG/PNG格式!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片大小必须小于2MB!");
  }
  return isJpgOrPng && isLt2M;
};

// 表格列
const columns = [
  {
    title: "单词",
    dataIndex: "word",
    key: "word",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "音标",
    dataIndex: "soundmark",
    key: "soundmark",
  },
  {
    title: "释义",
    dataIndex: "meaning",
    key: "meaning",
  },
  {
    title: "例子",
    dataIndex: "example",
    key: "example",
  },
  {
    title: "备注",
    dataIndex: "note",
    key: "note",
  },
  {
    title: "操作",
    dataIndex: "operate",
    key: "operate",
  },
];

const MyWords = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(); // 头像的url

  // 头像上传的回调函数
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  // 头像上传按钮
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传头像
      </div>
    </div>
  );

  const [pronunciationSrc, setPronunciationSrc] = useState(null); // 单词发音的url
  // 获取单词发音来源
  const speakWord = (word) => {
    setPronunciationSrc(`
    /youdao/dictvoice?type=${Cookies.get(
      "wordsConfigPronunciation"
    )}&audio=${word}`);
  };
  // ended事件在音频/视频(audio/video)播放完成后触发。该事件通常用于提示播放完成的信息，例如 "谢谢收听", "谢谢观看" 等。
  const speakEnded = () => {
    setPronunciationSrc(null);
  };

  const [isAdd, setIsAdd] = useState(true); // 是否是添加单词
  const [isModalOpen, setIsModalOpen] = useState(false); // 是否打开对话框
  // 添加单词按钮点击事件
  const addWordBtnClick = () => {
    setIsAdd(true);
    setIsModalOpen(true);
  };
  // 对话框的确定按钮点击事件
  const handleOk = () => {
    setIsModalOpen(false);
  };
  // 对话框的取消按钮点击事件
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [wordsList, setWordsList] = useState([]); // 表格数据
  // 获取该用户的所有单词
  useEffect(() => {
    getAllWordsAPI({ belonging: Cookies.get("userName") }).then((res) => {
      if(res.code === 200){
        // 将单词列表的数据转换为表格的数据: 添加key属性，其他字段不变
        const tempList = res.wordsList.map((item) => {
          return {
            key: item.id,
            ...item,
          };
        });
        setWordsList(tempList);
      }
    });
  }, []);

  return (
    <>
      {/* 头像上传 */}
      <div className="profile">
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          action="/api/user/upload/avatar"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100%",
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>

      <div className="my-words-ct">
        {/* 顶部按钮组 */}
        <div className="top-button-group">
          {/* 【选择多个】/【取消选择】 */}
          <Button type="primary" className="btn">
            选择多个
          </Button>
          {/* 【删除选择】 */}
          <Button danger icon={<DeleteOutlined />} className="btn">
            删除选择
          </Button>
          {/* 【遮住释义】/【让我看看】 */}
          <Button icon={<EyeInvisibleOutlined />} className="btn">
            遮住释义
          </Button>
          {/* 添加单词 */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addWordBtnClick}
          >
            添加单词
          </Button>
        </div>

        {/* 单词列表 */}
        <div className="words-list">
          <Table columns={columns} dataSource={wordsList} />
        </div>

        {/* 播放单词发音 */}
        <audio src={pronunciationSrc} autoPlay onClick={speakEnded}>
          对不起，您的浏览器版本无法使用音频！
        </audio>

        {/* 添加/修改单词对话框 */}
        <WordDialog
          isAdd={isAdd}
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      </div>
    </>
  );
};

export default MyWords;
