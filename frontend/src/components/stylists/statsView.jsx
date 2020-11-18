import React, { Component } from "react";
import ResponsiveBar from "nivo/lib/components/charts/bar/ResponsiveBar";

const MARGIN = { top: 50, right: 60, bottom: 50, left: 60 };
const PATTERNDEFS = [
  {
    id: "dots",
    type: "patternDots",
    background: "inherit",
    color: "#38bcb2",
    size: 4,
    padding: 1,
    stagger: true,
  },
  {
    id: "lines",
    type: "patternLines",
    background: "inherit",
    color: "#eed312",
    rotation: -45,
    lineWidth: 6,
    spacing: 10,
  },
];
const PATTERNASSIGNMENTS = [
  {
    match: {
      id: "trim",
    },
    id: "dots",
  },
  {
    match: {
      id: "Jodie",
    },
    id: "lines",
  },
];
const AXISBOTTOM = {
  tickSize: 10,
  tickPadding: 5,
  legend: "Stylist",
  legendPosition: "middle",
  legendOffset: 32,
};
const AXISLEFT = {
  tickSize: 5,
  tickPadding: 5,
  tickRotation: 0,
  legend: "Avg. Duration (minutes)",
  legendOffset: -40,
};

// TODO; FIGURE OUT HOW TO GET LEGEND TO SHOW UP
// const LEGEND = {
//   dataFrom: "keys",
//   anchor: "bottom-right",
//   direction: "column",
//   justify: false,
//   // translateX: 120,
//   // translateY: 0,
//   itemsSpacing: 2,
//   itemWidth: 100,
//   itemHeight: 20,
//   itemDirection: "left-to-right",
//   // itemOpacity: 0.85,
//   symbolSize: 20,
//   effects: [
//     {
//       on: "hover",
//       style: {
//         itemOpacity: 1,
//       },
//     },
//   ],
// };

class StatsView extends Component {
  state = {
    data: [
      {
        stylist: "Anne",
        iron: 20,
        manicure: 35,
        shampoo: 16,
        conditioner: 5,
        trim: 66,
      },
      {
        stylist: "Jodie",
        iron: 43,
        manicure: 26,
        shampoo: 12,
        conditioner: 4,
        trim: 43,
      },
    ],
    keys: ["iron", "manicure", "shampoo", "conditioner", "trim"],
    indexBy: "stylist",
  };
  componentDidMount() {
    this.props.redirectIfNotManager();
  }
  render() {
    return (
      <div
        style={{
          width: "50vw",
          height: "60vh",
          backgroundColor: "white",
          borderRadius: "6px",
        }}
      >
        <ResponsiveBar
          data={this.state.data}
          keys={this.state.keys}
          indexBy={this.state.indexBy}
          // STYLE =====================
          margin={MARGIN}
          padding={0.3}
          defs={PATTERNDEFS}
          fill={PATTERNASSIGNMENTS}
          axisBottom={AXISBOTTOM}
          axisLeft={AXISLEFT}
          labelSkipWidth={12}
          labelSkipHeight={12}
          // legends={[LEGEND]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    );
  }
}

export default StatsView;
