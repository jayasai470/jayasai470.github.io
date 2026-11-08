function Projects({ projects }) {
  if (!projects?.length) return null;

  return (
    <section id="projects" className="section section--muted">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Selected Work</p>
          <h2>Systems shipped in production.</h2>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <ul className="tag-list">
                {project.tags.map((tag) => (
                  <li className="tag tag--muted" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
