import { StyleSheet, Dimensions } from "react-native";

import {
  horizScale,
  vertScale,
  SectionHeader,
  Spacer,
} from "../../utils/LayoutUtil";

import { Fonts, Colors } from "../../theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.smokeWhite,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5
  },
});
