import { HTMLElementModel, HTMLContentModel } from "react-native-render-html"
import { moderateScale, verticalScale } from "react-native-size-matters"

export default {
    tagsStyles: {
        p: {
            fontFamily: "Inter_400Regular",
            color: "#999999",
            fontSize: moderateScale(12),
            marginVertical: verticalScale(5)
        },
        a: {
            color: '#1F86FF',
            fontSize: moderateScale(12)
        }
    },
    ignoredStyles: ["fontSize"],
    systemFonts: ["Inter_400Regular"],
    baseStyle: {
        fontFamily: "Inter_400Regular",
        color: "#999999",
        fontSize: moderateScale(12),
        marginVertical: verticalScale(5)
    },
    customHTMLElementModels: {
        'font': HTMLElementModel.fromCustomModel({
            tagName: 'font',
            contentModel: HTMLContentModel.block
        })
    }
}