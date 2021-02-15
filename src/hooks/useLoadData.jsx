import React, { useState, useEffect } from "react";

const useLoadData = (url, params) => {
  const [data, setData] = useState([]) || [];

  const fetchData = async () => {
    const result = await fetch(url, params).then((res) => res.json());
    setData(result);
  };

  const doFetch = () => {fetchData(url)};
  useEffect(() => {
    fetchData();
  }, [url, params]);
  return {simulatorText: data, doFetch};
};

export default useLoadData;
