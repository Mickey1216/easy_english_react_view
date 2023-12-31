import { Slider, InputNumber, Radio, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  changeWordNumAPI,
  changeWordPronunciationAPI,
  changeWordShowTypeAPI,
} from "../../api/api";
import "./index.css";

const Settings = () => {
  // 单词每页显示数量
  const [countValue, setCountValue] = useState(1);
  const countChange = (newCount) => {
    setCountValue(newCount);
    changeWordNumAPI({
      userName: Cookies.get("userName"),
      token: Cookies.get("easy-english-react-token"),
      page_size: newCount,
    }).then((res) => {
      if ((res.code = 200)) {
        // 修改成功
        message.success("修改成功");
        Cookies.set("wordsConfigLimit", newCount, { expires: 14 });
      } else {
        // 失败
        message.error("修改失败，服务器出现问题");
      }
    });
  };

  // 单词发音
  const [proType, setProType] = useState(0);
  const proChange = (e) => {
    const newProType = e.target.value;
    setProType(newProType);
    changeWordPronunciationAPI({
      userName: Cookies.get("userName"),
      token: Cookies.get("easy-english-react-token"),
      pronunciation: newProType,
    }).then((res) => {
      if ((res.code = 200)) {
        // 修改成功
        message.success("修改成功");
        Cookies.set("wordsConfigPronunciation", newProType, { expires: 14 });
      } else {
        // 失败
        message.error("修改失败，服务器出现问题");
      }
    });
  };

  // 单词类型
  const [typeValue, setTypeValue] = useState(0);
  const typeChange = (newType) => {
    setTypeValue(newType);
    changeWordShowTypeAPI({
      userName: Cookies.get("userName"),
      token: Cookies.get("easy-english-react-token"),
      show_type: newType,
    }).then((res) => {
      if ((res.code = 200)) {
        // 修改成功
        message.success("修改成功");
        Cookies.set("wordsConfigShowType", newType, { expires: 14 });
      } else {
        // 失败
        message.error("修改失败，服务器出现问题");
      }
    });
  };

  useEffect(() => {
    setCountValue(() => {
      if(Cookies.get("wordsConfigLimit") === undefined) return 1;
      return parseInt(Cookies.get("wordsConfigLimit"));
    });

    setProType(() => { 
      if(Cookies.get("wordsConfigPronunciation") === undefined) return 0;
      return parseInt(Cookies.get("wordsConfigPronunciation"));
    });

    setTypeValue(() => {
      if(Cookies.get("wordsConfigShowType") === undefined) return 2;
      return parseInt(Cookies.get("wordsConfigShowType"));
    });
  }, []);

  return (
    <div className="settings-ct">
      <div className="settings-title">单词偏好配置</div>
      <div className="settings-count">
        <span className="settings-count-title">单词每页显示数量</span>
        <Slider
          className="settings-count-slider"
          min={1}
          max={10}
          onChange={countChange}
          value={typeof countValue === "number" ? countValue : 0}
        />
        <InputNumber
          className="settings-count-input"
          min={1}
          max={10}
          value={countValue}
          onChange={countChange}
        />
      </div>
      <div className="settings-pronunciation">
        <span className="settings-pronunciation-title">单词发音</span>
        <Radio.Group onChange={proChange} value={proType}>
          <Radio value={0}>美式</Radio>
          <Radio value={1}>英式</Radio>
        </Radio.Group>
      </div>
      <div className="settings-type">
        <span className="settings-type-title">单词类型</span>
        <Select
          value={typeValue}
          style={{
            width: 120,
          }}
          onChange={typeChange}
          options={[
            {
              value: 0,
              label: "未标记",
            },
            {
              value: 1,
              label: "已标记",
            },
            {
              value: 2,
              label: "全部",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Settings;
