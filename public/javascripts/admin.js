document.addEventListener('DOMContentLoaded', function() {
    $('#myTable').DataTable({
        buttons: [
            'copy', 'excel', 'pdf','csv','print'
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' // Para español
        },
        responsive: true,
        order: [[0, 'desc']], // Ordenar por la primera columna
        dom: 'frtip'
    });
    let table = new DataTable('#myTable');
 
    new DataTable.Buttons(table, {
        buttons: [
            'copy', 'excel', 'pdf','csv','print'
        ]})
    table.buttons().container()
    .appendTo( '#toolbar' );

    });

