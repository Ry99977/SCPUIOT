export interface Skill {
  name: string
  level: number
  category: string
}

export interface SkillCategory {
  name: string
  icon: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = []

export const stats = [
  { label: '成立时间', value: 2026, suffix: '年4月' },
  { label: '社团代码', value: 102, prefix: 'X', suffix: '' },
  { label: '会员人数', value: 61, suffix: '人' },
  { label: '项目组', value: 3, suffix: '个' }
]
