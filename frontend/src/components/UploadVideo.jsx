import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function UploadVideo() {
  const navigate = useNavigate(); // Corrected useNavigate
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleVideoUpload(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('video', video);
    formData.append('thumbnail', thumbnail);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/upload-video', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.statusCode === 200) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  }

  return (
    <>
      <form onSubmit={handleVideoUpload}>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          placeholder="video"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <input
          type="file"
          placeholder="thumbnail"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default UploadVideo;
