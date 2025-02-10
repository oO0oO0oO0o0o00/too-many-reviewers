//
//  NameGenerator.swift
//  TooManyReviewers
//
//  Created by MeowCat on 2025/2/3.
//

fileprivate let kFirstNameChars = "哲梁谦炎蓓茜眉才丽旭志妍娴以裕成红瑾钧东亮达咏枫胜瑶承彪超琦敬腾永叶武霄月德健芬军璧姣君雪发克娣榕颖星顺莺茗佳苑若福嘉建学冰洁祥晓贵言可平俊全柔美纯维泰博芳振之广信芝蓉河融昭玉婕栋竹珍晶馥霭毅行弘韵琴刚锦荔翠毓秀爽林静凡厚义怡聪悦云彬元媛浩勤力黛彩良会纨乐伦晨兴欢惠伟震生琳兰珠盛致光莎斌秋园丹思世冠菁民艺育慧辉亨启妹凤峰坚玲雄娟茂辰航清青文素磊荣有功翰琛海飘涛杰奇梦环明鸣固露瑗巧淑龙姬飞澜筠豪先进薇华子士楠香壮树伯仪绍霞桂翔山时凝善诚贞家爱泽欣琬伊亚岚英滢江昌和中荷馨瑞波心宜舒松轮宁富琼婉雁菲雅娜莉友菊勇新倩蕊风鹏庆政影安利康朋保真群芸娥天梅春婷莲羽艳朗璐希寒燕娅宏琰强国萍岩策卿邦仁珊枝婵"

fileprivate let kFamilyNameChars = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞"

fileprivate let kAbbrPrefixChars = kFamilyNameChars + kFirstNameChars

struct NameGenerator {
    static var randomAbbr: String {
        "\(kAbbrPrefixChars.randomElement()!)\(kFirstNameChars.randomElement()!)"
    }
}
