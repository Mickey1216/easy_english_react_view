import {
  DeploymentUnitOutlined,
  UnorderedListOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import {
  Select,
  Slider,
  Switch,
  Button,
  Steps,
  message,
  notification,
} from "antd";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { getReviewWordsAPI, getWordsCountAPI } from "../../api/api";
import DoReview from "../../components/DoReview";
import "./index.css";

const WordsReview = () => {
  // 单词总数
  const [wordsCount, setWordsCount] = useState(0);
  useEffect(() => {
    // 获取单词总数
    getWordsCountAPI({
      belonging: Cookies.get("userName"),
    }).then((res) => {
      setWordsCount(res.data);
    });
  }, []);

  // 下拉列表选项
  const options = [
    {
      label: "未标记",
      value: 0,
    },
    {
      label: "标记",
      value: 1,
    },
  ];
  // 单词类型
  const [reviewType, setReviewType] = useState([0]);
  // 单词类型切换
  const typeChange = (value) => {
    setReviewType(value);
  };

  // 复习单词的个数
  const [reviewCount, setReviewCount] = useState(4);
  const reviewCountChange = (value) => {
    setReviewCount(value);
  };
  // 复习的单词
  const [reviewWords, setReviewWords] = useState([]);
  const reviewWordsRef = useRef(reviewWords);
  // 实际复习单词
  const [actualReviewWords, setActualReviewWords] = useState([]);

  // 随机顺序
  const [randomFlag, setRandomFlag] = useState(true);
  // 单词复习顺序
  const orderChange = (checked) => {
    setRandomFlag(!randomFlag);
  };

  // 开始复习按钮是否可用，默认可用
  const [startBtnDisabled, setStartBtnDisabled] = useState(false);
  // 当前复习激活步骤
  const [stepNumber, setStepNumber] = useState(0);

  // 开始复习按钮回调函数
  const startReview = async () => {
    // 检查是否符合复习条件
    if (startBtnDisabled) return;

    if (wordsCount < 4) {
      message.error("单词本中单词数量不足4个，无法复习");
      return;
    }
    if (reviewCount < 4) {
      message.error("复习单词数量不能少于4个");
      return;
    }
    if (!reviewType.length) {
      message.error("单词类型一个都不选吗");
      return;
    }
    if (reviewCount <= wordsCount && reviewCount) {
      setStepNumber(1);
      setStartBtnDisabled(true);
    } else {
      message.error("ha~what");
      return;
    }

    // 请求获取复习单词接口
    const res = await getReviewWordsAPI({
      belonging: Cookies.get("userName"),
      type: reviewType,
      count: reviewCount,
      order: randomFlag ? "random" : "order",
    })
    if (res.code === 200) {
      setReviewWords((reviewWords) => {
        reviewWords = res.data;
        reviewWordsRef.current = reviewWords;

        return reviewWords;
      });
      setStepNumber(2);
    } else {
      notification.error({
        message: "失败",
        description: "服务器出现问题",
        duration: 1.5,
      });

      setStepNumber(0);
      setStartBtnDisabled(false);
      return;
    }
    
    // 检查是否符合复习条件
    if (!reviewWordsRef.current.length || reviewWordsRef.current.length < 4) {
      console.log(reviewWordsRef.current);
      notification.error({
        message: "失败",
        description: "单词过少无法进行复习",
        duration: 1.5,
      });

      setStepNumber(0);
      setStartBtnDisabled(false);
      return;
    }

    // 复习单词组装
    let explanations = reviewWordsRef.current.map((item) => item.explanation); // 组成解释集合
    let wordsLen = reviewWordsRef.current.length;
    let index = -1;
    const tmpList = reviewWordsRef.current.map((res) => {
      index++;

      let random_opts_index = []; // 用于存储抽取的随机单词下标
      while (true) {
        for (
          let i = 0;
          i < 3;
          i++ // 随机挑选3个下标
        )
          random_opts_index.push(Math.floor(Math.random() * wordsLen));

        let flag =
          random_opts_index.find((item) => item === index) === undefined; // 检测是否本轮单词下标在其中
        let tmp = new Set(random_opts_index); // 检测是否抽取到重复单词

        if (tmp.size === 3 && flag) break; // 达成随机3个不重复、不包含自身，退出while

        random_opts_index = []; // 清空，再来随机挑选一遍
      }

      random_opts_index.push(index);
      random_opts_index.sort(() => 0.5 - Math.random()); // 打乱4个下标位置

      return {
        word: res.word,
        mark: res.mark,
        pronunciation: res.pronunciation,
        sentence: res.sentence,
        options: random_opts_index.map((item) => explanations[item]),
        ans: random_opts_index.findIndex((item) => item === index),
        index: index,
        done: -1,
        doneRes: false,
        reveal: false
      }
    });

    // 给实际复习单词赋值
    console.log('11', tmpList);
    setActualReviewWords(tmpList);
    setStepNumber(3);
    setStepNumber(4);
    setShowingReviewProcess(true);
  };

  // 是否展示复习流程
  const [showingReviewProcess, setShowingReviewProcess] = useState(false);
  // 返回到单词复习设置
  const returnReviewSetting = () => {
    setShowingReviewProcess(false);
    setReviewWords([]);
    setActualReviewWords([]);
    setStepNumber(0);
    setStartBtnDisabled(false);
  };

  // 复习步骤
  const reviewAreaItem = [
    {
      title: "First",
      description: "设置加载中",
    },
    {
      title: "Second",
      description: `${reviewCount}个单词正在加载...`,
      subTitle: "复习单词请求中",
    },
    {
      title: "Waiting",
      description: `本轮${reviewCount}个单词已到位，正在${
        randomFlag ? "随机" : "顺序"
      }排队`,
      subTitle: "复习单词组装中",
    },
    {
      title: "Last",
      description: "祝好运！",
      subTitle: "就绪",
    },
  ];

  return (
    <>
      <div className="words-review-ct">
        <div className="words-review-top">
          <DeploymentUnitOutlined
            style={{ fontSize: "30px", color: "white" }}
          />
          <span className="words-review-top-title">单词复习设置</span>
        </div>
        <div className="words-review-middle">
          <div className="words-review-middle-item words-review-middle-type">
            <span className="words-review-middle-item-title">本轮单词类型</span>
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
                marginTop: "20px",
              }}
              placeholder="请选择"
              onChange={typeChange}
              options={options}
              value={reviewType}
            />
          </div>
          <div className="words-review-middle-item words-review-middle-count">
            <span className="words-review-middle-item-title">
              复习{reviewCount}个
            </span>
            <Slider
              value={reviewCount}
              onChange={reviewCountChange}
              max={wordsCount}
              min={4}
              style={{ marginTop: "20px", width: "100%" }}
            />
          </div>
          <div className="words-review-middle-item words-review-middle-order">
            <span className="words-review-middle-item-title">
              从单词本挑选顺序
            </span>
            <div className="words-review-middle-order-check">
              <span className={randomFlag ? "" : "random"}>
                <UnorderedListOutlined />
                &nbsp;顺序&nbsp;&nbsp;
              </span>
              <Switch defaultChecked onChange={orderChange} />
              <span className={randomFlag ? "random" : ""}>
                &nbsp;&nbsp;随机&nbsp;
                <RetweetOutlined />
              </span>
            </div>
          </div>
        </div>
        <div className="words-review-button">
          <Button
            type="primary"
            size="large"
            onClick={startReview}
            disabled={startBtnDisabled}
          >
            开始复习
          </Button>
        </div>
        <div className="words-review-step">
          <Steps current={stepNumber} items={reviewAreaItem} />
        </div>
      </div>
      <div className="review-area">
        {showingReviewProcess ? (
          <DoReview
            actualReviewWords={actualReviewWords}
            returnReviewSettingEvent={returnReviewSetting}
          />
        ) : null}
      </div>
    </>
  );
};

export default WordsReview;
