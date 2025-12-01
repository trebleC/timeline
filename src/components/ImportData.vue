<template>
    <div class="import-section">
        <div class="import-card">
            <h2>📥 导入大事记数据</h2>
            <p class="import-hint">请粘贴你的大事记数据，格式示例：</p>
            <pre class="format-example">2022年

12月17日深夜
王力宏前妻李靓蕾微博发长文控诉...

12月19日
腾讯音乐娱乐集团...</pre>
            <textarea v-model="importText" placeholder="请粘贴大事记数据..." rows="15" class="import-textarea"></textarea>
            <div class="import-actions">
                <button @click="handleImport" class="import-btn">📥 开始导入</button>
                <button @click="clearAllData" class="clear-btn">🗑️ 清空所有数据</button>
            </div>
            <p v-if="importMessage" :class="['import-message', importSuccess ? 'success' : 'error']">
                {{ importMessage }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['import-success', 'clear-all'])

const importText = ref('')
const importMessage = ref('')
const importSuccess = ref(false)

// 导入数据解析函数
const parseImportData = (text) => {
    const lines = text.trim().split('\n')
    const parsedEvents = []
    let currentYear = ''
    let currentDate = ''
    let currentContent = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (!line) {
            continue
        }

        // 匹配年份
        if (/^\d{4}年$/.test(line)) {
            currentYear = line.replace('年', '')
            continue
        }

        // 匹配日期
        const dateMatch = line.match(/^(\d{1,2})月(\d{1,2})日(.*)$/)
        if (dateMatch) {
            if (currentDate && currentContent.length > 0) {
                const month = currentDate.split('-')[1]
                const day = currentDate.split('-')[2]
                const title = `${month}月${day}日`
                const content = currentContent.join('\n\n')

                parsedEvents.push({
                    id: Date.now() + parsedEvents.length,
                    title: title,
                    content: content,
                    time: `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00`,
                    location: '',
                    image: ''
                })
            }

            const month = dateMatch[1].padStart(2, '0')
            const day = dateMatch[2].padStart(2, '0')
            const extra = dateMatch[3]
            currentDate = `${currentYear}-${month}-${day}`
            currentContent = []

            if (extra) {
                currentContent.push(extra)
            }
            continue
        }

        if (currentDate) {
            currentContent.push(line)
        }
    }

    // 保存最后一个事件
    if (currentDate && currentContent.length > 0) {
        const month = currentDate.split('-')[1]
        const day = currentDate.split('-')[2]
        const title = `${month}月${day}日`
        const content = currentContent.join('\n\n')

        parsedEvents.push({
            id: Date.now() + parsedEvents.length,
            title: title,
            content: content,
            time: `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00`,
            location: '',
            image: ''
        })
    }

    return parsedEvents
}

// 处理导入
const handleImport = () => {
    if (!importText.value.trim()) {
        importMessage.value = '请输入要导入的数据'
        importSuccess.value = false
        return
    }

    try {
        const newEvents = parseImportData(importText.value)
        if (newEvents.length === 0) {
            importMessage.value = '未能解析到任何事件，请检查格式'
            importSuccess.value = false
            return
        }

        emit('import-success', newEvents)

        importMessage.value = `成功导入 ${newEvents.length} 条事件！`
        importSuccess.value = true
        importText.value = ''

        setTimeout(() => {
            importMessage.value = ''
        }, 3000)
    } catch (error) {
        importMessage.value = `导入失败：${error.message}`
        importSuccess.value = false
    }
}

// 清空所有数据
const clearAllData = () => {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
        emit('clear-all')
        importMessage.value = '已清空所有数据'
        importSuccess.value = true
        setTimeout(() => {
            importMessage.value = ''
        }, 2000)
    }
}
</script>

<style scoped>
.import-section {
    max-width: 800px;
    margin: 0 auto;
}

.import-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.import-card h2 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.import-hint {
    color: #666;
    margin-bottom: 1rem;
}

.format-example {
    background: #f5f7fa;
    padding: 1rem;
    border-radius: 8px;
    color: #555;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    overflow-x: auto;
}

.import-textarea {
    width: 100%;
    max-width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 1rem;
    box-sizing: border-box;
}

.import-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.import-actions {
    display: flex;
    gap: 1rem;
}

.import-btn {
    flex: 1;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
}

.import-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.clear-btn {
    padding: 1rem 2rem;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
}

.clear-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
}

.import-message {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
}

.import-message.success {
    background: #d4edda;
    color: #155724;
}

.import-message.error {
    background: #f8d7da;
    color: #721c24;
}

@media (max-width: 768px) {
    .import-card {
        padding: 1.5rem;
    }

    .import-actions {
        flex-direction: column;
    }

    .clear-btn {
        width: 100%;
    }
}
</style>
