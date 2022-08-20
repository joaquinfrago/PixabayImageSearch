import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button, Image} from '@rneui/themed';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppStackParamList} from '../../../App';
import {useAppContext} from '../../context/app';
import {searchImages} from '../../services/searchImages';

type DetailScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'Results'
>;

type DetailScreenRouteProp = RouteProp<AppStackParamList, 'Detail'>;

const DetailScreen = () => {
  const {navigate, goBack} = useNavigation<DetailScreenNavigationProp>();
  const {params} = useRoute<DetailScreenRouteProp>();

  const {
    getHitById,
    setSearchResults,
    setCurrentSearchValue,
    resetSearchResults,
  } = useAppContext();

  const imageDetails = React.useMemo(() => {
    return getHitById(params.id);
  }, [getHitById, params.id]);

  const keywords = React.useMemo(() => {
    return imageDetails?.tags.split(',').map(tag => tag.trim());
  }, [imageDetails?.tags]);

  const [isFetchingTag, setIsFetchingTag] = React.useState(false);

  const handleSearchByTag = async (tag: string) => {
    setCurrentSearchValue(tag);
    setIsFetchingTag(true);
    const response = await searchImages({q: tag, page: 1});
    setIsFetchingTag(false);
    if (response) {
      resetSearchResults(); // Reset results to start scroll to top
      const resJson = await response.json();
      if (resJson?.totalHits?.length === 0) {
        return;
      }
      setSearchResults(resJson);
      navigate('Results');
    }
  };

  if (!imageDetails) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {isFetchingTag ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={{margin: 10}}>
            <Button onPress={goBack}>Back</Button>
          </View>
          <View>
            <Image
              source={{uri: imageDetails.largeImageURL}}
              containerStyle={styles.item}
              PlaceholderContent={<ActivityIndicator />}
              resizeMode="cover"
            />
            <View>
              <Text>Author: {imageDetails.user}</Text>
              <Text>Tags:</Text>
              {keywords &&
                keywords.map(keyword => (
                  <TouchableOpacity
                    key={keyword}
                    onPress={() => handleSearchByTag(keyword)}>
                    <Text style={{margin: 4}}>{keyword}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </>
      )}
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

export default DetailScreen;
