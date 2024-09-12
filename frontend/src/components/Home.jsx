import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [fetchedData, setFetchedData] = useState({});
  const [fetchedVideo, setFetchedVideo] = useState({});

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
        console.log(data);
        setFetchedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/get-video",
          {
            headers: {
              Authorization: localStorage.getItem("accessToken"),
            },
          }
        );

        const data = response.data.data[0];
        console.log(data);
        setFetchedVideo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchVideo();
  }, []);

  return (
    <>
      <h1>{fetchedData.username}</h1>
      <h1>{fetchedData.fullName}</h1>
      <img src={fetchedData.avatar} alt="Avatar" />
      <img src={fetchedData.coverImage} alt="Cover" />

      <img src={fetchedVideo.videoFile} alt="" />

    </>
  );
}

export default Home;
