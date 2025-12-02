<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-layout class="timeline-app">
      <n-layout-header class="app-header">
        <h1>📱 事件时间线</h1>
        <n-space>
          <n-button circle @click="showAddModal = true" title="添加事件" secondary>
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </n-icon>
            </template>
          </n-button>
          <n-button circle @click="showImportModal = true" title="导入数据" secondary>
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </n-icon>
            </template>
          </n-button>
          <n-button circle @click="downloadTimeline" title="下载数据" secondary>
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </n-icon>
            </template>
          </n-button>
        </n-space>
      </n-layout-header>


    </n-layout>
    <n-layout-content class="content">
      <Timeline :events="sortedEvents" @delete-event="deleteEvent" />
    </n-layout-content>
    <!-- 添加事件弹窗 -->
    <n-modal v-model:show="showAddModal" preset="card" title="➕ 添加事件" :bordered="false" style="max-width: 800px">
      <EventForm @add-event="handleAddEvent" />
    </n-modal>

    <!-- 导入数据弹窗 -->
    <n-modal v-model:show="showImportModal" preset="card" title="📥 导入数据" :bordered="false" style="max-width: 800px">
      <ImportData @import-success="handleImportSuccess" @clear-all="handleClearAll" />
    </n-modal>
  </n-config-provider>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import {
  NConfigProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NButton,
  NIcon,
  NSpace,
  NModal
} from 'naive-ui'
import EventForm from './components/EventForm.vue'
import Timeline from './components/Timeline.vue'
import ImportData from './components/ImportData.vue'

const showAddModal = ref(false)
const showImportModal = ref(false)

// 主题配置
const themeOverrides = {
  common: {
    primaryColor: '#667eea',
    primaryColorHover: '#764ba2',
    primaryColorPressed: '#5568d3'
  }
}

// 从 localStorage 加载数据
const loadEvents = () => {
  const saved = localStorage.getItem('weiboTimeline')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('加载数据失败:', e)
      return []
    }
  }
  return [
    // {
    //   id: 1,
    //   title: '示例事件',
    //   content: '这是一个示例大事件，展示时间线的效果。你可以添加自己的事件！',
    //   time: '2024-12-01T10:00',
    //   location: '北京',
    //   image: 'https://via.placeholder.com/400x300/667eea/ffffff?text=示例图片'
    // }
  ]
}

const events = ref(loadEvents())

// 按时间排序的事件列表（从新到旧）
const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => {
    const timeA = new Date(a.time).getTime()
    const timeB = new Date(b.time).getTime()
    return timeB - timeA // 降序排列，最新的在前
  })
})

// 监听 events 变化，自动保存到 localStorage
watch(events, (newEvents) => {
  localStorage.setItem('weiboTimeline', JSON.stringify(newEvents))
}, { deep: true })

const handleAddEvent = (event) => {
  events.value.unshift({
    ...event,
    id: Date.now()
  })
  showAddModal.value = false
}

const deleteEvent = (id) => {
  events.value = events.value.filter(event => event.id !== id)
}

// 处理导入成功
const handleImportSuccess = (newEvents) => {
  events.value = [...newEvents, ...events.value]
  showImportModal.value = false
}

// 处理清空数据
const handleClearAll = () => {
  events.value = []
  localStorage.removeItem('weiboTimeline')
}

// 下载时间线数据为txt文件
const downloadTimeline = () => {
  // 按年份分组
  const groupedEvents = {}
  events.value.forEach((event, index) => {
    // 确保事件时间有效
    const eventDate = new Date(event.time);
    if (isNaN(eventDate.getTime())) {
      return;
    }
    
    const year = eventDate.getFullYear();
    
    if (!groupedEvents[year]) {
      groupedEvents[year] = [];
    }
    groupedEvents[year].push(event);
  });

  // 时段映射
  const timePeriods = ['清晨', '早上', '中午', '午后', '傍晚', '晚上', '深夜']

  // 生成txt内容
  let content = ''
  const sortedYears = Object.keys(groupedEvents).map(year => parseInt(year)).sort((a, b) => b - a); // 按年份降序排列
  
  sortedYears.forEach(year => {
    content += `${year}年\n\n`
    
    groupedEvents[year]
      .sort((a, b) => new Date(b.time) - new Date(a.time)) // 按时间降序排列
      .forEach(event => {
        const date = new Date(event.time)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        // 只有当事件有时间时才输出
        if (event.time) {
          let timeStr = `${month}月${day}日`
          
          // 如果事件有时段信息，则添加时段
          if (event.period && timePeriods.includes(event.period)) {
            timeStr += event.period
          }
          
          content += `${timeStr}\n${event.content}\n\n`
        }
      })
    content += '\n'
  })

  // 创建并下载文件
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `时间线数据_${new Date().getFullYear()}年${String(new Date().getMonth() + 1).padStart(2, '0')}月${String(new Date().getDate()).padStart(2, '0')}日.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 组件挂载时加载数据
onMounted(() => {
  // console.log('已加载', events.value.length, '条事件')
})
</script>

<style scoped>
.timeline-app {
  max-width: 1000px;
  margin: 0 auto;
  background: transparent;
  padding: 0 1rem;
  background-color: #fff;

}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.15);

}

.app-header h1 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}

.content {
  padding: 0;
}

/* 添加美化样式 */
:deep(.n-button) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.n-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
}

:deep(.n-modal) {
  border-radius: 16px !important;
}

:deep(.n-modal-content) {
  border-radius: 16px !important;
}

</style>
