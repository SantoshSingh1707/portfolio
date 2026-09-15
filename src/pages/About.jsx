import { GraduationCap, Briefcase, Code, Award } from 'lucide-react'
import './About.css'

function About() {
  const education = [
    {
      school: 'Dehradun Institute of Technology',
      location: 'Dehradun, India',
      degree: 'B.Tech Computer Science & Engineering',
      period: '2023 – 2027',
    },
    {
      school: 'SGRR Public School',
      location: 'Dehradun, India',
      degree: 'Senior Secondary School (Class XII)',
      period: 'Jul 2021 – Apr 2023',
      score: '73.45%',
    },
    {
      school: 'OLOHES',
      location: 'Silvassa, India',
      degree: 'High School (Class X)',
      period: 'May 2013 – Apr 2021',
      score: '79.67%',
    },
  ]

  const experience = [
    {
      company: 'Celebal Technologies Pvt. Ltd.',
      role: 'Celebal Excellence Intern (CEI) — Data Science',
      period: 'Jun 2026 – Aug 2026',
      highlights: [
        'Selected for structured, industry-focused internship combining guided learning, mentorship, and hands-on project work on real-world Data Science use cases',
        'Undergoing industry-aligned curriculum to build technical foundations with exposure to industry-relevant tools and datasets',
        'Program concludes with performance-based assessment and Certificate of Completion',
      ],
    },
  ]

  const skills = {
    'Languages': 'Java, Python',
    'Frameworks': 'TensorFlow, Keras, Scikit-learn, Pandas, NumPy, OpenCV, Matplotlib, FastAPI, React, LangChain',
    'Core Concepts': 'Machine Learning, Deep Learning, NLP, Computer Vision, Generative AI, RAG',
    'Tools': 'Jupyter Notebook, Git/GitHub, MLflow, ZenML, Docker, GitHub Actions (CI/CD), Ollama',
  }

  return (
    <section className="section-wrapper about-section">
      <div className="about-content">
        <div className="about-header">
          <h2 className="section-title">
            About <span className="accent-text">Me</span>
          </h2>
          <p className="about-intro">
            A passionate Data Science and ML Engineering student at DIT Dehradun,
            focused on building intelligent solutions with cutting-edge AI technologies.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="card-icon">
              <GraduationCap size={24} />
            </div>
            <h3>Education</h3>
            <div className="timeline">
              {education.map((edu, idx) => (
                <div key={idx} className="timeline-item">
                  <h4>{edu.school}</h4>
                  <p className="degree">{edu.degree}</p>
                  <p className="period">{edu.period}</p>
                  {edu.score && <p className="score">Score: {edu.score}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="about-card">
            <div className="card-icon">
              <Briefcase size={24} />
            </div>
            <h3>Experience</h3>
            <div className="timeline">
              {experience.map((exp, idx) => (
                <div key={idx} className="timeline-item">
                  <h4>{exp.company}</h4>
                  <p className="role">{exp.role}</p>
                  <p className="period">{exp.period}</p>
                  <ul className="highlights">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="about-card full-width">
            <div className="card-icon">
              <Code size={24} />
            </div>
            <h3>Technical Skills</h3>
            <div className="skills-grid">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category} className="skill-category">
                  <h4>{category}</h4>
                  <div className="skill-tags">
                    {skillList.split(', ').map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-card full-width">
            <div className="card-icon">
              <Award size={24} />
            </div>
            <h3>Achievements</h3>
            <p className="achievement">
              <strong>LeetCode:</strong> Solved 280+ Data Structures & Algorithms problems (Java),
              including arrays, strings, hash tables, dynamic programming, and binary search.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
