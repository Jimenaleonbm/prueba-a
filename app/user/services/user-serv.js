'use strict';
angular.module('user').service('$user', function ($q, _firebase, $push, $log) {

    var $user = {};

    var auth = _firebase.auth();

    auth.onAuthStateChanged(function (user) {
        if (!user) return;
        $user.uid = user.uid;
        $user.name = user.displayName;
        $user.image = user.photoURL;
        $user.email = user.email;
        $user.isAnonymous = user.isAnonymous;
        $push.register($user.uid);
        // condicion anonimo
        if (!$user.isAnonymous)
            $push.register($user.uid);
    });

    $user.getAuth = function () {
        return $q(function (resolve, reject) {
            auth.onAuthStateChanged(function (user) {
                if (user)
                    resolve(user);
                else
                    reject();
            });
        });
    };

    $user.facebookLogin = function () {
        return $q(function (resolve, reject) {
            facebookConnectPlugin.login(['public_profile', 'email'], function (data) {
                auth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(data.authResponse.accessToken)).then(function (userData) {
                    _firebase.database().ref('users').child(userData.uid).once('value').then(function (snapshot) {
                        if (snapshot.val()) {
                            _firebase.database().ref('users').child(userData.uid).child("info").update({
                                name: userData.displayName,
                                image: userData.photoURL
                            });
                        } else {
                            _firebase.database().ref('users').child(userData.uid).set({
                                info: {
                                    email: userData.email || null,
                                    name: userData.displayName,
                                    image: userData.photoURL
                                }, favorites: {init: true}
                            })
                        }
                        resolve();
                    }).catch(function (err) {
                        console.log('error database:', err);
                        reject();
                    });
                }).catch(function (err) {
                    console.log('err signInWithCredential:', err);
                    reject();
                });
            }, function (err) {
                console.log('err facebookConnectPlugin:', err);
                reject();
            });
        });
    };

    $user.register = function (email, password, name) {
        return $q(function (resolve, reject) {
            auth.createUserWithEmailAndPassword(email, password).then(function (userData) {
                _firebase.database().ref('users').child(auth.currentUser.uid).set({
                    info: {email: email, name: name},
                    favorites: {init: true}
                })
                auth.currentUser.updateProfile({displayName: name}).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    $user.saveProfile = function (form) {
        return $q(function (resolve, reject) {
            _firebase.database().ref('users').child(auth.currentUser.uid).child('info').update(form).then(function () {
                auth.currentUser.updateProfile({
                    photoURL: (form.image) ? form.image : $user.image,
                    displayName: (form.name) ? form.name : $user.name
                }).then(function () {
                    $user.image = form.image || $user.image;
                    $user.name = form.name || $user.name;
                    resolve();
                });
            }).catch(reject);
        });
    }

    $user.login = function (email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    $user.forgotPassword = function (email) {
        return auth.sendPasswordResetEmail(email);
    }

    $user.changePassword = function (password) {
        return auth.currentUser.updatePassword(password);
    }

    $user.logout = function () {
        return auth.signOut();
    }

    return $user;

});
