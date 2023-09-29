import EChartComponent from "@/components/BarChart";

export default async function Page() {
  return (
    <main>
      <h2 className="text-center font-bold text-[30px] my-10">
        {" "}
        Assessment Exercise
      </h2>
      <EChartComponent />
    </main>
  );
}
