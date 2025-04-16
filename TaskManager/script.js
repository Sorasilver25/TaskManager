$(document).ready(function () {

  let taskList = [];
  let chartInstance = {};

  function addTask(task) {
    const {id, name, category, tags, status, mask } = task;

    taskList.push(task);
    updateTaskStats();

    const tr = $(`<tr data-category="${category}" data-status="${status}" data-id="${id}" data-mask="${mask}">
      <td class="truncate" title="${name}">${name}</td>
      <td>${category}</td>
      <td class="truncate" title="${tags.join(", ")}">${tags.join(", ")}</td>
      <td>${status ? 'Terminée' : 'En cours'}</td>
      <td class="btnActions">
      <button class=${status ?"task-to-validate" : "task-validation"} data-title="${status ? 'Marquer comme en cours' : 'Marquer comme terminé'}">
        ${status ? 
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
          <path fill="currentColor" d="M27.38 28h-6.762L24 21.236ZM24 18a1 1 0 0 0-.895.553l-5 10A1 1 0 0 0 19 30h10a1 1 0 0 0 .921-1.39l-5.026-10.057A1 1 0 0 0 24 18"/>
          <path fill="currentColor" d="M18.746 22.8A9.999 9.999 0 1 1 14 4v10l6.097 6.097l1.22-2.44A2.99 2.99 0 0 1 24 16h1.82A11.993 11.993 0 1 0 14 26a12 12 0 0 0 3.394-.497Z"/>
        </svg>`
        : 
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#fff">
              <path d="M14.98 7.016s.5.5 1 1.5c0 0 1.589-2.5 3-3M9.995 2.021c-2.499-.105-4.429.182-4.429.182c-1.219.088-3.555.77-3.555 4.762c0 3.956-.025 8.834 0 10.779c0 1.188.736 3.96 3.282 4.108c3.095.18 8.67.219 11.228 0c.684-.039 2.964-.576 3.252-3.056c.299-2.57.24-4.355.24-4.78" />
              <path d="M22 7.016c0 2.761-2.24 5-5.005 5a5 5 0 0 1-5.005-5c0-2.762 2.241-5 5.005-5a5 5 0 0 1 5.005 5m-15.02 6h4m-4 4h8" />
            </g>
          </svg>`}
        </button>
        <button class="edit-task" data-title="Modifier">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
            <path fill="#fff" d="M224 160a64 64 0 0 0-64 64v576a64 64 0 0 0 64 64h576a64 64 0 0 0 64-64V224a64 64 0 0 0-64-64zm0-64h576a128 128 0 0 1 128 128v576a128 128 0 0 1-128 128H224A128 128 0 0 1 96 800V224A128 128 0 0 1 224 96" />
            <path fill="#fff" d="M384 416a64 64 0 1 0 0-128a64 64 0 0 0 0 128m0 64a128 128 0 1 1 0-256a128 128 0 0 1 0 256" />
            <path fill="#fff" d="M480 320h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32m160 416a64 64 0 1 0 0-128a64 64 0 0 0 0 128m0 64a128 128 0 1 1 0-256a128 128 0 0 1 0 256" />
            <path fill="#fff" d="M288 640h256q32 0 32 32t-32 32H288q-32 0-32-32t32-32" />
          </svg>
        </button>
        <button class="delete-task" data-title="Supprimer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#fff" fill-rule="evenodd" d="M9.774 5L3.758 3.94l.174-.986a.5.5 0 0 1 .58-.405L18.411 5h.088h-.087l1.855.327a.5.5 0 0 1 .406.58l-.174.984l-2.09-.368l-.8 13.594A2 2 0 0 1 15.615 22H8.386a2 2 0 0 1-1.997-1.883L5.59 6.5h12.69zH5.5zM9 9l.5 9H11l-.4-9zm4.5 0l-.5 9h1.5l.5-9zm-2.646-7.871l3.94.694a.5.5 0 0 1 .405.58l-.174.984l-4.924-.868l.174-.985a.5.5 0 0 1 .58-.405z" />
          </svg>
        </button>
        <button class="task-mask" data-title="Masquer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <path fill="#fff" d="M12.49 9.94A2.5 2.5 0 0 0 10 7.5z" />
            <path fill="#fff" d="M8.2 5.9a4.4 4.4 0 0 1 1.8-.4a4.5 4.5 0 0 1 4.5 4.5a4.3 4.3 0 0 1-.29 1.55L17 14.14A14 14 0 0 0 20 10s-3-7-10-7a9.6 9.6 0 0 0-4 .85zM2 2L1 3l2.55 2.4A13.9 13.9 0 0 0 0 10s3 7 10 7a9.7 9.7 0 0 0 4.64-1.16L18 19l1-1zm8 12.5A4.5 4.5 0 0 1 5.5 10a4.45 4.45 0 0 1 .6-2.2l1.53 1.44a2.5 2.5 0 0 0-.13.76a2.49 2.49 0 0 0 3.41 2.32l1.54 1.45a4.47 4.47 0 0 1-2.45.73" />
          </svg>
        </button>
      </td>
    </tr>`);

    tr.find('.task-validation').on('click', function () {
      let dataId = $(this).closest('tr').data('id');
      taskDone(dataId);
    })

    tr.find('.task-to-validate').on('click', function () {
      let dataId = $(this).closest('tr').data('id');
      taskDone(dataId);
    })

    tr.find('.delete-task').on('click', function () {
      tr.remove();
      taskList = taskList.filter(t => t.id !== id);
      updateTaskStats();
    });

    tr.find('.edit-task').on('click', function () {
      $('#task-name').val(name);
      $('#task-tags').val(tags.join(', '));
      $('#task-category').val(category);
      $(this).closest('tr').addClass('edited')
      $('#add-task').find('svg').addClass('cache')
      $('#add-task').contents().first().replaceWith('Éditer');
      $('#add-task').addClass('edit');

      updateTaskStats();
    });
    
    tr.find('.task-mask').on('click', function () {
      $(this).closest('tr').addClass('cache');
      const dataId = $(this).closest('tr').data('id');
      onTaskMask(dataId)
    })

    $('.displayTask').off('click').on('click',function() {
      displayAllTask()
      $(this).addClass('disabled')
    });

    $('#task-table tbody').append(tr);
  }

  function updateTable() {
    $('#task-table tbody').empty();
  
    taskList.forEach(task => {
      const { id, name, category, tags, status, mask } = task;
      const tr = $(`<tr data-category="${category}" data-status="${status}" data-id="${id}" data-mask="${mask}">
        <td class="truncate" title="${name}">${name}</td>
        <td>${category}</td>
        <td class="truncate" title="${tags.join(", ")}">${tags.join(", ")}</td>
        <td>${status ? 'Terminée' : 'En cours'}</td>
        <td class="btnActions">
        <button class=${status ?"task-to-validate" : "task-validation"} data-title="${status ? 'Marquer comme en cours' : 'Marquer comme terminé'}">
            ${status ? 
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
              <path fill="currentColor" d="M27.38 28h-6.762L24 21.236ZM24 18a1 1 0 0 0-.895.553l-5 10A1 1 0 0 0 19 30h10a1 1 0 0 0 .921-1.39l-5.026-10.057A1 1 0 0 0 24 18"/>
              <path fill="currentColor" d="M18.746 22.8A9.999 9.999 0 1 1 14 4v10l6.097 6.097l1.22-2.44A2.99 2.99 0 0 1 24 16h1.82A11.993 11.993 0 1 0 14 26a12 12 0 0 0 3.394-.497Z"/>
            </svg>`
            : 
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#fff">
                  <path d="M14.98 7.016s.5.5 1 1.5c0 0 1.589-2.5 3-3M9.995 2.021c-2.499-.105-4.429.182-4.429.182c-1.219.088-3.555.77-3.555 4.762c0 3.956-.025 8.834 0 10.779c0 1.188.736 3.96 3.282 4.108c3.095.18 8.67.219 11.228 0c.684-.039 2.964-.576 3.252-3.056c.299-2.57.24-4.355.24-4.78" />
                  <path d="M22 7.016c0 2.761-2.24 5-5.005 5a5 5 0 0 1-5.005-5c0-2.762 2.241-5 5.005-5a5 5 0 0 1 5.005 5m-15.02 6h4m-4 4h8" />
                </g>
              </svg>`}
          </button>
          <button class="edit-task" data-title="Modifier">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
              <path fill="#fff" d="M224 160a64 64 0 0 0-64 64v576a64 64 0 0 0 64 64h576a64 64 0 0 0 64-64V224a64 64 0 0 0-64-64zm0-64h576a128 128 0 0 1 128 128v576a128 128 0 0 1-128 128H224A128 128 0 0 1 96 800V224A128 128 0 0 1 224 96" />
              <path fill="#fff" d="M384 416a64 64 0 1 0 0-128a64 64 0 0 0 0 128m0 64a128 128 0 1 1 0-256a128 128 0 0 1 0 256" />
              <path fill="#fff" d="M480 320h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32m160 416a64 64 0 1 0 0-128a64 64 0 0 0 0 128m0 64a128 128 0 1 1 0-256a128 128 0 0 1 0 256" />
              <path fill="#fff" d="M288 640h256q32 0 32 32t-32 32H288q-32 0-32-32t32-32" />
            </svg>
          </button>
          <button class="delete-task" data-title="Supprimer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#fff" fill-rule="evenodd" d="M9.774 5L3.758 3.94l.174-.986a.5.5 0 0 1 .58-.405L18.411 5h.088h-.087l1.855.327a.5.5 0 0 1 .406.58l-.174.984l-2.09-.368l-.8 13.594A2 2 0 0 1 15.615 22H8.386a2 2 0 0 1-1.997-1.883L5.59 6.5h12.69zH5.5zM9 9l.5 9H11l-.4-9zm4.5 0l-.5 9h1.5l.5-9zm-2.646-7.871l3.94.694a.5.5 0 0 1 .405.58l-.174.984l-4.924-.868l.174-.985a.5.5 0 0 1 .58-.405z" />
            </svg>
          </button>
          <button class="task-mask" data-title="Masquer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <path fill="#fff" d="M12.49 9.94A2.5 2.5 0 0 0 10 7.5z" />
              <path fill="#fff" d="M8.2 5.9a4.4 4.4 0 0 1 1.8-.4a4.5 4.5 0 0 1 4.5 4.5a4.3 4.3 0 0 1-.29 1.55L17 14.14A14 14 0 0 0 20 10s-3-7-10-7a9.6 9.6 0 0 0-4 .85zM2 2L1 3l2.55 2.4A13.9 13.9 0 0 0 0 10s3 7 10 7a9.7 9.7 0 0 0 4.64-1.16L18 19l1-1zm8 12.5A4.5 4.5 0 0 1 5.5 10a4.45 4.45 0 0 1 .6-2.2l1.53 1.44a2.5 2.5 0 0 0-.13.76a2.49 2.49 0 0 0 3.41 2.32l1.54 1.45a4.47 4.47 0 0 1-2.45.73" />
            </svg>
          </button>
        </td>
      </tr>`);

      tr.find('.task-validation').on('click', function () {
        let dataId = $(this).closest('tr').data('id');
        taskDone(dataId);
      })
  
      tr.find('.task-to-validate').on('click', function () {
        let dataId = $(this).closest('tr').data('id');
        taskDone(dataId);
      })
  
      tr.find('.delete-task').on('click', function () {
        tr.remove();
        taskList = taskList.filter(t => t.id !== id);
        updateTaskStats();
      });
  
      tr.find('.edit-task').on('click', function () {
        $('#task-name').val(name);
        $('#task-tags').val(tags.join(', '));
        $('#task-category').val(category);
        $(this).closest('tr').addClass('edited')
        $('#add-task').find('svg').addClass('cache')
        $('#add-task').contents().first().replaceWith('Éditer');
        $('#add-task').addClass('edit');
      });
      
      tr.find('.task-mask').on('click', function () {
        $(this).closest('tr').addClass('cache');
        const dataId = $(this).closest('tr').data('id');
        onTaskMask(dataId)
      })
  
      $('.displayTask').off('click').on('click',function() {
        displayAllTask()
        $(this).addClass('disabled')
      });
      
      $('#task-table tbody').append(tr);
    });
  }

  function updateTaskStats() {
    const total = taskList.length;
    const completed = taskList.filter(task => task.status).length;
    const isHiddenTask = taskList.filter(task => task.mask).length;

    const inProgress = total - completed;

    const categoryStats = {
      'Travail': taskList.filter(t => t.category === 'Travail').length,
      'Ecole': taskList.filter(t => t.category === 'Ecole').length,
      'Personnel': taskList.filter(t => t.category === 'Personnel').length,
      'Autre': taskList.filter(t => t.category === 'Autre').length,
    };

    if(isHiddenTask && $('.displayTask').hasClass('disabled')){
        $('.displayTask').removeClass('disabled');
    }

    $('#task-count').text(`Tâches totales : ${total}`);
    $('#completed-count').text(`Tâches terminées : ${completed}`);
    $('#in-progress-count').text(`Tâches en cours : ${inProgress}`);
    $('#work-count').text(`Travail : ${categoryStats['Travail']}`);
    $('#school-count').text(`Ecole : ${categoryStats['Ecole']}`);
    $('#personal-count').text(`Personnel : ${categoryStats['Personnel']}`);
    $('#other-count').text(`Autre : ${categoryStats['Autre']}`);

    updatePieChart('task-stats-chart', ['Terminée', 'En cours'], [completed, inProgress]);
    updatePieChart('category-stats-chart', Object.keys(categoryStats), Object.values(categoryStats));
  }

  function taskDone(id){
    const TaskUpdated = taskList.filter(task => task.id === id);
    TaskUpdated[0].status = !TaskUpdated[0].status;

    const taskIndex = taskList.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      taskList[taskIndex] = TaskUpdated[0];
    }

    updateTable()
    updateTaskStats()
  }

  function updateTask(id){
    const TaskUpdated = taskList.filter(task => task.id === id);
    const name = $('#task-name').val().trim();
    const tags = $('#task-tags').val().trim().split(',').map(tag => tag.trim());
    const category = $('#task-category').val();
    TaskUpdated[0].name = name;
    TaskUpdated[0].category = category;
    TaskUpdated[0].tags = tags;

    const taskIndex = taskList.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      taskList[taskIndex] = TaskUpdated[0];
    }

    updateTable()
    $('#add-task').removeClass('edit')
    $('#add-task').find('svg').removeClass('cache')
    $('#add-task').contents().first().replaceWith('Ajouter');
    updateTaskStats()
  }

  function onTaskMask(id){
    const TaskUpdated = taskList.filter(task => task.id === id);
    TaskUpdated[0].mask = !TaskUpdated[0].mask;

    const taskIndex = taskList.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      taskList[taskIndex] = TaskUpdated[0];
    }

    if( $('.displayTask').hasClass('disabled')){
      $('.displayTask').removeClass('disabled')
    }

    updateTable()
  }

  function displayAllTask() {
    taskList.forEach(task => {
      task.mask = false;
    });

    updateTable()
  }

  function updatePieChart(chartId, labels, data) {
    const ctx = document.getElementById(chartId).getContext('2d');
    if (chartInstance[chartId]) {
      chartInstance[chartId].data.labels = labels;
      chartInstance[chartId].data.datasets[0].data = data;
      chartInstance[chartId].update();
    } else {
      chartInstance[chartId] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#28a745', '#ffcc00', '#007bff', '#dc3545'],
          borderWidth: 0
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'left',
            labels: {
              color: 'white',
              padding: 20
            }
          }
        }
      }
    });
    }
  }

  $('#add-task').on('click', function () {
    const id = `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const name = $('#task-name').val().trim();
    const tags = $('#task-tags').val().trim().split(',').map(tag => tag.trim());
    const category = $('#task-category').val();

    if (name) {
      if($('#add-task').hasClass('edit')){
        console.log($(this).closest('tr').data('id'))
        const dataId = $('tr.edited').data('id');
        updateTask(dataId)
      }
      else{
        addTask({id, name, category, tags, status: false, mask: false });
      }

      $('#task-name').val('');
      $('#task-tags').val('');
    }
  });

  $('#export-data').on('click', function () {
    const jsonData = JSON.stringify(taskList, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = $('<a>')
      .attr('href', url)
      .attr('download', 'tasks.json')
      .appendTo('body');

    a[0].click();
    a.remove();
  });

  $('#import-file').on('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = JSON.parse(e.target.result);
      $('#task-table tbody').empty();
      taskList = [];
      data.forEach(task => addTask(task));
    };
    reader.readAsText(file);
  });
});
