import { Platform } from "react-native";

export function imageUpload(path: string) {
    if (!path) return null;
  
    return {
      uri: Platform.OS === "android" ? path : path.replace("file://", ""),
      type: "image/jpg",
      name: "image.jpg",
    };
}