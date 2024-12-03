import { colors } from "@/constants/colors";
import { fontFamilies } from "@/constants/fontFamilies";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 12,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionStyle : {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
    text: {
        fontFamily: fontFamilies.regular,
        fontSize: 14,
        color: colors.text
    },
    button: {
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
      },
      shadow: {
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
      },
      inputContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.grey3,
        width: '100%',
        minHeight: 56,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: colors.white,
        marginBottom: 16,
        paddingVertical: 8,
      },
        errorText: {
        color: 'red',
        fontSize: 14,
        // marginTop:,
      },
});