import { Mail, Phone, MapPin, Code2, Link, ExternalLink } from 'lucide-react'
import './Contact.css'

function Contact() {
  const contactInfo = [
    {
      icon: <Phone size={20} />,
      label: 'Phone',
      value: '+91 8347735836',
      href: 'tel:+918347735836',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'santosh102969@gmail.com',
      href: 'mailto:santosh102969@gmail.com',
    },
    {
      icon: <MapPin size={20} />,
      label: 'Location',
      value: 'Dehradun, India',
      href: null,
    },
  ]

  const socials = [
    {
      icon: <Code2 size={20} />,
      label: 'GitHub',
      href: 'https://github.com/santosh',
    },
    {
      icon: <Link size={20} />,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/santosh',
    },
    {
      icon: <ExternalLink size={20} />,
      label: 'LeetCode',
      href: 'https://leetcode.com/santosh',
    },
  ]

  return (
    <section className="section-wrapper contact-section">
      <div className="contact-content">
        <div className="contact-header">
          <h2 className="section-title">
            Get in <span className="accent-text">Touch</span>
          </h2>
          <p className="contact-intro">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Contact Info</h3>
            <div className="contact-list">
              {contactInfo.map((item, idx) => (
                <div key={idx} className="contact-item">
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-details">
                    <span className="contact-label">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="contact-value link">{item.value}</a>
                    ) : (
                      <span className="contact-value">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-card">
            <h3>Connect</h3>
            <div className="social-list">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-item"
                >
                  <div className="social-icon">{social.icon}</div>
                  <span className="social-label">{social.label}</span>
                  <ExternalLink size={16} className="external-icon" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="contact-cta">
          <p>
            Currently open to <strong>internship opportunities</strong> and <strong>collaborative projects</strong> in Data Science and ML.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Contact
