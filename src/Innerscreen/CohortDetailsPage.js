import React, { useState } from 'react';
import './CohortDetailsPage.css';
import { FaCalendarAlt, FaUserFriends, FaClock } from 'react-icons/fa';
import Heading from '../components/heading';
import Footer from '../components/footer';

const CohortDetailsPage = () => {

     const [activeTab, setActiveTab] = useState('Overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <>
            <div className="card">
              <h3>Welcome Message</h3>
              <p>
                Welcome to UK Fall 2025 – Cohort A! I'm excited to guide you through your product management journey...
              </p>
              <p>
                This cohort is designed for recent graduates and career changers looking to transition into product management roles...
              </p>
            </div>
            <div className="card">
              <h3>What You'll Learn</h3>
              <div className="learning-columns">
                <div>
                  <h4>Core Skills</h4>
                  <ul>
                    <li>Product strategy & roadmapping</li>
                    <li>User research & data analysis</li>
                    <li>Feature prioritization frameworks</li>
                    <li>Stakeholder management</li>
                  </ul>
                </div>
                <div>
                  <h4>Interview Prep</h4>
                  <ul>
                    <li>Product design questions</li>
                    <li>Analytical & metrics cases</li>
                    <li>Behavioral storytelling</li>
                    <li>Mock interview practice</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        );
      case 'Schedule':
        return (
          <div className="weekly-sessions">
            <h3>Weekly Sessions</h3>

            <div className="session-card">
              <div className="session-info">
                <div className="session-title">
                  <strong>Week 1: Product Management Fundamentals</strong>
                  <span className="badge completed">completed</span>
                </div>
                <p>Introduction to product management, role overview, and key frameworks</p>
                <div className="session-meta">
                  <span>📅 9/22/2025</span>
                  <span>🕖 7:00 PM GMT</span>
                </div>
              </div>
              <button className="session-button">View Recording</button>
            </div>

            <div className="session-card">
              <div className="session-info">
                <div className="session-title">
                  <strong>Week 2: User Research & Customer Discovery</strong>
                  <span className="badge upcoming">upcoming</span>
                </div>
                <p>Methods for understanding user needs and validating product ideas</p>
                <div className="session-meta">
                  <span>📅 9/29/2025</span>
                  <span>🕖 7:00 PM GMT</span>
                </div>
              </div>
              <button className="session-button join">Join Session</button>
            </div>

            <div className="session-card">
              <div className="session-info">
                <div className="session-title">
                  <strong>Week 3: Product Strategy & Roadmapping</strong>
                  <span className="badge upcoming">upcoming</span>
                </div>
                <p>Building product vision, strategy, and creating effective roadmaps</p>
                <div className="session-meta">
                  <span>📅 10/6/2025</span>
                  <span>🕖 7:00 PM GMT</span>
                </div>
              </div>
              <button className="session-button join">Join Session</button>
            </div>
          </div>

        );
      case 'Tasks':
        return (
         <div className="weekly-tasks">
          <h3>Weekly Tasks</h3>

          <div className="task-card">
            <div className="task-header">
              <input type="checkbox" />
              <strong>Update LinkedIn Profile</strong>
              <span className="badge week">Week 1</span>
              <span className="badge priority high">high</span>
            </div>
            <p>Optimize your LinkedIn with PM keywords and experience</p>
            <div className="task-meta">📅 Due: 9/28/2025</div>
          </div>

          <div className="task-card">
            <div className="task-header">
              <input type="checkbox" />
              <strong>Complete Product Teardown</strong>
              <span className="badge week">Week 1</span>
              <span className="badge priority medium">medium</span>
            </div>
            <p>Analyze Instagram Stories feature and submit writeup</p>
            <div className="task-meta">📅 Due: 9/30/2025</div>
          </div>

          <div className="task-card">
            <div className="task-header">
              <input type="checkbox" />
              <strong>User Interview Practice</strong>
              <span className="badge week">Week 2</span>
              <span className="badge priority high">high</span>
            </div>
            <p>Conduct 2 practice user interviews with provided script</p>
            <div className="task-meta">📅 Due: 10/5/2025</div>
          </div>
        </div>

        );
      case 'Resources':
        return (
          <div className="resources-container">

            <div className="resource-section">
              <h4>Fundamentals</h4>
              <div className="resource-card">
                <div className="resource-info">
                  <span className="icon">📄</span>
                  <div>
                    <strong>Product Management Frameworks Guide</strong>
                    <p>Comprehensive guide to PM frameworks like RICE, MoSCoW, and Jobs-to-be-Done</p>
                    <span className="resource-tag document">document</span>
                  </div>
                </div>
                <button className="access-button">⬇ Access</button>
              </div>
            </div>

            <div className="resource-section">
              <h4>Session Recordings</h4>
              <div className="resource-card">
                <div className="resource-info">
                  <span className="icon">🎥</span>
                  <div>
                    <strong>Session 1 Recording: PM Fundamentals</strong>
                    <p>Full recording of our first session covering PM basics</p>
                    <span className="resource-tag video">video</span>
                  </div>
                </div>
                <button className="access-button">⬇ Access</button>
              </div>
            </div>

            <div className="resource-section">
              <h4>Templates</h4>
              <div className="resource-card">
                <div className="resource-info">
                  <span className="icon">📄</span>
                  <div>
                    <strong>Product Teardown Template</strong>
                    <p>Template for analyzing product features and user flows</p>
                    <span className="resource-tag template">template</span>
                  </div>
                </div>
                <button className="access-button">⬇ Access</button>
              </div>
            </div>

          </div>

        );
      case 'Progress':
        return (
          <div className="mentee-progress-container">
            <h3>Mentee Progress</h3>

            {[
              {
                name: "Alex Thompson",
                week: "Week 3",
                tasks: 8,
                totalTasks: 10,
                attendance: 100,
                overall: 80,
              },
              {
                name: "Emma Wilson",
                week: "Week 3",
                tasks: 7,
                totalTasks: 10,
                attendance: 90,
                overall: 70,
              },
              {
                name: "James Miller",
                week: "Week 2",
                tasks: 6,
                totalTasks: 10,
                attendance: 80,
                overall: 60,
              },
            ].map((mentee, idx) => (
              <div key={idx} className="mentee-card">
                <div className="mentee-header">
                  <div className="mentee-info">
                    <div className="mentee-avatar" />
                    <div>
                      <strong>{mentee.name}</strong>
                      <div className="mentee-week">{mentee.week}</div>
                    </div>
                  </div>
                  <div className="mentee-overall">{mentee.overall}% Complete</div>
                </div>

                <div className="progress-row">
                  <span>Tasks Completed</span>
                  <span>{mentee.tasks}/{mentee.totalTasks}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="bar-fill"
                    style={{ width: `${(mentee.tasks / mentee.totalTasks) * 100}%` }}
                  />
                </div>

                <div className="progress-row">
                  <span>Session Attendance</span>
                  <span>{mentee.attendance}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="bar-fill"
                    style={{ width: `${mentee.attendance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

        );
      case 'Ask Mentor':
        return (
          <div className="mentor-faq-section">
            <div className="ask-mentor">
              <h3>Ask Sarah Johnson</h3>
              <label>Subject</label>
              <input type="text" placeholder="What's your question about?" />
              
              <label>Message</label>
              <textarea placeholder="Describe your question or challenge in detail..." rows={5} />

              <button className="send-btn">
                <span className="icon">📨</span> Send Message
              </button>

              <div className="response-time">
                <strong>Response time:</strong> Sarah Johnson typically responds within 24 hours. For urgent questions, reach out on Slack.
              </div>
            </div>

            <div className="faq-mentor">
              <h3>Frequently Asked Questions</h3>

              <div className="faq-item">
                <strong>How do I prepare for product management interviews?</strong>
                <p>
                  Focus on understanding the company's products, practice case studies, and prepare specific examples from your experience using the STAR method.
                </p>
              </div>

              <div className="faq-item">
                <strong>What's the difference between a PM and a Product Owner?</strong>
                <p>
                  PMs focus on strategy and vision, while Product Owners are more tactical and work closely with engineering teams on execution.
                </p>
              </div>

              <div className="faq-item">
                <strong>How important is technical knowledge for PMs?</strong>
                <p>
                  You don’t need to code, but understanding technical concepts helps you communicate with engineering and make better product decisions.
                </p>
              </div>
            </div>
          </div>

        );
      default:
        return null;
    }
  };
  return (
    <div>
        <Heading/>
    <div className="cohort-page">
      {/* Header */}
      <div className="cohort-header">
        <div className="cohort-title-area">
          <h1 className="cohort-title">UK Fall 2025 – Cohort <span className="active-badge">A</span></h1>
          <p className="cohort-subtitle">Breaking into product management at top tech companies with hands-on experience and real case studies.</p>
          <div className="cohort-meta">
            <div className="mentor-info">
              <div className="mentor-avatar"></div>
              <span>Sarah Johnson • Senior Product Manager @ Google</span>
            </div>
            <div className="cohort-dates">
              <FaCalendarAlt /> 9/15/2025 - 11/30/2025
            </div>
            <div className="cohort-members">
              <FaUserFriends /> 12/15 mentees
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
    <div className="tab-nav">
        {['Overview', 'Schedule', 'Tasks', 'Resources', 'Progress', 'Ask Mentor'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="cohort-body">
          <div className="left-panel">
          {renderTabContent()}
        </div>


        <div className="right-panel">
          <div className="card">
            <h4>Cohort Details</h4>
            <p><FaCalendarAlt /> <strong>Duration:</strong> 9/15/2025 – 11/30/2025</p>
            <p><FaUserFriends /> <strong>Mentees:</strong> 12 of 15</p>
            <p><FaClock /> <strong>Time Commitment:</strong> 2–3 hours/week</p>
            <p><strong>Target Audience:</strong></p>
            <p className="text-sm">Recent graduates and career changers looking to transition into product management roles</p>
          </div>

          <div className="card">
            <h4>Skills You'll Gain</h4>
            <div className="tags">
              <span className="tag">Product Management</span>
              <span className="tag">Tech</span>
              <span className="tag">Career Change</span>
              <span className="tag">Data Analysis</span>
              <span className="tag">User Research</span>
              <span className="tag">A/B Testing</span>
              <span className="tag">SQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default CohortDetailsPage;
