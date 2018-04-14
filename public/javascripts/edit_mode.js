$(document).ready(function () {

    changes = {};
    editActive = false;
    $('#edit').click(function () {

        // When edit mode exit
        if (editActive) {

            // each edit form data
            $('.edit_form').each(function (index, val) {
                obj = {};
                obj['name'] = $(this).find('[name*="name"]').val()
                obj['group_name'] = $(this).find('[class*="select"] :selected').val();


                var id = $(this).prev('li')[0].classList[1];
                if ($.isNumeric(id))
                    obj['id'] = id;

                // Update
                if (obj.name !== '' && obj.group_name !== '' && obj.id !== undefined) {
                    console.log('updated');
                    $.post("/lights/update/" + obj.id, obj);
                }
                // Add new
                else if (obj.name !== '' && obj.group_name !== '') {
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

            // Change text to EDIT
            $('#edit').html("<i class='fa fa-pencil-square-o'  style='font-size: 1.5em;'></i>");

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
            $('#edit').html("<i class='fa fa-check-square-o' style='font-size: 1.5em; color:#7FFF00;'></i>");

            // add plus sign
            $('.options').append('<i id="add" style="font-size: 1.5em">+</i>');

            // add minus sign for remove
            $('.addRemove').append('<i class="fa fa-times remove" style="float: right; padding-top:3%; width: 10%;"></i>');

            // clear update timeouts
            clearTimeout(timeout1);
            clearTimeout(timeout2);

            // add classes EDIT to all li
            $('ul #sensors1 li').addClass('EDIT');
            $('ul #sensors2 li').addClass('EDIT');

            // Remove all classes EDIT click event
            $('.EDIT').off('click');

            // Create edit form
            var form = `
                <div class="edit_form" style="display: none;">
                    <form style="padding: 2% 5% 2% 5%;">
                        <i class="fa fa-times-circle-o remove" style="font-size: 3em; color: red;"></i><br>
                        Name:<br>
                        <input type="text" name="name" style="height: 100%;">
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
                var selected = $(this).next().find('.select :selected').text();
                console.log(selected);

                // OLD UPDATED METHOD FOR LIGHTS
                // if (name === '' && selected === '') {

                // }
                // else {
                //     console.log('UPDATE' + id + ' ' + name + ' ' + selected);
                //     var update = $.post("/lights/update/" + id, { name: name, group_name: selected });
                //     name = $(this).next().find('[name="name"]').val('');
                //     selected = $(this).next().find('.select').val('');
                // }

            });

            // plus sign functionality ADD new thing
            $('#add').click(function () {

                console.log("add");

                // add new row form
                var newForm = `
                <li class="addNew" style="background-color: #32CD32	;">
                    <a href="#">
                        <i class="fa fa-th-large"></i> Add new
                    </a>
                    <i class="fa fa-times"></i>
                </li>
                <div class="edit_form" style="display: true;">
                    <form style="padding: 2% 5% 2% 5%;">
                        Name:<br>
                        <input type="text" name="nameAdd" style="height: 100%;">
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
                </div>`;

                $('[data-target="#sensors1"]').before(newForm);

            });

            $('.remove').click(function () {
                var id = $(this).parent().parent().prev('li')[0].classList[1];
                $.post("/delete", {id: id});
                $(this).parent().parent().prev('li').remove();
                $(this).parent().parent().remove();
                console.log(id);
            });

        }
    })




});