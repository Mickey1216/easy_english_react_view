import { Modal, message } from "antd";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { addWordAPI, updateWordAPI } from "../../api/api";
import "./index.css";

const WordDialog = (props) => {
  // 添加的单词
  const [addWord, setAddWord] = useState({
    word: "",
    pronunciation: "",
    explanation: "",
    sentence: "",
    note: "",
    belonging: Cookies.get("userName"),
    mark: 0,
  });

  // 单词改变
  const wordChange = (e) => {
    setAddWord({
      ...addWord,
      word: e.target.value,
    });
  };
  // 音标改变
  const pronunciationChange = (e) => {
    setAddWord({
      ...addWord,
      pronunciation: e.target.value,
    });
  };
  // 释义改变
  const explanationChange = (e) => {
    setAddWord({
      ...addWord,
      explanation: e.target.value,
    });
  };
  // 例子改变
  const sentenceChange = (e) => {
    setAddWord({
      ...addWord,
      sentence: e.target.value,
    });
  };
  // 备注改变
  const noteChange = (e) => {
    setAddWord({
      ...addWord,
      note: e.target.value,
    });
  };
  // 模态框的确认
  const okClick = () => {
    // 新增单词
    if (props.isAdd) {
      // 将单词传给后端存储
      addWordAPI(addWord).then((res) => {
        // 通知父组件刷新单词列表
        props.refreshWordList(res, "add");
        // 提示单词添加成功
        message.success("单词添加成功");
      });
    } else {
      // 修改单词
      if (
        addWord.pronunciation === props.fulfilledInfo.pronunciation &&
        addWord.explanation === props.fulfilledInfo.explanation &&
        addWord.sentence === props.fulfilledInfo.sentence &&
        addWord.note === props.fulfilledInfo.note
      ) {
        props.handleOk();
        return;
      }

      // 将单词传给后端更新
      updateWordAPI(props.fulfilledInfo.id, addWord).then((res) => {
        addWord["id"] = props.fulfilledInfo.id;
        // 通知父组件刷新单词列表
        props.refreshWordList(addWord, "update");
        // 提示单词更新成功
        message.success("单词更新成功");
      });
    }

    // 清空输入框
    setAddWord({
      word: "",
      pronunciation: "",
      explanation: "",
      sentence: "",
      note: "",
    });

    // 关闭模态框
    props.handleOk();
  };
  // 模态框的取消
  const cancelClick = () => {
    props.handleCancel();
    // 清空输入框
    setAddWord({
      word: "",
      pronunciation: "",
      explanation: "",
      sentence: "",
      note: "",
    });
  };

  useEffect(() => {
    if (!props.isAdd) {
      // 单词修改
      setAddWord({
        pronunciation: props.fulfilledInfo.pronunciation,
        explanation: props.fulfilledInfo.explanation,
        sentence: props.fulfilledInfo.sentence,
        note: props.fulfilledInfo.note,
      });
    }
  }, [props.isAdd, props.fulfilledInfo]);

  return (
    <div className="word-dialog">
      <Modal
        title={props.isAdd ? "添加单词" : "修改单词"}
        open={props.isModalOpen}
        onOk={okClick}
        onCancel={cancelClick}
        okText="确认"
        cancelText="取消"
      >
        <div className="word-input">
          <span>单词</span>
          <input
            value={props.isAdd ? addWord.word : props.fulfilledInfo.word}
            onChange={wordChange}
            disabled={!props.isAdd}
          />
        </div>
        <div className="word-input">
          <span>音标</span>
          <input value={addWord.pronunciation} onChange={pronunciationChange} />
        </div>
        <div className="word-input">
          <span>释义</span>
          <input value={addWord.explanation} onChange={explanationChange} />
        </div>
        <div className="word-input">
          <span>例子</span>
          <input value={addWord.sentence} onChange={sentenceChange} />
        </div>
        <div className="word-input">
          <span>备注</span>
          <input value={addWord.note} onChange={noteChange} />
        </div>
      </Modal>
    </div>
  );
};

export default WordDialog;
