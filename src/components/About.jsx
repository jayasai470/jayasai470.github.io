import { MapPinIcon } from './Icons.jsx';

function About({ main, resume }) {
  if (!main) return null;

  const stats = [
    { label: 'Years in backend & DevOps', value: '11+' },
    { label: 'Engineers → Staff progression', value: '4 roles' },
    { label: 'Regions served in production', value: '3' },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">About</p>
          <h2>Backend systems, built to carry real traffic.</h2>
        </div>

        <div className="about-grid">
          <div className="about-copy">
            <p className="lead">{main.bio}</p>
            <p>{resume?.skillmessage}</p>
            <p className="about-location">
              <MapPinIcon />
              {main.address?.city}, {main.address?.state}
            </p>
          </div>

          <dl className="about-stats">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default About;
