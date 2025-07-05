import React, { useState } from "react";
import "./BeOurMentor.css";
import { collection, addDoc, Timestamp,getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { db } from "../firebase"; 
import { storage } from "../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;




export default function BeOurMentor() {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState("");


  const [sessionSlots, setSessionSlots] = useState([
    { title: "", duration: "", description: "", price: "" }
  ]);

  const [schedule, setSchedule] = useState([{ topic: "", date: "", details: "" }]);
  const [tasks, setTasks] = useState([{ title: "", description: "", due: "" }]);
  const [resources, setResources] = useState([{ title: "", url: "" }]);

// 
const [formData, setFormData] = useState({
  name: "",
  role: "",
  experience: "",
  languages: "",
  university: "",
  education: "",
  linkedin: "",
  price: "",
  about: "",
  whyMentor: "",
  helpWith: "",
  location: "" // ✅ new field
});


  const [imageFile, setImageFile] = useState(null);
//   const [sessionSlots, setSessionSlots] = useState([
//     { title: "", duration: "", description: "", price: "" }
//   ]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };




  // for cohort
  const [cohortTitle, setCohortTitle] = useState("");
const [subtitle, setSubtitle] = useState("");
const [mentorName, setMentorName] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [menteesCount, setMenteesCount] = useState("");
const [commitment, setCommitment] = useState("");
const [audience, setAudience] = useState("");
const [welcomeMsg, setWelcomeMsg] = useState("");
const [coreSkills, setCoreSkills] = useState("");
const [interviewPrep, setInterviewPrep] = useState("");
const [skillsGain, setSkillsGain] = useState("");

const [progress, setProgress] = useState("");
const [cohortImage, setCohortImage] = useState(null);

const handleCohortImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setCohortImage(e.target.files[0]);
  }
};


  const handleOpen = (type) => {
    setSelected(type);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelected(null);
  };


 const handleSubmit = async () => {
    try {
      let imageUrl = "";

      if (imageFile) {
        const storageRef = ref(storage, `mentors/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const mentorData = {
        ...formData,
        imageUrl,
        sessionSlots,
        createdAt: Timestamp.now(),
        status: "pending",
        createdBy: auth.currentUser?.uid || "anonymous"
      };

      await addDoc(collection(db, "mentors_section"), mentorData);
      alert("Mentor data with image uploaded successfully!");
    } catch (err) {
      console.error("Error submitting mentor:", err);
      alert("Something went wrong. Check console.");
    }
  };


const handleCohortSubmit = async () => {
  try {
    const storage = getStorage();
    const db = getFirestore();
    let imageUrl = "";

    if (cohortImage) {
      const imageRef = ref(storage, `cohort_images/${cohortImage.name}`);
      await uploadBytes(imageRef, cohortImage);
      imageUrl = await getDownloadURL(imageRef);
    }

    const cohortData = {
      cohortTitle,
      subtitle,
      mentorName,
      startDate,
      endDate,
      menteesCount,
      commitment,
      audience,
      welcomeMsg,
      coreSkills,
      interviewPrep,
      skillsGain,
      schedule,
      tasks,
      resources,
      progress,
      imageUrl,
      status: "pending"
    };

    await addDoc(collection(db, "Cohorts"), cohortData);
    alert("Cohort submitted successfully!");
  } catch (error) {
    console.error("Error submitting cohort:", error);
  }
};

  return (
    <div>
      <Heading />
      <div className="mentor-page">
        <h1 className="mentor-title">Be Our Mentor</h1>
        <p className="mentor-subtitle">Choose how you'd like to contribute to the GetLanded community.</p>

        <div className="mentor-intro-box">
          <p>
            At <strong>GetLanded</strong>, we believe in the power of mentorship. Whether you've landed a top role,
            completed your education abroad, or have unique career insights, your guidance can shape someone’s future.
          </p>
          <ul className="mentor-benefits">
            <li>✅ Share your journey with aspiring students</li>
            <li>🌐 Expand your professional network</li>
            <li>🎓 Support learners navigating global education & careers</li>
            <li>🧠 Build your personal brand as a mentor</li>
          </ul>
          <p>Select an option below to start contributing:</p>
        </div>

        <div className="mentor-options">
          <button className="option-btn" onClick={() => handleOpen("schedule")}>
            Add Mentor Schedule
          </button>
          {/* <button className="option-btn" onClick={() => handleOpen("cohort")}>
            Add Cohorts
          </button> */}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <button className="close-btn" onClick={handleClose}>✖</button>

            {selected === "schedule" && (
               <div className="form-box">
                <h2>Add Mentor Details</h2>
                <span>📁 Upload your Image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <input name="name" type="text" placeholder="Mentor Name" onChange={handleChange} />
                <input name="role" type="text" placeholder="Title / Role" onChange={handleChange} />
                <input name="experience" type="number" placeholder="Years of Experience" onChange={handleChange} />
                <input name="location" type="text" placeholder="Location" onChange={handleChange}/>

                <input name="languages" type="text" placeholder="Languages (comma-separated)" onChange={handleChange} />
                <input name="university" type="text" placeholder="University Name" onChange={handleChange} />
                <input name="education" type="text" placeholder="Education Background" onChange={handleChange} />
                <input name="linkedin" type="url" placeholder="LinkedIn Profile URL" onChange={handleChange} />
                <input name="price" type="number" placeholder="Session Price (£)" onChange={handleChange} />
                <textarea name="about" placeholder="About the Mentor" rows="4" onChange={handleChange} />
                <textarea name="whyMentor" placeholder="Why I Mentor" rows="3" onChange={handleChange} />
                <textarea name="helpWith" placeholder="What I Can Help With" rows="3" onChange={handleChange} />

                <h3>1-on-1 Session Slots</h3>
                {sessionSlots.map((slot, i) => (
                    <div key={i} className="session-slot">
                    <input
                        type="text"
                        placeholder="Title"
                        value={slot.title}
                        onChange={(e) => {
                        const updated = [...sessionSlots];
                        updated[i].title = e.target.value;
                        setSessionSlots(updated);
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Duration"
                        value={slot.duration}
                        onChange={(e) => {
                        const updated = [...sessionSlots];
                        updated[i].duration = e.target.value;
                        setSessionSlots(updated);
                        }}
                    />
                    <textarea
                        placeholder="Short Description"
                        value={slot.description}
                        onChange={(e) => {
                        const updated = [...sessionSlots];
                        updated[i].description = e.target.value;
                        setSessionSlots(updated);
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={slot.price}
                        onChange={(e) => {
                        const updated = [...sessionSlots];
                        updated[i].price = e.target.value;
                        setSessionSlots(updated);
                        }}
                    />
                    </div>
                ))}
                <button className="btn" onClick={() =>
                    setSessionSlots([...sessionSlots, { title: "", duration: "", description: "", price: "" }])
                }>
                    + Add Extra Slot
                </button>

                <button className="btn full-width" style={{ marginTop: "20px" }} onClick={handleSubmit}>
                    Submit Schedule
                </button>
                </div>
            )}

            {selected === "cohort" && (
              <div className="form-box">
  <h2>Add Cohort</h2>
  <label>Upload Mentor Profile Image</label>
<input
  type="file"
  accept="image/*"
  onChange={handleCohortImageChange}
/>
  <input type="text" placeholder="Cohort Title" value={cohortTitle} onChange={(e) => setCohortTitle(e.target.value)} />
  <input type="text" placeholder="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
  <input type="text" placeholder="Mentor Name & Role" value={mentorName} onChange={(e) => setMentorName(e.target.value)} />
  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
  <input type="number" placeholder="Number of Mentees" value={menteesCount} onChange={(e) => setMenteesCount(e.target.value)} />
  <input type="text" placeholder="Time Commitment" value={commitment} onChange={(e) => setCommitment(e.target.value)} />
  <input type="text" placeholder="Target Audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
  <textarea placeholder="Welcome Message" rows="5" value={welcomeMsg} onChange={(e) => setWelcomeMsg(e.target.value)} />
  <textarea placeholder="Core Skills" rows="3" value={coreSkills} onChange={(e) => setCoreSkills(e.target.value)} />
  <textarea placeholder="Interview Prep" rows="3" value={interviewPrep} onChange={(e) => setInterviewPrep(e.target.value)} />
  <input type="text" placeholder="Skills You'll Gain" value={skillsGain} onChange={(e) => setSkillsGain(e.target.value)} />

  <h3>Schedule</h3>
  {schedule.map((s, i) => (
    <div key={i} className="session-slot">
      <input
        type="text"
        placeholder="Topic"
        value={s.topic}
        onChange={(e) => {
          const updated = [...schedule];
          updated[i].topic = e.target.value;
          setSchedule(updated);
        }}
      />
      <input
        type="date"
        value={s.date}
        onChange={(e) => {
          const updated = [...schedule];
          updated[i].date = e.target.value;
          setSchedule(updated);
        }}
      />
      <textarea
        placeholder="Details"
        value={s.details}
        onChange={(e) => {
          const updated = [...schedule];
          updated[i].details = e.target.value;
          setSchedule(updated);
        }}
      />
    </div>
  ))}
  <button className="btn" onClick={() =>
    setSchedule([...schedule, { topic: "", date: "", details: "" }])
  }>+ Add Schedule</button>

  <h3>Tasks</h3>
  {tasks.map((t, i) => (
    <div key={i} className="session-slot">
      <input
        type="text"
        placeholder="Task Title"
        value={t.title}
        onChange={(e) => {
          const updated = [...tasks];
          updated[i].title = e.target.value;
          setTasks(updated);
        }}
      />
      <textarea
        placeholder="Task Description"
        value={t.description}
        onChange={(e) => {
          const updated = [...tasks];
          updated[i].description = e.target.value;
          setTasks(updated);
        }}
      />
      <input
        type="date"
        value={t.due}
        onChange={(e) => {
          const updated = [...tasks];
          updated[i].due = e.target.value;
          setTasks(updated);
        }}
      />
    </div>
  ))}
  <button className="btn" onClick={() =>
    setTasks([...tasks, { title: "", description: "", due: "" }])
  }>+ Add Task</button>

  <h3>Resources</h3>
  {resources.map((r, i) => (
    <div key={i} className="session-slot">
      <input
        type="text"
        placeholder="Resource Title"
        value={r.title}
        onChange={(e) => {
          const updated = [...resources];
          updated[i].title = e.target.value;
          setResources(updated);
        }}
      />
      <input
        type="url"
        placeholder="URL"
        value={r.url}
        onChange={(e) => {
          const updated = [...resources];
          updated[i].url = e.target.value;
          setResources(updated);
        }}
      />
    </div>
  ))}
  <button className="btn" onClick={() =>
    setResources([...resources, { title: "", url: "" }])
  }>+ Add Resource</button>

  <h3>Progress</h3>
  <textarea placeholder="Progress Updates" rows="3" value={progress} onChange={(e) => setProgress(e.target.value)} />

  <button className="btn full-width" style={{ marginTop: "20px" }} onClick={handleCohortSubmit}>
    Submit Cohort
  </button>
</div>

            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
