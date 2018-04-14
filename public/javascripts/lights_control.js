$(document).ready(function () {

    intervalTime = 10000;
    // Call functions
    getLights();
    getSensors();
    
    // ***********************LIGHTS*******************************
    function getLights() {
        // get lights list and display if ON
        $.getJSON("/lights", function (data) {
            var li = ``;
            $( "[class*='light']" ).off( "click" );
            $.each(data, function (key, val) {

                var activeLight = '';

                if (val.value === "ON") {
                    activeLight = ' activeLight';
                    $("[class*='" + val.name + "']").addClass("activeLight");
                }

                li += `
                <li class="lights`+ val.name + ` ` + val.id + activeLight + `">
                    <a href="#">
                        <i class="fa fa-lightbulb-o"></i>`+ val.name + `
                    </a>
                </li>
            `;
            })

            $('ul #sensors1').html(li);

        }).always(function () {
            // LIGHTS CONTROL
            //console.log('Lights response: ');
            $("[class*='lights']").click(function () {
                if (!$(this).hasClass("activeLight")) {
                    $(this).addClass("activeLight");
                    $('.' + this.classList[0]).addClass("activeLight");
                    console.log(this.classList[0] + " ON");
                    var update_on = $.post("/lights/update", { id: this.classList[1] });
                }
                else {
                    $(this).removeClass("activeLight");
                    $('.' + this.classList[0]).removeClass("activeLight");
                    console.log(this.classList[0] + " OFF");
                    var update_off = $.post("/lights/update", { id: this.classList[1] });
                }
            });


            timeout1 = setTimeout(getLights, intervalTime);
            // console.log(timeout1);
        });

        
    }

    // ***********************SENSORS*******************************
    function getSensors() {
        $.getJSON("/sensors", function (data) {
            var li = ``;
            $.each(data, function (key, val) {
                li += `
                <li class="sensors`+ val.name + ` ` + val.id +`">
                    <a href="#">
                        <i class="fa fa-rss"></i>`+ val.name + `: ` + val.value + `</a>
                </li>
            `;
            })
            $('ul #sensors2').html(li);
        }).always(function () {
            timeout2 = setTimeout(getSensors, intervalTime);
            // console.log(timeout2);
        });
    }

});