import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Container, IconButtonComponent, TextComponent } from "@/components";
import VideoPlayer from "react-native-video-player"; // Thư viện phát video
import { colors } from "@/constants/colors";
import { useCustomNavigation } from "@/utils/navigation";
import { useRoute } from "@react-navigation/native";
import { apiGetReportByReportId } from "@/api/apiReport";
import useLoading from "@/hook/useLoading";

const { width } = Dimensions.get("window");

interface ReportData {
  appointmentId: string;
  createdDate: string;
  id: number;
  petCenterId: string;
  reason: string;
  reportImages: Array<{ url: string }>;
  status: number;
  title: string;
  updatedDate: string;
  userId: string;
}

const ReportApplicationDetail = () => {
  const { goBack } = useCustomNavigation();
  const { showLoading, hideLoading } = useLoading();
  const route = useRoute<any>();
  const { reportId } = route.params;
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    showLoading();
    apiGetReportByReportId(reportId).then((res: any) => {
      if (res.statusCode === 200) {
        setReportData(res.data);
        hideLoading();
      } else {
        console.log("Lấy dữ liệu report detail lỗi");
        hideLoading();
      }
    });
  }, [reportId]);

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Đang chờ xử lý";
      case 1:
        return "Đã xử lý";
      case 2:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return colors.yellow;
      case 1:
        return colors.green;
      case 2:
        return colors.red;
      default:
        return colors.grey;
    }
  };

  const renderMedia = (media: { url: string }, index: number) => {
    const isVideo = media.url.includes(".mp4"); 

    if (isVideo) {
      return (
        <View key={index} style={styles.videoContainer}>
          <VideoPlayer
            video={{ uri: media.url }}
            videoWidth={width / 2 - 24}
            videoHeight={(width / 2 - 24) * 0.5625} 
            thumbnail={{ uri: "https://via.placeholder.com/150" }}
          />
        </View>
      );
    } else {
      return (
        <View key={index} style={styles.imageContainer}>
          <Image
            source={{ uri: media.url }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      );
    }
  };

  return (
    <Container
      title="Chi tiết báo cáo"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {reportData && (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <TextComponent
                  text={reportData.title}
                  type="title"
                  styles={styles.title}
                />
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(reportData.status) },
                  ]}
                >
                  <TextComponent
                    text={getStatusText(reportData.status)}
                    styles={styles.statusText}
                  />
                </View>
              </View>
              <TextComponent
                text={`Ngày tạo: ${reportData.createdDate}`}
                styles={styles.dates}
              />
              {reportData.updatedDate !== reportData.createdDate && (
                <TextComponent
                  text={`Cập nhật: ${reportData.updatedDate}`}
                  styles={styles.dates}
                />
              )}
            </View>

            {/* Lý do báo cáo */}
            <View style={styles.section}>
              <TextComponent text="Lý do báo cáo" type="title" />
              <View style={styles.contentBox}>
                <TextComponent text={reportData.reason} styles={styles.reason} />
              </View>
            </View>

            {/* Hình ảnh và video đính kèm */}
            {reportData.reportImages && reportData.reportImages.length > 0 && (
              <View style={styles.section}>
                <TextComponent text="Hình ảnh và video đính kèm" type="title" />
                <View style={styles.mediaGrid}>
                  {reportData.reportImages.map((media, index) =>
                    renderMedia(media, index)
                  )}
                </View>
              </View>
            )}

            {/* Thông tin bổ sung */}
            <View style={styles.section}>
              <TextComponent text="Thông tin bổ sung" type="title" />
              <View style={styles.contentBox}>
                <TextComponent
                  text={`ID Cuộc hẹn: ${reportData.appointmentId}`}
                  styles={styles.infoText}
                />
                <TextComponent
                  text={`ID Trung tâm: ${reportData.petCenterId}`}
                  styles={styles.infoText}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default ReportApplicationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.dark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginLeft: 10,
  },
  statusText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  dates: {
    fontSize: 13,
    color: colors.grey,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  contentBox: {
    backgroundColor: colors.grey4,
    padding: 16,
    borderRadius: 10,
  },
  reason: {
    fontSize: 15,
    color: colors.dark,
    lineHeight: 22,
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  imageContainer: {
    width: (width - 48) / 2,
    aspectRatio: 1,
    padding: 8,
  },
  videoContainer: {
    width: (width - 48) / 2,
    padding: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
  },
});