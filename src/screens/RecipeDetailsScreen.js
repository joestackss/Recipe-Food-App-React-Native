import {
  View,
  Text,
  ScrollView,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CachedImage } from "../../utils/index";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import Loading from "../components/Loading";
import axios from "axios";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function RecipeDetailsScreen(props) {
  let item = props.route.params;
  const navigation = useNavigation();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);

  console.log("Meal", meal);

  useEffect(() => {
    getMealData(item.idMeal);
  });

  const getMealData = async (id) => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );

      if (response && response.data) {
        setMeal(response.data.meals[0]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const ingredientsIndexes = (meal) => {
    if (!meal) return [];
    let indexes = [];

    for (let i = 1; i <= 20; i++) {
      if (meal["strIngredient" + i]) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
      <StatusBar style="white" />

      {/* Recipe Image */}

      <View className="flex-row justify-center">
        <CachedImage
          uri={item.strMealThumb}
          sharedTransitionTag={item.strMeal}
          style={{
            width: wp(100),
            height: hp(45),
          }}
        />
      </View>

      {/* Back Button and Favorite Icon */}

      <View className="w-full absolute flex-row justify-between items-center pt-10">
        <View className="p-2 rounded-full bg-white ml-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon
              size={hp(3.5)}
              color={"#f64e32"}
              strokeWidth={4.5}
            />
          </TouchableOpacity>
        </View>

        <View className="p-2 rounded-full bg-white mr-5">
          <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
            <HeartIcon
              size={hp(3.5)}
              color={isFavourite ? "#f64e32" : "gray"}
              strokeWidth={4.5}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Meal Description */}

      {isLoading ? (
        <Loading size="large" className="mt-16" />
      ) : (
        <View
          className="px-4 flex justify-between space-y-4 bg-white mt-[-46]"
          style={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            paddingTop: hp(3),
          }}
        >
          {/* Meal Name */}
          <Animated.View
            className="space-y-2 px-4"
            entering={FadeInDown.delay(200)
              .duration(700)
              .springify()
              .damping(12)}
          >
            <Text
              className="font-bold flex-1 text-neutral-700"
              style={{
                fontSize: hp(3),
              }}
            >
              {meal?.strMeal}
            </Text>

            <Text
              style={{
                fontSize: hp(2),
              }}
              className="text-neutral-500 font-medium"
            >
              {meal?.strArea}
            </Text>
          </Animated.View>

          {/* Ingredients */}

          <Animated.View
            className="space-y-4 p-4"
            entering={FadeInDown.delay(300)
              .duration(700)
              .springify()
              .damping(12)}
          >
            <Text
              style={{
                fontSize: hp(2.5),
              }}
              className="font-bold flex-1 text-neutral-700"
            >
              Ingredients
            </Text>

            <View className="space-y-2 ml-3">
              {ingredientsIndexes(meal).map((i) => {
                return (
                  <View className="flex-row space-x-4 items-center" key={i}>
                    <View
                      className="bg-[#f64e32] rounded-full"
                      style={{
                        height: hp(1.5),
                        width: hp(1.5),
                      }}
                    />
                    <View className="flex-row space-x-2">
                      <Text
                        style={{
                          fontSize: hp(1.7),
                        }}
                        className="font-medium text-neutral-800"
                      >
                        {meal["strIngredient" + i]}
                      </Text>
                      <Text
                        className="font-extrabold text-neutral-700"
                        style={{
                          fontSize: hp(1.7),
                        }}
                      >
                        {meal["strMeasure" + i]}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          {/* Instructions */}
          <Animated.View
            className="space-y-4 p-4"
            entering={FadeInDown.delay(400)
              .duration(700)
              .springify()
              .damping(12)}
          >
            <Text
              className="font-bold flex-1 text-neutral-700"
              style={{
                fontSize: hp(2.5),
              }}
            >
              Instructions
            </Text>

            <Text
              className="text-neutral-700"
              style={{
                fontSize: hp(1.7),
              }}
            >
              {meal?.strInstructions}
            </Text>
          </Animated.View>
        </View>
      )}
    </ScrollView>
  );
}
