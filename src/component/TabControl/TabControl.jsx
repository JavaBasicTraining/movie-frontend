import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TabControl.scss';

export default function TabControl(props) {
  const { tabs = [], children } = props;

  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Get all TabContent children
  const tabContents = React.Children.toArray(children).filter(
    (child) => child.type === TabControl.TabContent
  );

  // Get active tab content
  const activeContent = tabContents.find(
    (content) => content.props.name === activeTab
  );

  return (
    <div className="tab-control">
      <div className="tab-control__items">
        {tabs.map((tab) => (
          <TabControl.TabItem
            key={tab}
            name={tab}
            active={activeTab === tab}
            onClick={(name) => setActiveTab(name)}
          />
        ))}
      </div>
      <div className="tab-control__active-content">{activeContent}</div>
    </div>
  );
}

TabControl.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};

TabControl.TabItem = function TabItem(props) {
  const { active, name, onClick } = props;
  return (
    <button
      className={`tab-control__item btn-non-style ${active ? 'active' : ''}`}
      onClick={() => onClick(name)}
    >
      {name}
    </button>
  );
};

TabControl.TabItem.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

TabControl.TabContent = function TabContent(props) {
  const { children, name } = props;
  return (
    <div className="tab-control__content" name={name}>
      {children}
    </div>
  );
};

TabControl.TabContent.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};
