import {uniqBy} from 'lodash';
import React, {
  createContext,
  ReactElement,
  SetStateAction,
  useContext,
} from 'react';

interface Hit {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  user: string;
  tags: string;
}

interface SearchResults {
  total: number;
  totalHits: number;
  hits: Hit[];
}

interface AppContextValue {
  currentSearchValue: string;
  setCurrentSearchValue: React.Dispatch<SetStateAction<string>>;
  searchResults: SearchResults;
  setSearchResults: React.Dispatch<SetStateAction<SearchResults>>;
  appendHits: (newHits?: Hit[]) => void;
  getHitById: (id: number) => Hit | undefined;
  resetSearchResults: () => void;
}

const initSearchResults = {total: 0, hits: [], totalHits: 0};

const AppContext = createContext<AppContextValue>(undefined as any);

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppProvider: React.FC<{children: ReactElement}> = ({children}) => {
  const [currentSearchValue, setCurrentSearchValue] = React.useState('');
  const [searchResults, setSearchResults] =
    React.useState<SearchResults>(initSearchResults);

  const appendHits = React.useCallback((newHits: Hit[] = []) => {
    if (newHits.length === 0) {
      return;
    }
    setSearchResults(prev => {
      const allHits = uniqBy([...prev.hits, ...newHits], hit => hit.id);
      return {...prev, hits: allHits};
    });
  }, []);

  const getHitById = React.useCallback(
    (id: number) => {
      return searchResults.hits.find(hit => hit.id === id);
    },
    [searchResults.hits],
  );

  const resetSearchResults = React.useCallback(() => {
    setSearchResults(initSearchResults);
  }, []);

  const value: AppContextValue = React.useMemo(
    () => ({
      currentSearchValue,
      setCurrentSearchValue,
      searchResults,
      setSearchResults,
      appendHits,
      getHitById,
      resetSearchResults,
    }),
    [
      currentSearchValue,
      searchResults,
      appendHits,
      getHitById,
      resetSearchResults,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
