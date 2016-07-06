$(document).ready(function () {
    var currentDraggedElement;
    var currentClone;
    var currentBase;


    $('#closeBtn').click(function () {
        $('#closeBtn').hide();
        $('#categories').show();
        //$('#blocks .owl-wrapper-outer').html('');
        $('#blocks').data('owlCarousel').destroy();
        $('#blocks').css({'margin-top': '-130px', 'z-index': '0'});
    });

    $("#categories").owlCarousel({
        items: 7,
        navigation: true,
        pagination: false,
        navigationText: ['<i aria-hidden="true" class="fa fa-chevron-circle-left"></i>', '<i aria-hidden="true" class="fa fa-chevron-circle-right"></i>'],
        autoWidth: false
    });


    $('#reset').click(function () {
        location.reload();
    });
    console.log($s$);


    $(init);

    function init() {

        var blocks = {
            "Compliance Tracking": ["Compliance-Tracking.png", "Contract-Setup.png", "Reporting.png", "MC-Track.png"],
            "Medical Analytics": ["MedicaidAnalytics.svg", "OperationalDataStore.svg", "ContractSetup.svg"]
        };


        var startPos, cloneFlag = [];

        $('.mobule-box').click(function () {
            $("#categories").hide();
            $("#closeBtn").show();

            $('#blocks').html('');


            var category = $(this).attr('data-target');
            if (category) {

                $.each(blocks[category], function (index, element) {
                    $('#blocks').append('<div class="item" style="z-index: 1000;"><img class="level-' + index + ' draggable drag-drop" src = "assets/img/SVG/' + element + '" data-target    ="' + element + '"></div>');
                });

                $('#blocks').css({'margin-top': '0px', 'z-index': '1000'});
                $("#blocks").owlCarousel({
                    items: 5,
                    itemsDesktop: [1199, 4],
                    itemsDesktopSmall: [979, 3]
                });


                interact('#basePlatform img').dropzone({
                    overlap: 'center',
                    ondrop: function (event) {
                        event.relatedTarget.classList.add('dropped');
                        event.relatedTarget.textContent = 'Dropped';
                    }
                })
                    .on('dragenter', dragEnterListener)
                    .on('dragleave', dragLeaveListener);

                var x = $('[class^="level-"]');

                for (var i = 0; i < x.length; i++) {
                    cloneFlag[i] = false;

                    interact(x[i]).draggable({
                        inertia: true,
                        autoScroll: true,
                        snap: {
                            target: [startPos],
                            range: Infinity,
                            relativePoints: [{x: 0.5, y: 0.5}],
                            endOnly: true
                        },
                        onmove: dragMoveListener,

                    })
                        .on('move', function (event) {
                            var interaction = event.interaction;

                            // if the pointer was moved while being held down
                            // and an interaction hasn't started yet

                            if (interaction.pointerIsDown && !interaction.interacting() && !cloneFlag[i]) {
                                var original = event.currentTarget;
                                cloneFlag[i] = true;
                                // create a clone of the currentTarget element
                                clone = event.currentTarget.cloneNode(true);

                                // insert the clone to the page
                                $('#blocks').append(clone);

                                var position = $(original).position();
                                $(clone).css({
                                    'position': 'absolute',
                                    'left': position.left,
                                    'top': position.top,
                                    'bottom': position.bottom
                                });


                                currentDraggedElement = original;
                                currentClone = clone;
                                // start a drag interaction targeting the clone
                                interaction.start({name: 'drag'},
                                    event.interactable,
                                    clone);
                            }
                        })
                        .on('dragstart', function (event) {
                            var rect = interact.getElementRect(event.target);
                            // record center point when starting the very first a drag
                            startPos = {
                                x: rect.left + rect.width / 2,
                                y: rect.top + rect.height / 2
                            };

                            // snap to the start position
                            event.interactable.draggable({
                                snap: {
                                    targets: [startPos]
                                }
                            });
                        });
                }
            } else {
                $('#blocks').html('');
            }
        });


        function dragEnterListener(event) {

            var dropRect = interact.getElementRect(event.target),
                element = event.relatedTarget,
                elementRect = interact.getElementRect(element);
            if (!currentBase) {
                currentBase = elementRect;
            }

            var level = parseInt(element.classList[0].substring(6));
            var offsetX = (level == 0) ? elementRect.width / 2 : elementRect.width - 30;
            var offsetY = (level == 0 ) ? ( 1.25 * elementRect.height ) : currentBase.height * 0.35 * (level + 1) + elementRect.height + 8;
            dropCenter = {
                x: dropRect.right - offsetX,
                y: dropRect.top + dropRect.height / 2 - offsetY
            }
            ;

            var temp = $('#blocks').children('.dropped').length;
            var level = parseInt(event.relatedTarget.classList[0].substring(6));
            if ($(event.draggable._element).hasClass('level-0') || temp == level) {

                $(currentDraggedElement).parents('.owl-item').remove();

                event.draggable.draggable({
                    snap: {
                        targets: [dropCenter]
                    }
                });

                cloneFlag = [];
            } else {
                console.log("2");
                $(currentClone).remove();
                //event.draggable.snap(false);
                event.draggable.draggable({
                    snap: {
                        targets: [startPos]
                    }
                });

            }
        }

        function dragLeaveListener(event) {
            event.draggable.draggable({
                snap: {
                    targets: [startPos]
                }
            });
        }

        function dragMoveListener(event) {
            var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

        // this is used later in the resizing and gesture demos
        window.dragMoveListener = dragMoveListener;

    }


});
