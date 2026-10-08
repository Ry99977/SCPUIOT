export interface Experience {
  id: number
  company: string
  position: string
  period: string
  location: string
  description: string
  achievements: string[]
  technologies: string[]
}

export const experiences: Experience[] = [
  {
    id: 1,
    company: '物联网协会',
    position: '协会正式成立',
    period: '2018.09',
    location: '创新创业中心',
    description: '物联网协会在学校团委和创新创业中心的支持下正式成立，首批成员 30 人，致力于推广物联网技术，培养学生创新实践能力。',
    achievements: [
      '协会正式注册成立，首批成员 30 人',
      '建立第一个物联网实验室，配备基础开发套件',
      '与多家科技企业建立合作关系',
      '举办第一届物联网技术分享会'
    ],
    technologies: ['Arduino', '传感器', 'C语言']
  },
  {
    id: 2,
    company: '物联网协会',
    position: '快速发展期',
    period: '2019.09 - 2020.06',
    location: '工程训练中心',
    description: '协会成员规模快速扩大，开始系统性地组织技术培训和项目开发。完成多个校级创新项目，在省级比赛中崭露头角。',
    achievements: [
      '成员人数突破 80 人',
      '完成 10 个校级大学生创新项目',
      '获四川省大学生物联网设计大赛一等奖 2 项',
      '建立协会技术知识库，编写 20+ 技术教程'
    ],
    technologies: ['STM32', 'ESP8266', 'MQTT', 'Python']
  },
  {
    id: 3,
    company: '物联网协会',
    position: '成果丰收期',
    period: '2020.09 - 2022.06',
    location: '人工智能学院',
    description: '协会技术实力显著提升，完成多个有实际应用价值的物联网项目。智能家居、智慧农业等系统在校园内实际部署，获得广泛好评。',
    achievements: [
      '智能家居系统在 50+ 宿舍部署使用',
      '智慧农业监测系统在学校实验田落地',
      '获全国大学生物联网设计大赛二等奖',
      '申请实用新型专利 3 项，软件著作权 5 项'
    ],
    technologies: ['ESP32', 'LoRa', 'React', 'Node.js', '阿里云']
  },
  {
    id: 4,
    company: '物联网协会',
    position: '全面发展期',
    period: '2022.09 - 至今',
    location: '智能制造学院',
    description: '协会进入全面发展阶段，技术方向覆盖嵌入式、通信、云端、AI 等多个领域。与企业深度合作，开展联合项目开发，为成员提供更多实践机会。',
    achievements: [
      '成员人数达 150+，涵盖全校 8 个专业',
      '与 3 家物联网企业建立联合实验室',
      '累计完成项目 35+，服务师生超 1000 人',
      '每年举办物联网技术嘉年华活动，参与人数 500+'
    ],
    technologies: ['边缘计算', 'AIoT', '工业物联网', '5G', '数字孪生']
  }
]
