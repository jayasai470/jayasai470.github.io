import { GitHubIcon, LinkedInIcon, MailIcon, ArrowUpRightIcon, MapPinIcon } from './Icons.jsx';

const ICONS = { github: GitHubIcon, linkedin: LinkedInIcon, mail: MailIcon };

function Contact({ main }) {
  if (!main) return null;

  return (
    <section id="contact" className="section section--dark">
      <div className="container">
        <div className="contact-grid">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Let's talk.</h2>
            <p className="contact-message">{main.contactmessage}</p>
            <p className="about-location about-location--light">
              <MapPinIcon />
              {main.address?.city}, {main.address?.state}
            </p>
          </div>

          <div className="contact-actions">
            <a className="button button--primary" href={`mailto:${main.email}`}>
              Email Me
              <ArrowUpRightIcon />
            </a>

            <ul className="contact-link-list">
              {main.social?.map((network) => {
                const Icon = ICONS[network.icon];
                return (
                  <li key={network.name}>
                    <a href={network.url} target="_blank" rel="noreferrer">
                      {Icon ? <Icon /> : null}
                      <span>{network.icon === 'mail' ? main.email : network.url.replace(/^https?:\/\//, '')}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
