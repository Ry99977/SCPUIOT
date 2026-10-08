export interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  image: string
  tags: string[]
  category: string
  github: string
  demo: string
  features: string[]
}

export const projects: Project[] = [
  {
    id: 1,
    title: '智能分拣系统项目组',
    description: '物流自动化、视觉识别、机械臂控制',
    longDescription: '面向物流仓储场景的智能分拣系统，结合机器视觉与机械臂控制技术，实现物品的自动识别、分类与搬运。项目采用深度学习算法处理，可广泛应用于电商仓储、制造业生产线等场景。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=robotic%20arm%20sorting%20system%20logistics%20automation%20computer%20vision%20conveyor%20belt%20dark%20tech%20orange%20neon&image_size=landscape_16_9',
    tags: ['物流自动化', '视觉识别', '机械臂控制', '深度学习'],
    category: '项目组',
    github: 'https://github.com',
    demo: 'https://demo.com',
    features: ['物品视觉识别定位', '机械臂路径规划', '传送带联动控制', '多品类物品分拣']
  },
  {
    id: 2,
    title: '智能药盒研发项目组',
    description: '嵌入式开发、物联网（IoT）、医疗健康硬件设计',
    longDescription: '面向老年群体和慢性病患者的智能医疗药盒，集成嵌入式系统与物联网通信技术，实现用药提醒、药量监测、异常预警等功能。支持手机App远程查看和家属关怀功能。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20pill%20box%20medical%20iot%20healthcare%20device%20elderly%20care%20futuristic%20white%20blue%20tech&image_size=landscape_16_9',
    tags: ['嵌入式开发', '物联网IoT', '医疗健康', '硬件设计'],
    category: '项目组',
    github: 'https://github.com',
    demo: 'https://demo.com',
    features: ['智能用药提醒', '药量实时监测', '异常情况预警', '家属远程关怀']
  },
  {
    id: 3,
    title: '空间清洁机器人项目组',
    description: '特种机器人设计、传感器融合、非结构化环境导航',
    longDescription: '专攻特殊空间清洁机器人，主攻墙壁、天花板及空调管道等非结构化环境的自主清洁。融合多种传感器实现精准导航与避障，解决人工难以触及区域的清洁难题。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=special%20cleaning%20robot%20wall%20ceiling%20air%20duct%20sensor%20fusion%20autonomous%20navigation%20dark%20tech%20cyan%20neon&image_size=landscape_16_9',
    tags: ['特种机器人', '传感器融合', '非结构化环境导航', '墙壁清洁'],
    category: '项目组',
    github: 'https://github.com',
    demo: 'https://demo.com',
    features: ['墙壁天花板清洁', '空调管道清洁', '多传感器融合', '自主导航避障']
  }
]

export const categories = ['全部', '项目组']
