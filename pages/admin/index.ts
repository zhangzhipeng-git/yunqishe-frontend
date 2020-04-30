import Component from "vue-class-component";
import { Ref } from "vue-property-decorator";
import { ECharts } from "echarts";
import BaseComponent from "~/core/base-component";
@Component({ layout: 'admin' })
export default class AdminComponent extends BaseComponent {
  /** 用户在线分布 */
  @Ref("online")
  online: any;
  /** 用户性别分布 */
  @Ref("sex")
  sex: any;
  /** 年龄 */
  @Ref("age")
  age: any;
  /** 职业 */
  @Ref("occupation")
  occupation: any;
  /** 会员 */
  @Ref("vip")
  vip: any;
  /** 热门 */
  @Ref("hot")
  hot: any;
  /** 站点访问 */
  @Ref("visit")
  visit: any;
  /** 站点收益 */
  @Ref("profit")
  profit: any;
  /** echarts实例 */
  echarts$: ECharts[] = [];
  constructor() {
    super();
  }

  mounted() {
    this.loadEcharts(() => {
      const echarts: any = (<any>window).echarts;
      if (!echarts) return;
      const echarts1: ECharts = echarts.init(this.online, "light");
      const echarts2: ECharts = echarts.init(this.sex, "light");
      const echarts3: ECharts = echarts.init(this.age, "light");
      const echarts4: ECharts = echarts.init(this.occupation, "light");
      const echarts5: ECharts = echarts.init(this.vip, "light");
      const echarts6: ECharts = echarts.init(this.hot, "light");
      const echarts7: ECharts = echarts.init(this.visit, "light");
      const echarts8: ECharts = echarts.init(this.profit, "light");
      this.echarts$.push(echarts1);
      this.echarts$.push(echarts2);
      this.echarts$.push(echarts3);
      this.echarts$.push(echarts4);
      this.echarts$.push(echarts5);
      this.echarts$.push(echarts6);
      this.echarts$.push(echarts7);
      this.echarts$.push(echarts8);
      echarts1.showLoading();
      echarts2.showLoading();
      echarts3.showLoading();
      echarts4.showLoading();
      echarts5.showLoading();
      echarts6.showLoading();
      echarts7.showLoading();
      echarts8.showLoading();
      setTimeout(() => {
        this.setOnlineDistribute(echarts1);
        this.setSexDistribute(echarts2);
        this.setAgeDistribute(echarts3);
        this.setOccupationDistribute(echarts4);
        this.setVipDistribute(echarts5);
        this.setHotDistribute(echarts6);
        this.setVisitDistribute(echarts7);
        this.setProfitDistribute(echarts8);
        echarts1.hideLoading();
        echarts2.hideLoading();
        echarts3.hideLoading();
        echarts4.hideLoading();
        echarts5.hideLoading();
        echarts6.hideLoading();
        echarts7.hideLoading();
        echarts8.hideLoading();
      }, 2000);
    });
  }
  /** 设置用户在线分布情况 */
  private setOnlineDistribute(echarts: ECharts) {
    echarts.setOption({
      title: [
        {
          text: "标题",
          bottom: "10%",
          left: "center",
          textStyle: {
            color: "#333333",
            fontWeight: "normal",
            fontSize: 14
          }
        }
      ],
      legend: {
        orient: "horizontal",
        left: "center",
        top: 10,
        data: ["在线", "不在线"]
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: "用户在线情况",
          type: "pie",
          radius: ["70%", "100%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          left: "center",
          top: "middle",
          label: {
            position: "center",
            show: false
          },
          emphasis: {
            label: {
              fontSize: 20,
              fontWeight: "bold",
              show: true
            }
          },
          data: [
            { value: 335, name: "在线" },
            { value: 310, name: "不在线" }
          ]
        }
      ]
    });
  }

  /** 设置用户性别分布情况 */
  private setSexDistribute(echarts: ECharts) {
    echarts.setOption({
      title: [
        {
          text: "标题",
          bottom: "10%",
          left: "center",
          textStyle: {
            color: "#333333",
            fontWeight: "normal",
            fontSize: 14
          }
        }
      ],
      legend: {
        orient: "horizontal",
        left: "center",
        top: 10,
        data: ["在线", "不在线"]
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: "用户在线情况",
          type: "pie",
          radius: ["70%", "100%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          left: "center",
          top: "middle",
          label: {
            position: "center",
            show: false
          },
          emphasis: {
            label: {
              fontSize: 20,
              fontWeight: "bold",
              show: true
            }
          },
          data: [
            { value: 335, name: "在线" },
            { value: 310, name: "不在线" }
          ]
        }
      ]
    });
  }

  /** 设置用户年龄分布情况 */
  private setAgeDistribute(echarts: ECharts) {
    echarts.setOption({
      title: [
        {
          text: "标题",
          bottom: "10%",
          left: "center",
          textStyle: {
            color: "#333333",
            fontWeight: "normal",
            fontSize: 14
          }
        }
      ],
      legend: {
        orient: "horizontal",
        left: "center",
        top: 10,
        data: ["在线", "不在线"]
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: "用户在线情况",
          type: "pie",
          radius: ["70%", "100%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          left: "center",
          top: "middle",
          label: {
            position: "center",
            show: false
          },
          emphasis: {
            label: {
              fontSize: 20,
              fontWeight: "bold",
              show: true
            }
          },
          data: [
            { value: 335, name: "在线" },
            { value: 310, name: "不在线" }
          ]
        }
      ]
    });
  }

  /** 设置用户职业分布情况 */
  private setOccupationDistribute(echarts: ECharts) {
    echarts.setOption({
      title: [
        {
          text: "标题",
          bottom: "10%",
          left: "center",
          textStyle: {
            color: "#333333",
            fontWeight: "normal",
            fontSize: 14
          }
        }
      ],
      legend: {
        orient: "horizontal",
        left: "center",
        top: 10,
        data: ["在线", "不在线"]
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: "用户在线情况",
          type: "pie",
          radius: ["70%", "100%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          left: "center",
          top: "middle",
          label: {
            position: "center",
            show: false
          },
          emphasis: {
            label: {
              fontSize: 20,
              fontWeight: "bold",
              show: true
            }
          },
          data: [
            { value: 335, name: "在线" },
            { value: 310, name: "不在线" }
          ]
        }
      ]
    });
  }

  /** 设置用户VIP分布情况 */
  private setVipDistribute(echarts: ECharts) {
    echarts.setOption({
      title: [
        {
          text: "标题",
          bottom: "10%",
          left: "center",
          textStyle: {
            color: "#333333",
            fontWeight: "normal",
            fontSize: 14
          }
        }
      ],
      legend: {
        orient: "horizontal",
        left: "center",
        top: 10,
        data: ["在线", "不在线"]
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: "用户在线情况",
          type: "pie",
          radius: ["70%", "100%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          left: "center",
          top: "middle",
          label: {
            position: "center",
            show: false
          },
          emphasis: {
            label: {
              fontSize: 20,
              fontWeight: "bold",
              show: true
            }
          },
          data: [
            { value: 335, name: "在线" },
            { value: 310, name: "不在线" }
          ]
        }
      ]
    });
  }

  /** 设置用户关注热度情况 */
  private setHotDistribute(echarts: ECharts) {
    echarts.setOption({
      title: [
        {
          text: "标题",
          bottom: "10%",
          left: "center",
          textStyle: {
            color: "#333333",
            fontWeight: "normal",
            fontSize: 14
          }
        }
      ],
      legend: {
        orient: "horizontal",
        left: "center",
        top: 10,
        data: ["在线", "不在线"]
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: "用户在线情况",
          type: "pie",
          radius: ["70%", "100%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          left: "center",
          top: "middle",
          label: {
            position: "center",
            show: false
          },
          emphasis: {
            label: {
              fontSize: 20,
              fontWeight: "bold",
              show: true
            }
          },
          data: [
            { value: 335, name: "在线" },
            { value: 310, name: "不在线" }
          ]
        }
      ]
    });
  }
  /** 设置访问量曲线(近一年) */
  private setVisitDistribute(echarts: ECharts) {
    const data = [];
    const months = [];
    for (let i = 1, len = 13; i < len; i++) {
      data.push(Math.floor(Math.random() * 1000));
      months.push(i + "月");
    }

    echarts.setOption({
      title: {
        text: "站点近一年访问量统计",
        top: "5%",
        left: "center",
        textStyle: {
          color: "#333333",
          fontSize: 18,
          fontWeight: "normal"
        }
      },
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        type: "category",
        data: months
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: data,
          type: "line",
          smooth: true,
          width: "100%"
        }
      ]
    });
  }
  /** 设置利益曲线 */
  private setProfitDistribute(echarts: ECharts) {
    const data = [];
    const months = [];
    for (let i = 1, len = 13; i < len; i++) {
      data.push(Math.floor(Math.random() * 1000));
      months.push(i + "月");
    }

    echarts.setOption({
      title: {
        text: "站点近一年收益统计",
        top: "5%",
        left: "center",
        textStyle: {
          color: "#333333",
          fontSize: 18,
          fontWeight: "normal"
        }
      },
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        type: "category",
        data: months
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: data,
          type: "bar",
          smooth: true
        }
      ]
    });
  }
  public resize() {
    this.loadEcharts(() => {
        const echarts = (<any>window).echarts;
        if (!echarts) return;
        this.echarts$.forEach((e: ECharts) => {
            e.resize();
        });
    })
  }
}
