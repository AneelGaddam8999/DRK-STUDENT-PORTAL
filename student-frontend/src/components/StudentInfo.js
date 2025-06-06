import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './StudentInfo.css';

function StudentInfo() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [showMarks, setShowMarks] = useState(false);
  const [showCourseSyllabus, setShowCourseSyllabus] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [storedInfo, setStoredInfo] = useState({
    phoneNumber: '',
    email: '',
    address: ''
  });
  

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user from localStorage
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    const fetchStoredInfo = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.rollNumber) return;
  
        const response = await axios.get(`http://localhost:5000/api/student/info/${user.rollNumber}`);
        if (response.data.success) {
          setStoredInfo(response.data.studentInfo);
        }
      } catch (error) {
        console.error('Error fetching stored info:', error);
      }
    };
  
    fetchStoredInfo();
  }, []);


  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const rollNumber = JSON.parse(localStorage.getItem('user')).rollNumber;
      const response = await axios.get(`http://localhost:5000/api/student/${rollNumber}`);
      setData(response.data);
      setShowMarks(!showMarks);
      if (showSyllabus) {
        setShowSyllabus(false); // Hide marks if syllabus is shown
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 // State to store form data
 const [formData, setFormData] = useState({
  phoneNumber: '',
  email: '',
  address: ''
});

// State for handling submission feedback
const [submitStatus, setSubmitStatus] = useState({
  message: '',
  isError: false
});

// Handle input changes
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitStatus({ message: '', isError: false });

  try {
    const rollNumber = JSON.parse(localStorage.getItem('user'))?.rollNumber;
    
    if (!rollNumber) {
      setSubmitStatus({
        message: 'Roll number not found. Please login again.',
        isError: true
      });
      return;
    }

    const response = await axios.put('http://localhost:5000/api/register', {
      ...formData,
      rollNumber
    });

    if (response.data.success) {
      // Update stored info with new values
      setStoredInfo(prevState => ({
        ...prevState,
        ...formData
      }));
      
      // Clear form data
      setFormData({
        phoneNumber: '',
        email: '',
        address: ''
      });

      setSubmitStatus({
        message: 'Information updated successfully!',
        isError: false
      });
    }
  } catch (error) {
    setSubmitStatus({
      message: error.response?.data?.message || 'Failed to update information',
      isError: true
    });
  }
};

  const fetchSyllabus = () => {
    setShowSyllabus(!showSyllabus); // Toggle syllabus view
    if (showMarks) {
      setShowMarks(false); // Hide marks if syllabus is shown
    }
  };

  const handleRegulationClick = (regulation) => {
    try {
      const courseName = loggedInUser.courseName.toLowerCase();
      const pdfPath = `/images/${regulation}(${courseName}).pdf`;
      setSelectedPdf(pdfPath);
      setShowPdf(true);
    } catch (error) {
      console.error('Error opening PDF:', error);
      alert('Error opening PDF. Please try again later.');
    }
  };

  // Get logged in user's info
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!localStorage.getItem('user')) {
    return null; 
  }



   
  const shouldShowInput = (fieldName) => {
    return !storedInfo[fieldName];
  };

  return (
    <div className="student-page-container">
      <div className="decorative-elements">
        <div className="decorative-element"></div>
        <div className="decorative-element"></div>
        <div className="decorative-element"></div>
      </div>
      
      <div className="content-container">
        <div className="header-container">
          <h1 className="page-title">Student Information</h1>
          <div className="user-info">
            <span className="welcome-text">
              Welcome, {loggedInUser.name || 'Student'}
            </span>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
            <button 
              className="home-button"
              onClick={() => navigate('/')}
            > 
              Home
            </button>
          </div>
        </div>

        <div className="search-container">
          <div className="search-buttons-wrapper">
            <button onClick={fetchStudentData} className="search-button">
              Fetch academic results
            </button>

            <button onClick={fetchSyllabus} className="search-button">
              View syllabus
            </button>
          </div>

          {showSyllabus && loggedInUser.courseName && (
            <div className="syllabus-container">
              <div className="regulation-buttons">
                {/* CSE Course Buttons */}
                {loggedInUser.courseName === "CSE" && (
                  <>
                    <button 
                      className="regulation-button"
                      onClick={() => handleRegulationClick('r22')}
                    >
                      R22
                    </button>
                    <button 
                      className="regulation-button"
                      onClick={() => handleRegulationClick('r18')}
                    >
                      R18
                    </button>
                    <button 
                      className="regulation-button"
                      onClick={() => handleRegulationClick('r16')}
                    >
                      R16
                    </button>
                  </>
                )}

                {/* CSM Course Buttons */}
                {loggedInUser.courseName === "CSM" && (
                  <button 
                    className="regulation-button"
                    onClick={() => handleRegulationClick('r22')}
                  >
                    R22
                  </button>
                )}

                {/* CSD Course Buttons */}
                {loggedInUser.courseName === "CSD" && (
                  <button 
                    className="regulation-button"
                    onClick={() => handleRegulationClick('r22')}
                  >
                    R22
                  </button>
                )}

                {/* Mechanical Course Buttons */}
                {loggedInUser.courseName === "Mechanical" && (
                  <>
                    <button 
                      className="regulation-button"
                      onClick={() => handleRegulationClick('r22')}
                    >
                      R22
                    </button>
                    <button 
                      className="regulation-button"
                      onClick={() => handleRegulationClick('r18')}
                    >
                      R18
                    </button>
                    <button 
                      className="regulation-button"
                      onClick={() => handleRegulationClick('r16')}
                    >
                      R16
                    </button>
                  </>
                )}
              </div>
              {showPdf && selectedPdf && (
      <div className="pdf-viewer">
        <object
          data={selectedPdf}
          type="application/pdf"
          width="100%"
          height="600px"
        >
          <p>Unable to display PDF file. <a href={selectedPdf} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
        </object>
      </div>
    )}
            </div>
          )}
     
        
        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">Error: {error}</p>}
        {/* New Results Display Section */}
        {showMarks && data && (
          <div className="result-container">
            {/* Student Details Section */}
            <div className="student-details">
              <h2>Student Details</h2>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>{data.details.name}</td>
                    <td><strong>Roll Number:</strong></td>
                    <td>{data.details.rollNumber}</td>
                  </tr>
                  <tr>
                    <td><strong>College Code:</strong></td>
                    <td>{data.details.collegeCode}</td>
                    <td><strong>Father's Name:</strong></td>
                    <td>{data.details.fatherName}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Semester-wise Results */}
            {data.results.semesters.map((semester, index) => (
              <div key={index} className="semester-section">
                <h3>Semester {semester.semester}</h3>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject Name</th>
                      <th>Internal</th>
                      <th>External</th>
                      <th>Total</th>
                      <th>Grade</th>
                      <th>Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.subjects.map((subject, subIndex) => (
                      <tr key={subIndex}>
                        <td>{subject.subjectCode}</td>
                        <td>{subject.subjectName}</td>
                        <td>{subject.internalMarks}</td>
                        <td>{subject.externalMarks}</td>
                        <td>{subject.totalMarks}</td>
                        <td className={subject.grades === 'F' ? 'failed-grade' : ''}>
                          {subject.grades}
                        </td>
                        <td>{subject.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="7">
                        <div className="semester-summary">
                          <span><strong>SGPA:</strong> {semester.semesterSGPA}</span>
                          <span><strong>Credits:</strong> {semester.semesterCredits}</span>
                          <span><strong>Backlogs:</strong> {semester.backlogs}</span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}
            
            {/* Overall Performance Summary */}
            <div className="overall-summary">
              <h3>Overall Performance</h3>
              <div className="summary-details">
                <span><strong>CGPA:</strong> {data.results.CGPA}</span>
                <span><strong>Total Credits:</strong> {data.results.credits}</span>
                <span><strong>Total Backlogs:</strong> {data.results.backlogs}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="content-container">
  <h2>Additional Info</h2>
  
  {/* Display stored information */}
  <div className="stored-info">
    {storedInfo.phoneNumber && (
      <div className="info-display">
        <h3>Phone Number</h3>
        <p>{storedInfo.phoneNumber}</p>
      </div>
    )}
    
    {storedInfo.email && (
      <div className="info-display">
        <h3>Email</h3>
        <p>{storedInfo.email}</p>
      </div>
    )}
    
    {storedInfo.address && (
      <div className="info-display">
        <h3>Address</h3>
        <p>{storedInfo.address}</p>
      </div>
    )}
  </div>


  {(shouldShowInput('phoneNumber') || shouldShowInput('email') || shouldShowInput('address')) && (
    <form onSubmit={handleSubmit}>
      {shouldShowInput('phoneNumber') && (
        <div className="form-group">
          <h3>Phone Number</h3>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="form-input"
          />
        </div>
      )}

      {shouldShowInput('email') && (
        <div className="form-group">
          <h3>Email</h3>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="form-input"
          />
        </div>
      )}

      {shouldShowInput('address') && (
        <div className="form-group">
          <h3>Address</h3>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="form-textarea"
          />
        </div>
      )}

      {/* Status message */}
      {submitStatus.message && (
        <div className={`status-message ${submitStatus.isError ? 'error' : 'success'}`}>
          {submitStatus.message}
        </div>
      )}

      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  )}
    </div>

    </div>
  );
}

export default StudentInfo;