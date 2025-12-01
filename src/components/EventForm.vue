<template>
  <div class="event-form-card">
    <h2>📝 添加新事件</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">
          <span class="label-icon">📌</span>
          标题
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="请输入事件标题"
          required
        />
      </div>

      <div class="form-group">
        <label for="content">
          <span class="label-icon">📄</span>
          内容
        </label>
        <textarea
          id="content"
          v-model="formData.content"
          placeholder="请输入事件详细内容"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="time">
            <span class="label-icon">🕐</span>
            时间
          </label>
          <input
            id="time"
            v-model="formData.time"
            type="datetime-local"
            required
          />
        </div>

        <div class="form-group">
          <label for="location">
            <span class="label-icon">📍</span>
            地址
          </label>
          <input
            id="location"
            v-model="formData.location"
            type="text"
            placeholder="请输入地址"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="image">
          <span class="label-icon">🖼️</span>
          图片链接
        </label>
        <input
          id="image"
          v-model="formData.image"
          type="url"
          placeholder="请输入图片URL地址"
        />
      </div>

      <button type="submit" class="submit-btn">
        ➕ 添加事件
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-event'])

const formData = ref({
  title: '',
  content: '',
  time: '',
  location: '',
  image: ''
})

const handleSubmit = () => {
  emit('add-event', { ...formData.value })
  
  formData.value = {
    title: '',
    content: '',
    time: '',
    location: '',
    image: ''
  }
}
</script>

<style scoped>
.event-form-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.label-icon {
  margin-right: 0.3rem;
}

input, textarea {
  width: 100%;
  max-width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
  resize: vertical;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .event-form-card {
    padding: 1.5rem;
  }
  
  .form-row {
    flex-direction: column;
  }
}
</style>
