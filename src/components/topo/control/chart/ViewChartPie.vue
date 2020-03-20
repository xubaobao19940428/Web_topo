<template>
  <div class="view-chart-pie" ref="chartView">Click to bind data.</div>
</template>

<script>
import echarts from "echarts";
import BaseView from "../View";
export default {
  name: "ViewChartPie",
  extends: BaseView,
  props: {
    datas: {
      type: Object,
      default: () => {
        return {
          xData: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
          yData: [
            {
              value: 335,
              name: "直接访问"
            },
            {
              value: 310,
              name: "邮件营销"
            },
            {
              value: 234,
              name: "联盟广告"
            },
            {
              value: 135,
              name: "视频广告"
            },
            {
              value: 1548,
              name: "搜索引擎"
            }
          ]
        };
      }
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    datas:{
        deep:true,
        handler(val){
            this.setOption(this.datas)
        }
    }
  },
  data() {
    return {
      chart: null
    };
  },
  methods: {
    initChart() {
      let view = this.$refs.chartView;
      this.chart = echarts.init(view);
      this.setOption(this.datas);
    },
    setOption(datas) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: datas.xData
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: datas.yData
          }
        ]
      });
      if (this.echart) {
        this.echart.dispose();
      }
    },
    onResize() {
      if (this.echart) {
        this.echart.resize();
      }
    },
    updateView() {
      this.setOption(this.datas);
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.initChart()
    });
  }
};
</script>

<style lang="scss">
.view-chart-pie {
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
