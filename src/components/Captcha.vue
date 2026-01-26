<template>
  <div class="captcha-wrapper">
    <canvas
      ref="captchaCanvas"
      :height="canvasHeight"
      :width="canvasWidth"
      @click="generateCaptcha"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue'

  const emits = defineEmits<{
    'set-captcha-code': [string]
  }>()

  const captchaCanvas = ref<HTMLCanvasElement | null>(null)
  const canvasWidth = 120
  const canvasHeight = 38
  const captchaCode = ref('')

  // 驗證碼字符集（排除容易混淆的字符如 0, O, I, l）
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  // 生成隨機驗證碼
  function generateRandomCode (): string {
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
  }

  // 生成隨機顏色
  function randomColor (min: number, max: number): string {
    const r = Math.floor(Math.random() * (max - min + 1) + min)
    const g = Math.floor(Math.random() * (max - min + 1) + min)
    const b = Math.floor(Math.random() * (max - min + 1) + min)
    return `rgb(${r}, ${g}, ${b})`
  }

  // 繪製驗證碼
  function drawCaptcha (): void {
    const canvas = captchaCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // 清空畫布
    if (!ctx) return
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // 設置背景色
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 生成新的驗證碼
    captchaCode.value = generateRandomCode()

    // 繪製干擾線
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = randomColor(100, 200)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
      ctx.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
      ctx.stroke()
    }

    // 繪製干擾點
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = randomColor(150, 200)
      ctx.beginPath()
      ctx.arc(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight,
        1,
        0,
        2 * Math.PI,
      )
      ctx.fill()
    }

    // 繪製驗證碼文字
    const code = captchaCode.value
    for (const [i, char] of Array.from(code).entries()) {
      const x = 15 + i * 24
      const y = 22 + Math.random() * 6 - 3
      const angle = (Math.random() - 0.5) * 0.4
      const fontSize = 20 + Math.random() * 4

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.font = `bold ${fontSize}px Arial`
      ctx.fillStyle = randomColor(20, 100)
      ctx.textBaseline = 'middle'
      ctx.fillText(char, 0, 0)
      ctx.restore()
    }
  }

  // 產生驗證碼
  function generateCaptcha (): void {
    drawCaptcha()
    emits('set-captcha-code', captchaCode.value)
  }

  // 組件掛載時生成驗證碼
  onMounted((): void => {
    generateCaptcha()
  })
</script>

<style scoped>
.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

canvas {
  border: 2px solid #ddd;
  border-radius:  6px;
  cursor: pointer;
  transition: border-color 0.3s;
}

canvas:hover {
  border-color: #4CAF50;
}

/* 響應式設計 */
@media (max-width: 480px) {
  .captcha-wrapper {
    flex-direction: column;
  }

  canvas {
    width: 100%;
  }
}
</style>
