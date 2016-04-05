/*globals jQuery, SwaggerClient*/
(function( window, $, SwaggerApi, undefined ) {
  'use strict';
  var Agave = window.Agave = {};

  Agave.baseUrl = 'https://api.araport.org';

  Agave.token = null;

  Agave.client = null;

  Agave.auth = {};

  Agave.auth.newToken = function( username, password ) {
    var data = 'grant_type=password&scope=PRODUCTION&username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
    return Agave.auth.post( data );
  };

  Agave.auth.refreshToken = function( refreshToken ) {
    var data = 'grant_type=refresh_token&scope=PRODUCTION&refresh_token=' + encodeURIComponent(refreshToken);
    return Agave.auth.post( data );
  };

  Agave.auth.post = function( data ) {
    var deferred = $.Deferred();
    if (Agave.client) {
      $.ajax({
        url: Agave.baseUrl + '/token',
        type: 'post',
        data: data,
        headers: {
          Authorization: 'Basic ' + btoa( Agave.client.consumerKey + ':' + Agave.client.consumerSecret )
        }
      }).done(function( resp ) {
        Agave.token = {};

        /* Agave token property names are underscored. Convert to camelCase */
        $.each(resp, function(key, value) {
          if (/[a-z]+_[a-z]/.test(key)) {
            // replace _[a-z] with toUpperCase([a-z])
            key = key.replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
          }
          Agave.token[key] = value;
        });

        Agave.token.created = Date.now(); /* current time to detect token expiration */
        window.localStorage.setItem( 'Agave.token', JSON.stringify( Agave.token ) ); /* store token */
        deferred.resolve( Agave.token ); /* resolve deferred */
      }).fail(function( err ) {
        deferred.reject( err.message );
      });
    } else {
      deferred.reject( 'Agave.client is not initialized.' );
    }
    return deferred.promise();
  };

  Agave.loadToken = function() {
    var deferred, agaveToken;
    deferred = $.Deferred();
    agaveToken = window.localStorage.getItem( 'Agave.token' );
    if ( agaveToken ) {
      try {
        agaveToken = JSON.parse( agaveToken );
        if ( Date.now() - agaveToken.created < ( 1000 * agaveToken.expiresIn ) ) {
          Agave.token = agaveToken;
          deferred.resolve( Agave.token );
        } else {
          /* attempt refreshToken */
          Agave.auth.refreshToken( agaveToken.refreshToken )
          .done(function( token ) {
            deferred.resolve( token );
          })
          .fail(function( err ) {
            deferred.reject( err );
          });
        }
      } catch ( err ) {
        deferred.reject( err );
      }
    } else {
      deferred.reject( 'Agave.token does not exist!' );
    }
    return deferred.promise();
  };

  Agave.setClient = function( apiClient ) {
    Agave.client = apiClient;
    window.localStorage.setItem( 'Agave.client', JSON.stringify( Agave.client ) ); /* store client */
  };

  Agave.loadClient = function() {
    var deferred, agaveClient;
    deferred = $.Deferred();
    agaveClient = window.localStorage.getItem( 'Agave.client' );
    if ( agaveClient ) {
      try {
        Agave.client = JSON.parse( agaveClient );
        deferred.resolve( Agave.client );
      } catch ( err ) {
        deferred.reject( err );
      }
    } else {
      deferred.reject( 'API Client does not exist!' );
    }
    return deferred.promise();
  };

  Agave.createClient = function( username, password, appName ) {
    var deferred = $.Deferred();

    //authorizations.add( 'Authorization', new PasswordAuthorization( 'Authorization', username, password ) );
    var clientApi = new SwaggerApi({
      url: '//' + window.location.host + '/lib/resources/agaveapi.json',
      useJQuery: true,
      authorizations: {
          'Authorization': new SwaggerApi.PasswordAuthorization( 'Authorization', username, password )
      },
      success: function() {
        if ( clientApi.ready === true ) {

          clientApi.clients.create({ body:JSON.stringify( { clientName: appName } ) }, function( resp ) {
            if ( resp.obj.status === 'error' ) {
              deferred.reject( resp.obj.message );
            } else {
              Agave.client = {
                consumerKey: resp.obj.result.consumerKey,
                consumerSecret: resp.obj.result.consumerSecret
              };
              window.localStorage.setItem( 'Agave.client', JSON.stringify( Agave.client ) ); /* store client */
              deferred.resolve( Agave.client );
            }
          }, function( err ) {
            deferred.reject( err.obj.message );
          });
        }
      }
    });

    return deferred.promise();
  };

  /**
   * Initializes the Agave.api object. Initialization will fail if the
   * Agave.client or Agave.token are not already set.
   * @see {@link Agave.loadClient}
   * @see {@link Agave.loadToken}
   * @returns A promise for async initialization.
   */
  Agave.initialize = function() {
    var deferred = $.Deferred();

    if (Agave.client && Agave.token) {
      //authorizations.add( 'Authorization', new ApiKeyAuthorization( 'Authorization', 'Bearer ' + Agave.token.accessToken, 'header' ) );
      Agave.api = new SwaggerApi({
        url: '//' + window.location.host + '/lib/resources/agaveapi.json',
        useJQuery: true,
        authorizations: {
            'Authorization': new SwaggerApi.ApiKeyAuthorization( 'Authorization', 'Bearer ' + Agave.token.accessToken, 'header' )
        },
        success: function() {
          if ( Agave.api.ready === true ) {
            deferred.resolve( Agave );
          }
        },
        failure: function( error ) {
          deferred.reject( error );
        }
      });
    } else {
      deferred.reject( 'Agave client or token uninitialized.' );
    }

    return deferred.promise();
  };

  /**
   * Deinitializes the Agave object and clears the current credentials.
   * @param {boolean} stored - If true the stored token and client will also be destroyed
   */
  Agave.destroy = function( stored ) {
    Agave.api = null;
    Agave.token = null;
    Agave.client = null;
    //authorizations.remove( 'Authorization' );
    if ( stored ) {
      window.localStorage.removeItem( 'Agave.token' );
      window.localStorage.removeItem( 'Agave.client' );
    }
  };

  return Agave;
})( window, jQuery, SwaggerClient );
