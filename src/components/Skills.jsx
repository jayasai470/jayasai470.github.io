function Skills({ categories }) {
  if (!categories?.length) return null;

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Skills</p>
          <h2>The stack, end to end.</h2>
        </div>

        <div className="skills-grid">
          {categories.map((category) => (
            <div className="skill-card" key={category.category}>
              <h3>{category.category}</h3>
              <ul className="tag-list">
                {category.items.map((item) => (
                  <li className="tag" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
