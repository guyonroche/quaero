import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Container from './utils/container';

import QuestionPanel from './question-panel';
import QuestionsPanel from './questions-panel';
import AskPanel from './ask-panel';
import SearchPanel from './search-panel';

class Home extends Container {
  constructor(props) {
    super(props);
  }

  render() {
    const handleSelect = (index, last) => {
      console.log('Selected Tab', index, last);
    };
    const shorten = title => title.length > 20 ?
            title.substr(0, 18) + '...' : title;

    const { questions } = this.state;

    const showQuestion = this.state.showQuestion;
    const questionIndex = showQuestion ?
      questions.findIndex(question => question.quid === showQuestion) : -1;
    const tabIndex = questionIndex !== -1 ? 4 + questionIndex : 0;


    // Cool UX - to view a question, add a tab for it here!!!
    // TODO: store list of 'watched' questions on user info in svr
    return (
      <div className="app-main">
        <Tabs onSelect={handleSelect} selectedIndex={tabIndex}>
          <TabList>
            <Tab>Top</Tab>
            <Tab>Recent</Tab>
            <Tab>Search</Tab>
            <Tab>Ask</Tab>
            {
              questions.map(question => (
                <Tab key={`tab-${question.quid}`} >{shorten(question.title)}</Tab>
              ))
            }
          </TabList>

          <TabPanel>
            <QuestionsPanel type="top"/>
          </TabPanel>
          <TabPanel>
            <QuestionsPanel type="recent"/>
          </TabPanel>
          <TabPanel>
            <SearchPanel />
          </TabPanel>
          <TabPanel>
            <AskPanel />
          </TabPanel>
          {
            questions.map(question => (
              <TabPanel key={`tab-panel-${question.quid}`}>
                <QuestionPanel question={question} />
              </TabPanel>
            ))
          }
        </Tabs>
      </div>
    );
  }
}
Home.contextTypes = {
  store: React.PropTypes.object
};

export default Home;