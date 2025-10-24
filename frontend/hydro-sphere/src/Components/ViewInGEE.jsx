
import React from "react";
import { ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";

const ViewInGEE = ({ latitude, longitude, bufferRadius = 10000 }) => {
    const {userInfo} = useSelector((state) => state.user);
    const [clicked , setClicked] = useState(false);
const openGEE = (lat, lon) => {
    setClicked(true);
  const geeURL = "https://code.earthengine.google.com/?scriptPath=users/gamingnewton69/p1:dynamicFloodTemplate";

  alert(`🌍 Copy these coordinates and paste into your GEE script:

Latitude: ${lat}
Longitude: ${lon}

1️⃣ Open the GEE tab that will open automatically.
2️⃣ Find these lines in the code:
   var lat = 30.3;
   var lon = 79.1;
3️⃣ Replace them with:
   var lat = ${lat};
   var lon = ${lon};
4️⃣ Press "Run" in GEE to view your ROI.`);

 
  window.open(geeURL, "_blank");
};
const closeVoice = () => {
window.speechSynthesis.cancel();

}


  return (
    <div className="flex gap-3 pt-4">
 <button
  onClick={() => openGEE(latitude, longitude)}
  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
>
  Open GEE Script
</button>

    </div>
 

  );
};

export default ViewInGEE;
