import React, { Component, createContext} from "react";

// Create Context
const SearchContext = createContext()
SearchContext.displayName = "SearchContext";

// Provider Component
export class SearchProvider extends Component {
    state = {
        searchQuery: '',
    }

    setSearchQuery = (query) => {
        this.setState({searchQuery: query})
    }

    render() {
        return (
            <SearchContext.Provider
                value={{
                searchQuery: this.state.searchQuery,
                setSearchQuery: this.setSearchQuery,
                }}
            >
                {this.props.children}
            </SearchContext.Provider>
        )
    }
}

// Export Context
export default SearchContext
