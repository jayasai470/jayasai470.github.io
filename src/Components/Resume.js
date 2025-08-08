import React, { Component } from 'react';

class Resume extends Component {
  render() {

    if(this.props.data){
      var skillmessage = this.props.data.skillmessage;
      var education = this.props.data.education.map(function(education){
        return <div key={education.school}><h3>{education.school}</h3>
        <p className="info">{education.degree} <span>&bull;</span><em className="date">{education.graduated}</em></p>
        <p>{education.description}</p></div>
      })
      var work = this.props.data.work.map(function(work) {  
        // Split the description by full stop and remove any empty strings from the array  
        var descriptionPoints = work.description.split('. ').filter(function(sentence) {
            return sentence.trim().length > 0;  
        });  
      
        // Define the style for the bullet points with some tab indentation  
        var listItemStyle = {
            paddingLeft: '1em', // Adjusts the left padding for indentation  
        };
      
        // Map each sentence to a list item with the defined style  
        var descriptionListItems = descriptionPoints.map(function(sentence, index) {  
            return (  
                <li key={index} style={listItemStyle}>  
                    {sentence.trim()}.
                </li>  
            );  
        });  
      
        return (  
            <div key={work.company}>  
                <h3>{work.company}</h3>  
                <p className="info">{work.title}<span>&bull;</span> <em className="date">{work.years}</em></p>  
                <ul style={{ marginLeft: '1em', listStyleType: 'disc' }}>{descriptionListItems}</ul>  
            </div>  
        );  
    });  
      var skills = this.props.data.skills.map(function(skills){
        var className = 'bar-expand '+skills.name.toLowerCase();
        return <li key={skills.name}><span style={{width:skills.level}}className={className}></span><em>{skills.name}</em></li>
      })
    }

    return (
      <section id="resume">

      <div className="row education">
         <div className="three columns header-col">
            <h1><span>Education</span></h1>
         </div>

         <div className="nine columns main-col">
            <div className="row item">
               <div className="twelve columns">
                 {education}
               </div>
            </div>
         </div>
      </div>


      <div className="row work">

         <div className="three columns header-col">
            <h1><span>Work</span></h1>
         </div>

         <div className="nine columns main-col">
          {work}
        </div>
    </div>



      <div className="row skill">

         <div className="three columns header-col">
            <h1><span>Skills</span></h1>
         </div>

         <div className="nine columns main-col">

            <p>{skillmessage}
            </p>

				<div className="bars">
				   <ul className="skills">
					  {skills}
					</ul>
				</div>
			</div>
      </div>
   </section>
    );
  }
}

export default Resume;
