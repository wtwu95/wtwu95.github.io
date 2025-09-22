(function () {
  'use strict';

  var hashMeta = document.querySelector('meta[name="owner-edit-hash"]');
  if (!hashMeta) {
    return;
  }

  var ownerHash = (hashMeta.getAttribute('content') || '').trim().toLowerCase();
  if (!ownerHash) {
    return;
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll('.editable-block[data-editable-id]'));
  if (!sections.length) {
    return;
  }

  var STORAGE_KEY = 'owner:overrides';
  var SESSION_KEY = 'owner:session';
  var ownerMode = false;
  var toolbar = null;
  var modal = null;
  var toast = null;
  var activeSection = null;

  function toHex(buffer) {
    var view = new Uint8Array(buffer);
    var result = '';
    for (var i = 0; i < view.length; i += 1) {
      var value = view[i].toString(16);
      result += value.length === 1 ? '0' + value : value;
    }
    return result;
  }

  function simpleHash(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i += 1) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  }

  function hashString(str) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      var encoder = new TextEncoder();
      return window.crypto.subtle
        .digest('SHA-256', encoder.encode(str))
        .then(function (buffer) {
          return toHex(buffer);
        })
        .catch(function () {
          return simpleHash(str);
        });
    }
    return Promise.resolve(simpleHash(str));
  }

  function sanitize(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    Array.prototype.slice.call(template.content.querySelectorAll('script')).forEach(function (node) {
      node.parentNode.removeChild(node);
    });
    Array.prototype.slice.call(template.content.querySelectorAll('*')).forEach(function (element) {
      Array.prototype.slice.call(element.attributes).forEach(function (attribute) {
        if (/^on/i.test(attribute.name)) {
          element.removeAttribute(attribute.name);
        }
      });
    });
    return template.innerHTML;
  }

  function getStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // ignore storage errors
    }
  }

  function removeStorage(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // ignore storage errors
    }
  }

  function loadOverrides() {
    var raw = getStorage(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (error) {
      // ignore malformed data
    }
    return {};
  }

  function saveOverrides(map) {
    setStorage(STORAGE_KEY, JSON.stringify(map));
  }

  function showToast(message) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'owner-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('is-visible');

    window.clearTimeout(showToast.timerId);
    showToast.timerId = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  function dispatchRefresh(section) {
    var refreshNames = section.getAttribute('data-edit-refresh');
    if (!refreshNames) {
      return;
    }

    refreshNames
      .split(/\s+/)
      .map(function (name) {
        return name.trim();
      })
      .filter(Boolean)
      .forEach(function (name) {
        var event;
        try {
          event = new CustomEvent(name, { bubbles: false });
        } catch (error) {
          // IE fallback
          event = document.createEvent('CustomEvent');
          event.initCustomEvent(name, false, false, {});
        }
        document.dispatchEvent(event);
      });
  }

  sections.forEach(function (section) {
    if (!section.hasAttribute('data-edit-original')) {
      section.setAttribute('data-edit-original', sanitize(section.innerHTML));
    }
  });

  var overrides = loadOverrides();

  function applyOverrides() {
    sections.forEach(function (section) {
      var id = section.getAttribute('data-editable-id');
      if (!id || !overrides[id]) {
        return;
      }
      var sanitized = sanitize(overrides[id]);
      section.innerHTML = sanitized;
    });
  }

  applyOverrides();

  function ensureControls(section) {
    if (section.querySelector('.editable-block__controls')) {
      return;
    }

    var controls = document.createElement('div');
    controls.className = 'editable-block__controls';

    var editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'editable-block__button';
    editButton.textContent = '编辑';
    editButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      openEditor(section);
    });
    controls.appendChild(editButton);

    var resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'editable-block__button editable-block__button--ghost';
    resetButton.textContent = '恢复';
    resetButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      resetSection(section, true);
    });
    controls.appendChild(resetButton);

    section.appendChild(controls);
  }

  function getOverrideMap() {
    overrides = loadOverrides();
    return overrides;
  }

  function updateOverride(id, value) {
    var map = getOverrideMap();
    if (value) {
      map[id] = value;
    } else {
      delete map[id];
    }
    overrides = map;
    saveOverrides(map);
  }

  function resetSection(section, notify) {
    var id = section.getAttribute('data-editable-id');
    if (!id) {
      return;
    }

    var original = section.getAttribute('data-edit-original');
    if (typeof original !== 'string') {
      return;
    }

    section.innerHTML = original;
    updateOverride(id, null);
    dispatchRefresh(section);

    if (ownerMode) {
      ensureControls(section);
    }

    if (notify) {
      showToast('已恢复“' + (section.getAttribute('data-edit-title') || id) + '”模块');
    }
  }

  function clearAllOverrides() {
    var confirmed = window.confirm('确定要清除全部模块的本地修改吗？');
    if (!confirmed) {
      return;
    }

    saveOverrides({});
    overrides = {};

    sections.forEach(function (section) {
      resetSection(section, false);
    });

    showToast('已清除全部自定义内容');
  }

  function ensureToolbar() {
    if (toolbar) {
      return toolbar;
    }

    toolbar = document.createElement('div');
    toolbar.className = 'owner-toolbar';
    document.body.appendChild(toolbar);
    return toolbar;
  }

  function createButton(label) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'owner-toolbar__button';
    button.textContent = label;
    return button;
  }

  function updateToolbar() {
    ensureToolbar();
    toolbar.innerHTML = '';

    var group = document.createElement('div');
    group.className = 'owner-toolbar__group';
    toolbar.appendChild(group);

    if (ownerMode) {
      var exitButton = createButton('退出编辑模式');
      exitButton.addEventListener('click', function () {
        ownerMode = false;
        document.body.classList.remove('owner-mode-active');
        removeStorage(SESSION_KEY);
        updateToolbar();
        showToast('已退出编辑模式');
      });
      group.appendChild(exitButton);

      var clearButton = createButton('清除全部修改');
      clearButton.addEventListener('click', clearAllOverrides);
      group.appendChild(clearButton);
    } else {
      var loginButton = createButton('登录编辑模式');
      loginButton.addEventListener('click', function () {
        requestLogin();
      });
      group.appendChild(loginButton);

      var hint = document.createElement('div');
      hint.className = 'owner-toolbar__hint';
      hint.innerHTML = '<strong>站长提示</strong>使用授权密码可直接在线维护页面内容。';
      toolbar.appendChild(hint);
    }
  }

  function synchronizeViews(modalInstance, tab) {
    if (tab === 'html') {
      modalInstance.source.value = sanitize(modalInstance.editor.innerHTML);
    } else {
      modalInstance.editor.innerHTML = sanitize(modalInstance.source.value);
    }
  }

  function setActiveTab(modalInstance, tab) {
    if (modalInstance.activeTab === tab) {
      return;
    }

    modalInstance.tabs.forEach(function (button) {
      if (button.getAttribute('data-tab') === tab) {
        button.classList.add('is-active');
      } else {
        button.classList.remove('is-active');
      }
    });

    if (tab === 'visual') {
      modalInstance.editor.style.display = 'block';
      modalInstance.source.style.display = 'none';
    } else {
      modalInstance.editor.style.display = 'none';
      modalInstance.source.style.display = 'block';
    }

    modalInstance.activeTab = tab;
    synchronizeViews(modalInstance, tab);
  }

  function ensureModal() {
    if (modal) {
      return modal;
    }

    var root = document.createElement('div');
    root.className = 'owner-modal';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');

    var backdrop = document.createElement('div');
    backdrop.className = 'owner-modal__backdrop';
    root.appendChild(backdrop);

    var dialog = document.createElement('div');
    dialog.className = 'owner-modal__dialog';
    root.appendChild(dialog);

    var header = document.createElement('div');
    header.className = 'owner-modal__header';
    dialog.appendChild(header);

    var title = document.createElement('h3');
    title.className = 'owner-modal__title';
    header.appendChild(title);

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'owner-modal__close';
    close.setAttribute('aria-label', '关闭编辑窗口');
    close.textContent = '×';
    header.appendChild(close);

    var tabs = document.createElement('div');
    tabs.className = 'owner-modal__tabs';
    dialog.appendChild(tabs);

    var visualTab = document.createElement('button');
    visualTab.type = 'button';
    visualTab.className = 'owner-modal__tab';
    visualTab.textContent = '可视化编辑';
    visualTab.setAttribute('data-tab', 'visual');
    tabs.appendChild(visualTab);

    var htmlTab = document.createElement('button');
    htmlTab.type = 'button';
    htmlTab.className = 'owner-modal__tab';
    htmlTab.textContent = 'HTML 源码';
    htmlTab.setAttribute('data-tab', 'html');
    tabs.appendChild(htmlTab);

    var body = document.createElement('div');
    body.className = 'owner-modal__body';
    dialog.appendChild(body);

    var editor = document.createElement('div');
    editor.className = 'owner-modal__editor';
    editor.setAttribute('contenteditable', 'true');
    body.appendChild(editor);

    var source = document.createElement('textarea');
    source.className = 'owner-modal__source';
    source.setAttribute('spellcheck', 'false');
    body.appendChild(source);

    var hint = document.createElement('p');
    hint.className = 'owner-modal__hint';
    hint.textContent = '保存后内容仅在本地浏览器中生效，同时可复制 HTML 更新仓库源文件。';
    body.appendChild(hint);

    var footer = document.createElement('div');
    footer.className = 'owner-modal__footer';
    dialog.appendChild(footer);

    var copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'owner-modal__action owner-modal__action--ghost';
    copyButton.setAttribute('data-action', 'copy');
    copyButton.textContent = '复制 HTML';
    footer.appendChild(copyButton);

    var resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'owner-modal__action owner-modal__action--ghost';
    resetButton.setAttribute('data-action', 'reset');
    resetButton.textContent = '恢复原始内容';
    footer.appendChild(resetButton);

    var spacer = document.createElement('div');
    spacer.className = 'owner-modal__footer-spacer';
    footer.appendChild(spacer);

    var cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'owner-modal__action owner-modal__action--secondary';
    cancelButton.setAttribute('data-action', 'cancel');
    cancelButton.textContent = '取消';
    footer.appendChild(cancelButton);

    var saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'owner-modal__action owner-modal__action--primary';
    saveButton.setAttribute('data-action', 'save');
    saveButton.textContent = '保存修改';
    footer.appendChild(saveButton);

    document.body.appendChild(root);

    modal = {
      root: root,
      dialog: dialog,
      title: title,
      close: close,
      tabs: [visualTab, htmlTab],
      editor: editor,
      source: source,
      copyButton: copyButton,
      resetButton: resetButton,
      cancelButton: cancelButton,
      saveButton: saveButton,
      activeTab: 'visual'
    };

    close.addEventListener('click', function () {
      hideModal();
    });

    backdrop.addEventListener('click', function () {
      hideModal();
    });

    visualTab.addEventListener('click', function () {
      setActiveTab(modal, 'visual');
    });

    htmlTab.addEventListener('click', function () {
      setActiveTab(modal, 'html');
    });

    copyButton.addEventListener('click', function () {
      synchronizeViews(modal, modal.activeTab);
      var value = modal.activeTab === 'visual' ? sanitize(modal.editor.innerHTML) : sanitize(modal.source.value);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(value)
          .then(function () {
            showToast('已复制到剪贴板');
          })
          .catch(function () {
            showToast('复制失败，请手动选择内容');
          });
      } else {
        try {
          var temp = document.createElement('textarea');
          temp.value = value;
          temp.setAttribute('readonly', '');
          temp.style.position = 'absolute';
          temp.style.left = '-9999px';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          showToast('已复制到剪贴板');
        } catch (error) {
          showToast('复制失败，请手动选择内容');
        }
      }
    });

    resetButton.addEventListener('click', function () {
      if (!activeSection) {
        return;
      }
      var original = activeSection.getAttribute('data-edit-original');
      if (typeof original !== 'string') {
        return;
      }
      modal.editor.innerHTML = original;
      modal.source.value = original;
      showToast('已载入原始内容');
    });

    cancelButton.addEventListener('click', function () {
      hideModal();
    });

    saveButton.addEventListener('click', function () {
      if (!activeSection) {
        hideModal();
        return;
      }
      synchronizeViews(modal, modal.activeTab);
      var value = modal.activeTab === 'visual' ? modal.editor.innerHTML : modal.source.value;
      var sanitized = sanitize(value);
      activeSection.innerHTML = sanitized;
      var id = activeSection.getAttribute('data-editable-id');
      updateOverride(id, sanitized);
      dispatchRefresh(activeSection);
      showToast('已保存“' + (activeSection.getAttribute('data-edit-title') || id) + '”模块');
      if (ownerMode) {
        ensureControls(activeSection);
      }
      hideModal();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.root.classList.contains('is-visible')) {
        hideModal();
      }
    });

    setActiveTab(modal, 'visual');

    return modal;
  }

  function showModal() {
    ensureModal();
    modal.root.classList.add('is-visible');
  }

  function hideModal() {
    if (!modal) {
      return;
    }
    modal.root.classList.remove('is-visible');
    activeSection = null;
  }

  function openEditor(section) {
    ensureModal();
    activeSection = section;
    modal.title.textContent = '编辑：' + (section.getAttribute('data-edit-title') || section.getAttribute('data-editable-id'));
    var currentHtml = sanitize(section.innerHTML);
    modal.editor.innerHTML = currentHtml;
    modal.source.value = currentHtml;
    setActiveTab(modal, 'visual');
    showModal();
  }

  function isAuthenticated() {
    var session = getStorage(SESSION_KEY);
    return session && session.toLowerCase() === ownerHash;
  }

  function activateOwnerMode() {
    ownerMode = true;
    document.body.classList.add('owner-mode-active');
    sections.forEach(function (section) {
      ensureControls(section);
    });
    updateToolbar();
    showToast('已进入编辑模式');
  }

  function requestLogin() {
    var password = window.prompt('请输入站长编辑密码');
    if (password === null) {
      return;
    }
    password = password.trim();
    if (!password) {
      showToast('密码不能为空');
      return;
    }

    hashString(password).then(function (hashed) {
      if (hashed && hashed.toLowerCase() === ownerHash) {
        setStorage(SESSION_KEY, ownerHash);
        activateOwnerMode();
      } else {
        showToast('密码错误，无法进入编辑模式');
      }
    });
  }

  function initialize() {
    if (isAuthenticated()) {
      ownerMode = true;
      document.body.classList.add('owner-mode-active');
      sections.forEach(function (section) {
        ensureControls(section);
      });
    }
    updateToolbar();
  }

  initialize();
})();

