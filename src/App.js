import "./styles.css";
import { Select } from "antd";
import { useState } from "react";
import OliveSvg from "./icons/olive.svg";
import pickleSvg from "./icons/pickle.svg";
import chickenSvg from "./icons/chicken.svg";
import pieSvg from "./icons/pie.svg";
import pizzaSvg from "./icons/pizza.svg";

import { data } from "./data/data";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
  ResponsiveContainer
} from "recharts";
const items = [
  { label: "Pickle", value: "Pickle", icon: pickleSvg },
  { label: "Olives", value: "Olives", icon: OliveSvg },
  { label: "Chicken", value: "Chicken", icon: chickenSvg },
  { label: "Pizza", value: "Pizza", icon: pizzaSvg },
  { label: "Pie", value: "Pie", icon: pieSvg }
];

const color = ["#DEDDF1", "#8884d8", "#413ea0", "#ff7300"];

export default function App() {
  const [selectedItem, setSelectedItem] = useState("Pickle");

  const buildChartData = () => {
    let chartData = data.filter((item) => item.item === selectedItem);
    let finalData = chartData.map((item) => {
      let dateEqualCondition =
        new Date(item.date).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0);
      let dateGreaterCondition =
        new Date(item.date).setHours(0, 0, 0, 0) >
        new Date().setHours(0, 0, 0, 0);
      if (dateGreaterCondition || dateEqualCondition) {
        let newItem = {
          ...item,
          demandFuture: item.demand,
          demand: dateEqualCondition ? item.demand : null
        };
        return newItem;
      } else return { ...item, demandFuture: null };
    });
    return finalData;
  };
  const chartData = buildChartData();
  const todayStock = data.filter(
    (item) =>
      item.item === selectedItem &&
      new Date(item.date).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0)
  );
  const renderLegend = (props) => {
    const legendItemRender = (name, color, type) => {
      return (
        <div style={{ display: "flex", margin: 10, alignItems: "center" }}>
          {type === "bar" ? (
            <div
              style={{
                height: 20,
                width: 20,
                border: "1px solid black",
                marginRight: 5,
                backgroundColor: color
              }}
            ></div>
          ) : (
            <div
              style={{
                height: 2,
                width: 20,
                marginRight: 5,
                backgroundColor: color
              }}
            ></div>
          )}
          <div>{name}</div>
        </div>
      );
    };

    return (
      <div style={{ display: "flex", marginBottom: 50, justifyContent: "end" }}>
        {legendItemRender("Actual Stocks", color[3], "bar")}
        {legendItemRender("Projected Stocks", color[0], "bar")}
        {legendItemRender("Demand", color[2], "line")}
      </div>
    );
  };

  const renderLabel = (props) => {
    const { x, y, stroke, value } = props;
    if (
      new Date(value).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
    )
      return (
        <text
          x={x}
          y={y}
          dy={-4}
          fill={stroke}
          fontSize={12}
          textAnchor="middle"
        >
          <tspan x={x} y={y - 15}>{`Today`}</tspan>
          <tspan x={x} y={y - 5}>{`${new Date().toDateString()}`}</tspan>
        </text>
      );
  };

  const onDropdownChange = (value) => {
    setSelectedItem(value);
  };

  return (
    <div>
      <div className="item_details">
        <img
          style={{ height: 50, width: 50 }}
          alt=""
          src={items.filter((item) => item.value === selectedItem)[0].icon}
        />
        <div style={{ marginLeft: 20 }}>
          <div>{selectedItem}</div>
          <div style={{ marginTop: 10 }}>
            {todayStock[0].currentStock} units /{" "}
            <span style={{ color: "gray" }}>
              {todayStock[0].maxStock} units{" "}
            </span>
          </div>
        </div>
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <Select
            style={{ width: 250 }}
            value={selectedItem}
            options={items}
            onChange={(value) => onDropdownChange(value)}
          />
        </div>
      </div>
      <div className="chart_container">
        <div style={{ display: "flex" }}>
          <div
            style={{ height: 30, width: 200, fontSize: 30, marginBottom: 30 }}
          >
            {" "}
            Stocks Level
          </div>
          <div
            style={{
              border: "1px solid black",
              height: 20,
              borderRadius: 15,
              padding: 5,
              marginLeft: "auto"
            }}
          >
            Live Marketing Campaign{" "}
          </div>
        </div>
        <ResponsiveContainer width={"80%"} height={480}>
          <ComposedChart style={{ marginBottom: 40 }} data={chartData}>
            <XAxis
              dataKey="name"
              domain={[0, "auto"]}
              label={{
                value: "Days",
                offset: -10,
                position: "bottom",
                height: 200
              }}
            />
            <YAxis
              label={{ value: "KG", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend verticalAlign="top" content={renderLegend} />
            <CartesianGrid stroke="#f5f5f5" />
            <Bar dataKey="currentStock" barSize={40}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    new Date(entry.date).setHours(0, 0, 0, 0) <
                    new Date().setHours(0, 0, 0, 0)
                      ? color[3]
                      : new Date(entry.date).setHours(0, 0, 0, 0) ===
                        new Date().setHours(0, 0, 0, 0)
                      ? color[1]
                      : color[0]
                  }
                />
              ))}
              <LabelList dataKey="date" position="top" content={renderLabel} />
            </Bar>

            <Line
              type="step"
              dataKey="demand"
              stroke={color[2]}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              type="step"
              dataKey="demandFuture"
              stroke={color[2]}
              strokeDasharray="8"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
