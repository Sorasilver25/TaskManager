$(document).ready(function () {
  // Initialisation des champs

  let taskList = [];
  let chartInstance = {};

  // Fonction pour ajouter une tâche
  function addTask(task) {
    const { name, category, tags, status } = task;

    // Ajouter dans la liste des tâches
    taskList.push(task);
    updateTaskStats();

    // Mettre à jour le tableau
    const tr = $(`<tr data-category="${category}" data-status="${status}">
      <td class="truncate" data-title="${name}">${name}</td>
      <td>${category}</td>
      <td class="truncate" data-title="${tags.join(", ")}">${tags.join(", ")}</td>
      <td>${status ? 'Terminée' : 'En cours'}</td>
      <td class="btnActions">
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

    // Actions : modifier et supprimer
    tr.find('.delete-task').on('click', function () {
      tr.remove();
      taskList = taskList.filter(t => t.name !== name);
      updateTaskStats();
    });

    tr.find('.edit-task').on('click', function () {
      $('#task-name').val(name);
      $('#task-tags').val(tags.join(', '));
      $('#task-category').val(category);
      taskList = taskList.filter(t => t.name !== name); // Supprimer avant réajout
      tr.remove();
      updateTaskStats();
    });
    
    tr.find('.task-mask').on('click', function () {
      $(this).closest('tr').addClass('cache');
      if($(this).closest('tr').hasClass('cache') && $('.displayTask').hasClass('disabled')){
        $('.displayTask').removeClass('disabled');
      }
    })

    $('.displayTask').off('click').on('click',function() {
      $('tr').removeClass('cache');
      $(this).addClass('disabled')
    });

    $('#task-table tbody').append(tr);
  }

  // Statistiques des tâches
  function updateTaskStats() {
    const total = taskList.length;
    const completed = taskList.filter(task => task.status).length;
    const inProgress = total - completed;

    const categoryStats = {
      'Travail': taskList.filter(t => t.category === 'Travail').length,
      'Ecole': taskList.filter(t => t.category === 'Ecole').length,
      'Personnel': taskList.filter(t => t.category === 'Personnel').length,
      'Autre': taskList.filter(t => t.category === 'Autre').length,
    };

    // Mettre à jour les statistiques textuelles
    $('#task-count').text(`Tâches totales : ${total}`);
    $('#completed-count').text(`Tâches terminées : ${completed}`);
    $('#in-progress-count').text(`Tâches en cours : ${inProgress}`);
    $('#work-count').text(`Travail : ${categoryStats['Travail']}`);
    $('#school-count').text(`Ecole : ${categoryStats['Ecole']}`);
    $('#personal-count').text(`Personnel : ${categoryStats['Personnel']}`);
    $('#other-count').text(`Autre : ${categoryStats['Autre']}`);

    // Mettre à jour les graphiques
    updatePieChart('task-stats-chart', ['Terminée', 'En cours'], [completed, inProgress]);
    updatePieChart('category-stats-chart', Object.keys(categoryStats), Object.values(categoryStats));
  }

  // Mettre à jour le graphique en camembert
  function updatePieChart(chartId, labels, data) {
    const ctx = document.getElementById(chartId).getContext('2d');
    if (chartInstance[chartId]) {
      chartInstance[chartId].data.labels = labels; // Met à jour les étiquettes
      chartInstance[chartId].data.datasets[0].data = data; // Met à jour les données
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
        //   tooltip: {
        //     callbacks: {
        //       label: function (tooltipItem) {
        //         const value = tooltipItem.raw;
        //         return `Tâches : ${value} (${((value / totalCount) * 100).toFixed(2)}%)`;
        //       }
        //     }
        //   },
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

  // Ajouter une tâche depuis le formulaire
  $('#add-task').on('click', function () {
    const name = $('#task-name').val().trim();
    const tags = $('#task-tags').val().trim().split(',').map(tag => tag.trim());
    const category = $('#task-category').val();

    if (name) {
      addTask({ name, category, tags, status: false });
      $('#task-name').val('');
      $('#task-tags').val('');
    }
  });

  // // Afficher le tableau de bord
  // $('#dashboard-section').off('click').on('click', function () {
  //   $('#add-task-form').addClass('hidden');
  //   $('.stats').removeClass('hidden');
  //   $('#add-task-section').removeClass('disabled');
  //   $(this).addClass('disabled');
  // });

  // // Afficher le formulaire d'ajout de tâche
  // $('#add-task-section').on('click', function () {
  //   $('#add-task-form').removeClass('hidden');
  //   $('.stats').addClass('hidden');
  //   $('#dashboard-section').removeClass('disabled');
  //   $(this).addClass('disabled');
  // });

  // Exporter les données en JSON
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

  // Importer les données JSON
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
