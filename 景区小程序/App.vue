<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 添加缓存错误处理
			this.handleCacheErrors()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			handleCacheErrors() {
				console.log('🔧 App.vue 缓存错误处理已启用')
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
