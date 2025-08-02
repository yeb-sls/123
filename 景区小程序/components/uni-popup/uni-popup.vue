<template>
  <view v-if="visible" class="uni-popup">
    <!-- 遮罩层，只有点击遮罩才关闭弹窗 -->
    <view class="uni-popup__mask" @click.self="onMaskClick"></view>
    <view class="uni-popup__wrapper" :class="[`uni-popup--${type}`]">
      <view class="uni-popup__container">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UniPopup',
  props: {
    type: {
      type: String,
      default: 'center'
    },
    maskClick: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    show: {
      handler(newVal) {
        this.visible = newVal
      },
      immediate: true
    }
  },
  methods: {
    open(type) {
      this.visible = true
    },
    close() {
      this.visible = false
      this.$emit('close')
    },
    onMaskClick() {
      if (this.maskClick) {
        this.close()
      }
    }
  }
}
</script>

<style scoped>
.uni-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.uni-popup__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}
.uni-popup__wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: auto;
}

.uni-popup--center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.uni-popup--bottom {
  bottom: 0;
  left: 0;
  right: 0;
}

.uni-popup--top {
  top: 0;
  left: 0;
  right: 0;
}

.uni-popup--left {
  top: 0;
  left: 0;
  bottom: 0;
}

.uni-popup--right {
  top: 0;
  right: 0;
  bottom: 0;
}

.uni-popup__container {
  background-color: #fff;
  border-radius: 8rpx;
  max-width: 90vw;
  width: auto;
  max-height: 90vh;
  min-height: 200rpx;
  overflow: auto;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.18);
  padding: 0;
  pointer-events: auto;
}
</style> 