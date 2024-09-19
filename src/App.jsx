/* eslint-disable no-undef */


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
// Fonction pour convertir les dates relatives ("3 days ago") en date réelle
const parseRelativeDate = (relativeDate) => {
  const now = new Date();
  const dateParts = relativeDate.split(" ");

  if (dateParts.includes("days")) {
    const daysAgo = parseInt(dateParts[0], 10);
    now.setDate(now.getDate() - daysAgo);
  } else if (dateParts.includes("weeks")) {
    const weeksAgo = parseInt(dateParts[0], 10);
    now.setDate(now.getDate() - weeksAgo * 7);
  } else if (dateParts.includes("months")) {
    const monthsAgo = parseInt(dateParts[0], 10);
    now.setMonth(now.getMonth() - monthsAgo);
  } else if (dateParts.includes("hours")) {
    const hoursAgo = parseInt(dateParts[0], 10);
    now.setHours(now.getHours() - hoursAgo);
  } else if (dateParts.includes("minutes")) {
    const minutesAgo = parseInt(dateParts[0], 10);
    now.setMinutes(now.getMinutes() - minutesAgo);
  }

  return now;
};

const parseDate = (dateString) => {
  if (dateString.includes("ago")) {
    return parseRelativeDate(dateString);
  } else {
    // Traiter le cas où la date est au format standard (ex: "YYYY-MM-DD")
    return new Date(dateString);
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
      <div className="job-cards-container">
    {/* {jobs.filter((job) => job.location && job.location.toLowerCase().includes("marseille, france")) */}
      {jobs
      .sort((a, b) =>
       { const dateA = parseDate(a.postDate);
            const dateB = parseDate(b.postDate);
            if (!dateA || !dateB) return 0;
            return dateB - dateA;
})
        // new Date(b.postDate) - new Date(a.postDate)) // Trier par date de publication (du plus récent au plus ancien)
      .map((job, index) => (
        <div key={index} className="job-card">
          <h2 className="job-title">{job.title}</h2>
          <p className="company-name">Company: {job.company.name}</p>
          <p className="job-location">Location: {job.location}</p>
          <p className="post-date">Posté le: {job.postDate}</p>
          
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="job-link"
          >
            View Job
          </a>
        </div>
      ))}
  </div>

</>

    
  );
}

export default App;
