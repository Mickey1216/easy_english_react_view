import { Modal } from "antd";
import { useState } from "react";
import Cookies from "js-cookie";
import "./index.css";
import { addWordAPI } from "../../api/api";

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
  // 模态框的确认和取消
  const okClick = () => {
    // 将单词传给后端存储
    addWordAPI(addWord).then(res => {
      console.log(res);
    })

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
          <span>单词</span>{" "}
          <input
            placeholder={props.isAdd ? "" : "单词"}
            value={addWord.word}
            onChange={wordChange}
          />
        </div>
        <div className="word-input">
          音标{" "}
          <input value={addWord.pronunciation} onChange={pronunciationChange} />
        </div>
        <div className="word-input">
          释义{" "}
          <input value={addWord.explanation} onChange={explanationChange} />
        </div>
        <div className="word-input">
          例子 <input value={addWord.sentence} onChange={sentenceChange} />
        </div>
        <div className="word-input">
          备注 <input value={addWord.note} onChange={noteChange} />
        </div>
      </Modal>
    </div>
  );
};

export default WordDialog;
