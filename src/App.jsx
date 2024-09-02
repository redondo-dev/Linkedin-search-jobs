


import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

function App() {

  const [jobs, setJobs] = useState([]);
  const [searchJob, setSearchJob] = useState("");

  useEffect(() => {
    
      fetchJob();
  }, []);

  const fetchJob = async (query = "golang") => {
    try {
      const response = await axios.get(
        "https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs-v2",
        {
          params: {
            keywords: query,
            location: "Marseille, France",
            datePosted: "anyTime",
            sort: "mostRelevant",
          },
          headers: {
            "x-rapidapi-key":process.env.REACT_APP_API_KEY,
            "x-rapidapi-host": "rapid-linkedin-jobs-api.p.rapidapi.com",
          },
        }
      );

      console.log("Response Data:", response.data);

      setJobs(response.data.data || []); 
    } catch (error) {
      console.error("Error fetching jobs:", error.response || error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchJob.trim()) {
      fetchJob(searchJob);
    }
  };

  return (
    <>
      <h1>Job-Link-Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="search"
          name="search"
          placeholder="Cherchez votre job"
          value={searchJob}
          onChange={(e) => setSearchJob(e.target.value)}
        />
        <button type="submit">Envoyer</button>
      </form>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <h2>Job Title: {job.title}</h2>
            <p>Company Name: {job.company.name}</p>
            <p>Job location: {job.location}</p>
            <p>Posté le : {job.postDate}</p>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Job
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
