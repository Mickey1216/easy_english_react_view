import {
  DeploymentUnitOutlined,
  UnorderedListOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Select, Slider, Switch, Button, Steps } from "antd";
import "./WordsReview.css";
import { useState } from "react";

const WordsReview = () => {
  // 下拉列表选项
  const options = [
    {
      label: "标记",
      value: 0,
    },
    {
      label: "未标记",
      value: 1,
    },
    {
      label: "全部",
      value: 2,
    },
  ];
  // 单词类型切换
  const typeChange = (value) => {
    console.log(`selected ${value}`);
  };

  // 单词复习个数
  const [reviewCount, setReviewCount] = useState(1);
  const reviewCountChange = (value) => {
    setReviewCount(value);
  };
  // 单词总数
  const wordCount = useState(10);

  // 随机顺序
  const [randomFlag, setRandomFlag] = useState(true);
  // 单词复习顺序
  const orderChange = (checked) => {
    setRandomFlag(!randomFlag);
  };

  // 开始复习按钮回调函数
  const reviewBtnClick = () => {};

  // 复习步骤
  const reviewAreaItem = [
    {
      title: "First",
      description: '设置加载中',
    },
    {
      title: "Second",
      description: `${reviewCount}个单词正在加载...`,
      subTitle: '复习单词请求中',
    },
    {
      title: "Waiting",
      description: `本轮${reviewCount}个单词已到位，正在${randomFlag ? '随机' : '顺序'}排队`,
      subTitle: '复习单词组装中',
    },
    {
      title: "Last",
      description: '祝好运！',
      subTitle: '就绪',
    },
  ]

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
              defaultValue={[0]}
              onChange={typeChange}
              options={options}
            />
          </div>
          <div className="words-review-middle-item words-review-middle-count">
            <span className="words-review-middle-item-title">
              复习{reviewCount}个
            </span>
            <Slider
              defaultValue={1}
              value={reviewCount}
              onChange={reviewCountChange}
              max={wordCount}
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
          <Button type="primary" size="large" onClick={reviewBtnClick}>
            开始复习
          </Button>
        </div>
        <div className="words-review-step">
          <Steps
            current={0}
            items={reviewAreaItem}
          />
        </div>
      </div>
      <div className="review-area"></div>
    </>
  );
};

export default WordsReview;
