import React, { Component } from 'react';
import ReactGA from "react-ga4";
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import About from './Components/About';
import Resume from './Components/Resume';
import Contact from './Components/Contact';
import Portfolio from './Components/Portfolio';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      foo: 'bar',
      resumeData: {}
    };
  }

  getResumeData() {
    fetch('resumeData.json')
      .then(r => r.json())
      .then(resumeData => this.setState({ resumeData }))
    // .then(data => this.setState({resumeData: data.json()}))
  }

  componentDidMount() {
    this.getResumeData();
    ReactGA.initialize('G-24T9D4431G');
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
