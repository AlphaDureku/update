$('.datepicker-here').datepicker({
    language: 'en',
    inline: true
})

$.get("/book-appointment/get-schedule", function(data, status) {
    let enabledDays = []
    data.forEach(res => {
        enabledDays.push(res.date2)
    })

    renderCalendar(enabledDays);
});

const renderCalendar = (enabledDays) => {
    $('.datepicker-here').datepicker({
        dateFormat: 'yyyy/mm/dd',
        onSelect() {
            $.get("/book-appointment/get-schedule2", function(data, status) {
                $('#table').empty().not(':first').remove();
                $('#patientQueue').remove()
                $('#drop-down').children().not(':first').remove();
                data.forEach(res => {
                    if ($('#date').val() == res.date2) {
                        $('#table').append(`
                        <tr>
                        <td>${res.date}</td>
                        <td>${res.day}</td>
                        <td>${res.start} - ${res.end}</td>
                        </tr>`)
                        $('#main_table').append(`<div id="patientQueue">Hi Mark! You will be number <b>${res.current}</></b> in Queue.<br><br><br>We wil be waiting for you in the hospital at <b>${res.date}<br>Friday ${res.start} to ${res.end}.</b></div>`)
                        $('#drop-down').append(`<option value="${res.doctor_schedule_ID}" selected>${res.date} ${res.day} ${res.start}</option>`)
                    }
                })
            });
        },

        onRenderCell: function onRenderCell(date, cellType) {
            if (cellType == 'day') {
                var day = (date.getFullYear() + '-' + (('0' + (date.getMonth() + 1)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2)));
                var isDisabled = enabledDays.indexOf(day) == -1;
                return {
                    disabled: isDisabled
                }
            }
        }
    })

}