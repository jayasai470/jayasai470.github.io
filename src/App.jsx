import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import './App.css';
import Header from './components/Header.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/resumeData.json')
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.error('Failed to load resume data', err));
    ReactGA.initialize('G-24T9D4431G');
  }, []);

  if (!data) return null;

  return (
    <div className="site">
      <Header main={data.main} />
      <main>
        <About main={data.main} resume={data.resume} />
        <Experience work={data.resume.work} education={data.resume.education} />
        <Skills categories={data.resume.skillCategories} />
        <Projects projects={data.projects} />
        <Contact main={data.main} />
      </main>
      <Footer main={data.main} />
    </div>
  );
}

export default App;
