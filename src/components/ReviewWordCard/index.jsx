import { StarOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./index.css";
import { useMemo } from "react";

const ReviewWordCard = (props) => {
  // 【< prev】
  const prevBtnDisable = useMemo(() => {
    return !props.question.index;
  }, [props.question.index]);

  // 【next >】
  const nextBtnDisable = useMemo(() => {
    return props.question.index === props.reviewWordsLen - 1;
  }, [props.question.index, props.reviewWordsLen]);

  // 【< prev】- 点击事件
  const prevQuestionClick = () => {
    // this.$emit("prevQuestionEvent");
    props.prevQuestionEvent();
  };

  // 【next >】- 点击事件
  const nextQuestionClick = () => {
    // this.$emit("nextQuestionEvent");
    props.nextQuestionEvent();
  };

  // 选中某一选项
  const chooseAns = () => {
    return (chooseAns) => {
      if (chooseAns === props.question.done || props.question.reveal) return;

      // this.$emit("questionDid", chooseAns, chooseAns === this.question.ans);
    };
  };

  // 单词标记修改事件 - 点击
  const wordMarkChange = () => {
    // this.$emit(
    //   "wordMarkChangeEvent",
    //   this.question.word,
    //   this.question.mark === "0" ? "1" : "0"
    // );
  };

  return (
    // 复习单词卡片
    <div className="card-item">
      {/* 正确祝贺图片、单词、标记 */}
      <div className="card-top">
        {props.question.reveal && props.question.doneRes ? (
          <img
            src="../../assets/right.png"
            alt="正确祝贺"
            style={{
              height: "142px",
              width: "200px",
              position: "absolute",
              left: "0px",
            }}
          />
        ) : null}
        <div className="card-word">{props.question.word}</div>
        <div className="card-mark">
          {props.question.mark === "0" ? (
            <StarOutlined className="fa" onClick={wordMarkChange} />
          ) : (
            <StarOutlined className="fa" onClick={wordMarkChange} />
          )}
        </div>
      </div>
      {/* 单词音标 */}
      <div className="card-pron">{props.question.pronunciation}</div>
      {/* 单词例句 */}
      <div className="card-sentence">{props.question.sentence}</div>
      {/* 单词释义选项 */}
      <div className="card-btns">
        {/* 【< prev】 */}
        <div className="card-change">
          <Button
            className="change-word"
            disabled={prevBtnDisable}
            onClick={prevQuestionClick}
            type="text"
          >
            &lt;&nbsp;prev
          </Button>
        </div>
        {/* 选项（共4个） */}
        <div className="card-options">
          <div
            onClick={chooseAns(0)}
            className={`'card-option' ${
              props.question.done === 0 ? "card-option-active" : ""
            } ${
              props.question.reveal &&
              !props.question.doneRes &&
              props.question.done === 0
                ? "card-option-done-wrong"
                : ""
            } ${
              props.question.reveal &&
              props.question.done !== -1 &&
              props.question.ans === 0
                ? "card-option-done-right"
                : ""
            }`}
          >
            {props.question.options[0]}
          </div>
          <div
            onClick={chooseAns(1)}
            className={`'card-option' ${
              props.question.done === 1 ? "card-option-active" : ""
            } ${
              props.question.reveal &&
              !props.question.doneRes &&
              props.question.done === 1
                ? "card-option-done-wrong"
                : ""
            } ${
              props.question.reveal &&
              props.question.done !== -1 &&
              props.question.ans === 1
                ? "card-option-done-right"
                : ""
            }`}
          >
            {props.question.options[1]}
          </div>
          <div
            onClick={chooseAns(2)}
            className={`'card-option' ${
              props.question.done === 2 ? "card-option-active" : ""
            } ${
              props.question.reveal &&
              !props.question.doneRes &&
              props.question.done === 2
                ? "card-option-done-wrong"
                : ""
            } ${
              props.question.reveal &&
              props.question.done !== -1 &&
              props.question.ans === 2
                ? "card-option-done-right"
                : ""
            }`}
          >
            {props.question.options[2]}
          </div>
          <div
            onClick={chooseAns(3)}
            className={`'card-option' ${
              props.question.done === 3 ? "card-option-active" : ""
            } ${
              props.question.reveal &&
              !props.question.doneRes &&
              props.question.done === 3
                ? "card-option-done-wrong"
                : ""
            } ${
              props.question.reveal &&
              props.question.done !== -1 &&
              props.question.ans === 3
                ? "card-option-done-right"
                : ""
            }`}
          >
            {props.question.options[3]}
          </div>
        </div>
        {/* 【next >】 */}
        <div className="card-change">
          <Button
            className="change-word"
            disabled={nextBtnDisable}
            onClick={nextQuestionClick}
            type="text"
          >
            next&nbsp;&gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewWordCard;
