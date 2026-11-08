function Experience({ work, education }) {
  if (!work?.length) return null;

  return (
    <section id="experience" className="section section--muted">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Experience</p>
          <h2>Where the systems actually ran.</h2>
        </div>

        <ol className="timeline">
          {work.map((role) => (
            <li className="timeline-item" key={`${role.company}-${role.years}`}>
              <div className="timeline-marker" aria-hidden="true" />
              <div className="timeline-content">
                <div className="timeline-heading">
                  <h3>{role.title}</h3>
                  <span className="timeline-dates">{role.years}</span>
                </div>
                <p className="timeline-company">{role.company}</p>
                <p className="timeline-summary">{role.summary}</p>
                <ul className="timeline-highlights">
                  {role.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {education?.length > 0 && (
          <div className="education">
            <h3 className="education-heading">Education</h3>
            <ul className="education-list">
              {education.map((item) => (
                <li key={item.school}>
                  <span className="education-school">{item.school}</span>
                  <span className="education-degree">{item.degree}</span>
                  <span className="education-dates">{item.dateFrom} – {item.dateTo}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;
