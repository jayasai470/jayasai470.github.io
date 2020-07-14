import React, { Component } from 'react';
// import ReactGA from 'react-ga';
import './App.css';
import Header from './Components2/Header';
import Footer from './Components2/Footer';
import About from './Components2/About';
import Resume from './Components2/Resume';
import Contact from './Components2/Contact';
import Portfolio from './Components2/Portfolio';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      foo: 'bar',
      resumeData: {}
    };

    // ReactGA.initialize('UA-110570651-1');
    // ReactGA.pageview(window.location.pathname);

  }

  getResumeData() {
    fetch('resumeData.json')
      .then(r => r.json())
      .then(resumeData => this.setState({ resumeData }))
    // .then(data => this.setState({resumeData: data.json()}))
  }

  componentDidMount() {
    this.getResumeData();
  }

  render() {
    return (
      <div className="App">
        <Header data={this.state.resumeData.main} />
        <About data={this.state.resumeData.main} />
        <Resume data={this.state.resumeData.resume} />
        <Portfolio data={this.state.resumeData.portfolio} />
        <Contact data={this.state.resumeData.main} />
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
