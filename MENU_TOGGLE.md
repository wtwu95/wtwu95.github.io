# 折叠菜单栏按钮的打开与关闭机制

本文更新总结 `greedy-nav` 折叠菜单的状态管理、交互解耦与无障碍优化策略，帮助理解新版按钮的行为。

## 状态管理与无障碍播报
- 插件内部引入显式的 `isOpen` 状态，通过 `setMenuOpen()` 同步 DOM 类名、`aria-expanded`/`aria-hidden` 与按钮的 `data-state`，并在菜单隐藏或条目为空时强制回落到关闭态，保证状态一致性。【F:assets/js/plugins/jquery.greedy-navigation.js†L8-L83】
- 初始化时为切换按钮附加 `aria-live="polite"` 的隐藏状态区，并在 `announceState()` 中播报“展开/收起”提示，满足屏幕阅读器对状态变更的感知需求。【F:assets/js/plugins/jquery.greedy-navigation.js†L15-L44】
- `manageDocClickListener()` 动态注册/注销命名空间外部点击事件，既维持交互正确性，也避免无谓的全局监听。【F:assets/js/plugins/jquery.greedy-navigation.js†L46-L59】

## 打开路径
- “更多”按钮点击时根据当前 `isOpen` 状态切换，方向键 `ArrowDown/ArrowUp` 会自动展开菜单并把焦点定位到隐藏列表的首尾元素，完整支持键盘导航起点。【F:assets/js/plugins/jquery.greedy-navigation.js†L170-L203】
- 当焦点进入 `.greedy-nav__more` 区域时，`focusin` 事件会触发展开，确保键盘逐项访问时不会漏掉隐藏条目。【F:assets/js/plugins/jquery.greedy-navigation.js†L248-L252】
- 桌面端悬停逻辑独立在 `assets/js/nav-hover.js` 中：仅当命中 `(hover: hover) and (pointer: fine)` 媒体查询时绑定指针事件，并通过自定义事件 `greedyNav:open` 请求主插件展开菜单，触摸设备默认不响应悬停。【F:assets/js/nav-hover.js†L17-L128】【F:assets/js/plugins/jquery.greedy-navigation.js†L170-L179】

## 关闭策略
- “更多”按钮、隐藏列表项与 `focusout` 事件共同调用 `setMenuOpen(false)`：包括按 `Escape`、在隐藏列表里循环 Tab、焦点移出“更多”容器或用户点击页面其它区域时都会自动收起。【F:assets/js/plugins/jquery.greedy-navigation.js†L46-L258】
- 桌面悬停在指针离开后会延迟 150ms 触发 `greedyNav:close`，并在指针能力变化（如插拔触控板）时自动解绑监听，避免在触摸端误触折叠。【F:assets/js/nav-hover.js†L63-L129】【F:assets/js/plugins/jquery.greedy-navigation.js†L170-L179】

## 性能与事件委托
- 窗口尺寸变化使用 150ms 防抖并优先通过 `requestAnimationFrame` 执行 `updateNav()`，减少布局抖动。【F:assets/js/plugins/jquery.greedy-navigation.js†L159-L168】
- 隐藏列表使用事件委托集中处理键盘逻辑，避免为每个菜单项单独绑定监听器；文档级点击监听亦在关闭时解绑，实现更精简的事件管理。【F:assets/js/plugins/jquery.greedy-navigation.js†L46-L245】

通过上述优化，折叠菜单在保留既有功能的同时进一步强化了性能与无障碍体验，并确保不同输入设备的交互互不干扰。
