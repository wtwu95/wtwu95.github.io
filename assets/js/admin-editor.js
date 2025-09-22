(function () {
  'use strict';

  var win = window;
  var doc = document;
  var ownerConfig = win.__OWNER_CONFIG__ || {};
  var passwordHash = (ownerConfig.password_hash || ownerConfig.passwordHash || '').toLowerCase();
  var passwordHint = ownerConfig.password_hint || ownerConfig.passwordHint || '';
  var storagePrefix = ownerConfig.storage_prefix || ownerConfig.storagePrefix || 'owner-edit';

  var hasLocalStorage = false;
  var hasSessionStorage = false;

  try {
    hasLocalStorage = !!win.localStorage;
  } catch (error) {
    hasLocalStorage = false;
  }

  try {
    hasSessionStorage = !!win.sessionStorage;
  } catch (error) {
    hasSessionStorage = false;
  }

  var containers = Array.prototype.slice.call(doc.querySelectorAll('[data-editable-key]'));

  if (!containers.length) {
    return;
  }

  var originalContent = {};
  var sessionKey = storagePrefix + ':auth';
  var isAuthenticated = false;
  var toolbar = null;
  var toolbarButton = null;
  var toolbarMenu = null;
  var menuVisible = false;
  var toast = null;
  var toastTimer = null;
  var activeModal = null;

  function storageKey(key) {
    return storagePrefix + ':section:' + key;
  }

  function cloneData(value) {
    if (value === undefined || value === null) {
      return value;
    }
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return value;
    }
  }

  function resolveTarget(container) {
    if (!container) {
      return null;
    }
    var selector = container.getAttribute('data-editable-target');
    if (!selector || selector === 'self' || selector === '@self') {
      return container;
    }
    try {
      var target = container.querySelector(selector);
      return target || container;
    } catch (error) {
      return container;
    }
  }
  function collectDataAttributes(element) {
    var extras = {};
    Array.prototype.slice.call(element.attributes || []).forEach(function (attr) {
      if (attr && attr.name && attr.name.indexOf('data-') === 0) {
        extras[attr.name] = attr.value;
      }
    });
    return extras;
  }

  function serializePublicationItem(item) {
    var attrs = collectDataAttributes(item);
    var entry = {
      type: item.getAttribute('data-type') || '',
      year: item.getAttribute('data-year') || '',
      date: item.getAttribute('data-date') || '',
      plain: item.getAttribute('data-citation-plain') || '',
      bib: item.getAttribute('data-citation-bibtex') || '',
      html: item.innerHTML || '',
      extras: {}
    };

    Object.keys(attrs).forEach(function (name) {
      if (name === 'data-type' || name === 'data-year' || name === 'data-date' ||
          name === 'data-citation-plain' || name === 'data-citation-bibtex') {
        return;
      }
      entry.extras[name] = attrs[name];
    });

    return entry;
  }

  function serializeContainer(container) {
    var type = container.getAttribute('data-editable-type') || 'richtext';
    var target = resolveTarget(container);
    if (!target) {
      return { type: 'richtext', html: '' };
    }

    if (type === 'publication-list') {
      var items = Array.prototype.slice.call(target.children).map(function (item) {
        return serializePublicationItem(item);
      });
      return {
        type: 'publication-list',
        entries: items
      };
    }

    return {
      type: 'richtext',
      html: target.innerHTML
    };
  }

  function applyPublicationEntryAttributes(element, entry) {
    if (!element || !entry) {
      return;
    }

    function setAttr(name, value) {
      if (value === undefined || value === null || value === '') {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value);
      }
    }

    setAttr('data-type', entry.type || '');
    setAttr('data-year', entry.year || '');
    setAttr('data-date', entry.date || '');
    setAttr('data-citation-plain', entry.plain || '');
    setAttr('data-citation-bibtex', entry.bib || '');

    if (entry.extras) {
      Object.keys(entry.extras).forEach(function (name) {
        var value = entry.extras[name];
        if (value === undefined || value === null || value === '') {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value);
        }
      });
    }
  }

  function createPublicationItem(entry) {
    var li = doc.createElement('li');
    applyPublicationEntryAttributes(li, entry);
    li.innerHTML = entry && entry.html ? entry.html : '';
    return li;
  }

  function applyDataToContainer(container, data) {
    if (!container || !data) {
      return;
    }
    var type = data.type || container.getAttribute('data-editable-type') || 'richtext';
    var target = resolveTarget(container);
    if (!target) {
      return;
    }

    if (type === 'publication-list') {
      target.innerHTML = '';
      var entries = Array.isArray(data.entries) ? data.entries : [];
      entries.forEach(function (entry) {
        target.appendChild(createPublicationItem(entry));
      });
      return;
    }

    if (typeof data.html === 'string') {
      target.innerHTML = data.html;
    }
  }

  containers.forEach(function (container) {
    var key = container.getAttribute('data-editable-key');
    if (!key) {
      return;
    }
    originalContent[key] = cloneData(serializeContainer(container));
  });

  if (hasLocalStorage) {
    containers.forEach(function (container) {
      var key = container.getAttribute('data-editable-key');
      if (!key) {
        return;
      }
      var stored = win.localStorage.getItem(storageKey(key));
      if (!stored) {
        return;
      }
      try {
        var payload = JSON.parse(stored);
        applyDataToContainer(container, payload);
      } catch (error) {
        console.warn('Failed to restore stored content for "' + key + '"', error);
      }
    });
  }

  var autoEnable = hasSessionStorage && win.sessionStorage.getItem(sessionKey) === '1';
  createToolbar();
  if (autoEnable) {
    enableAdminMode(true);
  }

  function showToast(message, variant) {
    if (!message) {
      return;
    }
    if (!toast) {
      toast = doc.createElement('div');
      toast.className = 'owner-toast';
      doc.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('owner-toast--error');
    if (variant === 'error') {
      toast.classList.add('owner-toast--error');
    }
    toast.classList.add('is-visible');
    if (toastTimer) {
      win.clearTimeout(toastTimer);
    }
    toastTimer = win.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  function getSectionTitle(container, fallback) {
    return container.getAttribute('data-editable-title') || fallback || '';
  }

  function saveContainerData(container, data) {
    if (!container || !hasLocalStorage) {
      return;
    }
    var key = container.getAttribute('data-editable-key');
    if (!key) {
      return;
    }
    try {
      var payload = data ? cloneData(data) : serializeContainer(container);
      win.localStorage.setItem(storageKey(key), JSON.stringify(payload));
    } catch (error) {
      console.warn('Failed to persist section "' + key + '"', error);
    }
  }

  function clearContainerData(container) {
    if (!container || !hasLocalStorage) {
      return;
    }
    var key = container.getAttribute('data-editable-key');
    if (!key) {
      return;
    }
    win.localStorage.removeItem(storageKey(key));
  }

  function triggerSectionUpdated(container) {
    if (!container) {
      return;
    }
    var key = container.getAttribute('data-editable-key');
    if (!key) {
      return;
    }
    var detail = {
      key: key,
      type: container.getAttribute('data-editable-type') || 'richtext'
    };
    var event;
    if (typeof win.CustomEvent === 'function') {
      event = new win.CustomEvent('owner:section-updated', { detail: detail });
    } else {
      event = doc.createEvent('CustomEvent');
      event.initCustomEvent('owner:section-updated', true, true, detail);
    }
    doc.dispatchEvent(event);
  }

  function refreshEditButton(container) {
    if (!isAuthenticated) {
      return;
    }
    removeEditButton(container);
    ensureEditButton(container);
  }

  function resetContainer(container) {
    if (!container) {
      return;
    }
    var key = container.getAttribute('data-editable-key');
    if (!key) {
      return;
    }
    var original = originalContent[key];
    if (!original) {
      return;
    }
    applyDataToContainer(container, cloneData(original));
    clearContainerData(container);
    refreshEditButton(container);
    triggerSectionUpdated(container);
  }

  function ensureEditButton(container) {
    if (!container) {
      return;
    }
    if (container.querySelector('.owner-edit-handle')) {
      return;
    }
    var button = doc.createElement('button');
    button.type = 'button';
    button.className = 'owner-edit-handle';
    button.setAttribute('aria-label', '编辑内容');
    button.innerHTML = '✏️';
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      openEditor(container);
    });
    container.classList.add('owner-editable');
    container.insertBefore(button, container.firstChild);
  }

  function removeEditButton(container) {
    if (!container) {
      return;
    }
    container.classList.remove('owner-editable');
    var button = container.querySelector('.owner-edit-handle');
    if (button && button.parentNode) {
      button.parentNode.removeChild(button);
    }
  }

  function createToolbar() {
    toolbar = doc.createElement('div');
    toolbar.className = 'owner-toolbar';

    toolbarButton = doc.createElement('button');
    toolbarButton.type = 'button';
    toolbarButton.className = 'owner-toolbar__button';
    toolbar.appendChild(toolbarButton);

    toolbarMenu = doc.createElement('div');
    toolbarMenu.className = 'owner-toolbar__menu';

    var exportButton = doc.createElement('button');
    exportButton.type = 'button';
    exportButton.setAttribute('data-action', 'export');
    exportButton.textContent = '导出修改';
    toolbarMenu.appendChild(exportButton);

    var clearButton = doc.createElement('button');
    clearButton.type = 'button';
    clearButton.setAttribute('data-action', 'clear');
    clearButton.textContent = '清除全部修改';
    toolbarMenu.appendChild(clearButton);

    var logoutButton = doc.createElement('button');
    logoutButton.type = 'button';
    logoutButton.setAttribute('data-action', 'logout');
    logoutButton.textContent = '退出编辑模式';
    toolbarMenu.appendChild(logoutButton);

    toolbar.appendChild(toolbarMenu);
    doc.body.appendChild(toolbar);

    toolbarButton.addEventListener('click', function () {
      if (!isAuthenticated) {
        openLoginModal();
        return;
      }
      toggleMenu();
    });

    toolbarMenu.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-action]');
      if (!button) {
        return;
      }
      var action = button.getAttribute('data-action');
      hideMenu();
      if (action === 'export') {
        exportChanges();
      } else if (action === 'clear') {
        clearAllChanges();
      } else if (action === 'logout') {
        disableAdminMode();
        showToast('已退出编辑模式。');
      }
    });

    doc.addEventListener('click', function (event) {
      if (!menuVisible) {
        return;
      }
      if (!toolbar.contains(event.target)) {
        hideMenu();
      }
    });

    updateToolbar();
  }

  function toggleMenu() {
    menuVisible = !menuVisible;
    toolbarMenu.classList.toggle('is-open', menuVisible);
    toolbarButton.setAttribute('aria-expanded', menuVisible ? 'true' : 'false');
  }

  function hideMenu() {
    menuVisible = false;
    toolbarMenu.classList.remove('is-open');
    toolbarButton.setAttribute('aria-expanded', 'false');
  }

  function updateToolbar() {
    if (!toolbarButton) {
      return;
    }
    toolbarButton.textContent = isAuthenticated ? '🔓 Owner' : '🔒 Owner';
    toolbar.classList.toggle('owner-toolbar--active', isAuthenticated);
    if (!isAuthenticated) {
      hideMenu();
    }
  }

  function enableAdminMode(skipToast) {
    if (isAuthenticated) {
      return;
    }
    isAuthenticated = true;
    if (hasSessionStorage) {
      win.sessionStorage.setItem(sessionKey, '1');
    }
    doc.body.classList.add('owner-admin');
    containers.forEach(function (container) {
      ensureEditButton(container);
    });
    updateToolbar();
    if (!skipToast) {
      showToast('已进入编辑模式。');
    }
  }

  function disableAdminMode() {
    if (!isAuthenticated) {
      return;
    }
    isAuthenticated = false;
    if (hasSessionStorage) {
      win.sessionStorage.removeItem(sessionKey);
    }
    doc.body.classList.remove('owner-admin');
    containers.forEach(function (container) {
      removeEditButton(container);
    });
    if (activeModal && typeof activeModal.close === 'function') {
      activeModal.close();
    }
    updateToolbar();
  }

  function hashString(value) {
    if (win.crypto && win.crypto.subtle && win.TextEncoder) {
      var encoder = new win.TextEncoder();
      var data = encoder.encode(value);
      return win.crypto.subtle.digest('SHA-256', data).then(function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), function (byte) {
          return ('00' + byte.toString(16)).slice(-2);
        }).join('');
      });
    }
    return Promise.resolve(value);
  }

  function createModal(options) {
    if (activeModal && typeof activeModal.close === 'function') {
      activeModal.close();
    }
    var overlay = doc.createElement('div');
    overlay.className = 'owner-modal';

    var dialog = doc.createElement('div');
    dialog.className = 'owner-modal__dialog';
    overlay.appendChild(dialog);

    var header = doc.createElement('div');
    header.className = 'owner-modal__header';
    header.textContent = options && options.title ? options.title : '编辑内容';
    dialog.appendChild(header);

    var closeButton = doc.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'owner-modal__close';
    closeButton.setAttribute('aria-label', '关闭弹窗');
    closeButton.innerHTML = '&times;';
    header.appendChild(closeButton);

    var body = doc.createElement('div');
    body.className = 'owner-modal__body';
    dialog.appendChild(body);

    var footer = doc.createElement('div');
    footer.className = 'owner-modal__footer';
    dialog.appendChild(footer);

    function closeModal() {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      doc.body.classList.remove('owner-modal-open');
      if (activeModal && activeModal.overlay === overlay) {
        activeModal = null;
      }
    }

    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        closeModal();
      }
    });

    doc.body.appendChild(overlay);
    doc.body.classList.add('owner-modal-open');

    activeModal = {
      overlay: overlay,
      dialog: dialog,
      body: body,
      footer: footer,
      close: closeModal,
      header: header
    };

    return activeModal;
  }

  function createActionButton(label, variant) {
    var button = doc.createElement('button');
    button.type = 'button';
    button.className = 'owner-button';
    if (variant) {
      button.classList.add('owner-button--' + variant);
    }
    button.textContent = label;
    return button;
  }

  function createSmallButton(label, variant) {
    var button = createActionButton(label, variant);
    button.classList.add('owner-button--small');
    return button;
  }

  function openLoginModal() {
    var modal = createModal({ title: '身份验证' });
    var body = modal.body;
    var footer = modal.footer;

    var form = doc.createElement('form');
    form.className = 'owner-login';

    var label = doc.createElement('label');
    label.className = 'owner-login__label';
    label.textContent = '请输入管理员密码';
    var input = doc.createElement('input');
    input.type = 'password';
    input.className = 'owner-input';
    input.required = true;
    label.appendChild(input);
    form.appendChild(label);

    if (passwordHint) {
      var hint = doc.createElement('p');
      hint.className = 'owner-login__hint';
      hint.textContent = passwordHint;
      form.appendChild(hint);
    }

    var error = doc.createElement('p');
    error.className = 'owner-login__error';
    error.setAttribute('hidden', 'hidden');
    form.appendChild(error);

    body.appendChild(form);

    var submitButton = createActionButton('登录', 'primary');
    var cancelButton = createActionButton('取消', 'ghost');
    footer.appendChild(submitButton);
    footer.appendChild(cancelButton);

    cancelButton.addEventListener('click', function () {
      modal.close();
    });

    function showError() {
      error.textContent = '密码不正确，请重试。';
      error.removeAttribute('hidden');
      input.focus();
      input.select();
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitButton.setAttribute('disabled', 'disabled');
      hashString(input.value.trim()).then(function (hash) {
        submitButton.removeAttribute('disabled');
        if (!passwordHash) {
          modal.close();
          enableAdminMode();
          showToast('已进入编辑模式。');
          return;
        }
        if (hash && hash.toLowerCase() === passwordHash) {
          modal.close();
          enableAdminMode();
          showToast('登录成功，已进入编辑模式。');
        } else if (input.value && input.value === passwordHash) {
          modal.close();
          enableAdminMode();
          showToast('登录成功，已进入编辑模式。');
        } else {
          showError();
        }
      }).catch(function () {
        submitButton.removeAttribute('disabled');
        showError();
      });
    });

    submitButton.addEventListener('click', function () {
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    });

    setTimeout(function () {
      input.focus();
    }, 50);
  }

  function openEditor(container) {
    var type = container.getAttribute('data-editable-type') || 'richtext';
    if (type === 'publication-list') {
      openPublicationEditor(container);
    } else {
      openRichtextEditor(container);
    }
  }

  function openRichtextEditor(container) {
    var title = getSectionTitle(container, '编辑内容');
    var target = resolveTarget(container);
    if (!target) {
      return;
    }
    var modal = createModal({ title: title });
    var body = modal.body;
    var footer = modal.footer;

    var description = doc.createElement('p');
    description.className = 'owner-modal__help';
    description.textContent = '可以直接编辑下方的 HTML 内容，保存后仅对当前浏览器生效，可通过“导出修改”进行备份。';
    body.appendChild(description);

    var textarea = doc.createElement('textarea');
    textarea.className = 'owner-textarea';
    textarea.value = target.innerHTML.trim();
    body.appendChild(textarea);

    var saveButton = createActionButton('保存', 'primary');
    var resetButton = createActionButton('恢复默认', 'ghost');
    var cancelButton = createActionButton('取消', 'ghost');
    footer.appendChild(saveButton);
    footer.appendChild(resetButton);
    footer.appendChild(cancelButton);

    saveButton.addEventListener('click', function () {
      target.innerHTML = textarea.value;
      saveContainerData(container, { type: 'richtext', html: textarea.value });
      modal.close();
      refreshEditButton(container);
      triggerSectionUpdated(container);
      showToast('已保存“' + title + '”的修改。');
    });

    resetButton.addEventListener('click', function () {
      if (!win.confirm('确定要恢复“' + title + '”的默认内容吗？')) {
        return;
      }
      resetContainer(container);
      modal.close();
      showToast('已恢复默认内容。');
    });

    cancelButton.addEventListener('click', function () {
      modal.close();
    });
  }

  function extractPublicationTitle(entry) {
    if (!entry) {
      return '';
    }
    var html = entry.html || '';
    if (!html) {
      return '';
    }
    var temp = doc.createElement('div');
    temp.innerHTML = html;
    var link = temp.querySelector('a');
    if (link && link.textContent.trim()) {
      return link.textContent.trim();
    }
    var paragraph = temp.querySelector('p');
    if (paragraph && paragraph.textContent.trim()) {
      return paragraph.textContent.trim();
    }
    return html.replace(/<[^>]+>/g, '').trim();
  }

  function formatPublicationSummary(entry, index) {
    var year = entry.year || '—';
    var title = extractPublicationTitle(entry) || '(未命名条目)';
    return '[' + year + '] ' + title.replace(/\s+/g, ' ').trim();
  }

  function openPublicationEditor(container) {
    var title = getSectionTitle(container, 'Publications');
    var target = resolveTarget(container);
    if (!target) {
      return;
    }

    var entries = Array.prototype.slice.call(target.children).map(function (item) {
      return serializePublicationItem(item);
    });
    var workingEntries = entries.map(function (entry) {
      return cloneData(entry);
    });
    var activeIndex = null;

    var modal = createModal({ title: title + ' - 编辑列表' });
    var body = modal.body;
    var footer = modal.footer;

    var wrapper = doc.createElement('div');
    wrapper.className = 'owner-pub-editor';
    body.appendChild(wrapper);

    var listSection = doc.createElement('div');
    listSection.className = 'owner-pub-editor__list';
    wrapper.appendChild(listSection);

    var listHeader = doc.createElement('div');
    listHeader.className = 'owner-pub-editor__list-header';
    var addButton = createActionButton('新增条目', 'primary');
    listHeader.appendChild(addButton);
    listSection.appendChild(listHeader);

    var itemsContainer = doc.createElement('ul');
    itemsContainer.className = 'owner-pub-editor__items';
    listSection.appendChild(itemsContainer);

    var formSection = doc.createElement('div');
    formSection.className = 'owner-pub-editor__form';
    formSection.setAttribute('hidden', 'hidden');
    wrapper.appendChild(formSection);

    var formTitle = doc.createElement('h3');
    formTitle.className = 'owner-pub-editor__form-title';
    formSection.appendChild(formTitle);

    var form = doc.createElement('form');
    form.className = 'owner-pub-editor__details';
    formSection.appendChild(form);

    var errorMessage = doc.createElement('p');
    errorMessage.className = 'owner-pub-editor__error';
    errorMessage.setAttribute('hidden', 'hidden');
    form.appendChild(errorMessage);

    function createField(labelText, input) {
      var field = doc.createElement('label');
      field.className = 'owner-pub-editor__field';
      var span = doc.createElement('span');
      span.className = 'owner-pub-editor__field-label';
      span.textContent = labelText;
      field.appendChild(span);
      input.classList.add('owner-input');
      field.appendChild(input);
      form.appendChild(field);
      return input;
    }

    var typeInput = createField('类别 (如 journal/conference)', doc.createElement('input'));
    var yearInput = createField('年份', doc.createElement('input'));
    var dateInput = createField('日期 (YYYY 或 YYYY-MM)', doc.createElement('input'));
    var plainTextarea = createField('Plain Citation (可选)', doc.createElement('textarea'));
    plainTextarea.classList.add('owner-textarea');
    var bibTextarea = createField('BibTeX (可选)', doc.createElement('textarea'));
    bibTextarea.classList.add('owner-textarea');
    var htmlTextarea = createField('展示内容（HTML）', doc.createElement('textarea'));
    htmlTextarea.classList.add('owner-textarea', 'owner-textarea--large');

    var extrasTextarea = createField('额外 data-* 属性 (JSON，可选)', doc.createElement('textarea'));
    extrasTextarea.classList.add('owner-textarea');

    var formButtons = doc.createElement('div');
    formButtons.className = 'owner-pub-editor__form-actions';
    var formSaveButton = createActionButton('更新条目', 'primary');
    var formCancelButton = createActionButton('关闭编辑', 'ghost');
    formButtons.appendChild(formSaveButton);
    formButtons.appendChild(formCancelButton);
    form.appendChild(formButtons);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFormChanges();
    });

    formSaveButton.addEventListener('click', function () {
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    });

    formCancelButton.addEventListener('click', function () {
      hideForm();
    });

    addButton.addEventListener('click', function () {
      var newEntry = {
        type: '',
        year: new Date().getFullYear().toString(),
        date: '',
        plain: '',
        bib: '',
        html: '<p><strong>作者</strong>, “论文标题,” <em>期刊/会议</em>, 2025.</p>',
        extras: {}
      };
      workingEntries.push(newEntry);
      renderList();
      openForm(workingEntries.length - 1);
    });

    function renderList() {
      itemsContainer.innerHTML = '';
      if (!workingEntries.length) {
        var empty = doc.createElement('li');
        empty.className = 'owner-pub-editor__empty';
        empty.textContent = '暂无条目';
        itemsContainer.appendChild(empty);
        hideForm();
        return;
      }
      workingEntries.forEach(function (entry, index) {
        var item = doc.createElement('li');
        item.className = 'owner-pub-editor__item';
        if (index === activeIndex) {
          item.classList.add('is-active');
        }

        var summaryButton = doc.createElement('button');
        summaryButton.type = 'button';
        summaryButton.className = 'owner-pub-editor__summary';
        summaryButton.textContent = formatPublicationSummary(entry, index);
        summaryButton.addEventListener('click', function () {
          openForm(index);
        });
        item.appendChild(summaryButton);

        var actions = doc.createElement('div');
        actions.className = 'owner-pub-editor__item-actions';

        var upButton = createSmallButton('上移', 'ghost');
        upButton.disabled = index === 0;
        upButton.addEventListener('click', function () {
          moveEntry(index, index - 1);
        });
        actions.appendChild(upButton);

        var downButton = createSmallButton('下移', 'ghost');
        downButton.disabled = index === workingEntries.length - 1;
        downButton.addEventListener('click', function () {
          moveEntry(index, index + 1);
        });
        actions.appendChild(downButton);

        var deleteButton = createSmallButton('删除', 'ghost');
        deleteButton.addEventListener('click', function () {
          removeEntry(index);
        });
        actions.appendChild(deleteButton);

        item.appendChild(actions);
        itemsContainer.appendChild(item);
      });
    }

    function hideForm() {
      activeIndex = null;
      formSection.setAttribute('hidden', 'hidden');
    }

    function openForm(index) {
      activeIndex = index;
      var entry = workingEntries[index];
      formSection.removeAttribute('hidden');
      formTitle.textContent = '编辑条目 #' + (index + 1);
      errorMessage.setAttribute('hidden', 'hidden');
      typeInput.value = entry.type || '';
      yearInput.value = entry.year || '';
      dateInput.value = entry.date || '';
      plainTextarea.value = entry.plain || '';
      bibTextarea.value = entry.bib || '';
      htmlTextarea.value = entry.html || '';
      extrasTextarea.value = entry.extras ? JSON.stringify(entry.extras, null, 2) : '{}';
      renderList();
    }

    function applyFormChanges(skipMessage) {
      if (activeIndex === null) {
        return false;
      }
      errorMessage.setAttribute('hidden', 'hidden');
      var entry = workingEntries[activeIndex];
      entry.type = typeInput.value.trim();
      entry.year = yearInput.value.trim();
      entry.date = dateInput.value.trim();
      entry.plain = plainTextarea.value.trim();
      entry.bib = bibTextarea.value.trim();
      entry.html = htmlTextarea.value;
      var extrasText = extrasTextarea.value.trim();
      if (extrasText) {
        try {
          var extrasObj = extrasText ? JSON.parse(extrasText) : {};
          entry.extras = extrasObj && typeof extrasObj === 'object' ? extrasObj : {};
        } catch (error) {
          errorMessage.textContent = '额外属性不是有效的 JSON 格式。';
          errorMessage.removeAttribute('hidden');
          return false;
        }
      } else {
        entry.extras = {};
      }
      renderList();
      if (!skipMessage) {
        showToast('条目已更新（请记得保存全部修改）。');
      }
      return true;
    }

    function moveEntry(from, to) {
      if (to < 0 || to >= workingEntries.length) {
        return;
      }
      var item = workingEntries.splice(from, 1)[0];
      workingEntries.splice(to, 0, item);
      if (activeIndex === from) {
        activeIndex = to;
      } else if (activeIndex === to) {
        activeIndex = from;
      }
      renderList();
    }

    function removeEntry(index) {
      if (!win.confirm('确定要删除该条目吗？')) {
        return;
      }
      workingEntries.splice(index, 1);
      if (activeIndex === index) {
        hideForm();
      } else if (activeIndex > index) {
        activeIndex -= 1;
      }
      renderList();
    }

    renderList();

    var saveAllButton = createActionButton('保存修改', 'primary');
    var resetButton = createActionButton('恢复默认', 'ghost');
    var closeButton = createActionButton('完成', 'ghost');
    footer.appendChild(saveAllButton);
    footer.appendChild(resetButton);
    footer.appendChild(closeButton);

    saveAllButton.addEventListener('click', function () {
      if (!applyFormChanges(true)) {
        return;
      }
      var payload = {
        type: 'publication-list',
        entries: workingEntries.map(function (entry) {
          return cloneData(entry);
        })
      };
      applyDataToContainer(container, payload);
      saveContainerData(container, payload);
      modal.close();
      refreshEditButton(container);
      triggerSectionUpdated(container);
      showToast('已更新论文列表。');
    });

    resetButton.addEventListener('click', function () {
      if (!win.confirm('确定要恢复默认的论文列表吗？')) {
        return;
      }
      resetContainer(container);
      modal.close();
      showToast('已恢复默认论文列表。');
    });

    closeButton.addEventListener('click', function () {
      modal.close();
    });
  }

  function exportChanges() {
    if (!hasLocalStorage) {
      showToast('当前浏览器不支持导出。', 'error');
      return;
    }
    var sections = {};
    containers.forEach(function (container) {
      var key = container.getAttribute('data-editable-key');
      if (!key) {
        return;
      }
      var stored = win.localStorage.getItem(storageKey(key));
      if (!stored) {
        return;
      }
      try {
        sections[key] = JSON.parse(stored);
      } catch (error) {
        console.warn('Skip invalid stored data for "' + key + '"', error);
      }
    });
    var payload = {
      generatedAt: new Date().toISOString(),
      sections: sections
    };
    try {
      var json = JSON.stringify(payload, null, 2);
      var blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      var link = doc.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'owner-content-' + Date.now() + '.json';
      doc.body.appendChild(link);
      link.click();
      doc.body.removeChild(link);
      setTimeout(function () {
        URL.revokeObjectURL(link.href);
      }, 0);
      showToast('已导出当前修改。');
    } catch (error) {
      showToast('导出时出现问题。', 'error');
    }
  }

  function clearAllChanges() {
    if (!hasLocalStorage) {
      showToast('当前浏览器不支持本地存储。', 'error');
      return;
    }
    if (!win.confirm('确定要清除全部本地修改并恢复默认内容吗？')) {
      return;
    }
    containers.forEach(function (container) {
      clearContainerData(container);
      var key = container.getAttribute('data-editable-key');
      var original = originalContent[key];
      if (original) {
        applyDataToContainer(container, cloneData(original));
        triggerSectionUpdated(container);
      }
      refreshEditButton(container);
    });
    showToast('已清除全部本地修改。');
  }

  doc.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && activeModal && typeof activeModal.close === 'function') {
      activeModal.close();
    }
  });

})();

