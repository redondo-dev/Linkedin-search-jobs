import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchJob, setSearchJob] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (searchJob.trim()) {
      fetchJob(searchJob);
    }
  }, [searchJob]);

  const fetchJob = async (query = "React JS ") => {
    try {
      const response = await axios.get(
        "https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs",
        {
          params: {
            keywords: query,
            locationId: "92000000",
            datePosted: "anyTime",
            sort: "mostRelevant",
          },
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_API_KEY,
            "x-rapidapi-host": "rapid-linkedin-jobs-api.p.rapidapi.com",
          },
        }
      );

      if (
        response.data.message &&
        response.data.message.includes("you have exceeded the MONTHLY quota")
      ) {
        setErrorMessage("Vous avez dépassé le quota mensuel d'appels API.");
      } else {
        setJobs(response.data.data || []);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error.response || error.message);
      setErrorMessage("Erreur lors de la récupération des offres d'emploi.");
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

  // Fonction pour fermer la pop-up
  const closePopup = () => {
    setErrorMessage("");
  };

  return (
    <>
      <h1>Job-Link-Search</h1>
      <img
        src="https://www.alain-bensoussan.com/wp-content/uploads/2021/12/Man-with-futuristic-digital-tabletcRymden@AdobeStock_194849644-scaled.jpeg"
        alt="logo"
        className="headerimage"
      />
      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-input"
          type="search"
          name="search"
          placeholder="Cherchez votre job"
          value={searchJob}
          onChange={(e) => setSearchJob(e.target.value)}
        />
        <button className="search-button" type="submit">
          Envoyer
        </button>
      </form>

      {errorMessage && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="job-cards-container">
        {jobs
          .sort((a, b) => {
            const dateA = parseDate(a.postDate);
            const dateB = parseDate(b.postDate);
            if (!dateA || !dateB) return 0;
            return dateB - dateA;
          })
          .map((job) => (
            <div key={job.id} className="job-card">
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

// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./index.css";
// import "./App.css";

// function App () {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // Cette variable est utilisée

//   useEffect(() => {
//     fetchJobs(); // Assurez-vous que fetchJobs est appelé si elle est définie
//   }, []);

//   const fetchJobs = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         "http://api.adzuna.com/v1/api/jobs/fr/search/1",
//         {
//           params: {
//             app_id: "b5921462",
//             app_key: "807e2f4cfbb71db3792d11e4973f4955",
//             results_per_page: 20,
//             what: "javascript developer",
//             where: "Marseille",
//             content_type: "application/json"
//           },
//         }
//       );
//       setJobs(response.data.results);
//       setLoading(false);
//     } catch (error) {
//       // Gérer les erreurs correctement
//       if (error.response) {
//         setError(`Erreur: ${error.response.status} - ${error.response.data.message}`);
//       } else if (error.request) {
//         setError("Aucune réponse du serveur. Vérifiez votre connexion réseau.");
//       } else {
//         setError(`Erreur: ${error.message}`);
//       }
//       setLoading(false);
//     }
//   };

//   // Assurez-vous d'utiliser toutes les variables déclarées
//   if (loading) {
//     return <p>Chargement des offres d/emploi...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       <h1>Offres d/emploi informatique à Marseille</h1>
//       <div className="job-list">
//         {jobs.length > 0 ? (
//           jobs.map((job, index) => (
//             <div key={index} className="job-card">
//               <h2>{job.title}</h2>
//               <p><strong>Entreprise:</strong> {job.company.display_name}</p>
//               <p><strong>Lieu:</strong> {job.location.display_name}</p>
//               <p><strong>Type de contrat:</strong> {job.contract_time}</p>
//               <p><strong>Date de publication:</strong> {job.created}</p>
//               <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
//                 Voir l/offre
//               </a>
//             </div>
//           ))
//         ) : (
//           <p>Aucune offre trouvée.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;
