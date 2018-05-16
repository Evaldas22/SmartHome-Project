$(document).ready(function () {

    changes = {};
    editActive = false;
    $('#edit').click(function () {

        // When edit mode exit
        if (editActive) {

            // each edit form data
            $('.edit_form').each(function (index, val) {
                obj = {};
                obj['name'] = $(this).find('[name*="name"]').val();
                obj['value'] = $(this).find('[name*="value"]').val();
                obj['group_name'] = $(this).find('[class*="select"] :selected').val();


                // var id = $(this).prev('li')[0].classList[1];
                console.log($(this).prev('a'));
                if($(this).prev('a')[0] !== undefined)
                    var id = $(this).prev('a')[0].classList[1];
                else
                    var id = undefined;

                // if ($.isNumeric(id))
                    obj['id'] = id;

                    console.log(obj['id'] + ' ' + id);

                // Update
                if ((obj.name !== '' || obj.group_name !== '' || obj.value !== '') && obj.id) {
                    console.log('updated');
                    $.post("/lights/update/" + obj.id, obj);
                }
                // Add new
                else if (obj.name !== '' && obj.group_name !== '' && obj.value !== '') {
                    console.log('added');
                    $.post("/addNew", obj);
                }
                // No parameters given
                else {
                    console.log("No parameters given");
                }

            });

            // Remove all edit forms
            $('.edit_form').each(function (index, val) {
                $('.addNew').remove();
                $(this).remove();
            });

            console.log("close Edit_mode")
            editActive = false;
            // Remove classes EDIT from all li
            $('ul #sensors1 li').removeClass('EDIT');
            $('ul #sensors2 li').removeClass('EDIT');

            $('.groupLights a').removeClass('EDIT'); // v2
            $('.groupSensors a').removeClass('EDIT'); // v2


            // Change text to EDIT
            $('#edit').html("<i class='fa fa-pencil-square-o'></i>");

            // Remove plus sign
            $('#add').remove();

            // Remove minus sign
            $('.remove').remove();

            // Reloud page
            location.reload();
        }
        // In edit mode
        else {
            console.log('Edit_mode');
            editActive = true;

            // change text EDIT to SAVE
            $('#edit').html("<i id='save' class='fa fa-check-square-o' style='color:#50AE54;'></i>");

            // add plus sign
            $('.options').html('<i id="add" class="fa fa-plus"></i>');
            $('.addButton').css('display', 'block'); //v2


            // add minus sign for remove
            $('.addRemove').append('<i class="fa fa-times remove" style="float: right; padding-top:3%; width: 10%;"></i>');

            // clear update timeouts
            clearTimeout(timeout1);
            clearTimeout(timeout2);

            // add classes EDIT to all li
            $('ul #sensors1 li').addClass('EDIT');
            $('ul #sensors2 li').addClass('EDIT');

            $('.groupLights a').addClass('EDIT'); // v2
            $('.groupSensors a').addClass('EDIT'); // v2


            // Remove all classes EDIT click event
            $('.EDIT').off('click');

            // Create edit form
            var form = `
                <div class="edit_form" style="display: none;">
                    <form style="padding: 2% 5% 2% 5%;">
                        <i class="fa fa-times-circle-o remove" style="font-size: 3em; color: red;"></i><br>
                        Name:<br>
                        <input type="text" name="name" style="width: 100%; height: 100%; border-radius: 5px;" placeholder="type new name...">
                        <br>
                        Value:<br>
                        <input type="text" name="value" style="height: 100%;">
                        <br>
                        Group name:<br>
                        <select class="select">
                        `
            $.getJSON("/groups", function (data) {
                var opt = `<option value=''></option>`;
                $.each(data, function (key, val) {
                    //console.log(val.group_name);
                    opt += `<option value='` + val.group_name + `'>` + val.group_name + `</option>`;
                });
                $('.select').html(opt);
            });
            `
                        </select>
                    </form>
                </div>`;

            // ADD EDIT FORM AFTER li
            $('.EDIT').after(form);


            $(".EDIT").click(function () {
                $(this).next('div .edit_form').slideToggle("slow");

                var id = $(this).children().parent()[0].classList[1];
                console.log(id);
                var name = $(this).next().find('[name="name"]').val();
                console.log(name)
                var value = $(this).next().find('[name="value"]').val();
                console.log(value)
                var selected = $(this).next().find('.select :selected').text();
                console.log(selected);

            });

            // plus sign functionality ADD new thing
            $('#add').click(function () {

                console.log("add");

                // add new row form
                var newForm = `<div class="group">
                <div class="addNew groupName" style="background-color: #53AD58;">
                    <i class="fa fa-plus-circle"></i> Add new
                </div>
                <div class="edit_form" style="display: true;">
                    <form style="padding: 2% 5% 2% 5%;">
                    <i class="fa fa-times-circle-o remove" style="font-size: 3em; color: red;"></i><br>
                        Name:<br>
                        <input type="text" name="name" style="height: 100%;">
                        <br>
                        Value:<br>
                        <input type="text" name="value" style="height: 100%;">
                        <br>
                        Group name:<br>
                        <select class="selectAdd">
                        `
                $.getJSON("/groups", function (data) {
                    var opt = `<option value=''></option>`;
                    $.each(data, function (key, val) {
                        //console.log(val.group_name);
                        opt += `<option value='` + val.group_name + `'>` + val.group_name + `</option>`;
                    });
                    $('.selectAdd').html(opt);
                });
                `
                        </select>
                    </form>
                </div></div>`;

                // add form
                $('.navHeader').after(newForm);

                $('.remove').click(function () {
                    $(this).parent().parent().parent().remove();
                    console.log($(this).parent().parent().parent());
                });
            });

            $('.remove').click(function () {
                var id = $(this).parent().parent().prev('a')[0].classList[1];
                $.post("/delete", { id: id });
                $(this).parent().parent().prev('a').remove();
                $(this).parent().parent().remove();
                console.log(id);
            });

        }
    })




});