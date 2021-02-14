import React, { useState, useEffect } from "react";

const useLoadData = (url, params) => {
  const [data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(url, params).then((res) => res.json());
      setData(result);
    };
    fetchData();
  }, [url, params]);
  return data;
};

export default useLoadData;
