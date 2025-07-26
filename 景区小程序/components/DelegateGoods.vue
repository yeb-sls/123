<template>
  <view class="delegate-goods">
    <view class="form-title">
      <text class="icon">🛍️</text>代办物品（可选）
    </view>
    
    <view class="goods-list">
      <view v-for="(item, index) in goods" :key="index" class="goods-item">
        <view class="item-header">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-price">￥{{ item.price }}</text>
        </view>
        <view class="item-desc">{{ item.description }}</view>
        <view class="quantity-control">
          <text class="quantity-label">数量：</text>
          <button class="qty-btn" @click="decreaseQty(index)" :disabled="item.qty <= 0">-</button>
          <text class="qty-value">{{ item.qty }}</text>
          <button class="qty-btn" @click="increaseQty(index)">+</button>
        </view>
      </view>
    </view>
    
    <view class="total-section">
      <text class="total-label">总计：</text>
      <text class="total-price">￥{{ totalPrice }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DelegateGoods',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      goods: this.value.length > 0 ? [...this.value] : [
        {
          id: 1,
          name: '香烛套装',
          price: 50,
          description: '包含香、烛、纸钱等法会用品',
          qty: 0
        },
        {
          id: 2,
          name: '供果',
          price: 30,
          description: '新鲜水果供品',
          qty: 0
        },
        {
          id: 3,
          name: '鲜花',
          price: 40,
          description: '鲜花供品',
          qty: 0
        },
        {
          id: 4,
          name: '功德牌位',
          price: 100,
          description: '为逝者立功德牌位',
          qty: 0
        }
      ]
    }
  },
  computed: {
    totalPrice() {
      return this.goods.reduce((sum, item) => sum + item.price * item.qty, 0)
    }
  },
  watch: {
    goods: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  methods: {
    increaseQty(index) {
      this.goods[index].qty++
    },
    decreaseQty(index) {
      if (this.goods[index].qty > 0) {
        this.goods[index].qty--
      }
    }
  }
}
</script>

<style scoped>
.delegate-goods {
  background: #fff;
  border-radius: 18rpx;
  padding: 32rpx 24rpx;
  margin: 24rpx 16rpx;
  box-shadow: 0 2rpx 12rpx #e0eaff;
}

.form-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2d8cf0;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
}

.icon {
  font-size: 30rpx;
  margin-right: 8rpx;
}

.goods-list {
  margin-bottom: 24rpx;
}

.goods-item {
  border: 1px solid #e0eaff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f8f9fa;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.item-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.item-price {
  font-size: 28rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.item-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-label {
  font-size: 26rpx;
  color: #666;
  margin-right: 16rpx;
}

.qty-btn {
  width: 60rpx;
  height: 60rpx;
  border: 1px solid #2d8cf0;
  border-radius: 8rpx;
  background: #fff;
  color: #2d8cf0;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:disabled {
  color: #ccc;
  border-color: #ccc;
}

.qty-value {
  width: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  margin: 0 16rpx;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 1px solid #e0eaff;
}

.total-label {
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}
</style> 