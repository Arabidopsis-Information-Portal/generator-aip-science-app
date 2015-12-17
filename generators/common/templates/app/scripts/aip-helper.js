/* globals window, jQuery */
var AIP = {};
AIP = (function(window, $, undefined) {
  'use strict';

  /* Generate Agave API docs */
  //window.addEventListener('Agave::ready', function() {
  var displayDocs = function(appContext){
    var Agave, help, helpItem, helpDetail, methods, methodDetail;

    Agave = window.Agave;

    appContext.html('<h2>Hello AIP Science App &plus; Agave API!</h2><div class="api-help list-group"></div><hr><div class="api-info"></div><br>');

    help = $('.api-help', appContext);

    $.each(Agave.api.apisArray, function(i, api) {
      helpItem = $('<a class="list-group-item">');
      help.append(helpItem);

      helpItem.append($('<h4>').text(api.name).append('<i class="pull-right fa fa-toggle-up"></i>'));
      helpDetail = $('<div class="api-help-detail">');
      helpDetail.append($('<p>').text(api.description));
      helpDetail.append('<h5>Methods</h5>');
      methods = $('<ul>');
      $.each(api.help(), function(i, m) {
        methodDetail = $('<li>');
        methodDetail.append('<strong>' + m + '</strong>');
        var details = api[m.trim()].help();
        if (details) {
          methodDetail.append('<br>').append('Parameters');
          methodDetail.append('<p style="white-space:pre-line;">' + details + '</p>');
        }
        methods.append(methodDetail);
      });
      helpDetail.append(methods);
      helpItem.append(helpDetail.hide());
    });

    $('.api-help > a', appContext).on('click', function() {
      if (! $(this).hasClass('list-group-item-info')) {
        // close other
        $('.api-help > a.list-group-item-info', appContext).removeClass('list-group-item-info').find('.fa').toggleClass('fa-toggle-up fa-toggle-down').end().find('.api-help-detail').slideToggle();
      }

      $(this).toggleClass('list-group-item-info');
      $('.fa', this).toggleClass('fa-toggle-up fa-toggle-down');
      $('.api-help-detail', this).slideToggle();
    });

    var info = $('.api-info', appContext);
    info.addClass('text-center');
    info.append('<p>' + Agave.api.info.title + ': ' + Agave.api.info.description + '</p>');
    info.append('<p><a href="mailto:' + Agave.api.info.contact + '">Contact</a> | <a href="' + Agave.api.info.license + '">License</a> | <a href="' + Agave.api.info.license + '">Terms of use</a></p>');
  };
  //});
  var aip = {};
  aip.displayDocs = displayDocs;
  return aip;
})(window, jQuery);



AIP = (function(window, $, aip){
    'use strict';
    aip._titleize = function(str){
        str = str.replace(/[\-_]/g, ' ');
        return str.replace(/([^\W_]+[^\s-]*)*/g, 
                           function(txt){
                               return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                           });
    };
    aip.printTableHeaders = function(props){
        var table = $('<table class="table table-striped table-bordered"><thead></thead><tbody></tbody></table>');
        var thead = $('thead', table);
        var row = $('<tr></tr>');
        var header;
        for(var i = 0; i < props.length; i++){
            header = $('<th>' + aip._titleize(props[i]) + '</th>');
            row.append(header);
        }
        thead.append(row);
        aip.table.element.append(table);
    };
    aip.printTableData = function(objs, props){
        var tbody = $('tbody', aip.table.element);
        var row, cell, i, j, prop, obj;
        for(i = 0; i < objs.length && i < 10; i++){
            obj = objs[i];
            row = $('<tr></tr>');
            for(j = 0; j < props.length; j++){
                prop = props[j];
                cell = $('<td>' + obj[prop] + '</td>');
                row.append(cell);
            }
            tbody.append(row);
        }
    };
    aip.process = function(data){
        var response = data.obj.result;
        if(response.length <= 0){
            return;
        }
        var obj = response[0];
        var props = [];
        for(var p in obj){
            if(!obj.hasOwnProperty(p)){
                continue;
            }
            props.push(p);
        }
        $('.loading', aip.table.element).remove();
        aip.printTableHeaders(props);
        aip.printTableData(response, props);
    };
    aip.error = function(err){
        if(console){
            console.log('There was an error comunicating to Agave: ', err);
        }
    };
    // jshint unused:false
    aip.getList = function(namespace, service, config){
        var Agave = window.Agave;
        var params = {namespace: namespace, service: service};
        Agave.api.adama.list(params, aip.process, aip.error);
    };
    // jshint unused:strict
    aip.displayList = function(element, namespace, service, config){
        if (!namespace && !service && namespace.length <= 0 && service.length <= 0){
            return;
        }
        aip.table = {};
        aip.table.element = element;
        aip.table.config = config;
        var loading = $('<h3 class="loading"> Loading data ... <span class="glyphicon glyphicon-refresh spin-icon"></span></h3>');
        aip.table.element.append(loading);
        aip.getList(namespace, service, config);
    };
    return aip;
}(window, jQuery, AIP));
