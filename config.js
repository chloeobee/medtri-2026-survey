var SURVEY_CONFIG = {
  "version": "1.0.0-prod",
  "schemaVersion": 1,
  "company": "醫兆股份有限公司",
  "title": "2026 醫檢年會｜客戶滿意度調查",
  "intro": "感謝您蒞臨醫兆攤位，誠摯邀請您花 1 分鐘填寫問卷，您的意見將作為我們持續優化產品與服務的重要參考。",
  "logo": "logo.png",
  "colors": {
    "primary": "#007a42",
    "accent": "#ed7900"
  },
  "thanks": {
    "title": "感謝您的寶貴意見！",
    "text": "您的回覆已成功儲存，將協助醫兆持續優化產品與服務。"
  },
  "privacy": "本問卷用於產品與服務改善。請勿填寫病人資料或敏感個資。",
  "runtime": {
    "environment": "production",
    "submitTimeoutMs": 45000
  },
  "environments": {
    "test": {
      "enabled": true,
      "endpoint": "",
      "googleFormUrl": "",
      "label": "V1.0 長官測試版",
      "dailyLimit": 500
    },
    "production": {
      "enabled": true,
      "endpoint": "https://script.google.com/macros/s/AKfycbyTA9S-k5yYE4TNZb3m5dqzFsIgCIsUfdsbrXBH4KMyxsvWWI4qn6LSwHgujfL5onSk/exec",
      "googleFormUrl": "",
      "label": "正式版",
      "dailyLimit": 3000
    }
  },
  "hospitals": [
    {
      "name": "台北市立聯合醫院婦幼院區",
      "aliases": [
        "市立婦幼"
      ]
    },
    {
      "name": "台北市立聯合醫院仁愛院區",
      "aliases": [
        "市立仁愛"
      ]
    },
    {
      "name": "衛生福利部基隆醫院",
      "aliases": [
        "部基"
      ]
    },
    {
      "name": "新北市立聯合醫院三重院區",
      "aliases": [
        "縣三重"
      ]
    },
    {
      "name": "衛生福利部樂生醫院",
      "aliases": [
        "部樂生"
      ]
    },
    {
      "name": "衛生福利部臺北醫院",
      "aliases": [
        "部北"
      ]
    },
    {
      "name": "衛生福利部八里療養院",
      "aliases": [
        "八里療養院"
      ]
    },
    {
      "name": "衛生福利部金門醫院",
      "aliases": [
        "部金門"
      ]
    },
    {
      "name": "基隆市立醫院",
      "aliases": [
        "基隆市立"
      ]
    },
    {
      "name": "連江縣立醫院",
      "aliases": [
        "連江縣醫院"
      ]
    },
    {
      "name": "國立臺灣大學醫學院附設醫院",
      "aliases": [
        "台大醫院"
      ]
    },
    {
      "name": "三軍總醫院松山分院",
      "aliases": [
        "國軍松山"
      ]
    },
    {
      "name": "三軍總醫院汀洲院區",
      "aliases": [
        "三總汀洲"
      ]
    },
    {
      "name": "三軍總醫院",
      "aliases": [
        "三總"
      ]
    },
    {
      "name": "三軍總醫院附設基隆民眾診療服務處",
      "aliases": [
        "三總基隆"
      ]
    },
    {
      "name": "臺北榮民總醫院",
      "aliases": [
        "北榮"
      ]
    },
    {
      "name": "台北榮民總醫院蘇澳分院",
      "aliases": [
        "蘇澳榮民"
      ]
    },
    {
      "name": "台北榮民總醫院員山分院",
      "aliases": [
        "員山榮民"
      ]
    },
    {
      "name": "台北市立關渡醫院",
      "aliases": [
        "市立關渡"
      ]
    },
    {
      "name": "中山醫院",
      "aliases": [
        "中山醫院"
      ]
    },
    {
      "name": "臺安醫院",
      "aliases": [
        "台安醫院"
      ]
    },
    {
      "name": "宏恩綜合醫院",
      "aliases": [
        "宏恩"
      ]
    },
    {
      "name": "台北馬偕紀念醫院",
      "aliases": [
        "台北馬偕"
      ]
    },
    {
      "name": "康寧醫院",
      "aliases": [
        "康寧醫院"
      ]
    },
    {
      "name": "新光醫院",
      "aliases": [
        "新光醫院"
      ]
    },
    {
      "name": "振興醫院",
      "aliases": [
        "振興醫院"
      ]
    },
    {
      "name": "和信治癌中心醫院",
      "aliases": [
        "和信醫院"
      ]
    },
    {
      "name": "基隆長庚",
      "aliases": [
        "基隆長庚"
      ]
    },
    {
      "name": "亞東紀念醫院",
      "aliases": [
        "亞東"
      ]
    },
    {
      "name": "台北慈濟醫院",
      "aliases": [
        "台北慈濟"
      ]
    },
    {
      "name": "恩主公醫院",
      "aliases": [
        "恩主公"
      ]
    },
    {
      "name": "馬偕紀念醫院淡水分院",
      "aliases": [
        "淡水馬偕"
      ]
    },
    {
      "name": "土城長庚",
      "aliases": [
        "土城長庚"
      ]
    },
    {
      "name": "宜蘭仁愛醫院",
      "aliases": [
        "蘭陽仁愛"
      ]
    },
    {
      "name": "羅東博愛醫院",
      "aliases": [
        "羅東博愛"
      ]
    },
    {
      "name": "羅東聖母醫院",
      "aliases": [
        "羅東聖母"
      ]
    },
    {
      "name": "永和耕莘醫院",
      "aliases": [
        "永和耕莘"
      ]
    },
    {
      "name": "新店耕莘醫院",
      "aliases": [
        "新店耕莘"
      ]
    },
    {
      "name": "中國醫藥大學附設醫院台北分院",
      "aliases": [
        "中醫台北"
      ]
    },
    {
      "name": "台北醫學大學附設醫院",
      "aliases": [
        "北醫"
      ]
    },
    {
      "name": "衛生福利部雙和醫院",
      "aliases": [
        "雙和醫院"
      ]
    },
    {
      "name": "輔仁大學附設醫院",
      "aliases": [
        "輔大醫院"
      ]
    },
    {
      "name": "仁濟醫院",
      "aliases": [
        "仁濟醫院"
      ]
    },
    {
      "name": "臺灣礦工醫院",
      "aliases": [
        "礦工醫院"
      ]
    },
    {
      "name": "博仁醫院",
      "aliases": [
        "博仁"
      ]
    },
    {
      "name": "景美醫院",
      "aliases": [
        "景美醫院"
      ]
    },
    {
      "name": "板新醫院",
      "aliases": [
        "板新醫院"
      ]
    },
    {
      "name": "蕭中正醫院",
      "aliases": [
        "蕭中正"
      ]
    },
    {
      "name": "豐榮醫院",
      "aliases": [
        "豐榮醫院"
      ]
    },
    {
      "name": "新泰綜合醫院",
      "aliases": [
        "新泰醫院"
      ]
    },
    {
      "name": "樹林仁愛醫院",
      "aliases": [
        "樹林仁愛"
      ]
    },
    {
      "name": "台北病理中心",
      "aliases": [
        "病理中心"
      ]
    },
    {
      "name": "中一醫事檢驗所",
      "aliases": [
        "板橋中一"
      ]
    },
    {
      "name": "立人醫事檢驗所",
      "aliases": [
        "立人"
      ]
    },
    {
      "name": "聯合醫事檢驗所",
      "aliases": [
        "大安聯合"
      ]
    },
    {
      "name": "杏聯醫事檢驗所",
      "aliases": [
        "杏聯"
      ]
    },
    {
      "name": "健詮醫事檢驗所",
      "aliases": [
        "健詮"
      ]
    },
    {
      "name": "鎧越醫事檢驗所",
      "aliases": [
        "鎧越"
      ]
    },
    {
      "name": "陽光醫事檢驗所",
      "aliases": [
        "陽光"
      ]
    },
    {
      "name": "衛生福利部桃園醫院",
      "aliases": [
        "部桃"
      ]
    },
    {
      "name": "衛生福利部苗栗醫院",
      "aliases": [
        "部苗"
      ]
    },
    {
      "name": "台大醫院新竹分院",
      "aliases": [
        "台大新竹"
      ]
    },
    {
      "name": "台大生醫醫院竹北院區",
      "aliases": [
        "台大生醫"
      ]
    },
    {
      "name": "國軍桃園總醫院新竹分院",
      "aliases": [
        "國軍新竹"
      ]
    },
    {
      "name": "國軍桃園總醫院",
      "aliases": [
        "國桃"
      ]
    },
    {
      "name": "台北榮民總醫院桃園分院",
      "aliases": [
        "桃園榮民"
      ]
    },
    {
      "name": "台北榮民總醫院新竹分院",
      "aliases": [
        "竹東榮民"
      ]
    },
    {
      "name": "宏其婦幼",
      "aliases": [
        "宏其婦幼"
      ]
    },
    {
      "name": "天晟醫院",
      "aliases": [
        "天晟瑞安"
      ]
    },
    {
      "name": "東元綜合醫院",
      "aliases": [
        "東元醫院"
      ]
    },
    {
      "name": "馬偕紀念醫院新竹分院",
      "aliases": [
        "新竹馬偕"
      ]
    },
    {
      "name": "新竹市立馬偕兒童醫院",
      "aliases": [
        "竹馬兒醫"
      ]
    },
    {
      "name": "聖保祿醫院",
      "aliases": [
        "聖保祿"
      ]
    },
    {
      "name": "長庚紀念醫院林口總院",
      "aliases": [
        "林口長庚"
      ]
    },
    {
      "name": "仁慈醫院_x000D_",
      "aliases": [
        "湖口仁慈"
      ]
    },
    {
      "name": "為恭紀念醫院",
      "aliases": [
        "為恭醫院"
      ]
    },
    {
      "name": "中國醫藥大學新竹附設醫院",
      "aliases": [
        "中醫竹北"
      ]
    },
    {
      "name": "南門醫院",
      "aliases": [
        "南門醫院"
      ]
    },
    {
      "name": "聯新國際醫院桃新分院",
      "aliases": [
        "桃新醫院"
      ]
    },
    {
      "name": "敏盛經國",
      "aliases": [
        "敏盛"
      ]
    },
    {
      "name": "中壢長榮醫院",
      "aliases": [
        "中壢長榮"
      ]
    },
    {
      "name": "怡仁綜合醫院",
      "aliases": [
        "怡仁醫院"
      ]
    },
    {
      "name": "聯新國際醫院",
      "aliases": [
        "聯新醫院"
      ]
    },
    {
      "name": "林醫院",
      "aliases": [
        "林醫院"
      ]
    },
    {
      "name": "協和醫院",
      "aliases": [
        "協和"
      ]
    },
    {
      "name": "亞東醫事檢驗所",
      "aliases": [
        "中壢亞東"
      ]
    },
    {
      "name": "台灣優品醫事檢驗所",
      "aliases": [
        "桃園優品"
      ]
    },
    {
      "name": "賽亞健康醫事檢驗所",
      "aliases": [
        "桃園賽亞"
      ]
    },
    {
      "name": "立柏智能檢驗所",
      "aliases": [
        "立柏"
      ]
    },
    {
      "name": "衛生福利部台中醫院",
      "aliases": [
        "部台中"
      ]
    },
    {
      "name": "衛生福利部豐原醫院",
      "aliases": [
        "部豐"
      ]
    },
    {
      "name": "衛生福利部南投醫院",
      "aliases": [
        "部南投"
      ]
    },
    {
      "name": "國軍台中總醫院中清分院",
      "aliases": [
        "國軍中清"
      ]
    },
    {
      "name": "國軍台中總醫院",
      "aliases": [
        "國軍台中"
      ]
    },
    {
      "name": "臺中榮民總醫院",
      "aliases": [
        "中榮"
      ]
    },
    {
      "name": "臺中榮民總醫院埔里分院",
      "aliases": [
        "埔榮"
      ]
    },
    {
      "name": "林新醫療社團法人林新醫院",
      "aliases": [
        "林新醫院"
      ]
    },
    {
      "name": "光田綜合醫院大甲分院",
      "aliases": [
        "大甲光田"
      ]
    },
    {
      "name": "童綜合醫院",
      "aliases": [
        "童醫院"
      ]
    },
    {
      "name": "秀傳紀念醫院",
      "aliases": [
        "秀傳總院"
      ]
    },
    {
      "name": "員榮醫院",
      "aliases": [
        "員榮醫院"
      ]
    },
    {
      "name": "佑民醫院",
      "aliases": [
        "佑民醫院"
      ]
    },
    {
      "name": "竹山秀傳醫院",
      "aliases": [
        "竹山秀傳"
      ]
    },
    {
      "name": "台中慈濟",
      "aliases": [
        "中慈"
      ]
    },
    {
      "name": "大里仁愛醫院",
      "aliases": [
        "大里仁愛"
      ]
    },
    {
      "name": "彰化基督教醫院",
      "aliases": [
        "彰基"
      ]
    },
    {
      "name": "鹿港基督教醫院",
      "aliases": [
        "彰基鹿港"
      ]
    },
    {
      "name": "員林基督教醫院",
      "aliases": [
        "彰基員林"
      ]
    },
    {
      "name": "二林基督教醫院",
      "aliases": [
        "二林"
      ]
    },
    {
      "name": "南投基督教醫院",
      "aliases": [
        "南基"
      ]
    },
    {
      "name": "埔里基督教醫院",
      "aliases": [
        "埔基"
      ]
    },
    {
      "name": "亞洲大學附屬醫院",
      "aliases": [
        "亞大附醫"
      ]
    },
    {
      "name": "臺中市立老人復健綜合醫院(中醫)",
      "aliases": [
        "老人"
      ]
    },
    {
      "name": "中山醫學大學附設醫院",
      "aliases": [
        "中山"
      ]
    },
    {
      "name": "中國醫藥大學附設醫院",
      "aliases": [
        "中國醫"
      ]
    },
    {
      "name": "長安醫院",
      "aliases": [
        "長安醫院"
      ]
    },
    {
      "name": "霧峰澄清醫院",
      "aliases": [
        "霧峰澄清"
      ]
    },
    {
      "name": "台安醫院雙十分院",
      "aliases": [
        "台安雙十"
      ]
    },
    {
      "name": "茂盛醫院",
      "aliases": [
        "茂盛"
      ]
    },
    {
      "name": "澄清綜合醫院(平等院區)",
      "aliases": [
        "平等澄清"
      ]
    },
    {
      "name": "台新醫院",
      "aliases": [
        "台新"
      ]
    },
    {
      "name": "台安醫院(進化總院)",
      "aliases": [
        "台安進化"
      ]
    },
    {
      "name": "本堂澄清醫院",
      "aliases": [
        "本堂澄清"
      ]
    },
    {
      "name": "吉祥醫事檢驗所",
      "aliases": [
        "吉祥檢驗所"
      ]
    },
    {
      "name": "登全醫事檢驗所",
      "aliases": [
        "登全檢驗所"
      ]
    },
    {
      "name": "衛生福利部臺南醫院",
      "aliases": [
        "部台南"
      ]
    },
    {
      "name": "衛生福利部嘉義醫院",
      "aliases": [
        "部嘉義"
      ]
    },
    {
      "name": "衛生福利部朴子醫院",
      "aliases": [
        "部朴子"
      ]
    },
    {
      "name": "衛生福利部臺南醫院新化分院",
      "aliases": [
        "衛南新化"
      ]
    },
    {
      "name": "衛生福利部胸腔病院",
      "aliases": [
        "胸腔"
      ]
    },
    {
      "name": "衛生福利部嘉南療養院",
      "aliases": [
        "部嘉南"
      ]
    },
    {
      "name": "國立成功大學醫學院附設醫院",
      "aliases": [
        "成大醫院"
      ]
    },
    {
      "name": "國立台灣大學醫學院附設醫院雲林分院斗六院區",
      "aliases": [
        "台大斗六"
      ]
    },
    {
      "name": "國立台灣大學醫學院附設醫院雲林分院虎尾院區",
      "aliases": [
        "台大虎尾"
      ]
    },
    {
      "name": "台中榮民總醫院嘉義分院",
      "aliases": [
        "中榮嘉義"
      ]
    },
    {
      "name": "臺中榮民總醫院灣橋分院",
      "aliases": [
        "中榮灣橋"
      ]
    },
    {
      "name": "高雄榮民總醫院臺南分院",
      "aliases": [
        "高榮台南"
      ]
    },
    {
      "name": "台南市立醫院",
      "aliases": [
        "台南市立"
      ]
    },
    {
      "name": "慶昇醫院",
      "aliases": [
        "慶昇醫院"
      ]
    },
    {
      "name": "佳里奇美醫院",
      "aliases": [
        "佳里奇美"
      ]
    },
    {
      "name": "新樓醫院",
      "aliases": [
        "新樓醫院"
      ]
    },
    {
      "name": "嘉義基督教醫院",
      "aliases": [
        "嘉基"
      ]
    },
    {
      "name": "天主教聖馬爾定醫院",
      "aliases": [
        "聖馬爾定"
      ]
    },
    {
      "name": "天主教福安醫院",
      "aliases": [
        "福安醫院"
      ]
    },
    {
      "name": "若瑟醫院",
      "aliases": [
        "若瑟醫院"
      ]
    },
    {
      "name": "雲林基督教醫院",
      "aliases": [
        "雲基"
      ]
    },
    {
      "name": "長庚醫院嘉義分院",
      "aliases": [
        "嘉義長庚"
      ]
    },
    {
      "name": "慈濟大林醫院",
      "aliases": [
        "慈濟大林"
      ]
    },
    {
      "name": "柳營奇美醫院",
      "aliases": [
        "柳營奇美"
      ]
    },
    {
      "name": "奇美醫院",
      "aliases": [
        "永康奇美"
      ]
    },
    {
      "name": "安南醫院",
      "aliases": [
        "安南醫院"
      ]
    },
    {
      "name": "中國醫藥大學北港附設醫院",
      "aliases": [
        "中醫北港"
      ]
    },
    {
      "name": "郭綜合醫院",
      "aliases": [
        "郭綜合"
      ]
    },
    {
      "name": "陽明醫院",
      "aliases": [
        "陽明醫院"
      ]
    },
    {
      "name": "國泰功醫診所",
      "aliases": [
        "國泰功醫"
      ]
    },
    {
      "name": "尚捷檢驗所",
      "aliases": [
        "尚捷檢驗所"
      ]
    },
    {
      "name": "高雄市立聯合醫院",
      "aliases": [
        "高市聯合"
      ]
    },
    {
      "name": "大同醫院",
      "aliases": [
        "大同"
      ]
    },
    {
      "name": "高雄市立民生醫院",
      "aliases": [
        "市立民生"
      ]
    },
    {
      "name": "衛生福利部澎湖醫院",
      "aliases": [
        "部澎湖"
      ]
    },
    {
      "name": "國軍左營總醫院",
      "aliases": [
        "國左"
      ]
    },
    {
      "name": "國軍高雄總醫院",
      "aliases": [
        "國高"
      ]
    },
    {
      "name": "國軍左營總醫院岡山分院",
      "aliases": [
        "國軍岡山"
      ]
    },
    {
      "name": "國軍高雄總醫院屏東分院",
      "aliases": [
        "國軍屏東"
      ]
    },
    {
      "name": "三軍總醫院澎湖分院",
      "aliases": [
        "三總澎湖"
      ]
    },
    {
      "name": "高雄榮民總醫院(微生物)",
      "aliases": [
        "高雄榮總"
      ]
    },
    {
      "name": "屏東榮民總醫院",
      "aliases": [
        "屏榮"
      ]
    },
    {
      "name": "屏東榮民總醫院龍泉分院",
      "aliases": [
        "屏東龍泉"
      ]
    },
    {
      "name": "阮綜合醫院",
      "aliases": [
        "阮綜合"
      ]
    },
    {
      "name": "高雄秀傳紀念醫院",
      "aliases": [
        "高雄秀傳"
      ]
    },
    {
      "name": "高雄市立岡山醫院",
      "aliases": [
        "岡山秀傳"
      ]
    },
    {
      "name": "寶建醫院",
      "aliases": [
        "寶建醫院"
      ]
    },
    {
      "name": "潮州安泰醫院",
      "aliases": [
        "潮州安泰"
      ]
    },
    {
      "name": "安泰醫院",
      "aliases": [
        "東港安泰"
      ]
    },
    {
      "name": "枋寮醫院",
      "aliases": [
        "枋寮醫院"
      ]
    },
    {
      "name": "市立小港醫院",
      "aliases": [
        "小港醫院"
      ]
    },
    {
      "name": "聖功醫院",
      "aliases": [
        "聖功醫院"
      ]
    },
    {
      "name": "高雄長庚紀念醫院",
      "aliases": [
        "高雄長庚"
      ]
    },
    {
      "name": "義大醫院",
      "aliases": [
        "義大醫院"
      ]
    },
    {
      "name": "屏東基督教醫院",
      "aliases": [
        "屏基"
      ]
    },
    {
      "name": "恆春基督教醫院",
      "aliases": [
        "恆春基督教"
      ]
    },
    {
      "name": "惠民醫院",
      "aliases": [
        "澎湖惠民"
      ]
    },
    {
      "name": "高雄醫學大學附設中和紀念醫院",
      "aliases": [
        "高醫"
      ]
    },
    {
      "name": "高雄醫學大學附設高醫岡山醫院",
      "aliases": [
        "高醫岡山"
      ]
    },
    {
      "name": "高雄市立旗津醫院",
      "aliases": [
        "市立旗津"
      ]
    },
    {
      "name": "柏仁醫院",
      "aliases": [
        "柏仁醫院"
      ]
    },
    {
      "name": "健仁醫院",
      "aliases": [
        "健仁醫院"
      ]
    },
    {
      "name": "右昌聯合醫院",
      "aliases": [
        "右昌聯合醫"
      ]
    },
    {
      "name": "健新醫院",
      "aliases": [
        "健新醫院"
      ]
    },
    {
      "name": "立人醫事檢驗所(高雄)",
      "aliases": [
        "立人(高雄"
      ]
    },
    {
      "name": "衛生福利部花蓮醫院",
      "aliases": [
        "部花"
      ]
    },
    {
      "name": "衛生福利部玉里醫院",
      "aliases": [
        "部玉里"
      ]
    },
    {
      "name": "衛生福利部台東醫院",
      "aliases": [
        "部台東"
      ]
    },
    {
      "name": "國軍花蓮總醫院",
      "aliases": [
        "國花"
      ]
    },
    {
      "name": "台北榮民總醫院玉里分院",
      "aliases": [
        "玉里榮民"
      ]
    },
    {
      "name": "臺北榮民總醫院臺東分院",
      "aliases": [
        "台東榮民"
      ]
    },
    {
      "name": "門諾醫院",
      "aliases": [
        "門諾"
      ]
    },
    {
      "name": "慈濟綜合醫院玉里分院",
      "aliases": [
        "玉慈"
      ]
    },
    {
      "name": "台東馬偕紀念醫院",
      "aliases": [
        "台東馬偕"
      ]
    }
  ],
  "steps": [
    {
      "id": "profile",
      "label": "基本資料",
      "fields": [
        "hospital",
        "unit"
      ]
    },
    {
      "id": "usage",
      "label": "使用情況",
      "fields": [
        "usage"
      ]
    },
    {
      "id": "products",
      "label": "使用產品",
      "when": {
        "field": "usage",
        "equals": "有使用"
      },
      "fields": [
        "products"
      ]
    },
    {
      "id": "ratings",
      "label": "滿意度評價",
      "description": "請依照您的實際使用經驗，評價醫兆以下項目的滿意度。",
      "when": {
        "field": "usage",
        "equals": "有使用"
      },
      "fields": [
        "serviceRating",
        "productRating",
        "logisticsRating",
        "comment"
      ]
    },
    {
      "id": "interests",
      "label": "產品興趣",
      "when": {
        "field": "usage",
        "in": [
          "沒有使用",
          "不確定"
        ]
      },
      "fields": [
        "interests"
      ]
    }
  ],
  "ratingOptions": [
    {
      "value": "1",
      "label": "非常不滿意"
    },
    {
      "value": "2",
      "label": "不滿意"
    },
    {
      "value": "3",
      "label": "普通"
    },
    {
      "value": "4",
      "label": "滿意"
    },
    {
      "value": "5",
      "label": "非常滿意"
    }
  ],
  "fields": [
    {
      "id": "hospital",
      "type": "hospital",
      "title": "1. 請問您目前服務的醫療院所為何？",
      "required": true,
      "maxLength": 150,
      "hint": "輸入關鍵字搜尋；找不到時，直接填寫完整院所名稱即可。"
    },
    {
      "id": "unit",
      "type": "radio",
      "title": "2. 請問您目前所屬的單位為何？",
      "required": true,
      "options": [
        "檢驗科",
        "其他"
      ]
    },
    {
      "id": "usage",
      "type": "radio",
      "title": "3. 請問貴單位目前是否使用醫兆代理的產品或儀器？",
      "required": true,
      "options": [
        "有使用",
        "沒有使用",
        "不確定"
      ]
    },
    {
      "id": "products",
      "type": "checkbox",
      "title": "4. 請問貴單位目前使用哪些醫兆代理的產品或儀器？",
      "required": true,
      "hint": "可複選",
      "other": "其他",
      "otherId": "otherProduct",
      "otherMaxLength": 200,
      "options": [
        "ARKRAY Urine",
        "ARKRAY HbA1c",
        "ARKRAY Osmo",
        "Beckman CBC",
        "Beckman Urine",
        "Biomerieux Microbiology",
        "BioFire FilmArray",
        "VIDAS",
        "Liaison",
        "Kryptor",
        "AFIAS",
        "Euroimmun IFT",
        "Euroimmun EuroLine",
        "其他"
      ]
    },
    {
      "id": "serviceRating",
      "type": "rating",
      "title": "5-1. 整體服務滿意度",
      "required": true,
      "hint": "請依照您的實際使用經驗評分。"
    },
    {
      "id": "productRating",
      "type": "rating",
      "title": "5-2. 產品滿意度",
      "required": true,
      "hint": "請就使用的產品給予一個整體分數。"
    },
    {
      "id": "logisticsRating",
      "type": "rating",
      "title": "5-3. 物流服務滿意度",
      "required": true
    },
    {
      "id": "comment",
      "type": "textarea",
      "title": "其他意見或建議",
      "required": false,
      "maxLength": 2000
    },
    {
      "id": "interests",
      "type": "checkbox",
      "title": "請問您對醫兆代理的哪些產品線有興趣進一步了解？",
      "required": false,
      "hint": "可複選，也可以直接送出。「目前沒有特別感興趣的產品」與其餘選項互斥。",
      "other": "其他",
      "otherId": "otherInterest",
      "otherMaxLength": 200,
      "exclusive": "目前沒有特別感興趣的產品",
      "options": [
        "CBC",
        "尿液分析",
        "HbA1c",
        "全自動滲透壓分析儀",
        "Blood Culture",
        "微生物鑑定/藥敏",
        "POCT設備",
        "抗核抗體檢驗",
        "產前檢驗",
        "免疫分析(內分泌&生殖醫學)",
        "免疫分析(傳染病&病毒檢驗)",
        "其他",
        "目前沒有特別感興趣的產品"
      ]
    }
  ]
};
if (typeof module !== "undefined") module.exports = SURVEY_CONFIG;
