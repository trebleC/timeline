<template>
  <div class="timeline-app">
    <header class="app-header">
      <h1>📱 微博大事件时间线</h1>
      
      <div class="tabs">
        <button 
          :class="['tab-btn', { active: currentTab === 'timeline' }]"
          @click="currentTab = 'timeline'"
        >
          📋 时间线
        </button>
        <button 
          :class="['tab-btn', { active: currentTab === 'add' }]"
          @click="currentTab = 'add'"
        >
          ➕ 添加事件
        </button>
        <button 
          :class="['tab-btn', { active: currentTab === 'import' }]"
          @click="currentTab = 'import'"
        >
          📥 导入数据
        </button>
      </div>
    </header>
    
    <div class="content">
      <EventForm v-if="currentTab === 'add'" @add-event="handleAddEvent" />
      <ImportData v-if="currentTab === 'import'" @import-success="handleImportSuccess" @clear-all="handleClearAll" />
      <Timeline v-if="currentTab === 'timeline'" :events="events" @delete-event="deleteEvent" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import EventForm from './components/EventForm.vue'
import Timeline from './components/Timeline.vue'
import ImportData from './components/ImportData.vue'

const currentTab = ref('timeline')

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
    {
      id: 1,
      title: '示例事件',
      content: '这是一个示例大事件，展示时间线的效果。你可以添加自己的事件！',
      time: '2024-12-01T10:00',
      location: '北京',
      image: 'https://via.placeholder.com/400x300/667eea/ffffff?text=示例图片'
    }
  ]
}

const events = ref(loadEvents())

// 监听 events 变化，自动保存到 localStorage
watch(events, (newEvents) => {
  localStorage.setItem('weiboTimeline', JSON.stringify(newEvents))
}, { deep: true })

const handleAddEvent = (event) => {
  events.value.unshift({
    ...event,
    id: Date.now()
  })
  currentTab.value = 'timeline'
}

const deleteEvent = (id) => {
  events.value = events.value.filter(event => event.id !== id)
}

// 处理导入成功
const handleImportSuccess = (newEvents) => {
  events.value = [...newEvents, ...events.value]
  currentTab.value = 'timeline'
}

// 处理清空数据
const handleClearAll = () => {
  events.value = []
  localStorage.removeItem('weiboTimeline')
}

// 组件挂载时加载数据
onMounted(() => {
  console.log('已加载', events.value.length, '条事件')
})
</script>

<style scoped>
.timeline-app {
  max-width: 1000px;
  margin: 0 auto;
}

.app-header {
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.15);
}

.app-header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.8rem;
  font-weight: 700;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.tab-btn {
  padding: 0.4rem 1.2rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.tab-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
}

.content {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.8rem;
  }
  
  .app-header h1 {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
    padding: 0.5rem 1rem;
  }
}
</style>
