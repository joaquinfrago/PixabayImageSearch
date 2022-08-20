import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button, Image} from '@rneui/themed';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppStackParamList} from '../../../App';
import {useAppContext} from '../../context/app';
import {searchImages} from '../../services/searchImages';

type ResultsScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'Results'
>;

const ResultsScreen = () => {
  const {navigate, goBack} = useNavigation<ResultsScreenNavigationProp>();

  const {currentSearchValue, searchResults, appendHits} = useAppContext();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  // const handleToDetails;

  const handleEndReached = async () => {
    // Return if currently fetching
    if (isLoading) {
      return;
    }
    const newPage = currentPage + 1;
    setIsLoading(true);
    const response = await searchImages({q: currentSearchValue, page: newPage});
    if (response) {
      const resJson = await response.json();
      setCurrentPage(newPage);
      appendHits(resJson.hits);
    }
    setIsLoading(false);
  };

  const handleImagePress = (id: number) => {
    navigate('Detail', {id});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button onPress={goBack} style={{margin: 10}}>
          Back
        </Button>
      </View>
      <FlatList
        onEndReached={handleEndReached}
        directionalLockEnabled
        data={searchResults.hits}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleImagePress(item.id)}>
            <Image
              source={{uri: item.webformatURL}}
              containerStyle={styles.item}
              PlaceholderContent={<ActivityIndicator />}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  item: {
    aspectRatio: 1,
    width: '100%',
  },
});

export default ResultsScreen;
