import { Platform } from "react-native";

export function mediaUpload(path: string) {
  if (!path) return null;

  const isVideo = path.endsWith('.mp4');
  const fileType = isVideo ? "video/mp4" : "image/jpeg";

  return {
    uri: Platform.OS === "android" ? path : path.replace("file://", ""),
    type: fileType,
    name: isVideo ? "video.mp4" : "image.jpg",
  };
}