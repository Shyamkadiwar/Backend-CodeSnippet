import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [fetchedData, setFetchedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/current-user",
          {
            headers: {
              Authorization: localStorage.getItem("accessToken"),
            },
          }
        );
        const data = response.data.data;
        setFetchedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>{fetchedData.username}</h1>
      <h1>{fetchedData.fullName}</h1>
      <img src={fetchedData.avatar} alt="Avatar" />
      <img src={fetchedData.coverImage} alt="Cover" />
    </>
  );
}

export default Home;
