import React, { useCallback, useEffect, useRef, useState } from "react";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImageGrid from "../../components/imageGrid";
import debounce from "lodash/debounce";
import FiltersModel from "../../components/filtersModel";
import { useRouter } from "expo-router";

var page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const searchInputRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const modalRef = useRef(null);
  const [filters, setFilters] = useState(null);
  const scrollRef = useRef(null);
  const [isEndReached,SetIsEndReached] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    console.log("params", params, append);
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else setImages([...res.data.hits]);
    }
  };

  const openFilterModel = () => {
    modalRef?.current?.present();
  };

  const closeFilterModel = () => {
    modalRef?.current?.close();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModel();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModel();
  };

  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    (page = 1), setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      // search for this text
      page = 1;
      setImages([]);

      fetchImages({ page, q: text, ...filters }, false);
    }

    if (text === "") {
      //Reset Result
      page = 1;
      searchInputRef?.current.clear();
      setImages([]);
      setActiveCategory(null); //clear Category while searching
      fetchImages({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current.clear();
  };
  // const handleTextDebounce = useCallback(debounce(handleSearch, 800), []);

  const handleScroll = (event)=>{
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrolloffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if(scrolloffset>=bottomPosition-1){
      if(!isEndReached){
      SetIsEndReached(true);
      console.log('reached the bottom og scrollview');
      //fetch more images
      ++page;
      let params = {
        page,
        ...filters
      }
      if(activeCategory) params.category = activeCategory;
      if(search) params.q = search;
      fetchImages(params)
    }else if(isEndReached){
      SetIsEndReached(false);
    }
  }
  }
 
  const handleScrollUp = ()=>{
    scrollRef?.current?.scrollTo({
      y:0,
      animated : true
    })
  }
  const handleTextDebounce = useCallback(
    debounce((text) => {
      handleSearch(text);
    }, 800),
    []
  );

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}

      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}> Pixels</Text>
        </Pressable>
        <Pressable onPress={openFilterModel}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        {/* search Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            value={search}
            ref={searchInputRef}
            // onChangeText={handleTextDebounce}
            onChangeText={(text) => {
              setSearch(text); // Update the state immediately
              handleTextDebounce(text); // Then call the debounced function
            }}
            style={styles.searchInput}
          />

          {search && (
            <Pressable style={styles.closeIcon} onPress={clearSearch}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* Filters */}

        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key == "colors" ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}

                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.6)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Images Masonary grid */}
        <View>{images.length > 0 && <ImageGrid images={images} router={router} />}</View>

        {/* Loading */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      {/* Filter Model */}

      <FiltersModel
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFilterModel}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingleft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
    borderRadius: theme.radius.xl,
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: theme.radius.sm,
  },
});

export default HomeScreen;
