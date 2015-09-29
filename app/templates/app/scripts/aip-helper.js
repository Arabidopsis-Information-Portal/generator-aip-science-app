/* globals window, jQuery */
var AIP = {};
AIP = (function(window, $, undefined) {
  'use strict';

  /* Generate Agave API docs */
  //window.addEventListener('Agave::ready', function() {
  var printDocs = function(appContext){
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
  var obj = {};
  obj.printDocs = printDocs;
  return obj;
})(window, jQuery);



AIP = (function(window, $, aip){
    'use strict';
    aip.process = function(data){
        var response = JSON.parse(data.response);
        console.log(response);
    };
    aip.getList = function(element, namespace, service, config){
        aip.table = {};
        aip.table.element = element;
        aip.table.config = config;
        var Agave = window.Agave;
        var params = {namespace: namespace, service: service};
        Agave.api.adama.list(params, aip.process, aip.error);
    };
    return aip;
}(window, jQuery, AIP));
