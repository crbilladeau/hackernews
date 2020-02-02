import React, { Component } from 'react';
import axios from 'axios';
import './index.css';
import Table from '../Table';
import Search from '../Search';
import { ButtonWithLoading } from '../Button';
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PARAM_PAGE,
  PARAM_HPP,
  url
} from '../../constants';

const updateSearchTopStoriesState = (hits, page) => prevState => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  const updatedHits = [...oldHits, ...hits];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};

class App extends Component {
  state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false
  };

  // this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  // this.setSearchTopStories = this.setSearchTopStories.bind(this);
  // this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  // this.onSearchChange = this.onSearchChange.bind(this);
  // this.onSearchSubmit = this.onSearchSubmit.bind(this);
  // this.onDismiss = this.onDismiss.bind(this);

  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];

  setSearchTopStories = result => {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  };

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    axios(`${url}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }));
  };

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    e.preventDefault();
  };

  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  };

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
