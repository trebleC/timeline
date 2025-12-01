<template>
  <div class="timeline-container">

    <div v-if="events.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>暂无事件记录</p>
      <p class="empty-hint">快来添加第一个大事件吧！</p>
    </div>
    
    <div v-else class="timeline">
      <div
        v-for="event in events"
        :key="event.id"
        class="timeline-item"
      >
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="event-card">
            <div class="event-header">
              <h3 class="event-title">{{ event.title }}</h3>
              <button @click="$emit('delete-event', event.id)" class="delete-btn">
                🗑️
              </button>
            </div>
            
            <!-- <div class="event-meta">
              <span class="meta-item">
                <span class="meta-icon">🕐</span>
                {{ formatTime(event.time) }}
              </span>
            </div> -->
            
            <div class="event-content" v-html="formatContent(event.content)"></div>
            
            <div v-if="event.image" class="event-image">
              <img :src="event.image" :alt="event.title" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  events: {
    type: Array,
    required: true
  }
})

defineEmits(['delete-event'])

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}年${month}月${day}日 ${hours}:${minutes}`
}

// 格式化内容，将链接转为a标签
const formatContent = (content) => {
  if (!content) return ''
  
  // 匹配http/https链接
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  
  // 将文本中的链接转换为a标签
  let formattedContent = content.replace(urlRegex, '<a href="$1" target="_blank" class="content-link">$1</a>')
  
  // 保留换行
  formattedContent = formattedContent.replace(/\n/g, '<br>')
  
  return formattedContent
}
</script>

<style scoped>
.timeline-container {
  margin-top: 2rem;
}

.timeline-title {
  color: #667eea;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.empty-state {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.empty-hint {
  color: #999;
  font-size: 0.95rem !important;
}

.timeline {
  position: relative;
  padding-left: -0.5rem;
  padding-bottom: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  padding-left: 2rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 0;
  width: 1.4rem;
  height: 1.4rem;
  background: white;
  border: 4px solid #667eea;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  z-index: 2;
}

.timeline-content {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.event-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.event-card:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-title {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  padding: 0.25rem 0.5rem;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.2s;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.2);
}

.event-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.meta-icon {
  font-size: 1rem;
}

.event-content {
  color: #555;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.event-content :deep(.content-link) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid rgba(102, 126, 234, 0.3);
  transition: all 0.3s;
  word-break: break-all;
}

.event-content :deep(.content-link:hover) {
  color: #764ba2;
  border-bottom-color: #764ba2;
}

.event-image {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s;
}

.event-image:hover img {
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .timeline {
    padding-left: 1.5rem;
  }
  
  .timeline-item {
    padding-left: 1.5rem;
  }
  
  .event-card {
    padding: 1rem;
  }
  
  .event-title {
    font-size: 1.1rem;
  }
  
  .event-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
