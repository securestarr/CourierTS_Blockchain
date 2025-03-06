import { Bar } from "react-chartjs-2";

const Dashboard = () => {
  const data = {
    labels: ["Product A", "Product B"],
    datasets: [
      {
        label: "Quantity",
        data: [5, 10],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return <Bar data={data} />;
};
