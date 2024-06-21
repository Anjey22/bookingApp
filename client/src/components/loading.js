import React, { useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

function Loading() {
  let [loading, setLoading] = useState(true);

  return (
    <div className="loading-container">
      <div className="sweet-loading">
        <ScaleLoader color="blue" loading={loading} size={200}/>
      </div>
    </div>
  );
}

export default Loading;
