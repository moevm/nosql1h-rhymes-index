document.getElementById("searchStatButton").addEventListener("click", () => {
  const val = document.getElementById("searchStat").value;
  slovo = val;

  if (!val) {
    return;
  }

  // var str = val;
  // alert(str.substring(2));

  fetch("/api/statistic?word=" + val)
    .then(resp => resp.json())
    .then(data => {
      const words = data
        .map(s => s.lastword)
        .filter((e, i, arr) => arr.indexOf(e) === i);
      const titles = data.reduce((acc, curr) => {
        if (!acc[curr.title]) {
          acc[curr.title] = 0;
        }
        acc[curr.title]++;
        return acc;
      }, {});

      // Highcharts.chart("container", {
      //   chart: {
      //     type: "column",
      //     options3d: {
      //       enabled: true,
      //       alpha: 10,
      //       beta: 25,
      //       depth: 70
      //     }
      //   },
      //   title: {
      //     text: "Статистика по количеству слов-рифм во всех песнях."
      //   },
      //   plotOptions: {
      //     column: {
      //       depth: 25
      //     }
      //   },
      //   xAxis: {
      //     categories: words,
      //     labels: {
      //       skew3d: true,
      //       style: {
      //         fontSize: "16px"
      //       }
      //     }
      //   },
      //   yAxis: {
      //     title: {
      //       text: "количество"
      //     }
      //   },
      //   series: [
      //     {
      //       name: "Рифмы",
      //       data: []
      //       // data: words.map(w => data.filter(s => s.lastword === w).length)
      //     }
      //   ]
      // });

      Highcharts.chart("container1", {
        chart: {
          type: "pie",
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
          }
        },
        title: {
          text: "Статистика по количеству слов-рифм в каждой песне."
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            depth: 35,
            dataLabels: {
              enabled: true,
              format: "{point.name}"
            }
          }
        },
        series: [
          {
            type: "pie",
            name: "Browser share",
            data: data.map(s => [s._id.gr_song, s.hits])
            // data: data
            // .map(s => s.title)
            // .filter((s, i, arr) => arr.indexOf(s) === i)
            // .map(s => [s, titles[s]])
          }
        ]
      });
    });

  fetch("/api/statistic777?word=" + val)
    .then(resp => resp.json())
    // .then(data => {
    //   const gr_word777 = data.map(s => s._id.gr_word);
    //   const hits777 = data.map(s => s.whits);
    .then(data => {
      const words = data
        .map(s => s.lastword)
        .filter((e, i, arr) => arr.indexOf(e) === i);
      const titles = data.reduce((acc, curr) => {
        if (!acc[curr.title]) {
          acc[curr.title] = 0;
        }
        acc[curr.title]++;
        return acc;
      }, {});

      Highcharts.chart("container", {
        chart: {
          type: "column",
          options3d: {
            enabled: true,
            alpha: 10,
            beta: 25,
            depth: 70
          }
        },
        title: {
          text: "Статистика по количеству слов-рифм во всех песнях."
        },
        plotOptions: {
          column: {
            depth: 25
          }
        },
        xAxis: {
          categories: data.map(s => [s._id.gr_word]),
          labels: {
            skew3d: true,
            style: {
              fontSize: "16px"
            }
          }
        },
        yAxis: {
          title: {
            text: "количество"
          }
        },
        series: [
          {
            name: "Рифмы",
            data: data.map(w => [w.whits])
            // data: words.map(w => data.filter(s => s.lastword === w).length)
          }
        ]
      });
    });
});
