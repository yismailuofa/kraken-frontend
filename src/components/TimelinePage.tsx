import { Box } from "@chakra-ui/react";
import { useContext } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import SidebarWithHeader from "./SideBarWithHeader";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import moment from "moment";


interface TimelinePageProps {
  onLogout: (user: MaybeUser) => void;
}


function TimelinePageContent() {
  const project = useContext(ApiContext).project;
  const navigate = useNavigate();

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  const taskData = project.tasks?.filter((task) => (
    task.status != "Completed"
  )).map((task) => (
    {
      x: task.id,
      z: task.name,
      y: [
        new Date(task.createdAt!).getTime(),
        new Date(task.dueDate).getTime(),
      ],
      fillColor: '#2C7A7B',
    }
  ));

  const qaTaskData = project.tasks?.filter((task) => (
    task.status != "Completed"
  )).map((task) => (
    {
      x: task.id,
      z: task.qaTask.name,
      y: [
        new Date(task.createdAt!).getTime(),
        new Date(task.qaTask.dueDate).getTime(),
      ],
      fillColor: '#B6D6CC',
    }
  ));

  const milestoneData = project.milestones?.filter((milestone) => (
    milestone.status != "Completed"
  )).map((milestone) => (
    {
      x: milestone.id,
      z: milestone.name,
      y: [
        new Date(milestone.createdAt!).getTime(),
        new Date(milestone.dueDate).getTime(),
      ],
      fillColor: '#EDAE0F'
    }
  ));

  const chartHeight = taskData?.length! + qaTaskData?.length! + milestoneData?.length!

   const chartData: ApexOptions = {          
    series: [
      {
        name: "Task",
        data: taskData!,
      },
      {
        name: "QA Task",
        data: qaTaskData!,
      },
      {
        name: "Milestone",
        data: milestoneData!,
      },
    ],
      chart: {
        type: 'rangeBar'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          dataLabels: {
            hideOverflowingLabels: true
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: number[], opts) {
          var label = opts.w.globals.seriesZ[opts.seriesIndex][opts.dataPointIndex]
          var a = moment(val[0])
          var b = moment(val[1])
          var diff = b.diff(a, 'days')
          return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
        },
        style: {
          colors: ['#f3f4f5', '#fff']
        }
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        show: false,
      },
      grid: {
        row: {
          colors: ['#f3f4f5', '#fff'],
          opacity: 1
        }
      },
      legend: {
        position: 'top',
        labels: {
          colors: ['#2C7A7B', '#B6D6CC', '#EDAE0F'],
          useSeriesColors: true
        }
      },
      colors: ['#2C7A7B', '#B6D6CC', '#EDAE0F'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.02,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      title: {
        text: "Upcoming Tasks / QA Tasks / Milestones ",
      },
      tooltip: {
        custom: function(opts: any) {
          
          let color = opts.w.globals.colors[opts.seriesIndex];
          return '<div class="arrow_box" style="padding:8px;">' + '<div style="margin-bottom:8px;">' + '<span style="color:' + color + '; font-weight:bold; margin-left:5px;">' + opts.w.globals.seriesNames[opts.seriesIndex] + ':' + '</span>' +
          '</div>' + '<div>' + '<span style="color:Gray; font-weight:bold; margin:5px;">' + opts.w.globals.seriesZ[opts.seriesIndex][opts.dataPointIndex] + ': ' + '</span>' +
          new Date(opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].y[0]).toDateString().substring(4, 10) + ' - ' +
          new Date(opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].y[1]).toDateString().substring(4, 10) + '</div>' + '</div>'
        }
      }
  
  };


  return (
    <Box>
      <Box id="chart">
        <ReactApexChart options={chartData} series={chartData.series} type="rangeBar" height={chartHeight * 75} />
      </Box>
      <Box id="html-dist"></Box>
    </Box>
  );
}

export function TimelinePage({onLogout}: TimelinePageProps) {
  const project = useContext(ApiContext).project;
  const navigate = useNavigate();

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  return (
    <>
    <SidebarWithHeader
        onLogout={onLogout}
        content={<TimelinePageContent/>}
        headerButtons={null}
        pageTitle="Timeline"
    />
    </>
  );
}