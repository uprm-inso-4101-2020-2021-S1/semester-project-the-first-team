import React, { Component, Fragment } from "react";
import ResponsiveBar from "./../../node_modules/nivo/lib/components/charts/bar/ResponsiveBar";
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
    axisBottom: "Stylist",
    axisLeft: "Avg. Duration (minutes)",
  };
  render() {
    return (
      <div style={{ width: "100%", height: "60vh" }}>
        <ResponsiveBar
          data={this.state.data}
          keys={this.state.keys}
          indexBy={this.state.indexBy}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          //   colors={{ scheme: "nivo" }}
          defs={[
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
          ]}
          fill={[
            {
              match: {
                id: "Anne",
              },
              id: "dots",
            },
            {
              match: {
                id: "Jodie",
              },
              id: "lines",
            },
          ]}
          //   borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: this.state.axisBottom,
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: this.state.axisLeft,
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          //   labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 20,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    );
  }
}

export default StatsView;
