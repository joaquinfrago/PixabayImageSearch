import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button, Input, Text} from '@rneui/themed';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {AppStackParamList} from '../../../App';
import {useAppContext} from '../../context/app';
import {searchImages} from '../../services/searchImages';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'Search'
>;

const SearchScreen = () => {
  const {navigate} = useNavigation<SearchScreenNavigationProp>();
  const {
    currentSearchValue: searchValue,
    setCurrentSearchValue: setSearchValue,
    setSearchResults,
  } = useAppContext();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = async () => {
    if (searchValue === '') {
      return;
    }
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const response = await searchImages({q: searchValue, page: 1});
    setIsLoading(false);
    if (response) {
      const resJson = await response.json();
      if (resJson?.totalHits?.length === 0) {
        return;
      }
      setSearchResults(resJson);
      navigate('Results');
    }
  };

  return (
    <View style={styles.container}>
      <Text h4>Pixabay Image Search</Text>
      <Input value={searchValue} onChangeText={setSearchValue} />
      <Button onPress={handleSearch}>
        {isLoading ? <ActivityIndicator /> : 'Search'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default SearchScreen;
