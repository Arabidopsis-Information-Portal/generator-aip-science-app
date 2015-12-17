/*globals jQuery, Agave*/
(function( window, $, Agave, undefined ) {
  'use strict';

  function showToken() {
    $( '.current-token' ).html(
      '<p>Value: <span class="label label-success">' + Agave.token.accessToken +
      '</span> Expires: ' + new Date( Agave.token.created + ( 1000 * Agave.token.expiresIn ) ).toLocaleString() +
      '</p>'
    );
    $( '.api-credentials .token-form' ).hide();
  }

  function setClientInForm() {
    var form = $( 'form[name=agaveApiTokenForm]' );
    $.each(Agave.client, function( key, value ) {
      $( '[name='+key+']', form ).val( value );
    });
  }

  /* events */
  $('button[name=toggleTokenForm]').on('click', function() {
    $('.api-credentials .token-form').toggle();
  });

  $('button[name=createApiClient]').on('click', function() {
    $('.create-client.modal').modal();
  });

  $('form[name=createApiClientForm]').on('submit', function(e) {
    e.preventDefault();

    var form = $(this);

    Agave.createClient( form[0].username.value, form[0].password.value, form[0].appName.value )
      .done( setClientInForm )
      .done(function() {
        $('.create-client.modal').modal('hide');
      })
      .then(function() {
        return Agave.auth.newToken( form[0].username.value, form[0].password.value );
      })
      .done( showToken )
      .then( Agave.initialize )
      .done(function() {
        window.dispatchEvent( new CustomEvent( 'Agave::ready' ) );
      })
      .fail(function( error ) {
        console.log( error );
        window.alert( error );
      });
  });

  $('form[name=agaveApiTokenForm]').on('submit', function(e) {
    e.preventDefault();

    var form = $(this);

    Agave.setClient({
      consumerKey: form[0].consumerKey.value,
      consumerSecret: form[0].consumerSecret.value
    });

    Agave.auth.newToken( form[0].username.value, form[0].password.value )
      .done(showToken)
      .fail(function( error ) {
        console.log( error );
        window.alert( 'An error occurred! ' + error );
      })
      .then(Agave.initialize)
      .done(function() {
        window.dispatchEvent(new CustomEvent('Agave::ready'));
      });
  });

  $( 'button[name=agaveApiTokenFormClear]' ).on('click', function() {
    if ( window.confirm( 'Are you sure you want to clear your API credentials?' ) ) {
      Agave.destroy( true );
      window.location.reload();
    }
  });

  /* GO! */
  Agave.loadClient()
    .done( setClientInForm )
    .then( Agave.loadToken )
    .done( showToken )
    .then( Agave.initialize )
    .done( function() {
      window.dispatchEvent( new CustomEvent( 'Agave::ready' ) );
    })
    .fail(function( error ) {
      console.log( error );
    });

})( window, jQuery, Agave );
