'use strict';

/**
 * @ngdoc function
 * @name cpApp.controller:InvestigationctrlCtrl
 * @description
 * # InvestigationctrlCtrl
 * Controller of the cpApp
 */
angular.module('cpApp')
  .controller('InvestigationCtrl', function ($scope, $rootScope, $http, $filter, QueryCache, DOAPI, FileReader, BOSH, config, notifications) {
    var bosh = config.boshConfig;
    var apiConfig = config.apiConfig;
    /**
     * @fixme: move all BOSH stuff in the service
     * @todo: remove bosh callbacks from $rootScope
     */
    $scope.responses = [];
    $scope.responses_url = URL.createObjectURL(
      new Blob(
        [JSON.stringify(($scope.responses))],
        {type: 'application/json;charset=utf-8'}
      )
    );
    var onPresence = function(presence){
      var from = $(presence).attr('from');
      if(Strophe.getBareJidFromJid(from) === bosh.rooms[0]){
        var nick = Strophe.getResourceFromJid(from);
        if(!bosh.participants[nick] && $(presence).attr('type') !== 'unavailable'){
          var userJID = $(presence).find('item').attr('jid');
          bosh.participants[nick] = userJID || true;
        }else if(bosh.participants[nick] && $(presence).attr('type') === 'unavailable'){
          delete bosh.participants[nick];
          $scope.$broadcast('user_left', nick);
        }
      }
      return true;
    };
    var onPublicMessage = function(msg){
      var from = $(msg).attr('from');
      //var to = $(msg).attr('to');
      var nick = Strophe.getResourceFromJid(from);
      if(Strophe.getBareJidFromJid(from) === bosh.rooms[0]){
        var notice = !nick;
        //var body = $(msg).children('body').text();
        var ahevents = AHEvent.fromElements($(msg).children('event'));
        var delayed = $(msg).children('delay').length > 0  ||
          $(msg).children('x[xmlns="jabber:x:delay"]').length > 0;
        if(!notice){
          //$log.debug($(msg).children('event'));
          if(!delayed){
            if(ahevents !== 'undefined' && ahevents.length > 0){
              var ahevent = ahevents[0];
              if(ahevent !== 'undefined'){
                $rootScope.$broadcast('new_response', ahevent, nick);
              }
            }
          }
        }
      }
      return true;
    };

    var joinRoom = function(room){
      //console.log('Joining room '+room);
      // bosh.connection.xmlOutput = function(elem){
      //   //BOSH.storeSessionData();
      // };
      //bosh.connection.rawInput = DOAPI.logRawInput;
      //bosh.connection.rawOutput = DOAPI.logRawOutput;

      bosh.connection.nickname = bosh.connection.jid.split('/')[1];

      bosh.connection.send($pres().c('priority').t('-1'));
      bosh.connection.flush();

      bosh.connection.addHandler(onPresence, null, 'presence');
      bosh.connection.addHandler(onPublicMessage, null, 'message', 'groupchat');

      bosh.connection
        .send($pres({to: room + '/' + bosh.connection.nickname})
          .c('x', {xmlns: Strophe.NS.HTTPBIND})
        );
    };

    //if(bosh.connectionStatus === 'Connected' && bosh.nickname == null){
    //    console.log('no nickname');
    //    joinRoom();
    //}

    try {
      bosh.connection.restore(bosh.connection.jid, function(){
      });
    } catch(e) {
      //console.log(e);
      //if (e.name !== 'StropheSessionError') { throw(e); }
      $http.get(apiConfig.authUrl + '/bosh-session').then(
        function(resp){
          if(resp.status === 200){
            bosh.rooms = resp.data.rooms;
            /*angular.forEach(bosh.rooms, function(val, key){
             if(val.split('@')[0] == $stateParams.room){
             $scope.currentRoom = val;
             }
             });*/
            BOSH.attach(resp.data);
          }
        }, function(error){
          notifications.showError(error.statusText);
        }
      );
    }

    $scope.$on('new_response', function(e, event, fromNick){
      $scope.$apply(function(){
        var r = QueryCache.get(event.value('augment sha-1'));
        if(r){
          var queryHash = DOAPI.getAugmentKey(r.query);
          var existing = $filter('filter')($scope.responses, function(v){
            return v.query_hash === queryHash;
          });
          //debugger;
          if(existing.length > 0){
            // append
            var reply = existing[0];
            if(reply.experts.hasOwnProperty(fromNick)){
              reply.experts[fromNick].push(event.items());
            }else{
              reply.experts[fromNick] = [event.items()];
            }
          }else{
            var newReply = {
              query_hash: queryHash,
              query_string: r.query,
              experts: {}
            };
            newReply.experts[fromNick] = [event.items()];
            $scope.responses.push(newReply);
            $scope.responses_url = URL.createObjectURL(
              new Blob(
                [JSON.stringify(($scope.responses))],
                {type: 'application/json;charset=utf-8'}
              )
            );
          }
        }

      });
    });

    $rootScope.$on('bosh-attached', function(){
      /*angular.forEach(bosh.rooms, function(val, key){
       joinRoom(val);
       });*/
      joinRoom(bosh.rooms[0]);
    });

    $scope.exportResponses = function(){
      var header = ['query', 'expert'].concat($filter('eventKeysFilter')($scope.responses));
      var rv = [header];
      $scope.exportDate = new Date().getTime();
      angular.forEach($scope.responses, function(reply){
        angular.forEach(reply.experts, function(experts, nick){
          angular.forEach(experts, function(expert){
            var entry = [];
            for(var i=0;i<header.length;i++){
              entry[i] = '';
            }
            entry[0] = reply.query_string;
            entry[1] = nick;
            angular.forEach(expert, function(val, key){
              var keyIndex = header.indexOf(key);
              if(keyIndex !== -1){
                entry[keyIndex] = val.join();
              }

            });
            rv.push(entry);
          });

        });
      });
      return rv;
    };

    $scope.clearResponses = function(){
      $scope.responses = [];
    };

    $scope.getFile = function (file) {
      $scope.fileProgress = 0;
      FileReader.readAsText(file, $scope)
        .then(function (result) {
          var csv = result.split(/\r\n|\r|\n|,/g);
          $scope.search = csv.join(',');
        });
    };

    $scope.onSearch = function(){
      if(typeof $scope.search === 'undefined' || $scope.search.length < 1){
        return;
      }
      $scope.responses = [];
      var values = $scope.search.split(new RegExp(',|\\s'));
      angular.forEach(values, function(v){
        var request = {id: DOAPI.getId()};
        var key = 'host';
        var ere = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var emailRegex = new RegExp(ere);
        var ipv4Regex = new RegExp('^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])' +
          '(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$');

        // /^[0-9a-f]{32}$/i  // MD5
        // /^[0-9a-f]{40}$/i  // SHA-1
        var md5Regex = new RegExp('^[0-9a-f]{32}(?:[0-9a-f]{8})?$');
        var sha1Regex = new RegExp('^[0-9a-f]{40}(?:[0-9a-f]{8})?$');
        var sha256Regex = new RegExp('^[0-9a-f]{64}(?:[0-9a-f]{8})?$');
        var sha512Regex = new RegExp('^[0-9a-f]{128}(?:[0-9a-f]{8})?$');
        if(ipv4Regex.test(v) === true){
          key = 'ip';
        }else if(md5Regex.test(v.toLowerCase()) === true ||
          sha1Regex.test(v.toLowerCase()) === true ||
          sha256Regex.test(v.toLowerCase()) === true ||
          sha512Regex.test(v.toLowerCase()) === true){
          key = 'hash';
        }else if(emailRegex.test(v.toLowerCase()) === true){
          key = 'email';
        }
        if(request[key]){
          request[key].push(v.toLocaleLowerCase());
        }else{
          request[key] = [v.toLocaleLowerCase()];
        }
        request[key].sort();

        var newEvent = new AHEvent(request);

        var requestStr = '';
        var reprStr = '';
        var elength = newEvent._sortedAttrs().length;
        // no need to use AHEvents just for sorting
        // https://stackoverflow.com/questions/3423394/algorithm-of-javascript-sort-function
        newEvent._sortedAttrs().forEach(function(v, k){
          requestStr += v + '\xc0';
          if(k % 2 == 0) { // jshint ignore:line
            reprStr += v + '=';
          }else if(k == elength-1){ // jshint ignore:line
            reprStr += v;
          }else{
            reprStr += v + ', ';
          }

        });

        var query = {
          hash: DOAPI.getAugmentKey(requestStr),
          query: request[key][0],
          id: request.id,
          timestamp: Date.now()
        };
        QueryCache.put(query.hash, query);
        var body = '!repr ' + reprStr;
        bosh.connection.send(
          $msg({
            to: bosh.rooms[0],
            type: 'groupchat'}).c('body').t(body)
        );
      });
    };
  });
