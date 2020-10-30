// global vars
local_ip = '192.168.31.80';
global_ip = '85.143.113.155';
ip = global_ip;

//var SortingAlgoList = ['Bubble Sort', 'Shaker Sort', 'Insertion Sort', 'Selection Sort', 'QuickSort', 'ShellSort'];
var SortingAlgoList = ['Сортировка пузырьком', 'Шейкерная сортировка', 'Сортировка вставками', 'Сортировка выбором', 'Быстрая сортировка', 'Сортировка Шелла']
var SortingAlgoID = null;
var SequenceLength = 50;
var Sequence = [];
var nList = [];

// init popovers
$(document).ready(function(){
    //Инициализация всплывающей панели для
    //элементов веб-страницы, имеющих атрибут
    //data-toggle="popover"
    $('[data-toggle="popover-left"]').popover({
      //Установление направления отображения popover
      placement : 'left',
      trigger: "hover"
    });
    $('#navbarDropdownMenuLink').popover();
    //$("#popover-left").popover({ trigger: "hover" });
});

//-------------------------------------------------------

// UI functions
jQuery(function(){
    jQuery("#ChartTNBOX").hide();
    jQuery("#ChartTNLogBOX").hide();

    makeBarPlot('random');

    // btns
    jQuery("#Sort").click(function(){
        this.blur();
        Sort();
    });
    jQuery("#Compare").click(function(){
        this.blur();
        CompareSort();
    });
    jQuery('#randomSequence').click(function(){
        this.blur();
        makeBarPlot('random');
    });

    jQuery('#swapSequence').click(function(){
        this.blur();
        Sequence = shuffle(Sequence);
        plotBarPlot();
    });
    
    jQuery('#saveSequence').click(function(){
        Sequence = $('#inputSequenceForm').val().split(' ').map(Number);
        SequenceLength = Sequence.length;
        $('#SequenceLength').val(SequenceLength);
        plotBarPlot();
        $('#inputSequenceForm').val('');
    });

    $(document).on('change', '#SequenceLength', function() {
        SequenceLength = parseInt(this.value);
        makeBarPlot('random');
    });

    $(document).on('click', '.choiceSortingAlgo', function(){
        document.getElementById('btnGroupDropchoiceSortingAlgo').innerHTML = this.innerHTML;
        SortingAlgoID = this.id;
    });
});

function workingSpinnerSort(state) {
    if (state){
        //add alert
        //var success_alert_html = jQuery('<div id="success_alert" class="alert alert-warning text_center m10" role="alert">ОБРАБОТКА</div>');
        //jQuery(".code").prepend(success_alert_html);
        //add spinner to button
        var spinner_html = '<div class="spinner-border text-light" role="status"><span class="sr-only" style="font-size: 100vw">Loading...</span></div>';
        jQuery("#Sort").text("");
        jQuery("#Sort").append(spinner_html);
    } else{
        //jQuery("#success_alert").delay(500).fadeOut(100);
        jQuery("#Sort").empty();
        jQuery("#Sort").text("Отсортировать");
    }
}

function successAlertSort(time) {
    //add alert
    // style="text-align:start; vertical-align: center; height: 2.35em;"
    jQuery("#success_alert").remove();
    var success_alert_html = jQuery('<div id="success_alert" class="text-white mx-3 mt-2"><h6>выполнено за ' + time + ' мс</h6></div>');
    jQuery("#btnGroupSort").append(success_alert_html);
    jQuery("#success_alert").delay(3000).fadeOut(500);
    setTimeout(function() {
        jQuery("#success_alert").remove();
    }, 3500);
}

function workingSpinnerCompareSort(state) {
    if (state){
        //add spinner to button
        var spinner_html = '<div class="spinner-border text-primary" role="status"><span class="sr-only" style="font-size: 100vw">Loading...</span></div>';
        jQuery("#Compare").text("");
        jQuery("#Compare").append(spinner_html);
    } else{
        //jQuery("#success_alert").delay(500).fadeOut(100);
        jQuery("#Compare").empty();
        jQuery("#Compare").text("Построить графики");
    }
}

// Plot functions
function makeBarPlot(type){
    if (type = 'random'){
        Sequence = randomFloatArray(SequenceLength, 10);
        plotBarPlot();
    }
}

function plotBarPlot(){
    var data = [
        {
          //x: [0, 1, 2],
          y: Sequence,
          type: 'bar',
          marker: {
            color: 'rgba(8,200,225,.5)',
            line: {
              color: 'rgb(0,0,0)',/*'rgb(8,48,107)',*/
              width: 1.5
            }
          }
        }
    ];
      
    Plotly.newPlot('BarChart', data);
}

function makePlotT(nSeries, tSeries){
    
    traces = []
    
    for (var i = 0; i < SortingAlgoList.length; i++) {
        id = SortingAlgoList[i];
        traces.push({
            x: nSeries,
            y: tSeries[i],
            name: id,
            line: {shape: 'spline'}
        });
    }
    var config = {responsive: true}
    Plotly.newPlot('ChartTN', traces, {
        displayModeBar: true,
        config,
        legend: {
            x: 0,
            y: 1,
            traceorder: 'normal',
            /*
            font: {
              family: 'sans-serif',
              size: 12,
              color: '#000'
            },*/
            bgcolor: 'rgba(0,0,0,0)',
            //bordercolor: '#FFFFFF',
            //borderwidth: 2
        },
        margin: {
            l: 75,
            r: 25,
            b: 50,
            t: 25,
            pad: 2},
        xaxis: {
            title: {
                text: 'число элементов массива',
                font: {
                //family: 'Courier New, monospace',
                //size: 24,
                //color: '#7f7f7f'
                }
            },
        },
        yaxis: {
            title: {
                text: 'время, мс',
                font: {
                //family: 'Courier New, monospace',
                //size: 24,
                //color: '#7f7f7f'
                }
            }
        }
        });
    Plotly.newPlot('ChartTNLog', traces, {
        displayModeBar: true,
        config,

        /*xaxis: {
            type: 'log',
            autorange: true
        },*/
        xaxis: {
            title: {
                text: 'число элементов массива',
                font: {
                //family: 'Courier New, monospace',
                //size: 24,
                //color: '#7f7f7f'
                }
            },
        },
        yaxis: {
            title: {
                text: 'время, мс',
                font: {
                //family: 'Courier New, monospace',
                //size: 24,
                //color: '#7f7f7f'
                }
            },
            type: 'log',
            autorange: true
            },
        legend: {
            x: 0,
            y: 1,
            traceorder: 'normal',
            /*
            font: {
              family: 'sans-serif',
              size: 12,
              color: '#000'
            },*/
            bgcolor: 'rgba(0,0,0,0)',
            //bordercolor: '#FFFFFF',
            //borderwidth: 2
        },
        margin: {
            l: 75,
            r: 25,
            b: 50,
            t: 25,
            pad: 2}
        });
}

// Utility functions
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
  
function removeItemAll(arr, value) {
var i = 0;
while (i < arr.length) {
    if (arr[i] === value) {
    arr.splice(i, 1);
    } else {
    ++i;
    }
}
return arr;
}

function randomIntArray(length, delta) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * 2 * delta - delta);
    });
}

function randomFloatArray(length, delta) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.random() * 2 * delta - delta;
    });
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
}

// Calc functions

function Sort(){

    if (SortingAlgoID == null){
        alert('Выберите алгоритм сортировки')
    } else {
        workingSpinnerSort(true);
        // request data from server
        data = {
            'requestType': 0,
            'N': SequenceLength,
            'SortingAlgo': SortingAlgoID,
            'Sequence': Sequence
        }
        //console.log(data);
        jQuery.post(
            'http://' + ip + ':5100',
            data,
            successSort
        );
    }
}

function successSort(data){
    workingSpinnerSort(false);
    ReceivedData = JSON.parse(data);
    Sequence = ReceivedData[0];
    elapsedTime = parseInt(ReceivedData[1]);
    successAlertSort(elapsedTime);
    plotBarPlot();
    SequenceLength = Sequence.length;
    $('#SequenceLength').val(SequenceLength);
}

function CompareSort(){
    startN = $("#inputL").val();
    endN = $("#inputR").val();
    nList = [];
    for (n = startN; n <= endN; n *= 2){
        nList.push(n);
    }
    data = {
        'requestType': 1,
        'start': startN,
        'end': endN
    }
    workingSpinnerCompareSort(true);
    jQuery.post(
        'http://' + ip + ':5100',
        data,
        successCompareSort
    );
}

function successCompareSort(data){
    workingSpinnerCompareSort(false);
    ReceivedData = JSON.parse(data);
    jQuery("#ChartTNBOX").show();
    jQuery("#ChartTNLogBOX").show();
    makePlotT(nList, ReceivedData);
}