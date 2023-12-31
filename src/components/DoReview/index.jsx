// 复习页面
import React, { useState, useMemo, startTransition, useEffect } from "react";
import { Button, Progress } from "antd";
import Cookies from "js-cookie";
import ReviewWordCard from "../ReviewWordCard";
import "./index.css";

const DoReview = (props) => {
  const [currency, setCurrency] = useState(-1); // 当前单词索引
  const [total, setTotal] = useState(0); // 复习单词总数
  const [customColors, setCustomColors] = useState([
    { color: "#1989fa", percentage: 20 },
    { color: "#5cb87a", percentage: 40 },
    { color: "#6f7ad3", percentage: 60 },
    { color: "#e6a23c", percentage: 80 },
    { color: "#f56c6c", percentage: 100 },
  ]); // 进度条颜色
  const [customColorsScores, setCustomColorsScores] = useState([
    { color: "#1989fa", percentage: 20 },
    { color: "#5cb87a", percentage: 40 },
    { color: "#6f7ad3", percentage: 60 },
    { color: "#e6a23c", percentage: 80 },
    { color: "#f56c6c", percentage: 100 },
  ]); // 准确率进度条颜色
  const [indexArray, setIndexArray] = useState([]); // 单词索引数组
  const [reviewReportShowing, setReviewReportShowing] = useState(false); // 是否显示复习报告

  // 给单词索引数组赋值
  useEffect(() => {
    console.log(props.actualReviewWords);
    setCurrency(1);
    setTotal(props.actualReviewWords.length);
    let temp = [];
    for (let i = 1; i <= total; i++) {
      temp.push(i);
    }
    setIndexArray(temp);
  }, [])

  // 进度条的百分比
  const percentage = useMemo(() => {
    return (currency / total) * 100;
  }, [currency, total]);

  // 准确率进度条的百分比
  const calcAccuracy = useMemo(() => {
    return parseInt(
      (
        (props.actualReviewWords.filter((item) => item.doneRes).length /
          props.actualReviewWords.length) *
        100
      ).toFixed(2)
    );
  });

  // 点击单词序列按钮，进行跳转
  const jumpToQuestion = (index) => {
    return () => {
      setCurrency(index);
    };
  };

  // 指定进度条文字内容
  const progress = () => {
    return `${currency} / ${total}`;
  };

  // 获取上一个单词
  const prevQuestion = () => {
    if (currency > 1) setCurrency(currency - 1);
  };

  // 获取下一个单词
  const nextQuestion = () => {
    if (currency < props.actualReviewWords.length) setCurrency(currency + 1);
  };

  // 判断单词是否已经复习过
  const questionDid = (done, doneRes) => {
    let question = props.actualReviewWords[currency - 1];
    question.done = done;
    question.doneRes = doneRes;

    if (currency < props.actualReviewWords.length) setCurrency(currency + 1);
  };

  // 改变单词的标志
  const wordMarkChange = (word, mark) => {
    // request(`/words/mark`, "PATCH", {
    //   username: Cookies.get("userName"),
    //   word,
    //   mark
    // }).then(res => {
    //   if (res.flag) { // 成功
    //     ElNotification({
    //       title: "成功",
    //       message: "单词标记操作",
    //       type: "success",
    //       duration: 2000,
    //     });
    //     this.actualReviewWords[this.currency - 1].mark = mark;
    //   } else { // 失败
    //     ElNotification({
    //       title: "失败",
    //       message: "服务器出现问题",
    //       type: "error",
    //       duration: 2000,
    //     });
    //   }
    // });
  };

  // 【生成复习结果】- 点击事件
  const reviewReportClick = () => {
    if (reviewReportShowing) return;

    props.actualReviewWords.forEach((item) => {
      item.reveal = true;
    });
    setReviewReportShowing(true);
  };

  // 【返回】- 点击事件
  const returnReviewSettingClick = () => {
    setReviewReportShowing(false);
    props.returnReviewSettingEvent();
    // this.$emit("returnReviewSettingEvent");
  };

  // 【再做一次】- 点击事件
  const doAgainClick = () => {
    setReviewReportShowing(false);

    props.actualReviewWords.forEach((item) => {
      item.done = -1;
      item.doneRes = false;
      item.reveal = false;
    });

    setCurrency(1);
  };

  return (
    <>
      {/* 顶部 */}
      <div
        className="review-report"
        style={{ visibility: `${reviewReportShowing ? "visible" : "hidden"}` }}
      >
        {/* 单词按钮 */}
        <div className="review-report-left">
          {indexArray.map((item, index) => {
            return (
              <Button
                type="primary"
                onClick={jumpToQuestion(index)}
                key={index}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
        {/* 准确率 */}
        <div className="review-report-right">
          <div className="review-report-right-group">
            <Progress
              percent={calcAccuracy}
              type="circle"
              // strokeColor={customColorsScores}
            />
          </div>
          <div className="review-report-right-group-text">正确率</div>
        </div>
      </div>
      {/* ReviewWordCard组件 */}
      <ReviewWordCard
        reviewWordsLen={props.actualReviewWords.length}
        question={props.actualReviewWords[currency - 1]}
        prevQuestionEvent={prevQuestion}
        nextQuestionEvent={nextQuestion}
        questionDid={questionDid}
        wordMarkChangeEvent={wordMarkChange}
      />
      {/* 进度条 */}
      <Progress
        percent={percentage}
        // strokeColor={customColors}
        format={progress}
      />
      {/* 底部按钮 */}
      <div className="review-bottom">
        {/* 【返回】 */}
        {reviewReportShowing ? (
          <div className="review-bottom-btn" onClick={returnReviewSettingClick}>
            返回
          </div>
        ) : null}
        {/* 【生成复习结果】 */}
        <div
          className={`${
            reviewReportShowing
              ? "review-bottom-btn reviewBottomBtnDisabled"
              : "review-bottom-btn"
          }`}
          onClick={reviewReportClick}
        >
          生成复习结果
        </div>
        {/* 【再做一次】 */}
        {reviewReportShowing ? (
          <div className="review-bottom-btn" onClick={doAgainClick}>
            再做一次
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DoReview;
