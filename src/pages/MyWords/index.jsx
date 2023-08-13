import React, { useEffect, useState } from "react";
import { Button, Upload, message, Table, Popconfirm, Avatar } from "antd";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import "./index.css";
import WordDialog from "../../components/WordDialog";
import {
  getAllWordsAPI,
  deleteWordsAPI,
  getWordsCountAPI,
  deleteWordAPI
} from "../../api/api";

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

const MyWords = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(); // 头像的url
  const avatarUploadURL = "http://localhost:3005/api/user/uploadAvatar"; // 头像上传的url

  // 头像上传的回调函数
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // 获取头像的url
      getBase64(info.file.originFileObj, () => {
        setLoading(false);
      });
      
      localStorage.setItem("avatarUrl", info.file.response.fileUrl);
      setImageUrl(info.file.response.fileUrl)
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
    setIsAdd(true);
  };
  // 对话框的取消按钮点击事件
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsAdd(true);
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
      dataIndex: "pronunciation",
      key: "pronunciation",
    },
    {
      title: "释义",
      dataIndex: "explanation",
      key: "explanation",
    },
    {
      title: "例子",
      dataIndex: "sentence",
      key: "sentence",
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
      render: (text, record) => 
        wordsList.length > 0 ? (
          <div>
            <Button onClick={editClick(record.key)}>编辑</Button>
            <Popconfirm title="确定删除吗?" onConfirm={delClick(record.key)} okText="确定" cancelText="取消">
              <Button>删除</Button>
            </Popconfirm>
          </div>
        ) : null
    },
  ];
  const [wordsList, setWordsList] = useState([]); // 表格数据
  const [disableFlag, setDisableFlag] = useState(false); // 是否禁用【选择多个】/【删除选择】/【遮住释义】按钮，默认不禁用
  const [eyeHideFlag, setEyeHideFlag] = useState(true); // 遮住释义flag
  const [checkedOpenFlag, setCheckedOpenFlag] = useState(false); // 是否打开【选择多个】按钮
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中的行的key
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  }); // 分页器
  
  const [fulfilledInfo, setFulfilledInfo] = useState({}); // 单词信息

  // 获取单词总数
  const fetchWordsCount = () => {
    getWordsCountAPI({ belonging: Cookies.get("userName") }).then((res) => {
      if (res.code === 200) {
        setPagination({
          ...pagination,
          total: res.data,
        });
      }
    });
  };

  // 获取该用户的所有单词
  const fetchWordsList = () => {
    getAllWordsAPI({
      belonging: Cookies.get("userName"),
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    }).then((res) => {
      if (res.code === 200) {
        // 将单词列表的数据转换为表格的数据: 添加key属性，其他字段不变
        const tempList = res.data.map((item) => {
          return {
            key: item.id,
            ...item,
            backup: item.explanation,
          };
        });
        // 更新单词列表
        setWordsList((wordsList) => {
          // 如果单词列表为空，则禁用这三个按钮
          wordsList = tempList;
          setDisableFlag(wordsList && wordsList.length === 0);

          return wordsList;
        });
      }
    });
  };

  useEffect(() => {
    fetchWordsList();
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchWordsCount();
  }, [wordsList.length]);

  useEffect(() => {
    localStorage.getItem("avatarUrl") && setImageUrl(localStorage.getItem("avatarUrl"));
  }, [imageUrl]);

  const refreshWordList = (data, type) => {
    if (type === "add") {
      data.key = data.id;
      setWordsList([...wordsList, data]);
    } else {
      const newList = wordsList.map(item => {
        if (item.id === data.id) {
          item.explanation = data.explanation;
          item.note = data.note;
          item.pronunciation = data.pronunciation;
          item.sentence = data.sentence;
        }
        return item;
      })

      setWordsList(newList);
    }
  };

  // 遮住释义按钮点击事件
  const eyeHideClick = () => {
    setEyeHideFlag(!eyeHideFlag);

    setWordsList(
      wordsList.map((item) => {
        return {
          ...item,
          explanation: eyeHideFlag ? "******" : item.backup,
        };
      })
    );
  };

  // 删除选择按钮点击事件
  const deleteSelectedBtnClick = () => {
    deleteWordsAPI({ ids: selectedRowKeys }).then((res) => {
      if (res.code === 200) {
        message.success("删除成功！");
        // 重新获取单词列表
        fetchWordsList();
        setSelectedRowKeys([]);
      }
    });
  };

  // 表格变化
  const onTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 编辑按钮点击事件
  const editClick = (key) => {
    return () => {
      setFulfilledInfo(wordsList.find((item) => item.key === key));

      setIsAdd(false);
      setIsModalOpen(true);
    };
  }

  // 删除按钮点击事件
  const delClick = (key) => {
    return () => {
      deleteWordAPI(key).then((res) => {
        if (res.code === 200) {
          message.success("删除成功！");
          // 重新获取单词列表
          fetchWordsList();
        }
      });
    };
  }

  return (
    <>
      {/* 头像上传 */}
      <div className="profile">
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          action={avatarUploadURL}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <Avatar
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
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
          <Button
            type="primary"
            className="btn"
            disabled={disableFlag}
            onClick={() => {
              setCheckedOpenFlag(!checkedOpenFlag);
            }}
          >
            选择多个
          </Button>
          {/* 【删除选择】 */}
          <Button
            danger
            icon={<DeleteOutlined />}
            className="btn"
            disabled={disableFlag || selectedRowKeys.length === 0}
            onClick={deleteSelectedBtnClick}
          >
            删除选择
          </Button>
          {/* 【遮住释义】/【让我看看】 */}
          <Button
            icon={eyeHideFlag ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            className="btn"
            onClick={eyeHideClick}
            disabled={disableFlag}
          >
            {eyeHideFlag ? "遮住释义" : "让我看看"}
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
          <Table
            columns={columns}
            dataSource={wordsList}
            rowSelection={checkedOpenFlag ? rowSelection : null}
            onChange={onTableChange}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `共${total}条`,
            }}
            scroll={
              {y: 400}
            }
          />
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
          refreshWordList={refreshWordList}
          fulfilledInfo={fulfilledInfo}
        />
      </div>
    </>
  );
};

export default MyWords;
