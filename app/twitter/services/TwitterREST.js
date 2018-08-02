'use strict';
angular.module('twitter')


.factory('TwitterREST', function($log,$http, $q, $rootScope, Base64,$timeout, $ionicPlatform, $cordovaOauth,$twitterApi,$ionicLoading,$ionicPopup){


    var consumerKey      = "m4cfN4dvTMBJCCP8iolbKNQgA";//"ugvrsHPXCSPslooN7pgVvVZO2";
    var consumerSecret   = "ba4iGolg5zvCNNMhLznL52d0tT95lORUlWhIpyLKymGTsWSndG";//"gtfHTJOGZ9wy5ko2pzTsm6bq0ShZel5kgZ45HysIjGPK1tYuMy";
    var refreshFeedInterval = 60000;    

    var self = this;
    
    
    /*** PUBLIC API ****/
     self.tweets = [];
     self.query = "";
     
     self.isMoreData = true;
     self.error = false;
     self.promesaLiveFeed;
          
     self.init = function(query){
		self.query = query;
	 	self.tweets = []; 
		next_results = null;
		refresh_url = null;
		self.stoptwitterLiveFeed();	 	
	 }
	      
     self.starttwitterLiveFeed = function(){
		 console.log("starttwitterLiveFeed", self.promesaLiveFeed);
                 
                 if (self.promesaLiveFeed){
                     $timeout.cancel(self.promesaLiveFeed);
                 }
		 var def = $q.defer();
		 		 
		 liveEnabled = true;
		 getAuthorizationToken().then(function(){
			loadLiveFeed();
		 });
       
		return def.promise;   
	 }
         
         self.isLiveEnabled = function(){
             
             return liveEnabled;
         }
	 
	 self.stoptwitterLiveFeed = function(){
		
		 liveEnabled = false;
	 }
	 
	 self.loadMore = function(type){
		 
		 var def = $q.defer();
		 loadFeed(type).then(function(data){
				def.resolve(data);
		 }).catch(function(data){
			 //para evitar que el scroll infinito intente cargar más datos
			 def.reject(data);
			 });
		 
		 return def.promise;
	 }
	 
	 
    self.sendTwitt = function (message) {

		getAuthorizationToken(true).then(function(){
			createTwitt(message);
		});
    };
    
    
    
    var createTwitt = function (message) {
		
	  $twitterApi.configure(consumerKey, consumerSecret, authTwitterData.token);
	  
      $ionicLoading.show();
      var opciones = {};
	
      var mensaje = self.query+" "+message;
      
      $twitterApi.postStatusUpdate(mensaje, opciones).then(function (resultado) {
        $ionicLoading.hide();
       
        setTimeout(function () {
          $rootScope.$apply(function () {
            self.tweets.unshift(resultado);
          });
        }, 0);

      }).catch(function(error){
       
        $ionicLoading.hide();
        if (error = "401"){
			cleanToken();
        }
		  var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: "Problem creating, try again: " + error
        }).then(function(){
          
        });
		
      });
    }
	 
     /*** PRIVATE ****/
    /* PFS events credentials*/

    var twitterTokenURL  = "https://api.twitter.com/oauth2/token";
    var twitterStreamURL = "https://api.twitter.com/1.1/search/tweets.json"; //url query, this one is for hash tags
    var numberOfTweets = "&count=10";
    var max_id;
    var qValue = "";
    var liveEnabled = false;
    
	var next_results = null;
	var refresh_url = null; 
    
   //@type could be user or app
    var authTwitterData = {token:null,type:null}; 
    
    /*
     * Revisar si tenemos algún token guardado
     * Si el token es de usuario usar los metodos de usuario
     * Si el token es de app usar los metodos de app
     * 
     * Si no tenemos token conseguir autorizacion tipo app only
     * 
     */
     
	 var getAuthorizationToken = function(forceUserAuth){
		 
		 var def = $q.defer();
		 var type;
		 
		 $ionicPlatform.ready(function() {
			
			 	 
			RestoreToken();
			
			forceUserAuth = (forceUserAuth)?forceUserAuth:false;
			 
			 //Tenemos almacenado el token, lo podemos devolver
			 if (authTwitterData.token && forceUserAuth == false
			 // Token almacenado pero tenemos que verificar que sea del tipo usuario, si el token es de tipo  app 
			 // tenemos que ejecutar autorizacion de usuario para cambiar el tipo de token 
			 || (authTwitterData.token && forceUserAuth == true &&  authTwitterData.type=="user"))
			 {
					def.resolve(authTwitterData);		
			 }else{
				
				 //NO tenemos token almacenado, o no es el tipo de token: toca solicitar el token a twitter
				 type = (forceUserAuth)?"user":"app";
				 
				 switch(type){
					 case "user":
					 
						 getUserAuthorization()
						 .then(function(token){
						
							 SaveToken(token,"user");
							 def.resolve(token);
							 
						})
						.catch(function(data){
							 def.reject(data);
							});
					 
					 break;
					 
					 case "app":
					 default:
						 getAppOnlyAuthorization()
						 .then(function(token){
							 SaveToken(token,"app");
							 def.resolve(token);
							 
						})
						.catch(function(data, status){

							 
							 if (data.status == "403" || status == "403"|| data.status == "401" || status == "401"){
								cleanToken();
								getAuthorizationToken(true)
								.then(function(token){def.resolve(token);})
								.catch(function(data){ def.reject(data);});	
							 }else{
								 def.reject(data); 
							 }	
							
							});
					 
					 break;			 
				 } //switch end
			}
		}); //$ionicPlatform.ready ends

      return def.promise;
     }
 
 
        /**
         *  @type could be user or app token
         */ 
        var SaveToken =  function (token, type) {
			if (!type) type = 'app';
			
			authTwitterData.token = token;
			authTwitterData.type  = type;
			
            localStorage.authTwitterauthToken  = angular.toJson(token);
            localStorage.authTwitterauthType   = angular.toJson(type);
        };

        var RestoreToken =  function () {
            authTwitterData.token = angular.fromJson(localStorage.authTwitterauthToken);
            authTwitterData.type  = angular.fromJson(localStorage.authTwitterauthType);
            return authTwitterData;
        };
        
        var cleanToken =  function () {

			authTwitterData.token = null;
			authTwitterData.type  = null;
			
            localStorage.authTwitterauthToken  = null
            localStorage.authTwitterauthType   = null;
        };

    	
    var loadLiveFeed = function () {
		
		 if (!liveEnabled)return;
		 
	
			self.promesaLiveFeed = $timeout(function(){},refreshFeedInterval);
                        
                        self.promesaLiveFeed.then(function(){
				loadFeed("new").then(function(data){
					loadLiveFeed();
				});                            
                        });
		       
    };
    
    
    var loadFeed = function(timeType){

		var def = $q.defer();
		var promesa;
		
		timeType = (timeType)?timeType:"old";	
	
		//Sino hay mas datos, simplemente retornamos un array vacio
		if (timeType== "old" && self.isMoreData == false){
			def.resolve([]);
		}
		
		var qValue = self.query;		

		if (!next_results){
			next_results = '?q='+qValue+numberOfTweets+"&include_entities=1";//+"&result_type=mixed"
		}
		if (!refresh_url){
			refresh_url = '?q='+qValue+numberOfTweets+"&include_entities=1"
		}	
			
		var query = (timeType == "new")?refresh_url:next_results;

		getAuthorizationToken().then(function(){

			  switch(authTwitterData.type){
				  case "app":
				  promesa = loadFeedApp(query, timeType, authTwitterData.token);

				  break;
				  case "user":
				  promesa = loadFeedUser(query, timeType, authTwitterData.token);
				  break;				  
			  }
			  
			  	  promesa.then(function(data){
				
								  
					  updateTweets(timeType, data.statuses);

						if (data.statuses.length == 0){
							
							if (timeType == "old"){
								self.isMoreData = false;
							}
							def.resolve(data);return;
						}					  
					  
					  var meta = data.search_metadata;
					  
					  //Algunas veces next_results no viene en la respuesta nos toca construirlo
					  //next_results: "?max_id=11111111111&q=%23belgrade&include_entities=1"
					  if (meta.next_results){
						  next_results = meta.next_results;
					  }else{
						  var last = data.statuses[data.statuses.length-1];
						  
						  if (!last) {
							  self.isMoreData = false;
							  def.resolve(data);return;
						  }
						  
						  next_results = "?"+"max_id="+last.id+"&q="+meta.query+"&count="+meta.count+"&include_entities=1";						  
					  }

					  
					  //refresh_url: "?since_id=775148770539347969&q=%23belgrade&include_entities=1"
					  refresh_url  = data.search_metadata.refresh_url;		
						
					  self.error = false;
					  def.resolve(data);
				  
				  });
				  promesa.catch(function(data){
						
						if (data == "401" || data == "402" || data == "403"){
							cleanToken();
							loadFeed(timeType)
								.then(function(data){def.resolve(data);})
								.catch(function(data){def.reject(data)})
						}else{ 
					  
						self.error = "Error loading tweets";
						def.reject(data);
					  }
					  
				  });
			  			
		});
	
	 return def.promise;	
	}

	var updateTweets = function(timeType, statuses){
			if (statuses.length == 0){
				return;
			}
			
			self.isMoreData = true;
			
			if (timeType == "new"){
				for(var i=(statuses.length-1);i == 0;i-- ){
					self.tweets.unshift(statuses[i]);
				}				
			}else{
				//Algunas veces twitter retorna el primero repetido
				if (self.tweets.length && self.tweets.length >0){
					if (self.tweets[self.tweets.length-1].id == statuses[0].id){
							statuses.shift();
					}
				}
				[].push.apply(self.tweets, statuses);
				
			}
		
	}
	
	var loadFeedUser = function(query, timeType, token){

		var def = $q.defer();

		$twitterApi.configure(consumerKey, consumerSecret, token);

		var p = query.replace("?", "");

		p = p.split("&");
		var parametros = {};
		var tmp;
		
		angular.forEach(p,function(val){
			tmp = val.split("=");
			parametros[tmp[0]] = decodeURIComponent(tmp[1]); 
		});	

        var opciones = {};

        //getRequest(SEARCH_TWEETS_URL, {q: keyword}, parameters);
        $twitterApi.getRequest(twitterStreamURL, parametros, opciones)
        .then(function(data){

			def.resolve(data);
        }).catch(function(error){

            def.reject(error); 
        });
		
		return def.promise;        
		        
	}
    /** Sirve para cargar twieets nuevos o viejos
     * @timeTYpe (old, new)
     */
    var loadFeedApp = function(query,timeType,token){
		
		
		var def = $q.defer();		

		var busqueda = query.replace('#','%23');
		
		var req1 = {
			method: 'GET',

			url: twitterStreamURL+busqueda,
			headers: {
				'Authorization': 'Bearer '+token.access_token,
				'Content-Type': 'application/json'
			},
			cache:false
		};
		// make request with the token
		$http(req1).
			success(function(data, status, headers, config) {
				
				def.resolve(data);
			}).
			error(function(data, status, headers, config) {
				def.reject(data);
			});
      
        return def.promise;		
	}

    var getUserAuthorization = function(){
		var def = $q.defer();

        $cordovaOauth.twitter(consumerKey, consumerSecret)
			.then(function (succ) {

			  def.resolve(succ);	
          
        }, function (error) {
          def.reject(error);
        });
		
		return def.promise;
	
	};
    
    var getAppOnlyAuthorization = function () {
      var def = $q.defer();
      var base64Encoded;

      var combined = encodeURIComponent(consumerKey) + ":" + encodeURIComponent(consumerSecret);
      base64Encoded = Base64.encode(combined);

      // Get the token
      $http.post(twitterTokenURL,"grant_type=client_credentials", {headers: {'Authorization': 'Basic ' + base64Encoded, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}}).
          success(function(data, status, headers, config) {
			 
            if (data && data.token_type && data.token_type === "bearer") {
                def.resolve(data);
            }else{
				def.reject(data);
			}
          }).
          error(function(data, status, headers, config) {
		
			  data.status = status;
            def.reject(data);
          });
      return def.promise;
    };
    
    return self;
})


.factory('Base64', function(){
    var self = this;
    self.encode = function (input) {
        // Converts each character in the input to its Unicode number, then writes
        // out the Unicode numbers in binary, one after another, into a string.
        // This string is then split up at every 6th character, these substrings
        // are then converted back into binary integers and are used to subscript
        // the "swaps" array.
        // Since this would create HUGE strings of 1s and 0s, the distinct steps
        // above are actually interleaved in the code below (ie. the long binary
        // string, called "input_binary", gets processed while it is still being
        // created, so that it never gets too big (in fact, it stays under 13
        // characters long no matter what).

        // The indices of this array provide the map from numbers to base 64
        var swaps = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
        var input_binary = "";      // The input string, converted to Unicode numbers and written out in binary
        var output = "";        // The base 64 output
        var temp_binary;        // Used to ensure the binary numbers have 8 bits
        var index;      // Loop variable, for looping through input
        for (index=0; index < input.length; index++){
            // Turn the next character of input into astring of 8-bit binary
            temp_binary = input.charCodeAt(index).toString(2);
            while (temp_binary.length < 8){
                temp_binary = "0"+temp_binary;
            }
            // Stick this string on the end of the previous 8-bit binary strings to
            // get one big concatenated binary representation
            input_binary = input_binary + temp_binary;
            // Remove all 6-bit sequences from the start of the concatenated binary
            // string, convert them to a base 64 character and append to output.
            // Doing this here prevents input_binary from getting massive
            while (input_binary.length >= 6){
                output = output + swaps[parseInt(input_binary.substring(0,6),2)];
                input_binary = input_binary.substring(6);
            }
        }
        // Handle any necessary padding
        if (input_binary.length == 4){
            temp_binary = input_binary + "00";
            output = output + swaps[parseInt(temp_binary,2)];
            output = output + "=";
        }
        if (input_binary.length == 2){
            temp_binary = input_binary + "0000";
            output = output + swaps[parseInt(temp_binary,2)];
            output = output + "==";
        }
        // Output now contains the input in base 64
        return output;
    };

    self.decode = function (input) {
        // Takes a base 64 encoded string "input", strips any "=" or "==" padding
        // off it and converts its base 64 numerals into regular integers (using a
        // string as a lookup table). These are then written out as 6-bit binary
        // numbers and concatenated together. The result is split into 8-bit
        // sequences and these are converted to string characters, which are
        // concatenated and output.
        input = input.replace("=","");      // Padding characters are redundant
        // The index/character relationship in the following string acts as a
        // lookup table to convert from base 64 numerals to Javascript integers
        var swaps = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output_binary = "";
        var output = "";
        var temp_bin = "";
        var index;
        for (index=0; index < input.length; index++) {
            temp_bin = swaps.indexOf(input.charAt(index)).toString(2);
            while (temp_bin.length < 6) {
                // Add significant zeroes
                temp_bin = "0"+temp_bin;
            }
            while (temp_bin.length > 6) {
                // Remove significant bits
                temp_bin = temp_bin.substring(1);
            }
            output_binary = output_binary + temp_bin;
            while (output_binary.length >= 8) {
                output = output + String.fromCharCode(parseInt(output_binary.substring(0,8),2));
                output_binary = output_binary.substring(8);
            }
        }
        return output;
    };
    
    return self;
});
