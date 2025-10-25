import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import jsPDF from "jspdf";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import domtoimage from "dom-to-image-more";

const Pdf = forwardRef((props, ref) => {
  const { userInfo } = useSelector((state) => state.user);
  const { exact } = useSelector((state) => state.loc);

  const [weatherData, setWeatherData] = useState({
    rainfall: [],
    solar: [],
    cloud: [],
  });

  const rainfallRef = useRef();
  const solarRef = useRef();
  const cloudRef = useRef();
const {latLng} = useSelector((state) => state.location);
  const latitude = latLng?.lat;
  const longitude = latLng?.lng;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        const startDate = start.toISOString().split("T")[0];
        const endDate = end.toISOString().split("T")[0];

        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum,shortwave_radiation_sum,cloud_cover_mean&timezone=Asia/Kolkata`;

        const res = await axios.get(url);
        const daily = res.data.daily;

        if (!daily || !daily.time) {
          toast.error("No climate data found for this location.");
          return;
        }

        const formatted = daily.time.map((date, i) => ({
          date,
          rainfall: daily.precipitation_sum[i],
          solar: daily.shortwave_radiation_sum[i],
          cloud: daily.cloud_cover_mean[i],
        }));

        setWeatherData({
          rainfall: formatted.map((d) => ({ label: d.date, value: d.rainfall })),
          solar: formatted.map((d) => ({ label: d.date, value: d.solar })),
          cloud: formatted.map((d) => ({ label: d.date, value: d.cloud })),
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch climate data.");
      }
    };

    fetchWeatherData();
  }, []);

  useImperativeHandle(ref, () => ({
    downloadPDF,
  }));

  const downloadPDF = async () => {
    try {
      toast.loading("Generating PDF...", { id: "pdf" });

      // Capture chart images
      const rainfallImg = await domtoimage.toPng(rainfallRef.current);
      const solarImg = await domtoimage.toPng(solarRef.current);
      const cloudImg = await domtoimage.toPng(cloudRef.current);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const margin = 40;
      let y = margin;

    
  doc.setFillColor(10, 93, 173);
doc.rect(0, 0, W, 70, "F");

doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(255, 255, 255);

doc.text("HydroSphere — Zone Climate Report", W / 2, 45, { align: "center" });

doc.setFont("helvetica", "normal");
doc.setFontSize(12);
doc.text(`${userInfo?.username || "User"}`, W - margin, 60, { align: "right" });


      // --- Location & Date ---
      y = 100;
      const maxWidth = W - margin * 2;
      const wrappedText = doc.splitTextToSize(
        `${exact || "Location not available"}`,
        maxWidth
      );
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(wrappedText, margin, y);
      y += wrappedText.length * 7 + 6;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, W - margin - 120, y);
      y += 20;
      doc.setDrawColor(220);
      doc.line(margin, y, W - margin, y);
      y += 30;

      // --- Chart Section ---
      doc.setFontSize(9);
      doc.setTextColor(20, 40, 80);
      doc.text("Climate Analysis — Last 30 Days", margin, y);
      y += 25;

      const imgWidth = W - margin * 2;
      const imgHeight = 180;

      // 🌧️ Rainfall Chart
      doc.setFontSize(12);
      doc.text("Rainfall (mm)", margin, y - 5);
      doc.addImage(rainfallImg, "PNG", margin, y, imgWidth, imgHeight);
      y += imgHeight + 40;

      // ☀️ Solar Chart
      doc.text("Solar Radiation (MJ/m²)", margin, y - 5);
      doc.addImage(solarImg, "PNG", margin, y, imgWidth, imgHeight);
      y += imgHeight + 40;

      // ☁️ Cloud Chart
      doc.text("Cloud Cover (%)", margin, y - 5);
      doc.addImage(cloudImg, "PNG", margin, y, imgWidth, imgHeight);
      y += imgHeight + 50;

      // --- Flood Risk Table ---
      doc.setFontSize(13);
      doc.setTextColor(20, 40, 80);
      doc.text("Flood Risk Assessment", margin, y);
      y += 10;

      const tableX = margin;
      const tableW = W - margin * 2;
      const rowH = 22;
      const cols = [
        { label: "Parameter", w: tableW * 0.5 },
        { label: "Current Value", w: tableW * 0.25 },
        { label: "Risk Level", w: tableW * 0.25 },
      ];

      doc.setFillColor(240, 240, 240);
      doc.rect(tableX, y, tableW, rowH, "F");
      doc.setTextColor(60);
      let tx = tableX;
      cols.forEach((c) => {
        doc.text(c.label, tx + 6, y + 14);
        tx += c.w;
      });
      y += rowH;

      const rows = [
        ["Rainfall (mm)", "102", "Moderate"],
        ["Solar Radiation (MJ/m²)", "15", "Low"],
        ["Cloud Cover (%)", "65", "Moderate"],
      ];

      rows.forEach((r) => {
        doc.rect(tableX, y, tableW, rowH);
        tx = tableX;
        let idx = 0;
        r.forEach((cell) => {
          doc.text(String(cell), tx + 6, y + 14);
          tx += cols[idx].w;
          idx++;
        });
        y += rowH;
      });

      y += 30;

      // --- Summary ---
      doc.setFontSize(11);
      const summary =
        "Summary: The climate analysis shows moderate rainfall and cloud cover, with moderate solar energy levels. Flood risk remains in Zone C due to cumulative rainfall.";
      doc.text(doc.splitTextToSize(summary, W - margin * 2), margin, y);
      y += 60;

      // --- Footer ---
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Generated by HydroSphere • ${new Date().toLocaleString()}`,
        margin,
        H - 30
      );

      doc.save(`${userInfo?.username || "user"}_HydroSphere_Report.pdf`);
      toast.success("PDF Generated Successfully!", { id: "pdf" });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("PDF generation failed", { id: "pdf" });
    }
  };

  return (
    <>
      {/* Hidden container for charts */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          background: "#fff",
          padding: "20px",
          width: "700px",
          margin: "auto",
        }}
      >
        <div ref={rainfallRef}>
          <img
            src={`https://quickchart.io/chart?c={type:'line',data:{labels:${JSON.stringify(
              weatherData.rainfall.map((d) => d.label)
            )},datasets:[{label:'Rainfall (mm)',data:${JSON.stringify(
              weatherData.rainfall.map((d) => d.value)
            )},borderColor:'rgb(59,130,246)',fill:true,backgroundColor:'rgba(147,197,253,0.4)'}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{display:false}}}}}`}
            alt="Rainfall"
            style={{ width: "100%", height: "180px" }}
          />
        </div>

        <div ref={solarRef}>
          <img
            src={`https://quickchart.io/chart?c={type:'line',data:{labels:${JSON.stringify(
              weatherData.solar.map((d) => d.label)
            )},datasets:[{label:'Solar Radiation',data:${JSON.stringify(
              weatherData.solar.map((d) => d.value)
            )},borderColor:'rgb(251,191,36)',fill:true,backgroundColor:'rgba(253,230,138,0.4)'}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{display:false}}}}}`}
            alt="Solar"
            style={{ width: "100%", height: "180px" }}
          />
        </div>

        <div ref={cloudRef}>
          <img
            src={`https://quickchart.io/chart?c={type:'line',data:{labels:${JSON.stringify(
              weatherData.cloud.map((d) => d.label)
            )},datasets:[{label:'Cloud Cover',data:${JSON.stringify(
              weatherData.cloud.map((d) => d.value)
            )},borderColor:'rgb(156,163,175)',fill:true,backgroundColor:'rgba(229,231,235,0.4)'}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{display:false}}}}}`}
            alt="Cloud"
            style={{ width: "100%", height: "180px" }}
          />
        </div>
      </div>
    </>
  );
});

export default Pdf;
