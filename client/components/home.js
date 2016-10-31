import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import QuestionList from './question-list';
import AskPanel from './ask-panel';
import SearchPanel from './search-panel';

const Home = props => {

  const handleSelect = (index, last) => {
    console.log('Selected Tab', index, last);
  };

  let { store } = props;

  return (
    <div className="app-main">
      <Tabs onSelect={handleSelect} selectedIndex={0}>
        <TabList>
          <Tab>Top</Tab>
          <Tab>Recent</Tab>
          <Tab>Search</Tab>
          <Tab>Ask</Tab>
        </TabList>

        <TabPanel>
          <QuestionList store={store} type="top" />
        </TabPanel>
        <TabPanel>
          <QuestionList store={store} type="recent" />
        </TabPanel>
        <TabPanel>
          <SearchPanel store={store} />
        </TabPanel>
        <TabPanel>
          <AskPanel store={store} />
        </TabPanel>
      </Tabs>


    </div>
  );
};

export default Home;